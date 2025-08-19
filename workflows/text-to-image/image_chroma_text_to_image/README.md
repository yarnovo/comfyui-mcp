# Chroma Unlocked v33 文生图工作流

## 概述

使用 Chroma Unlocked v33 模型生成高质量艺术图像的专业工作流。Chroma 是一个先进的文生图模型，特别擅长生成具有鲜明色彩和艺术风格的图像。

## 工作流特点

- **模型版本**：Chroma Unlocked v33
- **文本编码器**：T5-XXL（支持更精确的提示词理解）
- **架构基础**：SD3（Stable Diffusion 3）
- **默认分辨率**：1024x1024
- **采样器**：Euler
- **默认步数**：30步

## 技术优势

1. **色彩表现力强**：Chroma 模型特别擅长生成色彩鲜艳、对比度高的图像
2. **艺术风格多样**：支持各种艺术风格，从写实到抽象
3. **细节处理精细**：能够准确渲染复杂的细节和纹理
4. **提示词理解准确**：T5-XXL 编码器提供卓越的语义理解能力

## 主要参数

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| positive_prompt | string | 必填 | 正向提示词，描述想要生成的图像内容 |
| negative_prompt | string | null | 负向提示词，描述不想要出现的内容 |
| width | number | 1024 | 图像宽度（像素） |
| height | number | 1024 | 图像高度（像素） |
| batch_size | number | 1 | 批次大小 |
| seed | number | -1 | 随机种子（-1为随机） |
| steps | number | 30 | 采样步数 |
| cfg | number | 4 | CFG强度 |
| sampler_name | string | euler | 采样器名称 |
| scheduler | string | simple | 调度器类型 |
| denoise | number | 1 | 去噪强度 |
| filename_prefix | string | ComfyUI | 输出文件名前缀 |

## 使用示例

### 基础用法

```python
from comfyui_mcp import run_workflow

# 生成一张自然风景图
result = await run_workflow(
    "image_chroma_text_to_image",
    positive_prompt="A majestic mountain landscape at sunset, golden hour lighting, dramatic clouds, photorealistic, high detail"
)
```

### 高级用法

```python
# 生成具有特定艺术风格的图像
result = await run_workflow(
    "image_chroma_text_to_image",
    positive_prompt="A cyberpunk city street at night, neon lights, rain reflections, blade runner style, cinematic composition",
    negative_prompt="low quality, blurry, distorted, ugly",
    width=1920,
    height=1080,
    steps=40,
    cfg=5,
    seed=12345
)
```

### 批量生成

```python
# 一次生成多张变体
result = await run_workflow(
    "image_chroma_text_to_image",
    positive_prompt="Abstract art composition with vibrant colors and geometric shapes",
    batch_size=4,
    seed=-1  # 随机种子以生成不同变体
)
```

## 提示词编写建议

### 有效的提示词结构

1. **主体描述**：明确说明图像的主要内容
2. **风格指定**：如 photorealistic, oil painting, anime style 等
3. **光线描述**：如 golden hour, studio lighting, dramatic shadows
4. **色彩倾向**：如 vibrant colors, monochrome, pastel tones
5. **构图说明**：如 close-up, wide angle, bird's eye view
6. **质量修饰**：如 high detail, 4K, masterpiece

### 示例提示词

**写实风格**：
```
"A professional portrait of a young woman, natural lighting, shallow depth of field, shot on 85mm lens, photorealistic, high detail"
```

**艺术风格**：
```
"A serene Japanese garden in autumn, traditional ink painting style, minimalist composition, watercolor effects, peaceful atmosphere"
```

**概念艺术**：
```
"Futuristic space station orbiting a gas giant, sci-fi concept art, dramatic lighting, epic scale, detailed machinery, digital art style"
```

## 参数调优指南

### CFG 强度调整

- **2-3**：创意自由度高，可能偏离提示词
- **4-6**：平衡创意和准确性（推荐）
- **7-10**：严格遵循提示词，可能过度饱和

### 采样步数选择

- **20步**：快速预览，质量尚可
- **30步**：默认设置，平衡质量和速度
- **40-50步**：高质量输出，细节更丰富
- **50步以上**：边际改善递减

### 分辨率建议

- **1024x1024**：默认正方形，最稳定
- **1920x1080**：16:9 横向，适合风景
- **1080x1920**：9:16 竖向，适合人像
- **2048x2048**：超高分辨率，需更多显存

## 常见问题

### Q: 如何提高生成图像的细节？

增加采样步数到40-50，适当提高CFG值到5-6，在提示词中加入"high detail, intricate details"等描述。

### Q: 生成的图像色彩过于鲜艳怎么办？

降低CFG值到3-4，或在负向提示词中加入"oversaturated, excessive contrast"。

### Q: 如何生成特定艺术风格？

在提示词中明确指定风格，如"oil painting style", "watercolor", "pencil sketch"，并参考相应艺术家的风格描述。

### Q: 批量生成时如何保持风格一致？

使用固定的seed值，只通过微调提示词来产生变化，或使用相同的基础提示词配合不同的细节描述。

## 性能优化

- **显存占用**：1024x1024 约需 8GB VRAM
- **生成速度**：30步约需 15-30秒（取决于硬件）
- **批量处理**：batch_size=4 时显存需求约翻倍

## 注意事项

1. 首次使用需要下载模型文件（约6GB）
2. T5-XXL 编码器需要额外的显存
3. 高分辨率生成可能需要更多的系统资源
4. 建议在生成前清理显存以避免OOM错误

## 相关资源

- [Chroma 模型文档](https://github.com/chroma-model)
- [SD3 架构说明](https://stability.ai/sd3)
- [提示词编写指南](https://docs.comfyui.com/prompting)