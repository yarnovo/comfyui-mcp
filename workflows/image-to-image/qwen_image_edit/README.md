# Qwen Image Edit 图像编辑工作流

## 概述

使用 Qwen Image Edit 模型的专业图像编辑工作流，基于 Qwen 2.5 VL 7B 多模态大语言模型，通过自然语言描述实现精确的图像编辑。

## 工作流特点

- **多模态理解**：基于 Qwen 2.5 VL 7B 模型，深度理解图像内容和编辑指令
- **精确编辑控制**：通过自然语言描述精确控制编辑内容和效果
- **高效推理**：使用 FP8 量化优化，提供更快的编辑速度
- **先进采样技术**：采用 CFGNorm 和 AuraFlow 算法，确保高质量输出
- **灵活应用**：支持元素去除、场景修改、风格转换等多种编辑操作

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | 是 | - | 需要编辑的输入图像路径 |
| positive_prompt | string | 是 | - | 编辑指令，描述想要的修改 |
| negative_prompt | string | 否 | null | 负面提示词（通常留空） |
| seed | number | 否 | 976480016588017 | 随机种子，-1为随机 |
| steps | number | 否 | 20 | 采样步数，15-25 |
| cfg | number | 否 | 2.5 | CFG引导强度，2-4 |
| denoise | number | 否 | 1.0 | 去噪强度，控制编辑强度 |
| sampler_name | string | 否 | euler | 采样器名称 |
| scheduler | string | 否 | simple | 调度器类型 |
| shift | number | 否 | 3 | AuraFlow偏移值 |
| megapixels | number | 否 | 1 | 目标百万像素数 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否* | - | 输出目录（系统自动提供） |

*注：output_dir 参数由系统运行时自动注入，用户可选择性使用

## 使用示例

### 去除UI元素

```python
workflow_manager.run_workflow(
    "run_image_to_image_workflow_qwen_image_edit",
    input_image="game_screenshot.png",
    positive_prompt="Remove all UI text elements from the image. Keep the feeling that the characters and scene are in water. Also, remove the green UI elements at the bottom.",
    cfg=2.5,
    steps=20,
    output_dir="/path/to/output"  # 可选
)
```

### 场景清理

```python
workflow_manager.run_workflow(
    "run_image_to_image_workflow_qwen_image_edit",
    input_image="street_photo.jpg",
    positive_prompt="Remove all the people and cars from the street, keep the buildings and environment intact",
    cfg=3.0,
    steps=25
)
```

### 物体修改

```python
workflow_manager.run_workflow(
    "run_image_to_image_workflow_qwen_image_edit",
    input_image="product.png",
    positive_prompt="Change the color of the product from red to blue, keep everything else the same",
    denoise=0.8,
    steps=20
)
```

## 编辑技巧

### 1. 编辑指令编写
- 使用清晰、具体的描述
- 指明要修改的元素和期望的结果
- 可以使用"remove"、"change"、"replace"、"add"等动词

### 2. 参数调整建议
- **cfg**: 2-3 适合温和编辑，3-4 适合更强的指令遵循
- **denoise**: 0.5-0.8 局部编辑，0.9-1.0 全局重建
- **steps**: 15 快速预览，20-25 高质量输出

### 3. 典型应用场景
- **UI去除**: 游戏截图、软件界面清理
- **场景净化**: 去除人物、车辆等干扰元素
- **物体编辑**: 颜色、材质、形状修改
- **背景处理**: 背景替换或修改
- **水印去除**: 清理图片水印和文字

## 注意事项

1. **图像分辨率**: 通过 megapixels 参数控制处理分辨率，过高可能影响速度
2. **编辑强度**: denoise 参数直接影响编辑的激进程度
3. **指令清晰度**: 编辑指令越具体，效果越精确
4. **多次尝试**: 复杂编辑可能需要调整参数多次尝试

## 模型信息

- **基础模型**: Qwen 2.5 VL 7B
- **量化版本**: FP8 (E4M3FN)
- **VAE模型**: Qwen Image VAE
- **采样算法**: AuraFlow + CFGNorm

## 输出说明

编辑后的图像将保存在指定的输出目录中，文件名格式为：
`{filename_prefix}_xxxxx.png`

其中 xxxxx 为自动生成的序号。