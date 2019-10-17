## 使用步骤：
### 1、安装Node.js
### 2、安装依赖
```bash
npm install
```
### 3、启动
```bash
npm run dev
```
### 4、发布
```bash
npm run build:prod
```
#### 更多介绍请参阅[这里](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)。
## 加权限：
#### 1、store/modules/user.js中的getInfo注释去掉
#### 2、permission.js中的注释去掉
## 一些可能会遇到的问题：
#### 1、Error: Cannot find module 'webpack/lib/RequestShortener'.
#### 解决方法：安装webpack，使用如下命令：
```bash
npm install webpack --save-dev  // 安装成功之后，会有提示再安装一遍 webpack-cli
npm install webpack-cli --save-dev
```
#### 2、Error: Loading PostCSS Plugin failed: Cannot find module 'autoprefixer'.
#### 解决方法：安装autoprefixer，使用如下命令：
```bash
npm install autoprefixer
```