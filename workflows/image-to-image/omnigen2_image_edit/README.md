# OmniGen2 图像编辑工作流

## 概述

使用 OmniGen2 模型的高级图像编辑工作流。OmniGen2 是基于 Qwen 2.5 VL 的多模态图像编辑模型，通过文本提示词精确控制图像变换。支持材质转换、风格迁移、物体编辑等多种高级编辑功能。

## 工作流特点

- **多模态理解**：基于 Qwen 2.5 VL 的视觉语言模型，理解图像内容与文本指令
- **精准编辑**：使用双重 CFG 引导和参考潜变量技术，保持原图结构
- **灵活控制**：支持多种采样器和调度器，可调节编辑强度
- **高效处理**：智能图像缩放，优化处理速度和显存占用
- **批量生成**：支持批次处理，一次生成多个编辑结果

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | 是 | - | 需要编辑的输入图像路径 |
| positive_prompt | string | 是 | - | 正面提示词，描述期望的编辑效果 |
| negative_prompt | string | 否 | null | 负面提示词，描述要避免的元素 |
| seed | number | 否 | -1 | 随机种子，-1 表示随机 |
| steps | number | 否 | 20 | 采样步数，建议 15-30 |
| cfg_conds | number | 否 | 5 | 主要 CFG 引导强度，建议 3-7 |
| cfg_cond2_negative | number | 否 | 2 | 次要 CFG 引导强度，建议 1-3 |
| denoise | number | 否 | 1.0 | 去噪强度，控制编辑程度 |
| sampler_name | string | 否 | euler | 采样器名称 |
| scheduler | string | 否 | simple | 调度器类型 |
| megapixels | number | 否 | 1 | 图像缩放目标百万像素数 |
| batch_size | number | 否 | 1 | 批次大小 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |

## 使用示例

### 基础用法 - 材质转换

```javascript
const result = await runWorkflow({
  workflowName: 'run_image_to_image_workflow_omnigen2_image_edit',
  input: {
    input_image: '/path/to/character.jpg',
    positive_prompt: 'Transform character into crystal material, transparent crystal texture, sparkling surface, prismatic light effects',
    negative_prompt: 'blurry, low quality, distorted'
  }
});
```

### 高级用法 - 风格迁移

```javascript
const result = await runWorkflow({
  workflowName: 'run_image_to_image_workflow_omnigen2_image_edit',
  input: {
    input_image: '/path/to/photo.jpg',
    positive_prompt: 'Convert to oil painting style, thick brushstrokes, vibrant colors, artistic texture',
    negative_prompt: 'photo realistic, digital art, 3d render',
    seed: 12345,
    steps: 30,
    cfg_conds: 6,
    denoise: 0.8,
    output_dir: './outputs/style_transfer'
  }
});
```

### 批量处理

```javascript
const result = await runWorkflow({
  workflowName: 'run_image_to_image_workflow_omnigen2_image_edit',
  input: {
    input_image: '/path/to/portrait.jpg',
    positive_prompt: 'Professional business portrait, formal attire, clean background',
    batch_size: 4,  // 生成 4 个变体
    seed: -1,       // 随机种子
    output_dir: './outputs/portraits'
  }
});
```

## 提示词建议

### 材质转换示例
- **水晶材质**：`crystal material, transparent, sparkling, prismatic light`
- **金属材质**：`metallic surface, chrome finish, reflective, industrial`
- **木质材质**：`wooden texture, natural grain, organic material`
- **玻璃材质**：`glass material, translucent, refraction effects`

### 风格转换示例
- **油画风格**：`oil painting style, thick brushstrokes, classic art`
- **水彩风格**：`watercolor painting, soft edges, flowing colors`
- **卡通风格**：`cartoon style, cel shading, anime aesthetic`
- **素描风格**：`pencil sketch, hand drawn, artistic lines`

### 效果增强示例
- **光照增强**：`dramatic lighting, cinematic illumination, volumetric light`
- **色彩调整**：`vibrant colors, pastel tones, monochrome palette`
- **细节增强**：`highly detailed, sharp focus, intricate patterns`

## 注意事项

1. **输入图像要求**
   - 支持 JPG、PNG 等常见格式
   - 建议使用高质量原图以获得最佳效果
   - 图像会根据 megapixels 参数自动缩放

2. **提示词编写**
   - 正面提示词应清晰描述期望效果
   - 负面提示词用于排除不需要的元素
   - 可以结合多种描述词实现复杂效果

3. **参数调节**
   - steps 越高质量越好但速度越慢
   - cfg_conds 控制提示词的影响力
   - denoise 控制编辑强度，1.0 为完全重绘

4. **性能优化**
   - megapixels 参数可控制处理分辨率
   - 较低的值可加快处理速度
   - batch_size 可一次生成多个结果

5. **输出管理**
   - 默认保存到 ComfyUI 输出目录
   - 可通过 output_dir 指定自定义路径
   - filename_prefix 用于组织输出文件

## 模型信息

- **基础模型**：OmniGen2 (omnigen2_fp16.safetensors)
- **CLIP 模型**：Qwen 2.5 VL (qwen_2.5_vl_fp16.safetensors)
- **VAE 模型**：ae.safetensors
- **技术特性**：多模态理解、双重 CFG 引导、参考潜变量

## 适用场景

- 角色材质变换
- 艺术风格化
- 创意图像编辑
- 产品效果图制作
- 概念设计探索
- 视觉特效制作