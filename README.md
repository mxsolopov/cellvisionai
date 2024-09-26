# Application for Segmentation of MSC Culture Photos

The web application is designed to automate the process of semantic segmentation of cell culture images using popular neural network models. It allows researchers and professionals in biology and medicine to efficiently analyze microscopic photographs and determine, for example, the confluency level of a cell culture.

## Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

This repository contains the source code for an application for semantic segmentation of MSC cell cultures using neural network models. The models were trained using a dataset of microphotographs from 5 different human MSC populations. The photographs were taken using a Nikon Eclipse Ti 2 microscope (10x objective). 320 images of 1000x1000 pixels were annotated by experts to create a reference set of cell masks. The VGG Image Annotator service was used for annotation. The application features three architectures for image segmentation: DeepLab, SegNet, and U-Net. All models were initialized with weights obtained after training on the ImageNet dataset and then fine-tuned on the MSC microphotograph dataset. 256 images were used for the training set, and 64 for validation. Training was conducted over 85 epochs, using binary cross-entropy as the loss function and the Adam optimizer.

## Features

- **Image Upload**: Users can upload batches of cell culture photographs in various formats.
- **Automatic Segmentation**: The application uses pre-trained neural network models for accurate cell segmentation, significantly speeding up the analysis process.
- **Interactive Interface**: A user-friendly and intuitive interface allows users to adjust segmentation parameters and visualize results in real-time.
- **Confluency Calculation**: Displays confluency data for the viewed image and for the entire batch of images.
- **Data Export**: Segmentation results can be exported in PNG and JSON formats for further analysis and processing.

## Installation

### Prerequisites

- Node.js v18.12.1
- npm v8.19.2
- Python 3.12.0 with installed packages tensorflow 2.16.1 and flask 3.0.3

### Cloning the Repository

- Run the commands:
```bash
    git clone https://github.com/mxsolopov/cellvisionai.git
    cd cellvisionai
```

### Frontend Setup

Run the command:
```bash
    npm install
```

### Flask Server Setup

- In the server folder, create a folder named `weights`, where you need to place the trained weight files: deep_lab_weights.h5, segnet_weights.h5, and unet_weights.h5. You can request weights files by email: mxsolopov@yandex.ru.

- Run the commands:
```bash
    cd server
    python app.py
```

## Usage

### Development Mode

- In the file `src/App.jsx` specify the Flask server address for development:
```js
    const URL = "http://localhost:5000/"
```

- In the root directory, start the frontend in development mode:
```bash
    npm run dev
```

### Building the Application

Before building, specify the Flask server address for production in the file `src/App.jsx`.

- Build the frontend:
```bash
    npm run build
```

- The compiled application files will be located in the `dist` directory.