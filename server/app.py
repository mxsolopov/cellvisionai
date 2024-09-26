import os
# Disabling warning notifications tensorflow
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from tensorflow.keras.models import model_from_json
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from werkzeug.utils import secure_filename
import keras
import time
import base64
from io import BytesIO
from PIL import Image
from scipy.ndimage import binary_erosion
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.applications import Xception, VGG16
from tensorflow.keras.layers import (
                                    Activation,
                                    Conv2D,
                                    MaxPooling2D,
                                    BatchNormalization,
                                    ReLU,
                                    UpSampling2D,
                                    concatenate,
                                    Concatenate,
                                    Input
)
import matplotlib as mpl
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER_CV = 'uploads_cv'

# Creating a folder for uploading images
os.makedirs(UPLOAD_FOLDER_CV, exist_ok=True)
app.config['UPLOAD_FOLDER_CV'] = UPLOAD_FOLDER_CV

IMAGE_SIZE = 256

# U-Net
def unet_model(input_size=(IMAGE_SIZE, IMAGE_SIZE, 3)):
    inputs = Input(input_size)
    
    # Base model VGG16
    base_model = VGG16(weights='imagenet', include_top=False, input_tensor=inputs)

    # Encoder
    conv1 = base_model.get_layer('block1_conv2').output
    pool1 = MaxPooling2D(pool_size=(2, 2))(conv1)
    conv2 = base_model.get_layer('block2_conv2').output
    pool2 = MaxPooling2D(pool_size=(2, 2))(conv2)
    conv3 = base_model.get_layer('block3_conv3').output
    pool3 = MaxPooling2D(pool_size=(2, 2))(conv3)
    conv4 = base_model.get_layer('block4_conv3').output
    pool4 = MaxPooling2D(pool_size=(2, 2))(conv4)
    conv5 = base_model.get_layer('block5_conv3').output

    # Decoder
    up6 = UpSampling2D(size=(2, 2))(conv5)
    up6 = concatenate([up6, conv4], axis=3)
    conv6 = Conv2D(512, (3, 3), activation='relu', padding='same')(up6)
    conv6 = Conv2D(512, (3, 3), activation='relu', padding='same')(conv6)

    up7 = UpSampling2D(size=(2, 2))(conv6)
    up7 = concatenate([up7, conv3], axis=3)
    conv7 = Conv2D(256, (3, 3), activation='relu', padding='same')(up7)
    conv7 = Conv2D(256, (3, 3), activation='relu', padding='same')(conv7)

    up8 = UpSampling2D(size=(2, 2))(conv7)
    up8 = concatenate([up8, conv2], axis=3)
    conv8 = Conv2D(128, (3, 3), activation='relu', padding='same')(up8)
    conv8 = Conv2D(128, (3, 3), activation='relu', padding='same')(conv8)

    up9 = UpSampling2D(size=(2, 2))(conv8)
    up9 = concatenate([up9, conv1], axis=3)
    conv9 = Conv2D(64, (3, 3), activation='relu', padding='same')(up9)
    conv9 = Conv2D(64, (3, 3), activation='relu', padding='same')(conv9)

    conv10 = Conv2D(1, (1, 1), activation='sigmoid')(conv9)

    model = Model(inputs=[inputs], outputs=[conv10])

    return model

# DeepLabV3Plus
def convolution_block(block_input, num_filters=256, kernel_size=3, dilation_rate=1, use_bias=False):
    x = Conv2D(num_filters, kernel_size=kernel_size, dilation_rate=dilation_rate, padding="same", use_bias=use_bias, kernel_initializer='he_normal')(block_input)
    x = BatchNormalization()(x)
    return ReLU()(x)

