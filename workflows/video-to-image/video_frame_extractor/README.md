# 视频帧提取工作流

## 概述

这是一个基于 VHS (Video Helper Suite) 插件的专业视频帧提取工作流。该工作流可以从上传的视频文件中智能提取静态帧，支持多种视频格式和精确的帧选择控制，是视频分析和内容处理的强大工具。

## 工作流特点

- **多格式支持**：兼容 MP4、AVI、MOV 等主流视频格式
- **精确控制**：支持帧率调整、尺寸定制、帧数限制等专业参数
- **智能选择**：可跳过开头帧、间隔选择特定帧，提供灵活的帧提取策略
- **高质量输出**：保持原始视频质量，支持自定义输出尺寸
- **批量处理**：一次性提取多个帧，适合大规模视频处理任务

## 核心功能

### 帧选择控制
- 跳过视频开头指定数量的帧
- 按间隔选择帧（如每隔2帧选择一帧）
- 限制最大加载帧数以控制输出量

### 尺寸与质量控制
- 保持原始视频尺寸或自定义输出分辨率
- 支持宽高比调整和强制帧率设置
- 优化内存使用，适合长视频处理

## 主要参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| video | string | 是 | - | 输入视频文件路径 |
| force_rate | number | 否 | 0 | 强制帧率（0=原始帧率） |
| custom_width | number | 否 | 0 | 自定义输出宽度（0=原始宽度） |
| custom_height | number | 否 | 0 | 自定义输出高度（0=原始高度） |
| frame_load_cap | number | 否 | 0 | 最大加载帧数（0=全部加载） |
| skip_first_frames | number | 否 | 0 | 跳过开头帧数 |
| select_every_nth | number | 否 | 1 | 每N帧选择一帧 |
| format | string | 否 | AnimateDiff | 视频格式类型 |
| filename_prefix | string | 否 | ComfyUI | 输出文件名前缀 |
| output_dir | string | 否 | - | 输出目录（系统自动提供） |

## 使用示例

### 基础用法 - 提取所有帧
```python
result = await run_video_to_image_workflow_video_frame_extractor(
    video="/path/to/video.mp4"
)
```

### 每隔3帧提取一帧
```python
result = await run_video_to_image_workflow_video_frame_extractor(
    video="/path/to/video.mp4",
    select_every_nth=3,
    filename_prefix="frame_sample"
)
```

### 跳过开头并限制提取数量
```python
result = await run_video_to_image_workflow_video_frame_extractor(
    video="/path/to/long_video.mp4",
    skip_first_frames=30,      # 跳过前30帧
    frame_load_cap=100,        # 只提取100帧
    select_every_nth=2         # 每隔一帧选择
)
```

### 自定义输出尺寸和路径
```python
result = await run_video_to_image_workflow_video_frame_extractor(
    video="/path/to/video.mp4",
    custom_width=1920,
    custom_height=1080,
    filename_prefix="thumbnail",
    output_dir="/path/to/output/frames/"
)
```

### 制作视频缩略图
```python
result = await run_video_to_image_workflow_video_frame_extractor(
    video="/path/to/presentation.mp4",
    select_every_nth=60,       # 大约每2秒一帧（30fps视频）
    custom_width=480,
    custom_height=270,
    filename_prefix="preview"
)
```

## 应用场景

### 1. **视频内容分析**
- 提取关键帧进行内容审核
- 分析视频场景变化和内容特征
- 生成视频摘要和预览

### 2. **动画制作**
- 从视频中提取参考帧
- 创建逐帧动画素材
- 分析动作序列

### 3. **缩略图生成**
- 自动生成视频预览图
- 创建时间轴缩略图
- 制作视频封面候选

### 4. **数据集创建**
- 从视频中提取训练样本
- 创建机器学习数据集
- 构建视觉识别素材库

### 5. **质量检测**
- 检查视频质量和一致性
- 分析视频压缩效果
- 监控直播内容

## 输出说明

工作流会根据设置生成一系列静态图像文件：

- **文件格式**：PNG（保持透明度）或 JPEG
- **命名规则**：`{filename_prefix}_{序号}.png`
- **输出位置**：指定的 output_dir 或默认输出目录

## 性能优化建议

### 内存管理
- 对于长视频，使用 `frame_load_cap` 限制同时加载的帧数
- 通过 `select_every_nth` 减少不必要的帧处理
- 调整输出尺寸以平衡质量和处理速度

### 批量处理
- 使用 `skip_first_frames` 跳过片头内容
- 合理设置间隔提取，避免提取过多相似帧
- 根据需求选择合适的输出分辨率

### 格式兼容性
- 确保输入视频编码格式被 ComfyUI 支持
- 对于特殊格式，可能需要预先转换
- AnimateDiff 格式通常提供最佳兼容性

## 注意事项

- 提取大量帧会占用大量磁盘空间，建议预先规划存储
- 视频质量直接影响提取帧的质量，建议使用高质量源文件
- `force_rate` 参数会影响提取的帧数和播放速度感知
- 某些视频编码可能需要额外的解码器支持
- 处理4K等高分辨率视频时需要足够的系统内存

## 故障排除

- **视频无法加载**：检查视频格式和编码是否支持
- **内存不足**：减少 `frame_load_cap` 或降低输出分辨率
- **提取帧数不符合预期**：检查 `select_every_nth` 和视频总帧数的关系
- **输出质量问题**：避免过度缩放，保持合理的宽高比