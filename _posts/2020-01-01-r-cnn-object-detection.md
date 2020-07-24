---
layout : post
title : R-CNN 객체 감지 
date : 2020-01-01
excerpt : "Keras, TensorFlow 및 DeepLearning 을 사용한 R-CNN 객체 감지"
tags: [deepLearning, Keras, TensorFlow]
categories: [인공지능]
comments: true
changefreq : daily
---

### 1. R-CNN(Region Proposal + Convolutional Neural Network) 이란 
- Image Classification 을 수행 하는 CNN 과 이미지에서 물체가 존재할 영역을 제안 해주는 region proposal 알고리즘을 연결하여 높은 성능의 object detection 을 수행 할 수 있음을 제시해 준 논문이다.
- <img src="/static/img/r-cnn-object-detection/r-cnn-overview.png">
    - 1) 이미지를 입력으로 받음 
    - 2) 이미지로부터 약 2000개 가량의 region proposal 을 추출함
    - 3) 각 region proposal 영역을 이미지로부터 잘라내고(cropping) 동일한 크기로 만든 후(warping), CNN 을 활용해 feature 추출 
    - 4) 각 region proposal feature 에 대한 classification 을 수행


