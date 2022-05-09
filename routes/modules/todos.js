const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// 進入新增 todo 的頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增資料，寫入資料庫
router.post('/', (req, res) => {
  const userId = req.user._id
  // 從 req.body 拿出表單裡的 name 資料
  const name = req.body.name
  // 存入資料庫
  return Todo.create({ name, userId })
    // 新增完成後導回首頁
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 查看特定一筆 todo 資料的頁面
router.get('/:id', (req, res) => {
  const userId = req.user._id
  // 改用 findOne 之後，Mongoose 就不會自動幫我們轉換 id 和 _id，所以這裡要寫和資料庫一樣的屬性名稱，也就是 _id
  const _id = req.params.id
  return Todo.findOne({ _id, userId })
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

// 進入修改 todo 頁面
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Todo.findOne({ _id, userId })
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// 修改資料，寫入資料庫
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, isDone } = req.body
  return Todo.findOne({ _id, userId })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${_id}`))
    .catch(error => console.log(error))
})

// 刪除資料，寫入資料庫
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Todo.findOne({ _id, userId })
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router