package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserServiceImpl userService;
    private final SuccessUserHandler successUserHandler;

    public WebSecurityConfig(SuccessUserHandler successUserHandler) {
        this.successUserHandler = successUserHandler;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/resources/**", "/css/**", "/js/**", "/").permitAll()
                .antMatchers(GET, "/api/users/").hasRole("ADMIN")
                .antMatchers(POST, "/api/users/").hasRole("ADMIN")
                .antMatchers(POST, "/api/users/{id}").hasRole("ADMIN")
                .antMatchers(PATCH, "/api/users/").hasRole("ADMIN")
                .antMatchers(GET, "/api/users/{id}").hasRole("ADMIN")
                .antMatchers(GET, "/api/users/{id}").hasRole("USER")
                .antMatchers(GET, "/api/usersauth").hasRole("ADMIN")
                .antMatchers(GET, "/api/usersauth").hasRole("USER")
                .antMatchers(GET, "/api/users/{id}").hasRole("USER")
                .antMatchers("/").authenticated()
                .anyRequest().authenticated()
                .and()
                .formLogin().successHandler(successUserHandler)
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/");
    }

    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService);
    }

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

}