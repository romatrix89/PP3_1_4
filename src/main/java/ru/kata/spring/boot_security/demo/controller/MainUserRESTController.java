package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import java.util.List;

@CrossOrigin
@Controller
public class MainUserRESTController {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/")
    public String mainPage() {
        return "index";
    }

    @ResponseBody
    @GetMapping("/api/users")
    public List<User> getAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        return allUsers;
    }

    @ResponseBody
    @GetMapping("/api/usersauth")
    public User getAuthUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = userService.getUserByName(authentication.getName());
        return authUser;
    }

    @ResponseBody
    @GetMapping("/api/users/{id}")
    public User getUserById(@PathVariable long id) {
        User userById = userService.getUserById(id);
        return userById;
    }

    @ResponseBody
    @PostMapping ("/api/users")
    public User addNewUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @ResponseBody
    @PatchMapping ("/api/users")
    public User editUser (@RequestBody User user){
        userService.editUser(user);
        return user;
    }

    @ResponseBody
    @PostMapping ("/api/users/{id}")
    public void deleteUserById(@PathVariable long id){
        userService.deleteUserById(id);
    }

}
