package com.peaksoft.springBootFetch.service;

import com.peaksoft.springBootFetch.entity.Role;

import java.util.List;

public interface RoleService {

    void saveRole(Role role);

    void updateRole(Role role);

    void deleteById(Long id);

    Role findById(Long id);

    List<Role> findAll();

    Role getRoleByName(String roleName);
}
