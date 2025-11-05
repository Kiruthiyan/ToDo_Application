package com.todo.backend.service;

import com.todo.backend.model.User;
import com.todo.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAll() { return repo.findAll(); }
    public User getById(Long id) { return repo.findById(id).orElse(null); }
    public User save(User user) { return repo.save(user); }
    public void delete(Long id) { repo.deleteById(id); }
}
