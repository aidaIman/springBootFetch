package com.peaksoft.springBootFetch.repository;

import com.peaksoft.springBootFetch.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Role getRoleByRoleName(String roleName);
}
