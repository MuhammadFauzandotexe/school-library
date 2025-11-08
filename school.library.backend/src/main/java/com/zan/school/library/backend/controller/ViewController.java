package com.zan.school.library.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    public static final String REGEX_NOT_API_OR_STATIC = "(?!api|static|_next|.*\\..*).*";

    @GetMapping(value = "/{path:^" + REGEX_NOT_API_OR_STATIC + "}/**")
    public String forwardSpa() {
        return "forward:/index.html";
    }
}
