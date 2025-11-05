package com.todo.backend.service;

import com.todo.backend.model.Todo;
import com.todo.backend.repository.TodoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    private final TodoRepository repo;

    public TodoService(TodoRepository repo) {
        this.repo = repo;
    }

    public List<Todo> getAll() { return repo.findAll(); }
    public List<Todo> getByUser(Long userId) { return repo.findByUserId(userId); }
    public Optional<Todo> getById(Long id) { return repo.findById(id); }
    public Todo save(Todo todo) { return repo.save(todo); }
    public void delete(Long id) { repo.deleteById(id); }
}
