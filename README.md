# 学科学习笔记

一个纯静态学习资料网站。目前包含工程数学、大学物理下册。无后端、数据库或登录系统。

## 页面

- index.html：学科首页，含QQ群交流入口和全站累计阅览量。
- engineering-mathematics.html：工程数学阅读页。
- university-physics-2.html：大学物理下册阅读页。
- assets/：PDF原文件、逐页PNG预览及原始QQ群二维码。
- counter.html / counter.js：既有第三方计数功能，仅首页加载，固定计数地址未变。

所有资料页使用静态图片预览，不依赖PDF插件或JavaScript，支持放大、页码跳转、查看原图、下载PDF及切换学科。阅览计数依赖不蒜子服务；其不可用不会影响资料阅读。

## 新增学科或更新资料

subjects.json 是统一资料清单。新增一条记录，指定唯一英文 slug、中文标题、学科分类、说明、源PDF相对路径、公开PDF路径和独立预览图片前缀。

建议预览前缀按学科使用不同目录，例如 assets/chemistry-pages/page。不要让不同学科共享预览目录或覆盖已有公共文件。

安装 Node.js 和 Poppler（含 pdfinfo、pdftoppm），然后在仓库根目录执行：

```powershell
node scripts/build-notes.cjs --source-root "你的学习笔记文件夹" --pdf-tools "Poppler的bin目录" --render
```

source 字段相对于 --source-root。脚本复制最新PDF，以180 DPI重新生成预览，自动读取页数与图片尺寸，并输出首页、独立资料页及 subjects-manifest.json。只替换各清单对应的PDF和该前缀匹配的生成图片，不修改原始学习笔记。

若PDF和预览已经齐全，仅更新页面内容可执行：

```powershell
node scripts/build-notes.cjs
```

脚本仅在维护时运行，访客访问网站无需 Node.js 或任何后端。提交生成的HTML、PDF和预览图片后，GitHub Pages 自动发布；仅修改本机文件不会更新网站。

## GitHub Pages

发布源为 main 分支 /（根目录）。保留 .nojekyll。原工程数学PDF路径以及首页 #reader 入口继续可用。

## 交流

QQ群：1124683202。群二维码由站长提供，位于 assets/qq-group.jpg。二维码失效时请更新图片。

## 紫色主题与输入页码跳转

阅读页通过 reader.js 在浏览器内校验整数页码并滚动到对应预览，支持回车。脚本无需后端。未启用 JavaScript 时仍能滚动阅读，跳转表单会隐藏。修改生成器后运行 node scripts/build-notes.cjs 更新静态页面。

## 阅读反馈选项

每份资料末尾提供“很有帮助／希望补充内容／发现错误”。第一项显示感谢，后两项展示QQ群1124683202和原始二维码入口。此功能仅在浏览器中展示提示，不保存点赞、不收集文字、不发送网络反馈，不需要表单账号或后端。
