package com.todo.backend.controller;

import com.todo.backend.model.Todo;
import com.todo.backend.model.User;
import com.todo.backend.service.TodoService;
import com.todo.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    private final TodoService todoService;
    private final UserService userService;

    public TodoController(TodoService todoService, UserService userService) {
        this.todoService = todoService;
        this.userService = userService;
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<Todo> getTodosByUser(@PathVariable Long userId) {
        return todoService.getByUser(userId);
    }

    @GetMapping("/{id}")
    public Optional<Todo> getTodoById(@PathVariable Long id) {
        return todoService.getById(id);
    }

    // Create expects JSON: { "title": "...", "description": "...", "status": "pending", "userId": 1 }
    @PostMapping
    public Todo createTodo(@RequestBody TodoRequest request) {
        User user = userService.getById(request.getUserId());
        if (user == null) throw new IllegalArgumentException("User not found with id: " + request.getUserId());

        Todo todo = new Todo();
        todo.setUser(user);
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getStatus() != null) todo.setStatus(request.getStatus());
        return todoService.save(todo);
    }

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody TodoRequest request) {
        Optional<Todo> opt = todoService.getById(id);
        if (opt.isEmpty()) throw new IllegalArgumentException("Todo not found with id: " + id);
        Todo todo = opt.get();
        if (request.getTitle() != null) todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getStatus() != null) todo.setStatus(request.getStatus());
        return todoService.save(todo);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.delete(id);
    }

    // Simple inner static DTO
    public static class TodoRequest {
        private Long userId;
        private String title;
        private String description;
        private String status;

        // getters & setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
