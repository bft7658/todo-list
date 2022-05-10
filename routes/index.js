// 引用 Express 與 Express 路由器
const express = require('express')
const router =express.Router()

// 準備引入路由模組
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const auth = require('./modules/auth')
// 掛載 middleware
const { authenticator } = require('../middleware/auth')

// 加入驗證程序
router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/auth', auth)
// 加入驗證程序
router.use('/', authenticator, home) 

// 匯出路由器
module.exports = router