def DilatedSpatialPyramidPooling(dspp_input):
    dims = dspp_input.shape
    x = tf.keras.layers.AveragePooling2D(pool_size=(dims[1], dims[2]))(dspp_input)
    x = convolution_block(x, kernel_size=1, use_bias=True)
    out_pool = UpSampling2D(size=(dims[1] // x.shape[1], dims[2] // x.shape[2]), interpolation="bilinear")(x)

    out_1 = convolution_block(dspp_input, kernel_size=1, dilation_rate=1)
    out_6 = convolution_block(dspp_input, kernel_size=3, dilation_rate=6)
    out_12 = convolution_block(dspp_input, kernel_size=3, dilation_rate=12)
    out_18 = convolution_block(dspp_input, kernel_size=3, dilation_rate=18)

    x = Concatenate(axis=-1)([out_pool, out_1, out_6, out_12, out_18])
    output = convolution_block(x, kernel_size=1)
    
    return output

def deep_lab_model(input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3), num_classes=1):
    model_input = Input(shape=input_shape)
    base_model = Xception(weights='imagenet', include_top=False, input_tensor=model_input)

    # Use the output of the last layer of the middle flow (block13)
    x = base_model.get_layer('block13_sepconv2_act').output
    x = DilatedSpatialPyramidPooling(x)

    input_a = UpSampling2D(size=(input_shape[0] // 4 // x.shape[1], input_shape[1] // 4 // x.shape[2]), interpolation="bilinear")(x)
    input_b = base_model.get_layer('block4_sepconv2_act').output  # Block4 is similar to the ResNet block2
    
    # Aligning the size of input_b to match input_a before concatenation
    input_b = convolution_block(input_b, num_filters=48, kernel_size=1)
    input_b = UpSampling2D(size=(input_a.shape[1] // input_b.shape[1], input_a.shape[2] // input_b.shape[2]), interpolation="bilinear")(input_b)

    x = Concatenate(axis=-1)([input_a, input_b])
    x = convolution_block(x)
    x = convolution_block(x)
    x = UpSampling2D(size=(input_shape[0] // x.shape[1], input_shape[1] // x.shape[2]), interpolation="bilinear")(x)

    model_output = Conv2D(num_classes, kernel_size=(1, 1), padding="same", activation='sigmoid')(x)

    return Model(inputs=model_input, outputs=model_output)

# SegNet
def segnet_model(input_size=(IMAGE_SIZE, IMAGE_SIZE, 3)):
    inputs = Input(input_size)
    
    # Base model VGG16 without top layers
    base_model = VGG16(weights='imagenet', include_top=False, input_tensor=inputs)

    # Encoder (из VGG16)
    conv1 = base_model.get_layer('block1_conv2').output
    pool1 = MaxPooling2D(pool_size=(2, 2))(conv1)
    conv2 = base_model.get_layer('block2_conv2').output
    pool2 = MaxPooling2D(pool_size=(2, 2))(conv2)
    conv3 = base_model.get_layer('block3_conv3').output
    pool3 = MaxPooling2D(pool_size=(2, 2))(conv3)
    conv4 = base_model.get_layer('block4_conv3').output
    pool4 = MaxPooling2D(pool_size=(2, 2))(conv4)
    conv5 = base_model.get_layer('block5_conv3').output
    pool5 = MaxPooling2D(pool_size=(2, 2))(conv5)

    # Decoder
    up6 = UpSampling2D(size=(2, 2))(pool5)
    conv6 = Conv2D(512, (3, 3), padding='same')(up6)
    conv6 = BatchNormalization()(conv6)
    conv6 = Activation('relu')(conv6)

    up7 = UpSampling2D(size=(2, 2))(conv6)
    conv7 = Conv2D(512, (3, 3), padding='same')(up7)
    conv7 = BatchNormalization()(conv7)
    conv7 = Activation('relu')(conv7)

    up8 = UpSampling2D(size=(2, 2))(conv7)
    conv8 = Conv2D(256, (3, 3), padding='same')(up8)
    conv8 = BatchNormalization()(conv8)
    conv8 = Activation('relu')(conv8)

    up9 = UpSampling2D(size=(2, 2))(conv8)
    conv9 = Conv2D(128, (3, 3), padding='same')(up9)
    conv9 = BatchNormalization()(conv9)
    conv9 = Activation('relu')(conv9)

    up10 = UpSampling2D(size=(2, 2))(conv9)
    conv10 = Conv2D(64, (3, 3), padding='same')(up10)
    conv10 = BatchNormalization()(conv10)
    conv10 = Activation('relu')(conv10)

    conv11 = Conv2D(1, (1, 1), activation='sigmoid')(conv10)

    model = Model(inputs=[inputs], outputs=[conv11])

    return model

unet = unet_model()
unet.load_weights('weights/unet_weights.h5')

deeplab = deep_lab_model()
deeplab.load_weights('weights/deep_lab_weights.h5')

segnet = segnet_model()
segnet.load_weights('weights/segnet_weights.h5')

def preprocess_image(image_path, target_size=(256, 256)):
    image = keras.preprocessing.image.load_img(image_path, target_size=target_size)
    image = keras.preprocessing.image.img_to_array(image) / 255.0
    return np.expand_dims(image, axis=0)

def predict_mask_with_threshold(model, image_path, threshold=0.5, target_size=(256, 256)):
    image = preprocess_image(image_path, target_size)
    predicted_mask = model.predict(image)
    predicted_mask = (predicted_mask > threshold).astype(np.uint8)
    if predicted_mask.ndim == 4:
        predicted_mask = predicted_mask[0]  # Remove batch dimension
    if predicted_mask.shape[-1] == 1:
        predicted_mask = predicted_mask.squeeze(-1)  # Remove channel dimension if it's 1
    return predicted_mask

@app.route('/upload-cv', methods=['POST'])
def upload_cv():
    if 'images' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['images']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    model_name = request.form.get('model')
    
    threshold = float(request.form.get('threshold'))
    
    if model_name == 'deeplab':
        model = deeplab
    elif model_name == 'segnet':
        model = segnet
    else:
        model = unet

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER_CV'], filename)
    file.save(file_path)

    mask = predict_mask_with_threshold(model, file_path, threshold)
    
    mask_binary = mask > 0

    eroded_mask = binary_erosion(mask_binary)
    edges = mask_binary ^ eroded_mask  # XOR

    height, width = mask.shape
    rgba_image = Image.new("RGBA", (width, height))
    pixels = rgba_image.load()

    fill_color = (49, 130, 206, 255)
    outline_color = (255, 255, 255, 255) 

    rgba_array = np.zeros((height, width, 4), dtype=np.uint8)

    rgba_array[mask_binary] = fill_color

    rgba_array[edges] = outline_color

    rgba_image = Image.fromarray(rgba_array, 'RGBA')

    # Convert mask image to base64
    buffered = BytesIO()
    rgba_image.save(buffered, format="PNG")
    mask_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return jsonify({'mask_base64': mask_base64})

if __name__ == "__main__":
    # app.run(host='0.0.0.0')
    app.run(debug=True)