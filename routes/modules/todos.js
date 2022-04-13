const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

// 取得新增 todo 的頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增資料，寫入資料庫
router.post('/', (req, res) => {
  // 從 req.body 拿出表單裡的 name 資料
  const name = req.body.name
  // 存入資料庫
  return Todo.create({ name })
    // 新增完成後導回首頁
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 取得瀏覽個別 todo 資料的頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

// 取得修改 todo 頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

// 修改資料，寫入資料庫
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// 刪除資料，寫入資料庫
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router