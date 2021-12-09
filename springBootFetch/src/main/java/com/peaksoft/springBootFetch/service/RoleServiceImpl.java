package com.peaksoft.springBootFetch.service;

import com.peaksoft.springBootFetch.entity.Role;
import com.peaksoft.springBootFetch.repository.RoleRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public void saveRole(Role role) {
        if (roleRepository.getRoleByRoleName(role.getRoleName()) == null) {
            roleRepository.save(role);
        }
    }

    public void updateRole(Role role) {
        roleRepository.save(role);
    }

    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }

    public Role findById(Long id) {
        return roleRepository.getById(id);
    }

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role getRoleByName(String roleName) {
        return roleRepository.getRoleByRoleName(roleName);
    }
}
