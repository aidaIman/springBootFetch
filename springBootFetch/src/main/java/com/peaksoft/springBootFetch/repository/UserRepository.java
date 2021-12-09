package com.peaksoft.springBootFetch.repository;

import com.peaksoft.springBootFetch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //Optional<User> getUserByUsername(String username);
    User getUserByUsername(String username);
}
