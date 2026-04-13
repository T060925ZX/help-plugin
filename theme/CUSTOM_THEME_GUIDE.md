# 自定义主题开发指南

## 📖 概述

本指南将帮助您创建属于自己的帮助菜单主题。通过修改 HTML 模板和 CSS 样式，您可以完全定制帮助菜单的外观。

---

## 📁 主题结构

### 目录结构

```
theme/
├── your-theme-name/      # 您的主题名称
│   ├── index.html        # HTML 模板
│   └── style.css         # CSS 样式
├── default/              # 默认主题（参考）
└── none/                 # 无主题模式（参考）
```

### 文件说明

- **index.html** - 页面结构和布局
- **style.css** - 视觉样式和配色

---

## 🚀 快速开始

### 步骤 1：创建主题目录

在 `theme/` 目录下创建新文件夹，例如 `my-theme`：

```bash
mkdir theme/my-theme
```

### 步骤 2：复制基础文件

从 `default` 或 `none` 主题复制文件作为起点：

```bash
cp theme/default/index.html theme/my-theme/
cp theme/default/style.css theme/my-theme/
```

### 步骤 3：修改配置

在 `config/config.yaml` 中设置使用您的主题：

```yaml
themes: my-theme    # 您的主题名称
theme: auto         # auto/dark/light/none
```

### 步骤 4：测试效果

发送 `#刷新帮助` 查看效果，根据需要调整样式。

---

## 📝 HTML 模板

### 基本结构

```html
<!DOCTYPE html>
<html lang="zh-cn" data-theme="{{theme}}">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <p>{{sub_title}}</p>
            <h1>{{main_title}}</h1>
        </div>
        {{groups}}
        <div class="footer">{{hitokoto}}</div>
    </div>
</body>
</html>
```

### 可用占位符

| 占位符 | 说明 | 示例 |
|--------|------|------|
| `{{main_title}}` | 主标题 | YUNZAI BOT |
| `{{sub_title}}` | 副标题 | COMMAND MENU |
| `{{hitokoto}}` | 一言内容 | 追求卓越... |
| `{{groups}}` | 命令组列表 | 自动生成 |
| `{{theme}}` | 主题模式 | dark/light/none |

### 自定义 HTML 结构

您可以完全重写 HTML 结构，但建议保留以下类名以确保兼容性：

- `.container` - 主容器
- `.header` - 头部区域
- `.group-box` - 命令组容器
- `.list` - 命令列表
- `.item` - 单个命令项
- `.icon` - 图标
- `.info` - 信息区域
- `.title-text` - 标题文本
- `.desc-text` - 描述文本
- `.footer` - 页脚

---

## 🎨 CSS 样式

### CSS 变量系统

推荐使用 CSS 变量实现主题切换和自定义：

```css
:root {
    /* 浅色模式变量 */
    --bg-color: #f4f7f9;
    --container-bg: rgba(255, 255, 255, var(--container-bg-opacity, 0.95));
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --accent-color: #3b82f6;
}

/* 深色模式变量 */
[data-theme="dark"] {
    --bg-color: #0f172a;
    --container-bg: rgba(32, 38, 48, var(--container-bg-opacity, 0.95));
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
}
```

### 可用的 CSS 变量

| 变量名 | 说明 | 默认值（浅色） | 默认值（深色） |
|--------|------|---------------|---------------|
| `--bg-color` | 页面背景色 | `#f4f7f9` | `#0f172a` |
| `--container-bg` | 容器背景 | `rgba(255,255,255,0.95)` | `rgba(32,38,48,0.95)` |
| `--border-color` | 边框颜色 | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.1)` |
| `--text-primary` | 主要文字 | `#1e293b` | `#f8fafc` |
| `--text-secondary` | 次要文字 | `#64748b` | `#94a3b8` |
| `--accent-color` | 强调色 | `#3b82f6` | `#3b82f6` |
| `--item-bg` | 项目背景 | `rgba(0,0,0,0.03)` | `rgba(255,255,255,0.05)` |
| `--group-line` | 分组线颜色 | `rgba(59,130,246,0.15)` | `rgba(59,130,246,0.3)` |
| `--footer-color` | 页脚文字 | `#94a3b8` | `#64748b` |
| `--icon-filter` | 图标滤镜 | `drop-shadow(...)` | `brightness(1.1) drop-shadow(...)` |
| `--blur-amount` | 模糊程度 | `10px` | `25px` |
| `--background-image` | 背景图片 | `none` | 自动注入 |
| `--container-bg-opacity` | 容器透明度 | `0.95` | 有背景时 `0.6` |

### 关键样式类

#### 1. 页面主体

```css
body {
    width: 1200px;
    padding: 60px 40px;
    background-image: var(--background-image, none);
    background-color: var(--bg-color);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}
```

#### 2. 主容器

```css
.container {
    width: 100%;
    padding: 50px;
    border-radius: 40px;
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
    background: var(--container-bg);
    border: 1px solid var(--border-color);
    backdrop-filter: blur(var(--blur-amount)) saturate(160%);
}
```

#### 3. 命令项

