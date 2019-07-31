# blog-site-fontend-side
自己搭的一个博客网站——后端部分（增加版），5.0 版本（[English](https://github.com/MonkingStand/blog-site-server-side)）

> 踩坑记录 : **[坑~](https://github.com/MonkingStand/blog-site-server-side/blob/master/ISSUE.md)**

> 线上运行版本可访问 : **[stanby.cn](http://www.stanby.cn)**

## 简述
*   使用 **`node@12.6.x`** 和 **`npm@6.9.x`** 的本地开发构建环境
*   使用 **`koa@~2.5.1`** 作为 nodejs 框架
*   使用 **`mysql`** 作为数据库
*   使用 **`sequelize`** 作为 ORM
*   关于前端静态资源
    *   由于所有静态资源将迁移至 **OSS** ，因此所有资源将从 **OSS** 引入

## 说明
*   如果需要本地启动服务， node 版本至少为 **7.6.0** ( koa2 限制，建议使用 **12.6.0** ，和前端保持一致)
*   package.json 中的启动脚本在 Linux/OS X 下正常执行，在 windows 环境下会报错，可能需要做部分修改
    *   修改 `NODE_ENV=development` 为 `$env:NODE_ENV="development"` 可能可以解决这个问题
    *   如果无法解决，请上 **Stack Overflow** 寻求帮助