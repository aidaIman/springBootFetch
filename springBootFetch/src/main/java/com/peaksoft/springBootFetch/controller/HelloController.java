package com.peaksoft.springBootFetch.controller;

import com.peaksoft.springBootFetch.entity.User;
import com.peaksoft.springBootFetch.service.RoleServiceImpl;
import com.peaksoft.springBootFetch.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HelloController {

    private final UserServiceImpl userServiceImpl;
    private final RoleServiceImpl roleServiceImpl;

    @Autowired
    public HelloController(UserServiceImpl userServiceImpl, RoleServiceImpl roleServiceImpl) {
        this.userServiceImpl = userServiceImpl;
        this.roleServiceImpl = roleServiceImpl;
    }

    @GetMapping(value = "")
    public String redirect() {
        return "redirect:/login";
    }

    @GetMapping(value = "login")
    public String login() {
        return "loginPage";
    }

    @GetMapping(value = "user")
    public String userInfo(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("user", user);
        model.addAttribute("roles", user.getRoles());
        return "userPage";
    }

    @GetMapping(value = "admin")
    public String listUsers(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("user", user);
        model.addAttribute("allUsers", userServiceImpl.findAll());
        model.addAttribute("allRoles", roleServiceImpl.findAll());
        return "adminPage";
    }
}
