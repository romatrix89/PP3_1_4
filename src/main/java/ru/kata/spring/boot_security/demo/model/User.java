package ru.kata.spring.boot_security.demo.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.*;


@Entity
@Table(name = "users")
@NamedEntityGraph(name = "graph.User.roles",
        attributeNodes = @NamedAttributeNode("roles"))
public class User implements UserDetails {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 32)
    private String firstName;
    @Column(nullable = false, length = 32)
    private String lastName;

    @Column(nullable = false, length = 3)
    private byte age;
    @Column(nullable = false, unique = true, length = 45)
    private String email;
    @Column(nullable = false, length = 64)
    private String username;
    @Column(nullable = false, length = 64)
    private String password;

    @ManyToMany
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    public User() {

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = getEmail();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public byte getAge() {
        return age;
    }

    public void setAge(byte age) {
        this.age = age;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        for (Role role : getRoles()) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return authorities;
    }

    @Override
    public String toString() {
        return Arrays.toString(roles.toArray())
                .replace("ROLE_", "")
                .replace("[", "")
                .replace(",", "")
                .replace("]", "");
    }
}

