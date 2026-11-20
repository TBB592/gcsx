# 学习资料库 · VitePress

网站 https://tbb592.github.io/gcsx/ 。使用 VitePress 自定义主题，继续沿用紫色校园界面。PDF 阅读和旧 HTML/PDF 地址保持兼容，指南使用 Markdown 编写。仍为静态网站，无后端。

## 日常只维护内容

资料仓库： https://github.com/TBB592/gcsx-content

替换 PDF 不需要改代码；新增 PDF/Markdown 时，在资料仓库 catalog.json 登记标题、分类、简介和文件。详见内容仓库 README。不要编辑本仓库生成页面。

## 自动发布

代码 push、手动运行 Actions 或每小时定时检查可触发。定时检查没有内容/代码变化时跳过构建；GitHub 定时任务可能延迟或因长期无代码活动停用，届时在 Actions 重新启用。资料版本会写入网站 deployment-info.json，可核对是否已上线。

工作流固定内容提交，再生成 PDF 预览、Markdown 与索引，通过 Pages artifact 一次性部署。PDF 内容哈希缓存减少重复渲染。失败不替换线上成功版本。内容变化不会直接向代码仓库推送，故不需要跨仓库写令牌。

## 本地开发/验证

Node 22 或以上，Poppler（pdfinfo/pdftoppm）。内容仓库放在相邻 gcsx-content，或设置 CONTENT_DIR 指定内容目录。

```sh
npm ci --ignore-scripts
npm test
npm run build
node scripts/verify-output.cjs
npm run preview
```

Windows 若 Poppler 不在 PATH，设置 PDF_TOOLS 为其 bin 目录。构建结果在 .output，临时生成源码在 .generated，PDF 缓存在 .cache/pdf-v1；均不提交 Git。

## 代码结构

- scripts/content.cjs：资料校验与兼容输出路径。
- scripts/prepare-content.cjs：资料转换、PDF 内容哈希缓存及 Markdown 准备。
- scripts/build-notes.cjs：兼容现有首页/PDF 阅读布局的模板适配器，仅构建时运行。
- site/.vitepress：VitePress 配置和自定义主题。
- templates、styles.css、reader.js、library.js：界面与静态阅读交互。
- .github/workflows/deploy.yml：构建、定时检查和发布。

## 扩容边界

SSG 解决内容生成与维护，不是无限文件存储。当前 PDF 原稿独立仓库、预览存构建缓存和发布产物。Git 历史仍保留过去版本，不进行历史重写。资料接近 GitHub Pages 或仓库容量限制时，应迁往对象存储/CDN，保留内容清单与页面构建流程。

## 回退

切换前站点提交：e6094226281c24fd0b2d320de9e983808e28a77e，Pages 原设置 main 分支根目录。若需回退，先暂停新部署工作流，恢复该提交的静态文件至新提交，再将 Pages 改回 Deploy from a branch/main/root。无需 force push。内容仓库保留不删除。

构建过程仅消费校验后的资料与 Markdown，不执行内容仓库脚本。Markdown 内原始 HTML 不执行；不接受路径越界、重复标识或未支持的相对附件。私密/未授权资料不要放入公开内容仓库。
