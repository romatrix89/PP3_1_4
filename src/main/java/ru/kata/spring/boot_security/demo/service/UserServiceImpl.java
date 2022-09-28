package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.RoleDao;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.*;


@Service
public class UserServiceImpl implements UserDetailsService {

    @PersistenceContext
    EntityManager em;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;


    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = getUserByName(username);

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();

        for (Role role : user.getRoles()) {
            grantedAuthorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), grantedAuthorities);
    }
    @Transactional
    public void saveUser(User user) {
        userDao.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        String hql = "select u FROM User u";
        return em.createQuery(hql, User.class)
                .setHint("javax.persistence.fetchgraph", em.getEntityGraph("graph.User.roles"))
                .getResultList();
    }

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleDao.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        String hql = "SELECT u FROM User u WHERE u.id = :id";
        return em.createQuery(hql, User.class)
                .setParameter("id", userId)
                .setHint("javax.persistence.fetchgraph", em.getEntityGraph("graph.User.roles"))
                .getSingleResult();
    }

    @Transactional(readOnly = true)
    public User getUserByName(String userName) {
        String hql = "SELECT u FROM User u WHERE u.username = :username";
        return em.createQuery(hql, User.class)
                .setParameter("username", userName)
                .setHint("javax.persistence.fetchgraph", em.getEntityGraph("graph.User.roles"))
                .getSingleResult();
    }
    @Transactional
    public void editUser(User user) {
        User userToBeEdit = getUserById(user.getId());
        userToBeEdit.setFirstName(user.getFirstName());
        userToBeEdit.setLastName(user.getLastName());
        userToBeEdit.setEmail(user.getEmail());
        userToBeEdit.setAge(user.getAge());
        userToBeEdit.setUsername("test");
        userToBeEdit.setRoles(user.getRoles());
        if (!Objects.equals(user.getPassword(), "")) {
            userToBeEdit.setPassword(user.getPassword());
        }
    }
    @Transactional
    public void deleteUserById(long id) {
        userDao.deleteById(id);
    }
}
