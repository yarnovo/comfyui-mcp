# 图像按像素数缩放工作流

## 概述

这是一个专业的图像尺寸调整工作流，通过指定目标总像素数来智能缩放图像。该工作流会自动计算合适的宽高尺寸，在保持原始宽高比的同时，将图像调整到指定的总像素数。

## 工作流特点

- **精确控制**：通过百万像素（megapixels）参数精确控制输出图像大小
- **保持比例**：自动保持原始图像的宽高比，避免图像变形
- **高质量算法**：支持多种缩放算法，默认使用 nearest-exact 确保最佳质量
- **批量处理**：适合批量处理大量图片到统一的文件大小
- **灵活应用**：适用于网页优化、存储优化、缩略图生成等多种场景

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | 是 | - | 输入图像路径 |
| megapixels | number | 否 | 1 | 目标总像素数（百万像素） |
| upscale_method | string | 否 | nearest-exact | 缩放算法 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |

## 使用示例

### 基础使用 - 缩放到1百万像素

```python
from comfyui_mcp import run_workflow

result = run_workflow(
    "image_scale_by_pixel_count",
    input_image="/path/to/your/image.jpg"
)
```

### 自定义像素数

```python
# 缩放到50万像素（约700x700）
result = run_workflow(
    "image_scale_by_pixel_count",
    input_image="/path/to/large_photo.jpg",
    megapixels=0.5
)

# 缩放到2百万像素（约1400x1400）
result = run_workflow(
    "image_scale_by_pixel_count",
    input_image="/path/to/small_image.png",
    megapixels=2
)
```

### 批量处理示例

```python
import os
from pathlib import Path

# 批量处理文件夹中的所有图片
input_folder = Path("/path/to/images")
output_folder = Path("/path/to/output")

for image_file in input_folder.glob("*.jpg"):
    result = run_workflow(
        "image_scale_by_pixel_count",
        input_image=str(image_file),
        megapixels=0.5,  # 统一缩放到50万像素
        output_dir=str(output_folder),
        filename_prefix=f"scaled_{image_file.stem}"
    )
    print(f"处理完成: {image_file.name}")
```

### 使用不同的缩放算法

```python
# 使用双线性插值（更平滑）
result = run_workflow(
    "image_scale_by_pixel_count",
    input_image="/path/to/image.jpg",
    megapixels=1,
    upscale_method="bilinear"
)

# 使用区域采样（缩小时质量更好）
result = run_workflow(
    "image_scale_by_pixel_count",
    input_image="/path/to/large_image.jpg",
    megapixels=0.25,
    upscale_method="area"
)
```

## 像素数参考

- **0.1 MP**：约 316x316 像素，适合小缩略图
- **0.25 MP**：约 500x500 像素，适合社交媒体预览
- **0.5 MP**：约 707x707 像素，适合中等大小展示
- **1 MP**：约 1000x1000 像素，适合网页展示
- **2 MP**：约 1414x1414 像素，适合高清展示
- **4 MP**：约 2000x2000 像素，适合打印输出

## 缩放算法说明

- **nearest-exact**（默认）：最近邻精确算法，保持锐利边缘，适合像素艺术和需要保持原始像素特征的场景
- **bilinear**：双线性插值，提供平滑的过渡效果，适合一般照片处理
- **area**：区域采样算法，在缩小图像时能提供最佳质量，适合生成缩略图
- **bicubic**：双三次插值，在放大图像时提供更好的质量，适合图像放大场景
- **lanczos**：Lanczos重采样算法，提供高质量的缩放效果，但计算开销较大

## 注意事项

1. **宽高比保持**：工作流会自动保持原始宽高比，实际输出的宽高会根据原图比例计算
2. **文件格式**：支持 JPG、PNG、WEBP 等常见图像格式
3. **性能考虑**：处理超大图像时可能需要较多内存
4. **输出质量**：选择合适的缩放算法可以获得更好的输出质量

## 应用场景

- **网站优化**：批量调整图片大小以加快网页加载速度
- **存储优化**：减少高分辨率照片的存储空间
- **缩略图生成**：为图片库生成统一大小的缩略图
- **社交媒体**：调整图片到平台推荐的尺寸
- **批量处理**：统一处理大量图片到相同的文件大小