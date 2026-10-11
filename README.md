# 工程数学网站

工程数学学习笔记网站，支持 PDF 在线阅读、下载与手机浏览。纯静态 HTML/CSS，无后端。

## GitHub Pages 部署

将本目录内容上传到仓库根目录，然后在 Settings → Pages 中选择 Deploy from a branch，分支选择 main，目录选择 /(root)，保存。等待发布完成，以 GitHub Pages 页面给出的实际网址为准。

## 更新笔记

替换 assets/engineering-mathematics.pdf，并根据实际文件大小更新 index.html 中的说明。提交后 GitHub Pages 会重新部署。

## 本地查看

在浏览器打开 index.html。如果内嵌 PDF 不显示，使用页面的“独立打开 PDF”或“下载 PDF”。

## 兼容阅读预览

阅读区使用由原 PDF 以 180 DPI 导出的 9 张 PNG 图片，不依赖浏览器 PDF 插件、JavaScript 或外部 CDN。支持滚动阅读、跳页和放大。图片预览不可选择文字；全文搜索和复制请使用原始 PDF。

更换 PDF 时必须同步重新生成 assets/pages/page-N.png，并更新 index.html 中的页码、图片尺寸及总页数，避免预览与下载版本不一致。
