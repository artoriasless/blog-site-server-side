# blog-site-server-side
server-side of enhanced blog site belongs to me, version 5.0（[中文](https://github.com/MonkingStand/blog-site-server-side/blob/master/README.zh.md)）

> depreciated tips : this repo has(will) be upgraded into **[6.0](https://github.com/MonkingStand/nextjs-blog-site)**

> issue log : **[ISSUE](https://github.com/MonkingStand/blog-site-server-side/blob/master/ISSUE.md)**

> blog site : **[stanby.cn](http://www.stanby.cn)**

## brief
*   it uses **node@12.6.0** and **`npm@6.9.x`** as local development&runtime environment
*   it will use **`koa@~2.5.1`** as nodejs framework
*   it will use **`mysql`** as database
*   it will use **`sequelize`** as ORM
*   about front-end resources
    *   due to that all front-end static resources will be migrated into **OSS** , all resources will be imported from **OSS**

## NOTE
*   node version must be at least **7.6.0** (due koa2 required, but suggest **12.6.0**)
*   scripts cmd in pkg.json is available for linux/os x,if you want to run under window,it's supposed to modify
    *   change `NODE_ENV=development` to `$env:NODE_ENV="development"` may work
    *   if still not work,try to ask for help on **Stack Overflow**