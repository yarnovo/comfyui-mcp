# YOLO 智能物体裁剪工作流

## 概述

这是一个基于 YOLO（You Only Look Once）深度学习模型的智能物体检测与裁剪工作流。该工作流可以自动识别图像中的特定物体，并进行精确裁剪，支持80多种常见物体类别的检测。

## 工作流特点

- **智能识别**：使用先进的 YOLO 模型，准确检测图像中的目标物体
- **多类别支持**：支持80+种物体类别，包括人物、动物、车辆、家具、食物等
- **双重输出**：同时提供原始裁剪和正方形裁剪两种格式
- **边界控制**：可调节裁剪边界的填充大小，灵活控制裁剪范围
- **批量处理**：适合大规模图像的自动化处理

## 支持的物体类别

### 人物与动物
- face（人脸）、person（人物）
- bird（鸟）、cat（猫）、dog（狗）、horse（马）、sheep（羊）
- cow（牛）、elephant（大象）、bear（熊）、zebra（斑马）、giraffe（长颈鹿）

### 交通工具
- bicycle（自行车）、car（汽车）、motorcycle（摩托车）、airplane（飞机）
- bus（公交车）、train（火车）、truck（卡车）、boat（船）

### 日常用品
- backpack（背包）、umbrella（雨伞）、handbag（手提包）、tie（领带）、suitcase（行李箱）
- bottle（瓶子）、wine glass（酒杯）、cup（杯子）、fork（叉子）、knife（刀）、spoon（勺子）

### 食物
- banana（香蕉）、apple（苹果）、sandwich（三明治）、orange（橙子）
- broccoli（西兰花）、carrot（胡萝卜）、hot dog（热狗）、pizza（披萨）、donut（甜甜圈）、cake（蛋糕）

### 家具与电子产品
- chair（椅子）、couch（沙发）、bed（床）、dining table（餐桌）
- tv（电视）、laptop（笔记本电脑）、mouse（鼠标）、keyboard（键盘）、cell phone（手机）

[完整列表包含80+种类别]

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | 是 | - | 输入图像路径 |
| object | string | 否 | person | 要检测的物体类型 |
| padding | number | 否 | 0 | 裁剪边界填充（像素） |
| filename_prefix_original | string | 否 | original | 原始裁剪输出前缀 |
| filename_prefix_square | string | 否 | square | 正方形裁剪输出前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |

## 使用示例

### 基础用法 - 裁剪人物
```python
result = await run_image_to_image_workflow_yolo_cropper(
    input_image="/path/to/group_photo.jpg",
    object="person"
)
```

### 裁剪人脸并添加边距
```python
result = await run_image_to_image_workflow_yolo_cropper(
    input_image="/path/to/portrait.jpg",
    object="face",
    padding=20  # 在人脸周围添加20像素边距
)
```

### 从图像中提取所有汽车
```python
result = await run_image_to_image_workflow_yolo_cropper(
    input_image="/path/to/street_scene.jpg",
    object="car",
    filename_prefix_original="car_crop",
    filename_prefix_square="car_square"
)
```

### 制作宠物头像
```python
result = await run_image_to_image_workflow_yolo_cropper(
    input_image="/path/to/pet_photo.jpg",
    object="dog",  # 或 "cat"
    padding=30,
    output_dir="/path/to/pet_avatars/"
)
```

## 应用场景

1. **电商产品图处理**
   - 自动从场景图中裁剪产品
   - 批量生成标准化产品图片

2. **人像处理**
   - 从合照中提取个人照片
   - 自动生成证件照裁剪

3. **数据集制作**
   - 为机器学习创建特定物体的数据集
   - 自动标注和裁剪训练样本

4. **社交媒体内容**
   - 智能裁剪制作头像
   - 生成聚焦特定物体的内容图片

5. **视觉分析**
   - 交通监控中的车辆提取
   - 野生动物照片的自动裁剪

## 输出说明

工作流会生成两种格式的输出：

1. **原始裁剪（Original）**：保持检测到的物体原始宽高比
2. **正方形裁剪（Square）**：将裁剪结果调整为正方形，适合用作头像等场景

## 注意事项

- YOLO 模型的检测准确率取决于图像质量和物体清晰度
- 当图像中存在多个同类物体时，会检测并裁剪所有符合条件的物体
- padding 参数可以为负值，用于缩小裁剪范围
- 建议使用清晰、光线良好的图像以获得最佳检测效果
- 某些类别（如 face）可能需要额外的模型支持

## 性能优化建议

- 对于批量处理，建议先将图像调整到合适的分辨率
- 复杂场景下可能需要调整检测阈值（如果工作流支持）
- 大图像处理可能需要更多内存，建议分批处理