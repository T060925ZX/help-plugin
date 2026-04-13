# 🤖 AI 辅助主题开发指南

> **本文档专为 AI 助手设计**，用于快速理解和生成 Yunzai-Bot Help Lite Pro 插件的自定义主题。

---

## 📋 项目概述

**Help Lite Pro** 是一个 Yunzai-Bot 帮助菜单插件，支持通过 HTML + CSS 自定义主题。

### 核心架构

```
theme/
├── {theme-name}/
│   ├── index.html    # HTML 模板（使用占位符）
│   └── style.css     # CSS 样式（使用 CSS 变量）
```

---

## 🎯 开发规则

### 1. HTML 模板规范

#### 必需占位符

| 占位符 | 说明 | 示例值 |
|--------|------|--------|
| `{{main_title}}` | 主标题 | "YUNZAI BOT" |
| `{{sub_title}}` | 副标题 | "COMMAND MENU" |
| `{{hitokoto}}` | 一言内容 | "追求卓越..." |
| `{{groups}}` | 命令组列表 | 自动生成的 HTML |
| `{{theme}}` | 主题模式 | "dark" / "light" / "none" |

#### HTML 结构要求

```html
<!DOCTYPE html>
<html lang="zh-cn" data-theme="{{theme}}">
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div class="container">
        <!-- 头部区域 -->
        <div class="header">
            <p>{{sub_title}}</p>
            <h1>{{main_title}}</h1>
        </div>
        
        <!-- 命令组列表（自动生成） -->
        {{groups}}
        
        <!-- 页脚 -->
        <div class="footer">{{hitokoto}}</div>
    </div>
</body>
</html>
```

#### ⚠️ 重要约束

1. **不要修改占位符名称** - 必须完全匹配 `{{variable}}`
2. **保留基本结构** - `.container`, `.header`, `.footer` 类名
3. **CSS 通过 link 引入** - 系统会自动替换为内联样式

---

### 2. CSS 样式规范

#### CSS 变量系统

所有主题**必须**使用 CSS 变量实现深浅色切换：

```css
/* 浅色模式（默认） */
:root {
    --bg-color: #f4f7f9;
    --container-bg: rgba(255, 255, 255, var(--container-bg-opacity, 0.95));
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --accent-color: #3b82f6;
    --item-bg: rgba(0, 0, 0, 0.03);
    --border-color: rgba(255, 255, 255, 0.5);
    --blur-amount: 10px;
}

/* 深色模式 */
[data-theme="dark"] {
    --bg-color: #0f172a;
    --container-bg: rgba(32, 38, 48, var(--container-bg-opacity, 0.95));
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --accent-color: #3b82f6;
    --item-bg: rgba(255, 255, 255, 0.05);
    --border-color: rgba(255, 255, 255, 0.1);
    --blur-amount: 25px;
}
```

#### 必需的 CSS 变量

| 变量名 | 用途 | 默认值 |
|--------|------|--------|
| `--bg-color` | 页面背景色 | 必填 |
| `--container-bg` | 容器背景 | 必填 |
| `--text-primary` | 主要文字颜色 | 必填 |
| `--text-secondary` | 次要文字颜色 | 必填 |
| `--accent-color` | 强调色（分组标题等） | 必填 |
| `--item-bg` | 命令项背景 | 必填 |
| `--border-color` | 边框颜色 | 可选 |
| `--blur-amount` | 毛玻璃模糊程度 | 可选 |
| `--container-bg-opacity` | 容器透明度（自动注入） | 0.95 或 0.6 |
| `--background-image` | 背景图片 URL（自动注入） | none |
| `--wrap-text` | 文本换行模式（自动注入） | nowrap 或 normal |

#### 关键样式类

##### 1. 页面主体
```css
body {
    width: 1200px;              /* 固定宽度 */
    padding: 60px 40px;
    background-image: var(--background-image, none);
    background-color: var(--bg-color);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}
```

##### 2. 主容器
```css
.container {
    width: 100%;
    padding: 50px;
    border-radius: 40px;
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
    background: var(--container-bg);
    backdrop-filter: blur(var(--blur-amount)) saturate(160%);
}
```

##### 3. 命令组结构（由 JS 生成）

JS 生成的 HTML 结构：
```html
<div class="group-box">
    <div class="group-label">分组名称</div>
    <div class="list">
        <div class="item">
            <img class="icon" src="file://...">
            <div class="info">
                <div class="title-text">命令标题</div>
                <div class="desc-text">命令描述</div>
            </div>
        </div>
    </div>
</div>
```

对应的 CSS：
```css
.group-box {
    margin-top: 45px;
}

.group-label {
    font-size: 15px;
    font-weight: 800;
    color: var(--accent-color);
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.item {
    width: calc(33.33% - 10px);  /* 每行3个 */
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 20px;
    background: var(--item-bg);
}

.icon {
    width: 38px;
    height: 38px;
    margin-right: 18px;
}

.title-text {
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    white-space: var(--wrap-text, nowrap);
    overflow: hidden;
    text-overflow: ellipsis;
}

.desc-text {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 3px;
    white-space: var(--wrap-text, nowrap);
    overflow: hidden;
    text-overflow: ellipsis;
}
```

---

## 🔧 高级特性

### 1. 背景图片支持

系统会自动注入背景图 URL：
```css
:root {
    --background-image: url('https://example.com/bg.jpg');
}

body {
    background-image: var(--background-image, none);
}
```

### 2. 动态透明度

有背景图时，系统自动注入：
```css
:root {
    --container-bg-opacity: 0.6;  /* 降低透明度 */
}
```

