# BRIA AI RMBG 背景移除工作流

## 概述

使用 BRIA AI RMBG 模型实现高质量背景移除的专业工作流。BRIA RMBG（Remove Background）是一个基于深度学习的先进背景移除模型，能够精确识别并分离图像中的前景主体与背景，输出带透明通道的高质量抠图结果。

## 工作流特点

- **高精度分割**：采用 BRIA AI 的先进算法，精确识别复杂边缘
- **智能边缘处理**：自动处理头发、半透明物体等细节区域
- **快速处理**：优化的模型架构，提供快速的背景移除处理
- **通用性强**：适用于人像、产品、动物等各类主体
- **透明背景输出**：直接输出 PNG 格式的透明背景图像

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| input_image | string | 是 | - | 需要移除背景的输入图像路径 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |

## 使用示例

### 基础使用

```python
result = await mcp.call_tool(
    "run_image_to_image_workflow_bria_rmbg",
    {
        "input_image": "/path/to/portrait.jpg"
    }
)
```

### 自定义输出

```python
result = await mcp.call_tool(
    "run_image_to_image_workflow_bria_rmbg",
    {
        "input_image": "/path/to/product.png",
        "filename_prefix": "product_transparent",
        "output_dir": "/path/to/output"
    }
)
```

## 适用场景

1. **电商产品图**
   - 商品白底图制作
   - 产品展示图背景替换
   - 批量产品抠图处理

2. **人像处理**
   - 证件照背景更换
   - 人像艺术创作
   - 社交媒体头像制作

3. **设计素材**
   - PNG 透明素材制作
   - 图标和 Logo 抠图
   - 合成素材准备

4. **内容创作**
   - 视频特效素材
   - 表情包制作
   - 创意拼贴素材

## 技术特性

- **模型架构**：基于深度卷积神经网络
- **输入格式**：支持 JPG、PNG、WEBP 等常见格式
- **输出格式**：PNG 格式，包含 Alpha 通道
- **处理速度**：单张图片通常在 1-3 秒内完成
- **质量保证**：保持原始图像分辨率和细节

## 注意事项

1. **输入图像要求**
   - 建议使用清晰、对比度良好的图片
   - 主体与背景有一定的色彩或亮度差异
   - 避免过度模糊或噪点过多的图片

2. **最佳实践**
   - 人像照片建议使用正面或侧面角度
   - 产品图建议使用简单背景
   - 复杂背景可能需要后期微调

3. **输出处理**
   - 输出为透明背景 PNG，可直接用于合成
   - 如需其他背景，可使用图像编辑软件添加
   - 建议保存原始输出以备后续调整

## 相关工作流

- `rmbg_multiple_models` - 支持多种背景移除模型的高级工作流
- `inspyrenet_rembg` - 使用 InSPyReNet 模型的背景移除工作流