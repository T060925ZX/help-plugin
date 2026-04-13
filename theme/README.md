# 主题系统说明

## 📁 目录结构

```
theme/
├── default/          # 默认主题（支持自动昼夜切换）
│   ├── index.html    # HTML 模板
│   └── style.css     # CSS 样式
└── none/             # 无主题模式（不分昼夜）
    ├── index.html
    └── style.css
```

## 🎨 创建自定义主题

### 1. 创建主题目录

在 `theme/` 下创建新目录，例如 `my-theme/`：

```
theme/my-theme/
├── index.html
└── style.css
```

### 2. 编写 HTML 模板

使用以下占位符：

- `{{main_title}}` - 主标题
- `{{sub_title}}` - 副标题
- `{{hitokoto}}` - 一言内容
- `{{groups}}` - 命令组列表（自动生成）

示例：

```html
<!DOCTYPE html>
<html lang="zh-cn">
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

### 3. 编写 CSS 样式

推荐使用 CSS 变量实现主题切换：

```css
/* 浅色模式 */
:root {
    --bg-color: #f4f7f9;
    --text-primary: #1e293b;
    --accent-color: #3b82f6;
    /* ... 更多变量 */
}

/* 深色模式 */
[data-theme="dark"] {
    --bg-color: #0f172a;
    --text-primary: #f8fafc;
    --accent-color: #3b82f6;
    /* ... 更多变量 */
}
```

### 4. 配置使用主题

在 `config/config.yaml` 中设置：

```yaml
themes: my-theme  # 你的主题名称
theme: auto       # auto/dark/light/none
```

## 🌙 主题模式说明

- **auto** - 自动根据时间切换（6-18点为浅色，其他为深色）
- **dark** - 强制深色模式
- **light** - 强制浅色模式
- **none** - 不使用主题系统，完全自定义

## 💡 最佳实践

1. **复制现有主题** - 从 `default` 或 `none` 主题开始修改
2. **使用 CSS 变量** - 便于维护和切换
3. **保持结构一致** - 确保 HTML 中有必要的类名
4. **测试不同模式** - 验证深浅色模式下的显示效果

## 🔧 可用 CSS 变量

| 变量名 | 说明 |
|--------|------|
| `--bg-color` | 背景颜色 |
| `--container-bg` | 容器背景 |
| `--text-primary` | 主要文字颜色 |
| `--text-secondary` | 次要文字颜色 |
| `--accent-color` | 强调色 |
| `--item-bg` | 项目背景 |
| `--icon-filter` | 图标滤镜 |
| `--blur-amount` | 模糊程度 |
| `--background-image` | 背景图片 URL（自动注入） |

完整变量列表请参考 `theme/default/style.css`

## 🖼️ 自定义背景图片

在 `config/config.yaml` 中设置背景图片：

```yaml
background_image_url: 'https://example.com/background.jpg'
```

支持的格式：
- **网络 URL**: `https://example.com/image.jpg`
- **本地路径**: `file:///path/to/image.jpg`
- **Base64**: `data:image/png;base64,...`

### 工作原理

1. 系统检测到 `background_image_url` 配置后
2. 自动将 URL 注入到 CSS 的 `:root` 变量中
3. CSS 中的 `var(--background-image, none)` 会自动使用该值
4. 背景图片会应用以下样式：
   - `background-size: cover` - 覆盖整个背景
   - `background-position: center` - 居中显示
   - `background-attachment: fixed` - 固定背景
