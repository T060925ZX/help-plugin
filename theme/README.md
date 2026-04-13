# 主题系统说明

<div align="center">

**快速开始** | [📖 查看详细开发指南](CUSTOM_THEME_GUIDE.md) | [🤖 AI 辅助开发指南](AI_THEME_GUIDE.md)

</div>

---

## 📁 目录结构

```
theme/
├── default/          # 默认主题（支持自动昼夜切换）
│   ├── index.html    # HTML 模板
│   └── style.css     # CSS 样式
├── none/             # 无主题模式（不分昼夜）
│   ├── index.html
│   └── style.css
└── CUSTOM_THEME_GUIDE.md  # 📚 自定义主题开发指南
```

---

## ⚡ 快速使用

### 1. 切换主题

在 `config/config.yaml` 中设置：

```yaml
themes: default    # 主题名称（default / none / 自定义主题名）
theme: auto        # 主题模式：auto / dark / light / none
```

### 2. 设置背景图

```yaml
background_image_url: 'https://example.com/background.jpg'
```

系统会自动降低容器透明度至 60%，让背景图更明显。

---

## 🌙 主题模式

| 模式 | 说明 |
|------|------|
| `auto` | 自动根据时间切换（6-18点浅色，其他深色） |
| `dark` | 强制深色模式 |
| `light` | 强制浅色模式 |
| `none` | 不分昼夜，使用默认样式 |

---

## 🎨 创建自定义主题

> 💡 **提示**：以下是简要步骤，详细内容请查看 [📖 自定义主题开发指南](CUSTOM_THEME_GUIDE.md)

### 基本步骤

1. **创建主题目录**
   ```
   theme/my-theme/
   ├── index.html
   └── style.css
   ```

2. **复制基础文件**
   ```bash
   cp theme/default/index.html theme/my-theme/
   cp theme/default/style.css theme/my-theme/
   ```

3. **修改配置**
   ```yaml
   themes: my-theme
   ```

4. **编辑样式**
   - 修改 `index.html` - 调整页面结构
   - 修改 `style.css` - 调整视觉样式

5. **测试效果**
   发送 `#刷新帮助` 查看效果

---

## 📚 详细文档

如需深入了解主题开发，请查看：

- [📖 自定义主题开发指南](CUSTOM_THEME_GUIDE.md) - 完整的开发教程
  - HTML 模板占位符详解
  - CSS 变量系统完整列表
  - 高级技巧和最佳实践
  - 常见问题解答
  - 示例主题代码

- [🤖 AI 辅助开发指南](AI_THEME_GUIDE.md) - 专为 AI 助手设计
  - 快速理解项目架构
  - 完整的开发规范
  - AI 开发检查清单
  - 可直接投喂给其他 AI

---

## 🔧 核心 CSS 变量

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
| `--container-bg-opacity` | 容器透明度（有背景时自动调整为 0.6） |

完整变量列表请参考 `theme/default/style.css`

---

<div align="center">

**开始创作您的独特主题！** 🎨

[查看完整开发指南 →](CUSTOM_THEME_GUIDE.md)

</div>
