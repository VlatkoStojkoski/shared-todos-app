const express = require('express');
const router = express.Router();

const TodoList = require('../models/TodoList');

router.get('/view/:todoListID', (req, res) => {
	TodoList.findOne({ id: req.params.todoListID }).then((todoList) => {
		if (todoList) {
			res.render('todolist', {
				todos: todoList.todos,
				todoListID: req.params.todoListID,
			});
		} else {
			req.flash(
				'error_msg',
				`TODO list " ${req.params.todoListID} " not found`
			);
			res.redirect(`/todolist/new`);
		}
	});
});

router.post('/edit/:todoListID', (req, res) => {
	TodoList.findOne({ id: req.params.todoListID }).then((todoList) => {
		if (todoList) {
			const newTodos = [];

			if (req.body.todoLabel == undefined) {
				req.body.todoLabel = [];
				req.body.todoCheckboxValue = [];
			}

			if (req.body.todoLabel.constructor !== Array) {
				req.body.todoLabel = [req.body.todoLabel];
				req.body.todoCheckboxValue = [req.body.todoCheckboxValue];
			}

			req.body.todoLabel.forEach((todo, index) => {
				if (todo != '') {
					newTodos.push({
						description: todo,
						done: req.body.todoCheckboxValue[index],
					});
				}
			});

			todoList.todos = newTodos;

			todoList
				.save()
				.then((todoListThen) => console.log(todoListThen))
				.catch((err) => console.log(err));

			req.flash(
				'success_msg',
				`Successfully submited TODO list with URL /todolist/view/${req.params.todoListID}`
			);

			res.redirect(`/todolist/view/${req.params.todoListID}`);
		} else {
			req.flash(
				'error_msg',
				`TODO list ${newTodoList.id} not found`
			);
			res.redirect(`/todolist/new`);
		}
	});
});

router.get('/new', (req, res) => res.render('newtodolist'));

router.post('/new', (req, res) => {
	const todos = [];

	if (req.body.todoCheckboxValue == undefined) {
		req.body.todoCheckboxValue = [];
		req.body.todoLabel = [];
	}

	if (req.body.todoCheckboxValue.constructor !== Array) {
		req.body.todoCheckboxValue = [req.body.todoCheckboxValue];
		req.body.todoLabel = [req.body.todoLabel];
	}

	req.body.todoLabel.forEach((todo, index) => {
		if (todo.trim() != '') {
			todos.push({
				description: todo,
				done: req.body.todoCheckboxValue[index],
			});
		}
	});

	let errors = [];

	if (todos.length == 0) {
		errors.push({ msg: 'You need to enter TODOs' });
		res.render('newtodolist', { errors });
	} else {
		const newTodoList = new TodoList({ todos });

		newTodoList
			.save()
			.then(() => {
				req.flash(
					'success_msg',
					`Successfully registered TODO list with URL /todolist/view/${newTodoList.id}`
				);
				res.redirect(`/todolist/view/${newTodoList.id}`);
			})
			.catch((err) => {
				console.log(err);
				errors.push({ msg: 'Error while saving to database' });
				res.render('newtodolist', { errors });
			});
	}
});

module.exports = router;
