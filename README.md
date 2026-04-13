# Help Lite Pro - 极简帮助插件

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Author](https://img.shields.io/badge/author-Jiaozi-orange)

**一个现代化、美观的 Yunzai-Bot 帮助菜单插件**

[可视化编辑器](https://help.jiaozi.live/) | [功能特性](#-功能特性) | [安装指南](#-安装指南) | [使用说明](#-使用说明)

</div>

---

## 📖 项目简介

Help Lite Pro 是一个为 Yunzai-Bot 打造的高端帮助菜单插件，采用现代化的设计风格，支持自动主题切换、自定义背景、图标库管理等功能。通过简洁的配置和强大的自动化能力，让您的 Bot 帮助菜单更加美观和专业。

### ✨ 核心特点

- 🎨 **现代化设计** - 毛玻璃效果、渐变背景、流畅动画
- 🌙 **智能主题** - 支持自动/深色/浅色三种主题模式
- 🖼️ **丰富图标** - 自动下载和管理图标库，支持回退机制
- ⚡ **智能缓存** - 基于文件哈希的增量更新，提升性能
- 🔄 **自动更新** - 一键更新插件，无需手动操作
- 📦 **配置同步** - 支持从喵喵插件同步帮助配置
- 🌐 **网络优化** - 自动检测网络环境，选择最优下载源

---

## 🚀 功能特性

### 1️⃣ 基础功能

- ✅ 生成精美的帮助菜单图片
- ✅ 支持自定义标题、副标题
- ✅ 支持一言 API 集成
- ✅ 支持自定义背景图片
- ✅ 响应式布局，适配不同屏幕

### 2️⃣ 智能图标管理

- 🎯 **优先级检测** - 首先检查指定图标是否存在
- 🔄 **自动回退** - 图标不存在时自动使用默认 logo
- 🌍 **多源下载** - 根据网络环境自动选择 GitHub 或 GitCode
- 📁 **完整克隆** - 自动克隆整个项目获取所有资源

### 3️⃣ 配置管理系统

- 📂 **分离式设计** - 默认配置与用户配置分离
  - `default_config/` - 默认配置模板（自动生成）
  - `config/` - 用户自定义配置（可安全修改）
- 💾 **自动备份** - 同步配置前自动备份原有文件
- 🔍 **格式转换** - 支持 JS 到 YAML 的自动转换

### 4️⃣ 指令系统

| 指令 | 别名 | 功能说明 |
|------|------|----------|
| `#帮助` | `#菜单`, `/help` | 显示帮助菜单图片 |
| `#刷新帮助` | `#重载帮助`, `#重置帮助` | 重新渲染帮助图片 |
| `#帮助更新` | - | 更新插件到最新版本 |
| `#同步喵喵` | - | 从喵喵插件同步帮助配置 |

---

## 📦 安装指南

### 前置要求

- ✅ Yunzai-Bot 已安装并正常运行
- ✅ Node.js >= 16.x
- ✅ Git 已安装并配置
- ✅ Puppeteer 渲染器可用

### 安装步骤

```bash
# 进入 Yunzai-Bot 根目录
cd /path/to/Yunzai

# 下载插件到 example 目录

# 国内
curl -o "./plugins/example/Help_Lite.js" "https://raw.gitcode.com/T060925ZX/help-plugin/raw/main/Help_Lite.js"

# 海外
curl -o "./plugins/example/Help_Lite.js" "https://raw.githubusercontent.com/T060925ZX/help-plugin/refs/heads/main/Help_Lite.js"
```

### 首次运行

插件首次运行时会自动：

1. ✅ 创建必要的目录结构
2. ✅ 生成默认配置文件
3. ✅ 检测网络环境
4. ✅ 下载图标库资源

> ⏱️ 首次启动可能需要几分钟下载资源，请耐心等待

---

## 📁 目录结构

```
resources/help-plugin/
├── icon/                    # 图标目录
│   ├── logo.png            # 默认图标（必填）
│   ├── help.png            # 帮助图标
│   ├── update.png          # 更新图标
│   └── ...                 # 其他图标
├── default_config/         # 默认配置模板
│   ├── config.yaml         # 主配置文件
│   └── help.yaml           # 帮助菜单配置
├── config/                 # 用户配置（可修改）
│   ├── config.yaml         # 主配置文件
│   ├── help.yaml           # 帮助菜单配置
│   └── help_backup_*.yaml  # 自动备份文件
└── Help_Lite.js            # 插件主文件

plugins/example/
└── Help_Lite.js            # 插件入口（软链接或副本）
```

---

## ⚙️ 配置说明

### config.yaml - 主配置文件

```yaml
# 主标题
main_title: 'YUNZAI BOT'

# 副标题
sub_title: 'COMMAND MENU'

# 主题模式：auto（自动）/ dark（深色）/ light（浅色）
theme: 'auto'

# 设备缩放比例（影响图片清晰度）
device_scale_factor: 1.2

# 默认一言（留空则从 API 获取）
default_hitokoto: ''

# 背景图片 URL（留空则使用纯色背景）
background_image_url: ''
```

### help.yaml - 帮助菜单配置

```yaml
- group: 基础命令              # 分组名称
  desc: 常用基础功能            # 分组描述（可选）
  list:
    - icon: help              # 图标名称（对应 icon/ 目录下的文件名）
      title: '#帮助'           # 命令标题
      desc: '查看指令菜单'     # 命令描述
    
    - icon: update
      title: '#全部更新'
      desc: '更新所有插件'

- group: 游戏功能
  list:
    - icon: game
      title: '#原神'
      desc: '原神相关功能'
```

> 💡 **提示**：图标名称不需要包含 `.png` 后缀，系统会自动添加

---

## 🎯 使用说明

### 基本用法

发送以下任一指令即可查看帮助菜单：

```
#帮助
#菜单
/help
```

### 刷新帮助

修改配置后，发送以下指令重新生成帮助图片：

```
#刷新帮助
#重载帮助
#重置帮助
```

### 更新插件

保持插件为最新版本：

```
#帮助更新
```

更新流程：
1. 在 `resources/help-plugin` 执行 `git pull`
2. 检测是否有新版本
3. 自动复制新文件到 `plugins/example/`
4. 提示重启 Bot 应用更新

### 同步喵喵配置

如果您同时安装了 [miao-plugin](https://github.com/yoimiya-kokomi/miao-plugin)，可以一键同步其帮助配置：

```
#同步喵喵
```

同步流程：
1. 读取 `plugins/miao-plugin/config/help.js`
2. **自动备份**现有 `help.yaml`
3. 转换 JS 格式为 YAML 格式
4. 写入 `resources/help-plugin/config/help.yaml`
5. 提示发送 `#刷新帮助` 查看效果

> ⚠️ 注意：同步会覆盖现有的 `help.yaml`，请确保已备份重要配置

---

## 🌐 网络优化

插件会自动检测网络环境并选择最优下载源：

| 网络环境 | 仓库地址 |
|---------|---------|
| 海外网络 | `https://github.com/T060925ZX/help-plugin.git` |
| 国内网络 | `https://gitcode.com/T060925ZX/help-plugin.git` |

检测机制：通过 ping google.com 判断网络环境

---

## 🔧 高级配置

### 自定义背景图片

在 `config.yaml` 中设置背景图片 URL：

```yaml
background_image_url: 'https://example.com/background.jpg'
```

支持：
- 本地路径：`file:///path/to/image.jpg`
- 网络 URL：`https://example.com/image.jpg`
- Base64：`data:image/png;base64,...`

### 固定一言内容

如果不想使用随机一言，可以设置固定内容：

```yaml
default_hitokoto: '这是我的自定义一言内容'
```

### 调整图片质量

修改设备缩放比例以获得更清晰的图片：

```yaml
device_scale_factor: 2.0  # 范围：1.0 - 3.0，值越大越清晰但文件越大
```

---

## ❓ 常见问题

### Q1: 首次启动卡在下载图标？

**A:** 这是正常现象，首次需要下载图标库。如果长时间无响应：
1. 检查网络连接
2. 手动克隆仓库到 `resources/help-plugin/`
3. 重启 Bot

### Q2: 图标显示为默认 logo？

**A:** 可能的原因：
- 图标文件不存在于 `icon/` 目录
- 图标名称拼写错误（注意大小写）
- 文件格式不是 `.png`

解决方法：检查 `help.yaml` 中的 `icon` 字段是否与 `icon/` 目录下的文件名一致

### Q3: 如何添加自定义图标？

**A:** 
1. 准备 PNG 格式的图标文件
2. 放入 `resources/help-plugin/icon/` 目录
3. 在 `help.yaml` 中使用文件名（不含扩展名）作为 `icon` 值

### Q4: 同步喵喵配置失败？

**A:** 请确认：
- 已安装 miao-plugin
- 路径 `plugins/miao-plugin/config/help.js` 存在
- 文件格式正确（包含 `helpList` 数组）

### Q5: 帮助图片生成失败？

**A:** 检查：
- Puppeteer 是否正确安装
- 控制台是否有报错信息
- 配置文件格式是否正确（YAML 语法）

---

## 🛠️ 开发相关

### 可视化编辑器

访问 [https://help.jiaozi.live/](https://help.jiaozi.live/) 在线编辑帮助菜单配置

### 技术栈

- **运行时**: Node.js + ES Modules
- **渲染引擎**: Puppeteer
- **配置格式**: YAML
- **图像处理**: 原生 Canvas + CSS

### 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议

---

## 👥 作者

**Jiaozi**

- GitHub: [@T060925ZX](https://github.com/T060925ZX)
- 项目主页: [help-plugin](https://github.com/T060925ZX/help-plugin)

---

## 🙏 致谢

- [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot) - 优秀的 Bot 框架
- [miao-plugin](https://github.com/yoimiya-kokomi/miao-plugin) - 灵感来源
- [Puppeteer](https://pptr.dev/) - 强大的浏览器自动化工具
- [yaml](https://www.npmjs.com/package/yaml) - YAML 解析库

---

<div align="center">

**如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by Jiaozi

</div>