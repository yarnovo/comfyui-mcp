# FLUX.1 Schnell 完整版文生图工作流

## 概述

使用 FLUX.1 Schnell 极速版模型的完整工作流，集成双CLIP文本编码器（CLIP L + T5-XXL）实现更精确的语义理解和图像生成控制。仅需4步即可生成高质量图像，在保持专业级输出质量的同时大幅提升生成速度。

## 工作流特点

- **双编码器架构**：同时使用 CLIP L 和 T5-XXL 编码器，提供更丰富的语义理解
- **极速生成**：4步采样算法，生成速度比标准模型快10倍以上
- **高质量输出**：虽然步数少，但通过优化的模型架构保持出色的图像质量
- **灵活控制**：支持独立调整两个文本编码器的提示词，实现更精细的创意控制
- **高分辨率支持**：原生支持1024x1024及更高分辨率输出

## 主要参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| positive_prompt | string | *见示例* | CLIP L提示词，描述主要图像内容 |
| t5xxl_prompt | string | *见示例* | T5-XXL提示词，提供详细场景和风格描述 |
| guidance | number | 3.5 | 引导强度（1-10），控制提示词影响程度 |
| seed | number | 随机 | 随机种子，固定值可重现结果 |
| steps | number | 4 | 采样步数（Schnell优化为4步） |
| cfg | number | 1 | CFG强度（Schnell推荐1） |
| width | number | 1024 | 输出图像宽度 |
| height | number | 1024 | 输出图像高度 |
| batch_size | number | 1 | 批量生成数量 |

## 使用示例

### 基础使用

```python
result = await run_workflow(
    "flux_schnell_full",
    positive_prompt="A majestic mountain landscape at sunset",
    t5xxl_prompt="Photorealistic mountain scene with golden hour lighting, dramatic clouds, snow-capped peaks"
)
```

### 创意插画风格

```python
result = await run_workflow(
    "flux_schnell_full",
    positive_prompt="Cute retro mini car with pastel flowers",
    t5xxl_prompt="3D illustration style, whimsical and delicate, spring atmosphere",
    guidance=3.5
)
```

### 批量生成

```python
result = await run_workflow(
    "flux_schnell_full",
    positive_prompt="Abstract art composition",
    batch_size=4,  # 一次生成4张不同变体
    seed=-1  # 随机种子
)
```

## 提示词编写技巧

### CLIP L 提示词（positive_prompt）
- 描述主要元素和构图
- 使用简洁明确的关键词
- 强调主体和整体风格

### T5-XXL 提示词（t5xxl_prompt）
- 提供详细的场景描述
- 包含材质、光线、氛围等细节
- 可以使用更自然的语言描述

### 引导强度（guidance）
- 1-2：更多创意自由度
- 3-4：平衡控制（推荐）
- 5+：严格遵循提示词

## 性能优化建议

1. **快速预览**：保持默认4步设置，快速验证创意
2. **批量处理**：利用batch_size参数一次生成多个变体
3. **分辨率选择**：
   - 1024x1024：标准输出，平衡质量和速度
   - 768x768：更快速度，适合草图
   - 1536x1536：高清输出，需要更多显存

## 常见应用场景

- **创意探索**：快速测试不同的视觉概念
- **原型设计**：UI/UX设计的快速视觉原型
- **内容创作**：社交媒体、博客配图快速生成
- **艺术创作**：数字艺术作品的初稿生成
- **商业设计**：产品概念图、广告素材制作

## 注意事项

- Schnell模型专为速度优化，如需更高质量可考虑使用FLUX Dev版本
- T5-XXL编码器需要较大显存，建议至少8GB VRAM
- 首次运行需要下载模型文件（约10GB）
- 建议使用CUDA加速以获得最佳性能

## 相关资源

- [FLUX.1 官方文档](https://github.com/black-forest-labs/flux)
- [ComfyUI 文档](https://github.com/comfyanonymous/ComfyUI)
- 模型下载：HuggingFace或Civitai