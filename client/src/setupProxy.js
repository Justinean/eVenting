const { createProxyMiddleware } = require('http-proxy-middleware');

const target1 = 'http://localhost:3001'; 
const target2 = 'http://localhost:4000'; 

module.exports = function (app) {
    app.use(
        '/api/users',
        createProxyMiddleware({
            target: target2,
            changeOrigin: true,
        })
    );

    app.use(
        '/api',
        createProxyMiddleware({
            target: target1,
            changeOrigin: true,
        })
    );
};
