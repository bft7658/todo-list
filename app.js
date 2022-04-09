const express = require('express')
const exphbs = require('express-handlebars')

// 載入 mongoose
const mongoose = require('mongoose')

// 載入 Todo model
const Todo = require('./models/todo')

// 引用 body-parser
const bodyParser = require('body-parser')

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

// 根目錄頁面
app.get('/', (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// 新增 todo 的頁面
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

// 接收 todo 後，傳入資料庫再拿回來
app.post('/todos', (req, res) => {
  // 從 req.body 拿出表單裡的 name 資料
  const name = req.body.name
  // 存入資料庫
  return Todo.create({ name })
    // 新增完成後導回首頁
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽個別 todo 的資料
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

// 修改特定 todo
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// 接收修改 todo 後，傳入資料庫再拿回來
app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})