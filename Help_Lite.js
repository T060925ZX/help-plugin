/**
 * @author Jiaozi
 * @version 1.2.1
 * @date 2026-04-12
 * @copyright Jiaozi © 2024-2026
 * @license MIT
 */

/** 
 * @description 可视化编辑网页：https://help.jiaozi.live/
 * 资源位置：Yunzai/resources/help-plugin
 */ 

import plugin from '../../lib/plugins/plugin.js';
import { createRequire } from "module";
import { createHash } from 'crypto';
import PuppeteerRenderer from '../../renderers/puppeteer/lib/puppeteer.js';
import yaml from 'yaml';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

const require = createRequire(import.meta.url);
const { execSync } = require("child_process");

const _path = process.cwd();
const RES_PATH = path.join(_path, 'resources', 'help-plugin');
const ICON_PATH = path.join(RES_PATH, 'icon');
const DEFAULT_CONFIG_PATH = path.join(RES_PATH, 'default_config');
const CONFIG_DIR = path.join(RES_PATH, 'config');
const CONFIG_FILE_PATH = path.join(CONFIG_DIR, 'config.yaml');
const HELP_FILE_PATH = path.join(CONFIG_DIR, 'help.yaml');
const THEME_PATH = path.join(RES_PATH, 'theme');
const TEMP_DIR = path.join(_path, 'data', 'help-plugin-temp');

// 初始化渲染器
const renderer = new PuppeteerRenderer({
    headless: "new",
    args: ["--disable-gpu", "--disable-setuid-sandbox", "--no-sandbox", "--no-zygote", "--disable-dev-shm-usage"]
});

/**
 * 资源管理器：处理配置、图标下载及目录初始化
 */
class ResourceManager {
    constructor() {
        this.initDirs();
        this.initConfig();
        this.initIcons();
    }

    initDirs() {
        [RES_PATH, ICON_PATH, DEFAULT_CONFIG_PATH, CONFIG_DIR, THEME_PATH, TEMP_DIR].forEach(p => {
            if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
        });
    }

    initConfig() {
        // 检查默认配置是否存在，不存在则创建
        const defaultConfigPath = path.join(DEFAULT_CONFIG_PATH, 'config.yaml');
        const defaultHelpPath = path.join(DEFAULT_CONFIG_PATH, 'help.yaml');
        
        if (!fs.existsSync(defaultConfigPath)) {
            const defaultCfg = {
                main_title: 'YUNZAI BOT',
                sub_title: 'COMMAND MENU',
                theme: 'auto', 
                device_scale_factor: 1.2,
                default_hitokoto: "", // 留空则从 API 获取
                background_image_url: '' // 背景图片 URL
            };
            fs.writeFileSync(defaultConfigPath, yaml.stringify(defaultCfg), 'utf8');
        }
        
        if (!fs.existsSync(defaultHelpPath)) {
            const defaultHelp = [
                {
                    group: '基础命令',
                    list: [
                        { icon: 'help', title: '#帮助', desc: '查看指令菜单' },
                        { icon: 'update', title: '#全部更新', desc: '更新所有插件' }
                    ]
                }
            ];
            fs.writeFileSync(defaultHelpPath, yaml.stringify(defaultHelp), 'utf8');
        }
        
        // 将默认配置复制到用户配置目录（如果用户配置不存在）
        if (!fs.existsSync(CONFIG_FILE_PATH)) {
            fs.copyFileSync(defaultConfigPath, CONFIG_FILE_PATH);
        }
        
        if (!fs.existsSync(HELP_FILE_PATH)) {
            fs.copyFileSync(defaultHelpPath, HELP_FILE_PATH);
        }
    }

