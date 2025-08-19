# 图像尺寸调整工作流

## 概述

专业的图像尺寸调整工具，提供精确的分辨率控制和多种高质量缩放算法。支持批量处理，可快速将图像调整到指定尺寸，同时保持最佳的视觉质量。

## 工作流特点

- 🎯 **精确控制**：自定义输出宽度和高度
- 🔧 **多种算法**：5种专业缩放算法可选
- 📐 **智能裁剪**：支持中心裁剪和拉伸适配
- 🚀 **高效处理**：优化的处理流程，快速完成
- 🎨 **质量保证**：保持原始图像的色彩和细节

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | ✅ | - | 输入图像路径 |
| width | number | ❌ | 512 | 目标宽度（像素） |
| height | number | ❌ | 512 | 目标高度（像素） |
| upscale_method | string | ❌ | nearest-exact | 缩放算法选择 |
| crop | string | ❌ | center | 裁剪模式 |
| filename_prefix | string | ❌ | ComfyUI | 输出文件名前缀 |
| output_dir | string | ❌ | - | 输出目录（系统自动提供） |

### 缩放算法说明

- **nearest-exact**：最近邻算法，处理速度最快，适合像素风格图像
- **bilinear**：双线性插值，速度和质量平衡，适合一般用途
- **area**：区域插值，缩小图像时效果最佳
- **bicubic**：双三次插值，放大图像时质量较好
- **lanczos**：Lanczos重采样，最高质量，适合要求严格的场景

## 使用示例

### 基础使用

```python
# 将图像缩放到 1024x1024
result = await client.run_workflow(
    workflow_name="image_scale_resize",
    category="image-to-image",
    params={
        "input_image": "/path/to/image.jpg",
        "width": 1024,
        "height": 1024
    }
)
```

### 制作缩略图

```python
# 创建 256x256 的缩略图，使用高质量算法
result = await client.run_workflow(
    workflow_name="image_scale_resize",
    category="image-to-image",
    params={
        "input_image": "/path/to/large_image.png",
        "width": 256,
        "height": 256,
        "upscale_method": "lanczos",
        "crop": "center",
        "filename_prefix": "thumbnail"
    }
)
```

### 批量处理

```python
# 批量将图像调整为网页适用尺寸
images = ["photo1.jpg", "photo2.jpg", "photo3.jpg"]
for img in images:
    result = await client.run_workflow(
        workflow_name="image_scale_resize",
        category="image-to-image",
        params={
            "input_image": f"/images/{img}",
            "width": 800,
            "height": 600,
            "upscale_method": "area",  # 缩小时效果最佳
            "output_dir": "/output/web_images/"
        }
    )
```

### 保持宽高比

```python
# 设置宽度，高度自动计算（需要先获取原始图像尺寸）
result = await client.run_workflow(
    workflow_name="image_scale_resize",
    category="image-to-image",
    params={
        "input_image": "/path/to/image.jpg",
        "width": 1920,
        "height": 1080,  # 16:9 比例
        "crop": "center",  # 中心裁剪保持比例
        "upscale_method": "bicubic"
    }
)
```

## 应用场景

1. **网站优化**：批量调整图片尺寸，减少加载时间
2. **缩略图生成**：为图库创建统一尺寸的预览图
3. **社交媒体**：调整图片以符合平台要求
4. **打印准备**：调整分辨率以适应打印需求
5. **存储优化**：缩小图片尺寸节省存储空间

## 注意事项

- 输入图像路径必须是有效的本地文件路径
- 过度放大可能导致图像质量下降，建议放大倍数不超过2倍
- 选择合适的缩放算法：缩小用area，放大用bicubic或lanczos
- crop设为"disabled"时图像可能变形，建议使用"center"保持比例
- 输出文件将保存为PNG格式以保持最佳质量