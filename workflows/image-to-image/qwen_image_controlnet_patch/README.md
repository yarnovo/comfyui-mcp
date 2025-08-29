# Qwen Image ControlNet Patch 工作流

## 概述

使用 Qwen Image 模型结合 ControlNet Patch 技术的高级图像编辑工作流。基于 Qwen 2.5 VL 7B 多模态模型，通过 Canny 边缘检测提供精确的结构控制，配合 DiffSynth ControlNet 补丁实现高质量的条件生成。

## 工作流特点

- **精确控制**：采用 Canny 边缘检测技术，提供精确的结构控制
- **多模态融合**：结合 Qwen 2.5 VL 视觉语言模型，理解复杂场景描述
- **补丁优化**：使用 DiffSynth ControlNet 补丁增强生成效果
- **高级采样**：配备 AuraFlow 采样算法，确保生成质量
- **灵活调节**：支持边缘检测阈值和控制强度的精细调节

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| input_image | string | ✓ | "" | 需要编辑的输入图像路径 |
| positive_prompt | string | ✓ | "" | 正面提示词，描述期望的生成内容 |
| negative_prompt | string |  | null | 负面提示词，描述要避免的元素 |
| seed | number |  | 随机 | 随机种子，控制生成结果的可重复性 |
| steps | number |  | 20 | 采样步数，影响生成质量 |
| cfg | number |  | 2.5 | CFG 引导强度 |
| sampler_name | string |  | "euler" | 采样器名称 |
| scheduler | string |  | "simple" | 调度器类型 |
| denoise | number |  | 1 | 去噪强度，控制生成变化程度 |
| strength | number |  | 1 | ControlNet 控制强度 |
| canny_low_threshold | number |  | 0.1 | Canny 边缘检测低阈值 |
| canny_high_threshold | number |  | 0.2 | Canny 边缘检测高阈值 |
| megapixels | number |  | 1.68 | 图像缩放目标百万像素数 |
| shift | number |  | 3.1 | AuraFlow 采样算法偏移值 |
| filename_prefix | string |  | "ComfyUI" | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |
| output_name | string | 否 | - | 输出文件夹名（系统自动提供） |

## 使用示例

```python
# 基于边缘控制的图像重绘
workflow_result = mcp_client.call_tool(
    "run_image_to_image_workflow_qwen_image_controlnet_patch",
    {
        "input_image": "/path/to/input.jpg",
        "positive_prompt": "一幅精美的水彩画，柔和的色调，艺术感强烈",
        "negative_prompt": "模糊，低质量，噪点",
        "steps": 25,
        "cfg": 3.0,
        "strength": 0.8,
        "output_dir": "/path/to/output",
        "output_name": "watercolor_art"
    }
)

# 建筑设计渲染
workflow_result = mcp_client.call_tool(
    "run_image_to_image_workflow_qwen_image_controlnet_patch",
    {
        "input_image": "/path/to/sketch.png",
        "positive_prompt": "现代建筑外观，玻璃幕墙，清晰的线条，专业建筑摄影",
        "canny_low_threshold": 0.05,
        "canny_high_threshold": 0.15,
        "strength": 1.0,
        "output_dir": "/path/to/output",
        "output_name": "building_render"
    }
)
```

## 适用场景

- **创意编辑**：保持原图结构的艺术风格转换
- **线稿上色**：将黑白线稿转换为彩色插画
- **建筑渲染**：建筑草图转专业效果图
- **产品设计**：产品概念图可视化
- **场景重建**：基于轮廓重新生成场景内容

## 技术特点

1. **边缘控制**：通过 Canny 算法提取图像边缘信息，确保结构保持
2. **多模态理解**：Qwen 2.5 VL 模型能够理解复杂的场景描述
3. **补丁增强**：DiffSynth ControlNet 补丁提升控制精度
4. **高质量采样**：AuraFlow 算法确保生成图像的细节表现

## 注意事项

- 边缘检测阈值需要根据输入图像的复杂度调整
- ControlNet 强度过高可能导致过度约束，过低则控制效果不明显
- 建议先使用默认参数测试，再根据结果调整具体参数
- 输入图像的质量和清晰度会影响最终生成效果