    /**
     * 检测网络环境
     * @returns {boolean} true 为海外网络，false 为国内网络
     */
    isGlobal() {
        try {
            // 通过 ping google 来判断网络
            const cmd = process.platform === 'win32' ? 'ping -n 1 -w 2000 google.com' : 'ping -c 1 -W 2 google.com';
            execSync(cmd, { stdio: 'ignore' });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 自动初始化图标库
     */
    initIcons() {
        // 首先检查默认图标是否存在
        const defaultLogoPath = path.join(ICON_PATH, 'logo.png');
        if (!fs.existsSync(defaultLogoPath)) {
            // 检测网络环境，选择合适的仓库地址
            const isGlobal = this.isGlobal();
            const repoUrl = isGlobal 
                ? 'https://github.com/T060925ZX/help-plugin.git' 
                : 'https://gitcode.com/T060925ZX/help-plugin.git';
            
            logger.mark(`[Help-Plugin] 检测到网络环境: ${isGlobal ? '海外' : '国内'}, 正在克隆项目...`);
            
            try {
                // 删除已存在的目录（如果有）
                if (fs.existsSync(RES_PATH)) {
                    fs.rmSync(RES_PATH, { recursive: true, force: true });
                }
                
                // 克隆整个项目
                execSync(`git clone --depth=1 ${repoUrl} ${RES_PATH}`, { stdio: 'inherit' });
                
                logger.mark(`[Help-Plugin] 项目克隆成功！`);
            } catch (error) {
                logger.error(`[Help-Plugin] 项目克隆失败: ${error.message}`);
                logger.mark(`[Help-Plugin] 请尝试手动下载项目放入 ${RES_PATH}`);
                
                // 如果克隆失败，确保目录存在并创建基本结构
                if (!fs.existsSync(RES_PATH)) {
                    fs.mkdirSync(RES_PATH, { recursive: true });
                    fs.mkdirSync(ICON_PATH, { recursive: true });
                    fs.mkdirSync(CONFIG_DIR, { recursive: true });
                    fs.mkdirSync(DEFAULT_CONFIG_PATH, { recursive: true });
                }
            }
        }
    }

    getConfig() {
        try { return yaml.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8')); } catch (e) { return {}; }
    }

    getHelpData() {
        try { 
            if (!fs.existsSync(HELP_FILE_PATH)) return [];
            return yaml.parse(fs.readFileSync(HELP_FILE_PATH, 'utf8')); 
        } catch (e) { return []; }
    }

    getFileHash(filePath) {
        if (!fs.existsSync(filePath)) return '';
        try {
            return createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
        } catch (e) {
            return '';
        }
    }
    
    getAllFileHashes() {
        // 返回所有相关文件的哈希值用于缓存判断
        return {
            config: this.getFileHash(CONFIG_FILE_PATH),
            help: this.getFileHash(HELP_FILE_PATH)
        };
    }
}

const resources = new ResourceManager();

/**
 * 核心渲染函数
 */
const renderHelpImage = async () => {
    const cfg = resources.getConfig();
    const helpData = resources.getHelpData();
    
    // 主题判断
    const themeMode = cfg.theme || 'auto';
    let isNight = false;
    if (themeMode === 'dark') isNight = true;
    else if (themeMode === 'light') isNight = false;
    else if (themeMode !== 'none') {
        const hour = new Date().getHours();
        isNight = hour < 6 || hour > 18;
    }

    // 获取一言
    let hitokoto = cfg.default_hitokoto;
    if (!hitokoto) {
        try {
            const response = await fetch('https://v1.hitokoto.cn/?encode=json', { timeout: 2000 });
            if (response.ok) {
                const data = await response.json();
                hitokoto = data.hitokoto || "追求卓越，成功就会在不经意间追上你";
            }
        } catch (e) {
            hitokoto = "追求卓越，成功就会在不经意间追上你";
        }
    }

    // 确定主题目录
    let themesName = cfg.themes || 'default';
    let themeDir = path.join(THEME_PATH, themesName);
    let themeHtmlPath = path.join(themeDir, 'index.html');
    let themeCssPath = path.join(themeDir, 'style.css');
    
    // 检查主题文件是否存在，如果不存在则回退到 default 主题
    if (!fs.existsSync(themeHtmlPath) || !fs.existsSync(themeCssPath)) {
        logger.warn(`[Help-Plugin] 主题 "${themesName}" 不存在，回退到 default 主题`);
        const defaultThemeDir = path.join(THEME_PATH, 'default');
        const defaultHtmlPath = path.join(defaultThemeDir, 'index.html');
        const defaultCssPath = path.join(defaultThemeDir, 'style.css');
        
        if (!fs.existsSync(defaultHtmlPath) || !fs.existsSync(defaultCssPath)) {
            logger.error('[Help-Plugin] default 主题文件也不存在，无法渲染');
            return null;
        }
        
        // 使用 default 主题
        themesName = 'default';
        themeDir = defaultThemeDir;
        themeHtmlPath = defaultHtmlPath;
        themeCssPath = defaultCssPath;
    }

    // 读取主题模板
    let htmlTemplate = fs.readFileSync(themeHtmlPath, 'utf8');
    let cssContent = fs.readFileSync(themeCssPath, 'utf8');
    
    // 生成命令组 HTML
    const groupsHtml = helpData.map(group => {
        const itemsHtml = group.list.map(item => {
            const iconPath = path.join(ICON_PATH, item.icon + '.png');
            const iconSrc = fs.existsSync(iconPath) 
                ? `file://${iconPath}` 
                : `file://${path.join(ICON_PATH, 'logo.png')}`;
            return `
                            <div class="item">
                                <img class="icon" src="${iconSrc}">
                                <div class="info">
                                    <div class="title-text">${item.title}</div>
                                    <div class="desc-text">${item.desc}</div>
                                </div>
                            </div>`;
        }).join('\n');
        
        return `
                <div class="group-box">
                    <div class="group-label">${group.group}</div>
                    <div class="list">
                        ${itemsHtml}
                    </div>
                </div>`;
    }).join('\n');

    // 替换模板变量
    const hasBg = !!cfg.background_image_url;
    htmlTemplate = htmlTemplate.replace('{{sub_title}}', cfg.sub_title);
    htmlTemplate = htmlTemplate.replace('{{main_title}}', cfg.main_title);
    htmlTemplate = htmlTemplate.replace('{{hitokoto}}', hitokoto);
    htmlTemplate = htmlTemplate.replace('{{groups}}', groupsHtml);
    
    // 设置主题模式
    let themeValue = 'light';
    if (themeMode === 'dark') {
        themeValue = 'dark';
    } else if (themeMode === 'auto') {
        themeValue = isNight ? 'dark' : 'light';
    } else if (themeMode === 'none') {
        themeValue = 'none';
    }
    htmlTemplate = htmlTemplate.replace('{{theme}}', themeValue);
    
    // 处理背景图片 - 将 URL 注入到 CSS 中
    let finalCss = cssContent;
    if (hasBg) {
        // 在 CSS 开头添加背景图片变量和降低容器透明度
        const bgVarStyle = `:root { 
    --background-image: url('${cfg.background_image_url}');
    --container-bg-opacity: 0.6;
}
`;
        finalCss = bgVarStyle + finalCss;
    }
    
    // 将 CSS 嵌入到 HTML 中
    const finalHtml = htmlTemplate.replace('<link rel="stylesheet" href="./style.css">', `<style>${finalCss}</style>`);
    
    // 创建临时 HTML 文件
    const tempHtmlPath = path.join(TEMP_DIR, 'help_temp.html');
    fs.writeFileSync(tempHtmlPath, finalHtml);

    try {
        const result = await renderer.screenshot('help-plugin', {
            tplFile: tempHtmlPath,
            imgType: 'jpeg',
            quality: 100,
            setViewport: { deviceScaleFactor: cfg.device_scale_factor || 1.2 }
        });

        if (result) {
            fs.writeFileSync(path.join(TEMP_DIR, 'help.jpg'), result);
            return result;
        }
    } catch (e) {
        logger.error("[Help-Plugin] 渲染出错:", e);
    }
    return null;
};

export class HelpPlugin extends plugin {
    constructor() {
        super({
            name: 'Help_Lite_Pro',
            dsc: '高端极简宽屏版帮助',
            event: 'message',
            priority: 5,
            rule: [
                { reg: '^(#|/)?(帮助|菜单|help)$', fnc: 'showHelp' },
                { reg: '^(#|/)?(刷新|重载)帮助$', fnc: 'refreshHelp' },
                { reg: '^(#|/)?帮助更新$', fnc: 'updateHelp' },
                { reg: '^(#|/)?同步喵喵$', fnc: 'syncMiaoMiaoHelp' },
                { reg: '^(#|/)?重置帮助$', fnc: 'resetHelp' }
            ]
        });
        this.autoCheckUpdate();
    }

    /**
     * 自动检测更新，对比配置和数据的 Hash，决定是否重新渲染
     */
    async autoCheckUpdate() {
        const cfg = resources.getConfig();
        // 如果开启了一言自动刷新，则每小时更换一次缓存
        const hitokotoSuffix = !cfg.default_hitokoto ? new Date().getHours() : '';
        const hashes = resources.getAllFileHashes();
        const currentHash = `${hashes.config}-${hashes.help}-${cfg.theme}-${cfg.background_image_url}-${hitokotoSuffix}`;
        const savedHashPath = path.join(TEMP_DIR, 'cache.hash');
        const savedHash = fs.existsSync(savedHashPath) ? fs.readFileSync(savedHashPath, 'utf8') : '';

        if (currentHash !== savedHash || !fs.existsSync(path.join(TEMP_DIR, 'help.jpg'))) {
            await renderHelpImage();
            fs.writeFileSync(savedHashPath, currentHash);
        }
    }

    async showHelp(e) {
        const imgPath = path.join(TEMP_DIR, 'help.jpg');
        // 如果文件不存在则触发渲染
        if (!fs.existsSync(imgPath)) {
            await renderHelpImage();
        }
        
        if (fs.existsSync(imgPath)) {
            return await e.reply(segment.image(`file://${imgPath}`));
        }
        return await e.reply("帮助生成失败，请检查控制台报错信息。");
    }

    async refreshHelp(e) {
        await e.reply("少女祈祷中...");
        const result = await renderHelpImage();
        if (result) {
            await e.reply(segment.image(result));
        } else {
            await e.reply("刷新失败。");
        }
        return true;
    }

    /**
     * 更新帮助插件
     */
    async updateHelp(e) {
        await e.reply("正在检查更新...");
        
        try {
            // 在 ./resources/help-plugin 目录执行 git pull
            logger.mark(`[Help-Plugin] 正在执行 git pull...`);
            const pullResult = execSync('git pull', { 
                cwd: RES_PATH,
                encoding: 'utf8',
                stdio: 'pipe'
            });
            
            logger.debug(`[Help-Plugin] Git pull 结果:`, pullResult);
            
            // 判断是否有更新
            if (pullResult.includes('Already up to date') || pullResult.includes('已经是最新的')) {
                await e.reply("✅ 帮助插件已是最新版本！");
                return true;
            }
            
            await e.reply("📦 检测到更新，正在复制文件...");
            
            // 将 ./resources/help-plugin/Help_Lite.js 复制替换到 ./plugins/example/Help_Lite.js
            const sourceFile = path.join(RES_PATH, 'Help_Lite.js');
            const targetDir = path.join(_path, 'plugins', 'example');
            const targetFile = path.join(targetDir, 'Help_Lite.js');
            
            // 确保目标目录存在
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            // 复制文件
            if (fs.existsSync(sourceFile)) {
                fs.copyFileSync(sourceFile, targetFile);
                logger.mark(`[Help-Plugin] 文件已复制到: ${targetFile}`);
                
                await e.reply("✅ 帮助插件更新成功！\n🔄 请重启 Bot 以应用更新。", true);
            } else {
                await e.reply("❌ 更新失败：找不到 Help_Lite.js 文件");
            }
            
        } catch (error) {
            logger.error(`[Help-Plugin] 更新失败:`, error.message);
            await e.reply(`❌ 更新失败：${error.message}\n请检查网络连接或手动更新。`);
        }
        
        return true;
    }

    /**
     * 同步喵喵帮助配置
     */
    async syncMiaoMiaoHelp(e) {
        await e.reply("正在同步喵喵帮助配置...");
        
        try {
            // 定义路径
            const jsFilePath = path.resolve(_path, 'plugins/miao-plugin/config/help.js');
            const defaultJsFilePath = path.resolve(_path, 'plugins/miao-plugin/config/help_default.js');
            const yamlFilePath = HELP_FILE_PATH;
            const backupFilePath = path.join(CONFIG_DIR, `help_backup_${Date.now()}.yaml`);

            // 选择文件路径
            let filePathToUse = jsFilePath;
            if (!fs.existsSync(jsFilePath)) {
                logger.warn(`[Help-Plugin] 指定的帮助文件 ${jsFilePath} 不存在，尝试使用默认帮助文件 ${defaultJsFilePath}。`);
                filePathToUse = defaultJsFilePath;
                
                if (!fs.existsSync(defaultJsFilePath)) {
                    await e.reply("❌ 未找到喵喵插件的帮助配置文件，请确认已安装 miao-plugin。");
                    return true;
                }
            }

            // 备份现有的 YAML 文件
            if (fs.existsSync(yamlFilePath)) {
                fs.copyFileSync(yamlFilePath, backupFilePath);
                logger.mark(`[Help-Plugin] 成功备份现有的 help.yaml 到 ${backupFilePath}`);
                await e.reply("📦 已备份原有配置文件");
            }

            // 动态导入 JS 文件内容
            logger.mark(`[Help-Plugin] 正在读取喵喵帮助配置: ${filePathToUse}`);
            const module = await import(`file://${filePathToUse}`);
            const helpConfig = module.default || module;

            // 检查配置格式
            if (!helpConfig.helpList || !Array.isArray(helpConfig.helpList)) {
                throw new Error('喵喵帮助配置格式不正确，缺少 helpList 数组');
            }

            // 转换为简化的 YAML 格式
            const simplifiedHelpConfig = helpConfig.helpList.map(group => ({
                group: group.group,
                desc: group.desc || undefined,
                list: group.list.map(item => ({
                    icon: item.icon || 'paimon',
                    title: item.title,
                    desc: item.desc
                }))
            }));

            // 将简化后的 JavaScript 对象转换为 YAML 格式
            const yamlContent = yaml.stringify(simplifiedHelpConfig);

            // 将 YAML 内容写入文件
            fs.writeFileSync(yamlFilePath, yamlContent, 'utf8');
            logger.mark(`[Help-Plugin] 成功将 ${filePathToUse} 同步到 ${yamlFilePath}`);
            
            await e.reply(`✅ 成功同步喵喵帮助配置！\n📝 共转换 ${simplifiedHelpConfig.length} 个命令组\n🔄 请发送 #刷新帮助 查看效果`);
            
        } catch (error) {
            logger.error('[Help-Plugin] 同步过程中出现错误:', error);
            await e.reply(`❌ 同步失败：${error.message}\n请检查喵喵插件是否正确安装。`);
        }
        
        return true;
    }

    /**
     * 重置帮助插件（备份并重新拉取）
     */
    async resetHelp(e) {
        await e.reply("🔄 开始重置帮助插件...");
        
        try {
            const backupPath = path.join(_path, 'resources', 'help-plugin-bak');
            const timestamp = Date.now();
            const finalBackupPath = `${backupPath}_${timestamp}`;
            
            // 步骤 1: 备份现有目录
            if (fs.existsSync(RES_PATH)) {
                await e.reply("📦 正在备份现有资源...");
                logger.mark(`[Help-Plugin] 正在备份 ${RES_PATH} 到 ${finalBackupPath}`);
                
                // 递归复制目录
                const copyDir = (src, dest) => {
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest, { recursive: true });
                    }
                    
                    const entries = fs.readdirSync(src, { withFileTypes: true });
                    
                    for (const entry of entries) {
                        const srcPath = path.join(src, entry.name);
                        const destPath = path.join(dest, entry.name);
                        
                        if (entry.isDirectory()) {
                            copyDir(srcPath, destPath);
                        } else {
                            fs.copyFileSync(srcPath, destPath);
                        }
                    }
                };
                
                copyDir(RES_PATH, finalBackupPath);
                logger.mark(`[Help-Plugin] 备份完成: ${finalBackupPath}`);
                await e.reply(`✅ 备份完成`);
            } else {
                await e.reply("⚠️ 未发现现有资源目录，跳过备份步骤");
            }
            
            // 步骤 2: 删除现有目录
            await e.reply("🗑️ 正在清理旧文件...");
            if (fs.existsSync(RES_PATH)) {
                fs.rmSync(RES_PATH, { recursive: true, force: true });
                logger.mark(`[Help-Plugin] 已删除旧目录: ${RES_PATH}`);
            }
            
            // 步骤 3: 重新克隆仓库
            await e.reply("📥 正在重新克隆仓库...");
            
            // 检测网络环境
            const isGlobal = this.isGlobal ? this.isGlobal() : (() => {
                try {
                    const cmd = process.platform === 'win32' ? 'ping -n 1 -w 2000 google.com' : 'ping -c 1 -W 2 google.com';
                    execSync(cmd, { stdio: 'ignore' });
                    return true;
                } catch (e) {
                    return false;
                }
            })();
            
            const repoUrl = isGlobal 
                ? 'https://github.com/T060925ZX/help-plugin.git' 
                : 'https://gitcode.com/T060925ZX/help-plugin.git';
            
            logger.mark(`[Help-Plugin] 检测到网络环境: ${isGlobal ? '海外' : '国内'}, 正在克隆...`);
            await e.reply(`🌐 使用源: ${isGlobal ? 'GitHub' : 'GitCode'}`);
            
            execSync(`git clone --depth=1 ${repoUrl} ${RES_PATH}`, { stdio: 'inherit' });
            
            logger.mark(`[Help-Plugin] 克隆成功: ${RES_PATH}`);
            await e.reply("✅ 仓库克隆成功！");
            
            // 步骤 4: 复制 Help_Lite.js 到 plugins/example/
            await e.reply("📋 正在复制插件文件...");
            const sourceFile = path.join(RES_PATH, 'Help_Lite.js');
            const targetDir = path.join(_path, 'plugins', 'example');
            const targetFile = path.join(targetDir, 'Help_Lite.js');
            
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            if (fs.existsSync(sourceFile)) {
                fs.copyFileSync(sourceFile, targetFile);
                logger.mark(`[Help-Plugin] 文件已复制到: ${targetFile}`);
            }
            
            await e.reply(
                "✅ 帮助插件重置成功！\n" +
                `📦 备份位置: ${finalBackupPath}\n` +
                "🔄 请重启 Bot 以应用更改\n" +
                "💡 如需恢复，可从备份目录手动还原"
            );
            
        } catch (error) {
            logger.error('[Help-Plugin] 重置失败:', error);
            await e.reply(
                `❌ 重置失败：${error.message}\n` +
                "💡 请检查网络连接和 Git 配置\n" +
                "📦 备份文件仍保留，可手动恢复"
            );
        }
        
        return true;
    }
}