# 图像比例缩放工作流

## 概述

专业的图像比例缩放工具，可以按指定倍数精确调整图像尺寸，同时保持原始宽高比避免图像变形。

## 工作流特点

- **精确缩放**：支持任意比例的图像缩放，从缩小到放大都能精确控制
- **多种算法**：提供多种缩放算法选择，满足不同场景的质量需求
- **保持比例**：自动保持原始宽高比，避免图像拉伸或压缩变形
- **批量处理**：可以高效处理大量图像的缩放需求
- **灵活应用**：适用于缩略图生成、分辨率调整、素材准备等多种场景

## 主要参数

| 参数名称 | 类型 | 必填 | 默认值 | 说明 |
|---------|------|------|--------|------|
| input_image | string | 是 | - | 输入图像路径 |
| scale_by | number | 否 | 1.0 | 缩放比例（<1缩小，>1放大） |
| upscale_method | string | 否 | nearest-exact | 缩放算法 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |

## 缩放算法说明

- **nearest-exact**：最近邻算法，速度最快，适合像素风格图像
- **bilinear**：双线性插值，平衡速度和质量，适合大多数场景  
- **area**：区域插值，在缩小图像时能提供更好的质量
- **bicubic**：双三次插值，高质量算法，适合放大图像
- **lanczos**：Lanczos 算法，最高质量，适合对质量要求极高的场景

## 使用示例

### 基础缩放
```python
# 将图像缩小到原始的50%
result = await client.run_image_to_image_workflow_image_scale_by_factor(
    input_image="/path/to/image.jpg",
    scale_by=0.5
)
```

### 高质量放大
```python
# 使用双三次插值将图像放大2倍
result = await client.run_image_to_image_workflow_image_scale_by_factor(
    input_image="/path/to/image.jpg",
    scale_by=2.0,
    upscale_method="bicubic",
    output_dir="/path/to/output"
)
```

### 批量处理缩略图
```python
# 创建网页缩略图（25%大小）
result = await client.run_image_to_image_workflow_image_scale_by_factor(
    input_image="/path/to/product.jpg",
    scale_by=0.25,
    upscale_method="bilinear",
    filename_prefix="thumbnail"
)
```

## 注意事项

1. **缩放比例建议**：
   - 缩小：0.25-1.0 范围内效果最佳
   - 放大：1.0-4.0 范围内效果最佳
   - 超过4倍放大可能导致明显的质量损失

2. **算法选择**：
   - 缩小图像时，推荐使用 area 算法获得最佳质量
   - 放大图像时，建议使用 bicubic 或 lanczos
   - 处理大量图像时，可以选择 nearest-exact 提高速度
   - 需要极高质量时，选择 lanczos 算法

3. **内存使用**：
   - 大幅放大高分辨率图像可能需要较多内存
   - 批量处理时注意控制并发数量

4. **文件格式**：
   - 输出格式默认为 PNG
   - 支持 jpg、png、webp 等常见格式输入