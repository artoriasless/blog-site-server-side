## Issue Logs

-----

### [nodemon] Error: listen EADDRINUSE: address already in use
+   **Runtime Environment**
    +   app run script : **`node nodemon forever.js`**
    +   forever version : **`forever-monitor@~1.7.1`**
    +   nodemon version : **`nodemon@~1.17.5`**
+   **Solution**
    +   update **`nodemon`** bump to **`~1.18.0`**

### [sequelize] TypeError: User.findById is not a function
+   **Runtime Environment**
    +   ORM : **sequelize@~6.0.0**
+   **Solution**
    +   With Sequelize v5, findById() was replaced by findByPk(). Replace findById using findByPk and everything should work fine