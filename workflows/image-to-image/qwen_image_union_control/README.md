# Qwen Image Union Control 工作流

## 概述

这是一个基于 Qwen Image 模型和 Union Control 技术的高级图像编辑工作流。通过结合 Canny 边缘检测、ReferenceLatent 条件处理和 AuraFlow 采样算法，实现精确控制的图像生成和编辑。

## 工作流特点

- **Qwen 2.5 VL 7B 模型**：采用多模态大语言模型，理解复杂的图像编辑指令
- **Union Control 技术**：通过 Canny 边缘检测提供精确的结构控制
- **Union DiffSynth LoRA**：专门的 LoRA 微调模型，优化生成效果
- **ReferenceLatent 处理**：先进的条件信息处理，提升生成质量
- **AuraFlow 采样算法**：优化的采样策略，改善视觉效果
- **FP8 量化优化**：模型使用 FP8 量化，提供更快的推理速度

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | 是 | - | 输入图像路径，将提取边缘作为控制条件 |
| positive_prompt | string | 是 | - | 正面提示词，描述生成内容 |
| negative_prompt | string | 否 | null | 负面提示词，描述要避免的元素 |
| seed | number | 否 | 685046142015154 | 随机种子，-1 为随机 |
| steps | number | 否 | 20 | 采样步数，建议 15-30 |
| cfg | number | 否 | 2.5 | CFG 引导强度，建议 2-4 |
| denoise | number | 否 | 1.0 | 去噪强度，控制变化程度 |
| sampler_name | string | 否 | euler | 采样器名称 |
| scheduler | string | 否 | simple | 调度器类型 |
| shift | number | 否 | 3.1 | AuraFlow 偏移值 |
| lora_strength | number | 否 | 1.0 | LoRA 模型强度 |
| canny_low_threshold | number | 否 | 0.4 | Canny 低阈值 |
| canny_high_threshold | number | 否 | 0.8 | Canny 高阈值 |
| megapixels | number | 否 | 1 | 目标百万像素数 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |
| output_name | string | 否 | - | 输出文件夹名（系统自动提供） |

## 使用示例

### 基础使用

```python
from comfyui_mcp import ComfyUIClient

client = ComfyUIClient()
result = await client.run_workflow(
    "qwen_image_union_control",
    input_image="path/to/input.jpg",
    positive_prompt="一幅油画风格的风景画，金色的夕阳，温暖的色调，印象派风格",
    negative_prompt="模糊，低质量，变形，文字，水印"
)
```

### 高级设置

```python
result = await client.run_workflow(
    "qwen_image_union_control",
    input_image="path/to/sketch.png",
    positive_prompt="精致的建筑渲染图，现代建筑，玻璃幕墙，蓝天白云，专业建筑摄影",
    negative_prompt="草图，线稿，未完成，模糊",
    steps=25,
    cfg=3.0,
    canny_low_threshold=0.3,
    canny_high_threshold=0.7,
    lora_strength=0.8,
    shift=2.5,
    seed=42,
    output_dir="/path/to/output",
    output_name="architecture_render"
)
```

### 创意应用示例

#### 线稿上色
```python
result = await client.run_workflow(
    "qwen_image_union_control",
    input_image="path/to/line_art.png",
    positive_prompt="动漫风格上色，鲜艳的色彩，细腻的光影，赛璐璐风格",
    canny_low_threshold=0.2,
    canny_high_threshold=0.5
)
```

#### 风格迁移（保持结构）
```python
result = await client.run_workflow(
    "qwen_image_union_control",
    input_image="path/to/photo.jpg",
    positive_prompt="梵高星空风格，旋涡状笔触，强烈的色彩对比，后印象派",
    denoise=0.8,
    lora_strength=1.2
)
```

## 注意事项

1. **边缘检测阈值**：
   - 低阈值影响边缘检测的敏感度，较低值会检测更多边缘
   - 高阈值控制边缘的连续性，较高值会过滤弱边缘
   - 根据输入图像的复杂度调整阈值

2. **LoRA 强度调节**：
   - 默认值 1.0 适合大多数场景
   - 增加强度可以增强特定风格效果
   - 过高可能导致过拟合

3. **AuraFlow 偏移值**：
   - 影响生成的视觉风格和细节表现
   - 较高值通常产生更强烈的风格化效果
   - 建议在 2-5 之间调整

4. **分辨率设置**：
   - megapixels 参数控制处理分辨率
   - 较高分辨率需要更多显存
   - 建议根据硬件性能调整

5. **提示词编写**：
   - 正面提示词应详细描述想要的效果
   - 负面提示词直接列出不需要的元素，不使用"不要"等否定词
   - 可以包含艺术风格、色彩、光影等描述

## 适用场景

- **线稿上色**：为黑白线稿添加色彩
- **建筑可视化**：将草图转换为渲染图
- **产品设计**：概念图到效果图转换
- **艺术创作**：保持结构的风格迁移
- **游戏美术**：概念艺术细化
- **UI/UX 设计**：线框图到高保真设计

## 技术细节

- 模型：qwen_image_fp8_e4m3fn.safetensors
- CLIP：qwen_2.5_vl_7b_fp8_scaled.safetensors
- LoRA：qwen_image_union_diffsynth_lora.safetensors
- VAE：qwen_image_vae.safetensors
- 采样算法：AuraFlow with ReferenceLatent