/*global require, __dirname*/
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = 8080; 

// Serve static files from the directory containing frontend files
app.use(express.static(path.join(__dirname)));

// Proxy API requests from '/api' to the backend server's private IP
app.use('/api', createProxyMiddleware({
 target: 'http://192.168.1.155:8080', // Private IP of backend server
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove '/api' prefix before forwarding to backend
    },
    ws: true, // Enable WebSocket proxying
}));

app.listen(port, () => {
    console.log(`Frontend server is running on http://0.0.0.0:${port}`);
});
