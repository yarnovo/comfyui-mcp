# Qwen Image InstantX ControlNet 工作流

## 概述

使用 Qwen Image 模型结合 InstantX ControlNet Union 和 Lotus 深度估计技术的高级图像编辑工作流。基于 Qwen 2.5 VL 7B 多模态模型，通过 InstantX ControlNet Union 提供多种控制条件支持，配合 Lotus 深度估计模型自动生成深度图进行精确的结构控制。

## 工作流特点

- **智能深度估计**：使用 Lotus 深度估计模型自动生成高质量深度图
- **多种控制模式**：InstantX ControlNet Union 支持多种控制条件
- **多模态融合**：结合 Qwen 2.5 VL 视觉语言模型的强大理解能力
- **精确结构控制**：通过深度信息保持图像的空间结构和深度关系
- **高级采样算法**：配备 AuraFlow 采样算法，确保生成质量
- **灵活控制参数**：支持控制强度、作用时机的精细调节

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
| controlnet_strength | number |  | 1 | ControlNet 控制强度 |
| controlnet_start_percent | number |  | 0 | ControlNet 开始应用的时机 |
| controlnet_end_percent | number |  | 1 | ControlNet 结束应用的时机 |
| megapixels | number |  | 1.68 | 图像缩放目标百万像素数 |
| shift | number |  | 3.1 | AuraFlow 采样算法偏移值 |
| filename_prefix | string |  | "ComfyUI" | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |
| output_name | string | 否 | - | 输出文件夹名（系统自动提供） |

## 使用示例

```python
# 基于深度控制的图像重绘
workflow_result = mcp_client.call_tool(
    "run_image_to_image_workflow_qwen_image_instantx_controlnet",
    {
        "input_image": "/path/to/input.jpg",
        "positive_prompt": "科幻风格的未来城市，霓虹灯光，赛博朋克美学",
        "negative_prompt": "模糊，低质量，变形",
        "steps": 25,
        "cfg": 3.0,
        "controlnet_strength": 0.8,
        "output_dir": "/path/to/output",
        "output_name": "cyberpunk_city"
    }
)

# 建筑风格转换
workflow_result = mcp_client.call_tool(
    "run_image_to_image_workflow_qwen_image_instantx_controlnet",
    {
        "input_image": "/path/to/building.png",
        "positive_prompt": "古典欧洲建筑风格，巴洛克装饰，大理石材质，金色细节",
        "controlnet_strength": 1.0,
        "controlnet_start_percent": 0.1,
        "controlnet_end_percent": 0.9,
        "output_dir": "/path/to/output",
        "output_name": "baroque_building"
    }
)

# 产品渲染优化
workflow_result = mcp_client.call_tool(
    "run_image_to_image_workflow_qwen_image_instantx_controlnet",
    {
        "input_image": "/path/to/product.jpg",
        "positive_prompt": "专业产品摄影，工业设计美学，金属质感，完美光影",
        "steps": 30,
        "cfg": 2.8,
        "megapixels": 2.0,
        "output_dir": "/path/to/output",
        "output_name": "product_render"
    }
)
```

## 适用场景

- **建筑可视化**：建筑设计图转专业效果图，保持空间结构
- **产品展示**：产品图像的风格化处理，增强视觉表现力
- **艺术创作**：基于深度结构的创意图像生成
- **场景编辑**：复杂场景的风格转换和内容替换
- **室内设计**：室内空间的风格转换和装饰效果展示
- **游戏美术**：概念图到成品图的快速转换

## 技术特点

1. **自动深度估计**：Lotus 模型自动分析图像深度信息，无需手动提供深度图
2. **多控制融合**：InstantX ControlNet Union 支持多种控制条件的组合使用
3. **智能语义理解**：Qwen 2.5 VL 模型能够精准理解复杂的场景描述
4. **结构保持**：通过深度控制确保生成图像保持原有的空间结构
5. **时机控制**：可精确控制 ControlNet 在采样过程中的作用时机

## 注意事项

- 输入图像的深度复杂度会影响最终生成效果
- ControlNet 强度过高可能导致过度约束，建议在 0.6-1.0 之间调整
- 对于复杂场景，建议适当增加采样步数以获得更好的细节
- 控制时机参数（start_percent/end_percent）可用于精细调节控制效果
- 建议先使用默认参数测试，再根据结果调整具体参数