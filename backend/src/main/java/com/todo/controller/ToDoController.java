package com.todo.controller;

import com.todo.model.ToDo;
import com.todo.repository.ToDoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Allow requests from your frontend running on localhost:3000
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/todos")
public class ToDoController {

    @Autowired
    private ToDoRepository toDoRepository;

    // Get all todos
    @GetMapping
    public ResponseEntity<List<ToDo>> getAllTodos() {
        List<ToDo> todos = toDoRepository.findAll();
        return ResponseEntity.ok(todos);
    }

    // Create a new todo
    @PostMapping
    public ResponseEntity<ToDo> createTodo(@RequestBody ToDo todo) {
        ToDo savedTodo = toDoRepository.save(todo);
        return ResponseEntity.ok(savedTodo);
    }

    // Get a single todo by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTodoById(@PathVariable Long id) {
        if (!toDoRepository.existsById(id)) {
            return ResponseEntity.status(404).body("❌ To-Do not found!");
        }
        ToDo todo = toDoRepository.findById(id).get();
        return ResponseEntity.ok(todo);
    }

    // Update a todo
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody ToDo updatedTodo) {
        if (!toDoRepository.existsById(id)) {
            return ResponseEntity.status(404).body("❌ To-Do not found!");
        }
        ToDo todo = toDoRepository.findById(id).get();
        todo.setTitle(updatedTodo.getTitle());
        todo.setDescription(updatedTodo.getDescription());
        todo.setCompleted(updatedTodo.isCompleted());
        todo.setDeadline(updatedTodo.getDeadline()); // <-- add this
        ToDo savedTodo = toDoRepository.save(todo);
        return ResponseEntity.ok(savedTodo);
    }

    // Delete a todo
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTodo(@PathVariable Long id) {
        if (!toDoRepository.existsById(id)) {
            return ResponseEntity.status(404).body("❌ To-Do not found!");
        }
        toDoRepository.deleteById(id);
        return ResponseEntity.ok("🗑️ To-Do deleted successfully!");
    }
}





