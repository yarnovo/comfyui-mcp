# RMBG Multiple Models 背景移除工作流

## 概述

使用 RMBG 节点实现的多模型背景移除工作流，支持多种先进的背景分割模型，可以根据不同图片类型选择最适合的模型进行处理。提供丰富的参数调节选项，支持精细化边缘处理和多种背景输出模式。

## 工作流特点

- **多模型支持**：集成 RMBG-2.0、INSPYRENET、BEN、BEN2 四种专业背景移除模型
- **精确分割**：智能识别前景主体，精确分离复杂边缘
- **边缘优化**：支持 mask 模糊、偏移和前景优化功能
- **灵活输出**：支持透明背景、纯色背景、模糊背景等多种输出模式
- **高分辨率**：支持高达 1024px 的处理分辨率

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | 是 | - | 输入图片路径 |
| model | string | 否 | BEN2 | 背景移除模型选择 |
| sensitivity | number | 否 | 1 | 模型灵敏度 (0-1) |
| process_res | number | 否 | 1024 | 处理分辨率 |
| mask_blur | number | 否 | 0 | 遮罩模糊半径 |
| mask_offset | number | 否 | 0 | 遮罩偏移量 |
| invert_output | boolean | 否 | false | 是否反转输出 |
| refine_foreground | boolean | 否 | false | 是否优化前景 |
| background | string | 否 | Alpha | 背景类型（Alpha/Color） |
| background_color | string | 否 | #222222 | 背景颜色 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |

## 模型说明

### RMBG-2.0
最新版本的 RMBG 模型，综合性能最佳，适合大多数场景。

### INSPYRENET
基于 Inspyrenet 架构的模型，对复杂边缘和半透明区域有较好的处理效果。

### BEN
BiRefNet 增强版本，适合处理人像和物体。

### BEN2
BEN 的改进版本，默认模型，在速度和质量之间取得良好平衡。

## 使用示例

### 基础使用
```python
result = await workflow.run(
    input_image="/path/to/image.jpg"
)
```

### 使用 RMBG-2.0 模型
```python
result = await workflow.run(
    input_image="/path/to/image.jpg",
    model="RMBG-2.0",
    sensitivity=0.8
)
```

### 优化边缘处理
```python
result = await workflow.run(
    input_image="/path/to/image.jpg",
    mask_blur=2,
    mask_offset=1,
    refine_foreground=True
)
```

### 纯色背景输出
```python
result = await workflow.run(
    input_image="/path/to/image.jpg",
    background="Color",
    background_color="#FFFFFF"
)
```

### 指定输出目录
```python
result = await workflow.run(
    input_image="/path/to/image.jpg",
    output_dir="/custom/output/path",
    filename_prefix="removed_bg"
)
```

## 参数调节建议

### sensitivity（灵敏度）
- 0.5-0.7：适合简单背景，减少误检
- 0.8-0.9：平衡设置，适合大多数图片
- 1.0：最高灵敏度，保留所有细节

### process_res（处理分辨率）
- 512：快速处理，适合预览
- 768：平衡质量和速度
- 1024：最高质量，适合精细处理

### mask_blur（遮罩模糊）
- 0：保持锐利边缘
- 1-3：轻微柔化，自然过渡
- 4-8：明显柔化，适合毛发等复杂边缘

### mask_offset（遮罩偏移）
- 负值：收缩遮罩，去除边缘残留
- 0：不偏移
- 正值：扩展遮罩，确保完整保留主体

## 注意事项

1. 不同模型对不同类型的图片效果各异，建议根据实际需求选择
2. 处理分辨率越高，质量越好但速度越慢
3. 对于毛发、透明物体等复杂边缘，建议启用 refine_foreground
4. 输出的透明背景图片请使用 PNG 格式保存
5. background 参数支持 "Alpha"（透明背景）、"Color"（纯色背景）和 "Blur"（模糊原背景）三种模式

## 输出说明

工作流会生成两个输出：
1. 主输出：处理后的图片（透明背景或指定背景）
2. 预览输出：生成的 mask 遮罩图像

文件将保存到指定的 output_dir 或默认的 ComfyUI 输出目录。