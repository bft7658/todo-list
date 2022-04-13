const express = require('express')
const exphbs = require('express-handlebars')

// 載入 mongoose
const mongoose = require('mongoose')

// 引用 body-parser
const bodyParser = require('body-parser')

// 載入 method-override
const methodOverride = require('method-override') 

// 引用路由器，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案
const routes = require('./routes')

const app = express()
const port = 3000

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))


// 將 request 導入路由器
app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})