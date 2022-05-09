const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  isDone: {
    type: Boolean,
    default: false
  },
  // 新增一個 userId 屬性，用這個屬性來連結 User 的唯一值 _id
  userId: {  // 加入關聯設定
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Todo', todoSchema)