无背景图时：
```css
:root {
    --container-bg-opacity: 0.95;  /* 正常透明度 */
}
```

使用方式：
```css
.container {
    background: rgba(255, 255, 255, var(--container-bg-opacity, 0.95));
}
```

### 3. 文本换行控制

配置 `wrap_text: true` 时，系统注入：
```css
:root {
    --wrap-text: normal;  /* 允许换行 */
}
```

否则：
```css
:root {
    --wrap-text: nowrap;  /* 单行省略 */
}
```

### 4. 主题模式

HTML 会根据配置添加 `data-theme` 属性：
- `data-theme="light"` - 浅色模式
- `data-theme="dark"` - 深色模式
- `data-theme="none"` - 不分昼夜

CSS 通过属性选择器应用样式：
```css
[data-theme="dark"] {
    /* 深色模式样式 */
}
```

---

## 📦 资源文件

### 支持的资源类型

主题目录可以包含：
- ✅ 字体文件（`.ttf`, `.woff`, `.woff2`）
- ✅ 图片文件（`.png`, `.jpg`, `.webp`）
- ✅ 其他静态资源

### 资源引用方式

```css
/* 字体 */
@font-face {
    font-family: 'MyFont';
    src: url('./my-font.ttf') format('truetype');
}

/* 图片 */
.header {
    background: url('./header-bg.png');
}
```

⚠️ **注意**：系统会自动将主题目录的所有文件复制到临时目录，并将相对路径转换为绝对路径。

---

## 🎨 主题设计最佳实践

### 1. 从现有主题开始

```bash
# 复制 default 主题作为基础
cp -r theme/default theme/my-theme
```

### 2. 使用 CSS 变量

✅ **推荐**：
```css
.color { color: var(--text-primary); }
```

❌ **不推荐**：
```css
.color { color: #1e293b; }
```

### 3. 保持响应式布局

```css
.item {
    width: calc(33.33% - 10px);  /* 每行3个 */
}
```

### 4. 测试多种场景

- ✅ 有/无背景图
- ✅ 深色/浅色模式
- ✅ 长文本换行/不换行
- ✅ 不同屏幕尺寸

---

## 🚀 快速创建主题步骤

### Step 1: 创建目录
```bash
mkdir theme/my-awesome-theme
```

### Step 2: 创建 HTML
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

### Step 3: 创建 CSS
```css
:root {
    --bg-color: #ffffff;
    --container-bg: rgba(255, 255, 255, var(--container-bg-opacity, 0.95));
    --text-primary: #333333;
    --text-secondary: #666666;
    --accent-color: #007bff;
    --item-bg: #f5f5f5;
}

[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --container-bg: rgba(30, 30, 30, var(--container-bg-opacity, 0.95));
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --accent-color: #4da3ff;
    --item-bg: #2a2a2a;
}

/* ... 其他样式 ... */
```

### Step 4: 测试
```yaml
# config/config.yaml
themes: my-awesome-theme
theme: auto
```

发送 `#刷新帮助` 查看效果。

---

## ❓ 常见问题

### Q1: 为什么我的 CSS 变量不生效？

**A:** 确保：
1. 在 `:root` 中定义了变量
2. 在 `[data-theme="dark"]` 中也定义了对应变量
3. 使用 `var(--variable-name, fallback)` 语法

### Q2: 如何让背景图显示？

**A:** 
1. 在 CSS 中使用 `var(--background-image, none)`
2. 用户需要在配置中设置 `background_image_url`
3. 系统会自动注入 URL

### Q3: 字体文件如何加载？

**A:**
1. 将字体文件放在主题目录
2. 使用 `@font-face` 引入
3. 系统会自动复制文件并转换路径

### Q4: 如何实现毛玻璃效果？

**A:**
```css
.container {
    backdrop-filter: blur(var(--blur-amount)) saturate(160%);
    -webkit-backdrop-filter: blur(var(--blur-amount)) saturate(160%);
}
```

---

## 📚 参考示例

### 示例 1: 简约风格
```css
:root {
    --bg-color: #fafafa;
    --container-bg: rgba(255, 255, 255, var(--container-bg-opacity, 0.98));
    --text-primary: #2c3e50;
    --accent-color: #3498db;
    --blur-amount: 5px;
}
```

### 示例 2: 霓虹风格
```css
:root {
    --bg-color: #0a0a0a;
    --container-bg: rgba(20, 20, 20, var(--container-bg-opacity, 0.9));
    --text-primary: #00ffff;
    --accent-color: #ff00ff;
    --item-bg: rgba(255, 0, 255, 0.1);
}

.item {
    box-shadow: 0 0 10px var(--accent-color);
}
```

### 示例 3: 玻璃拟态
```css
.container {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
```

---

## 🎯 AI 开发检查清单

生成主题前，请确认：

- [ ] HTML 包含所有必需占位符
- [ ] HTML 有 `data-theme="{{theme}}"` 属性
- [ ] CSS 定义了 `:root` 变量
- [ ] CSS 定义了 `[data-theme="dark"]` 变量
- [ ] 使用了 `var(--container-bg-opacity, 0.95)` 支持动态透明度
- [ ] 使用了 `var(--background-image, none)` 支持背景图
- [ ] 使用了 `var(--wrap-text, nowrap)` 支持文本换行
- [ ] `.item` 宽度设置为 `calc(33.33% - Xpx)` 实现3列布局
- [ ] 文本溢出使用 `text-overflow: ellipsis`
- [ ] 测试了深浅色模式

---

<div align="center">

**现在你可以让 AI 帮你创建独特的主题了！** 🎨✨

参考示例主题：`theme/default/`, `theme/demo/`, `theme/cute/`

</div>
