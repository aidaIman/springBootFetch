package com.peaksoft.springBootFetch.service;

import com.peaksoft.springBootFetch.entity.User;

import java.util.List;

public interface UserService {

    void saveUser(User user);

    void updateUser(Long id, User user);

    void deleteById(Long id);

    User findById(Long id);

    List<User> findAll();

    User getUserByUsername(String username);
}
