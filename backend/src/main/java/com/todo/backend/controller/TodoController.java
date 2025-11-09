package com.todo.backend.controller;

import com.todo.backend.model.Todo;
import com.todo.backend.model.User;
import com.todo.backend.repository.UserRepository;
import com.todo.backend.security.JwtUtil;
import com.todo.backend.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // ✅ Frontend URL allow பண்ணும்
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public TodoController(TodoService todoService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.todoService = todoService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // ✅ Extract user from token
    private User getUserFromToken(String token) {
        String email = jwtUtil.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ Get all todos for the logged-in user
    @GetMapping
    public List<Todo> getTodos(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        User user = getUserFromToken(token);
        return todoService.getTodos(user);
    }

    // ✅ Create new todo
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody Todo todo) {
        String token = authHeader.substring(7);
        User user = getUserFromToken(token);
        todo.setUser(user);
        return ResponseEntity.ok(todoService.createTodo(todo));
    }

    // ✅ Update todo (only if it belongs to the user)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long id,
                                        @RequestBody Todo todoDetails) {
        String token = authHeader.substring(7);
        User user = getUserFromToken(token);

        return todoService.getTodoById(id)
                .map(todo -> {
                    if (!todo.getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Forbidden");
                    }
                    todo.setTitle(todoDetails.getTitle());
                    todo.setDescription(todoDetails.getDescription());
                    todo.setCompleted(todoDetails.isCompleted());
                    return ResponseEntity.ok(todoService.createTodo(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete todo (only if it belongs to the user)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long id) {
        String token = authHeader.substring(7);
        User user = getUserFromToken(token);

        return todoService.getTodoById(id)
                .map(todo -> {
                    if (!todo.getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Forbidden");
                    }
                    todoService.deleteTodo(todo);
                    return ResponseEntity.ok("Deleted successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
