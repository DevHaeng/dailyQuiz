package com.ldailyquiz.controller;

import com.ldailyquiz.dto.GuessRequestDto;
import com.ldailyquiz.service.DailyQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DailyQuizController {
    @Autowired
    private DailyQuizService service;

    @PostMapping("/check-guess")
    public ResponseEntity<Map<String, Object>> checkGuess(@RequestBody GuessRequestDto request) {
        Map<String, Object> response = service.checkGuess(request.getGuess(), request.getAttemptNumber());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-hint")
    public ResponseEntity<Map<String, String>> getHint() {
        String hint = service.getHint();
        Map<String, String> response = new HashMap<>();
        response.put("hint", hint);
        return ResponseEntity.ok(response);
    }
}