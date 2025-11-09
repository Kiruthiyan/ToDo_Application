package com.todo.backend.service;

import com.todo.backend.model.Todo;
import com.todo.backend.model.User;
import com.todo.backend.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public List<Todo> getTodos(User user) {
        return todoRepository.findByUser(user);
    }

    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    public void deleteTodo(Todo todo) {
        todoRepository.delete(todo);
    }
}
