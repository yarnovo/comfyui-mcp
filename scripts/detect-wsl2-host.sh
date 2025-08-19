#!/bin/bash

# WSL2 网络信息显示脚本
# 用于获取正确的 Windows 主机 IP 地址

echo "🌐 WSL2 网络信息"
echo "=================="
echo ""

# 1. 从路由表获取默认网关（最可靠）
echo "📡 默认网关（推荐使用）:"
GATEWAY_IP=$(ip route show default | grep -oP 'default via \K[\d.]+')
if [ -n "$GATEWAY_IP" ]; then
    echo "   IP地址: $GATEWAY_IP"
    echo "   ✅ 这是访问 Windows 主机的最可靠地址"
else
    echo "   ❌ 无法获取默认网关"
fi
echo ""

# 2. 测试 ComfyUI 连接
echo "🔍 测试 ComfyUI 连接..."
if [ -n "$GATEWAY_IP" ]; then
    # 测试端口 8000
    if curl -s --noproxy "*" --connect-timeout 2 -o /dev/null -w "%{http_code}" "http://$GATEWAY_IP:8000/" | grep -q "200"; then
        echo "   ✅ ComfyUI 在端口 8000 上运行"
        PORT=8000
    elif curl -s --noproxy "*" --connect-timeout 2 -o /dev/null -w "%{http_code}" "http://$GATEWAY_IP:8188/" | grep -q "200"; then
        echo "   ✅ ComfyUI 在端口 8188 上运行"
        PORT=8188
    else
        echo "   ❌ 无法连接到 ComfyUI"
        echo "   请确保 ComfyUI 正在运行并监听 0.0.0.0"
        PORT=8000
    fi
fi
echo ""

# 配置建议
echo "📝 配置建议:"
echo "在 .env 文件中设置:"
echo ""
echo "COMFYUI_HOST=$GATEWAY_IP"
echo "COMFYUI_PORT=${PORT:-8000}"
echo "BYPASS_PROXY=true"
echo ""

# 生成 .env 模板
echo "💡 或直接运行以下命令创建 .env 文件:"
echo ""
echo "cat > .env << EOF"
echo "# ComfyUI 工作流文件夹路径"
echo "WORKFLOWS_DIR=./workflows"
echo ""
echo "# ComfyUI 服务器配置"
echo "COMFYUI_HOST=$GATEWAY_IP"
echo "COMFYUI_PORT=${PORT:-8000}"
echo ""
echo "# 绕过系统代理"
echo "BYPASS_PROXY=true"
echo "EOF"
echo ""
echo "=================="
echo "提示: 如果 IP 地址发生变化（如重启后），需要重新运行此脚本获取新地址"