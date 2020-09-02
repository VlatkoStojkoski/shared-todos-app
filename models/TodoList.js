const mongoose = require('mongoose');
const shortid = require('shortid');

const TodoSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
	done: {
		type: Boolean,
		default: false,
	},
});

const TodoListSchema = new mongoose.Schema({
	id: {
		type: String,
		default: shortid.generate(),
	},
	todos: [TodoSchema],
});

const TodoList = mongoose.model('TodoList', TodoListSchema);

module.exports = TodoList;