```css
.item {
    width: calc(33.33% - 10px);  /* 每行3个 */
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 20px;
    background: var(--item-bg);
    border: 1px solid var(--item-border);
}
```

#### 4. 文本省略

```css
.title-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;  /* 显示 ... */
}

.desc-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

---

## 🖼️ 背景图片

### 配置方法

在 `config/config.yaml` 中设置：

```yaml
background_image_url: 'https://example.com/background.jpg'
```

### 支持格式

- **网络 URL**: `https://example.com/image.jpg`
- **本地路径**: `file:///D:/images/bg.jpg`
- **Base64**: `data:image/png;base64,...`

### 自动透明度

系统会自动检测背景图并调整容器透明度：

- **无背景图**：容器透明度 95%
- **有背景图**：容器透明度 60%

---

## 🌙 主题模式

### 配置选项

在 `config/config.yaml` 中设置：

```yaml
theme: auto  # auto / dark / light / none
```

### 模式说明

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| `auto` | 根据时间自动切换 | 通用 |
| `dark` | 强制深色模式 | 夜间使用 |
| `light` | 强制浅色模式 | 白天使用 |
| `none` | 不分昼夜，使用默认样式 | 自定义主题 |

### 实现原理

HTML 会根据配置添加 `data-theme` 属性：

```html
<html data-theme="dark">  <!-- 深色模式 -->
<html data-theme="light"> <!-- 浅色模式 -->
<html data-theme="none">  <!-- 无主题模式 -->
```

CSS 通过属性选择器应用不同样式：

```css
[data-theme="dark"] {
    /* 深色模式样式 */
}
```

---

## 💡 最佳实践

### 1. 从现有主题开始

```bash
# 复制 default 主题作为基础
cp -r theme/default theme/my-custom-theme
```

### 2. 使用 CSS 变量

```css
/* ✅ 推荐：使用变量 */
.color { color: var(--text-primary); }

/* ❌ 不推荐：硬编码颜色 */
.color { color: #1e293b; }
```

### 3. 保持响应式

确保在不同屏幕尺寸下都能正常显示。

### 4. 测试多种模式

```yaml
# 测试深色模式
theme: dark

# 测试浅色模式
theme: light

# 测试背景图
background_image_url: 'your-image-url'
```

### 5. 注释清晰

```css
/* 头部样式 */
.header {
    margin-bottom: 40px;
}

/* 命令项悬停效果 */
.item:hover {
    background: var(--item-bg-hover);
}
```

---

## 🔧 高级技巧

### 自定义布局

修改 `.item` 的宽度可以改变每行显示的命令数量：

```css
/* 每行 2 个 */
.item { width: calc(50% - 10px); }

/* 每行 4 个 */
.item { width: calc(25% - 10px); }
```

### 添加动画效果

```css
.item {
    transition: all 0.3s ease;
}

.item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 自定义字体

```css
* {
    font-family: "Your Font", "PingFang SC", sans-serif;
}
```

### 多行文本显示

如果想让描述显示多行：

```css
.desc-text {
    white-space: normal;
    overflow: visible;
    text-overflow: initial;
    /* 限制最多 2 行 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
```

---

## 📦 分享主题

### 打包主题

将您的主题文件夹压缩：

```bash
cd theme
zip -r my-theme.zip my-theme/
```

### 主题元数据（可选）

在主题目录下创建 `theme.json`：

```json
{
    "name": "My Custom Theme",
    "author": "Your Name",
    "version": "1.0.0",
    "description": "一个精美的自定义主题",
    "preview": "preview.png"
}
```

---

## ❓ 常见问题

### Q1: 修改 CSS 后没有生效？

**A:** 发送 `#刷新帮助` 重新渲染，或检查浏览器控制台是否有 CSS 错误。

### Q2: 如何调试主题？

**A:** 
1. 临时生成的 HTML 在 `data/help-plugin-temp/help_temp.html`
2. 用浏览器打开该文件进行调试
3. 修改 CSS 后重新生成

### Q3: 深色模式不生效？

**A:** 确保：
- HTML 中有 `data-theme="{{theme}}"`
- CSS 中有 `[data-theme="dark"]` 选择器
- 配置文件中 `theme: dark` 或 `theme: auto`

### Q4: 背景图不显示？

**A:** 检查：
- URL 是否正确
- 图片是否可访问
- CSS 中是否有 `background-image: var(--background-image, none)`

### Q5: 如何恢复默认主题？

**A:** 修改配置：
```yaml
themes: default
```

---

## 📚 参考资源

- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

---

## 🎯 示例主题

### 简约风格

```css
:root {
    --container-bg: rgba(255, 255, 255, 0.98);
    --blur-amount: 5px;
    --border-radius: 20px;
}
```

### 霓虹风格

```css
:root {
    --accent-color: #ff00ff;
    --item-bg: rgba(255, 0, 255, 0.1);
    --text-primary: #00ffff;
}

.item {
    box-shadow: 0 0 10px var(--accent-color);
}
```

### 玻璃拟态

```css
.container {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
```

---

<div align="center">

**祝您创作出独特的主题！** 🎨

如有问题，请参考 `theme/README.md` 或查看示例主题

</div>
