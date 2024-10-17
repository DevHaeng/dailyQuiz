package com.ldailyquiz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DailyQuizController {

    private String hint = "이 단어는 과일의 이름입니다.";

    @PostMapping("/check-guess")
    public ResponseEntity<Map<String, Object>> checkGuess(@RequestBody GuessRequest request) {
        String guess = request.getGuess();
        String answer = "APPLE"; // 실제 게임에서는 동적으로 설정
        String[] result = new String[5];
        boolean isCorrect = true;

        for (int i = 0; i < 5; i++) {
            if (guess.charAt(i) == answer.charAt(i)) {
                result[i] = "correct";
            } else if (answer.indexOf(guess.charAt(i)) != -1) {
                result[i] = "present";
                isCorrect = false;
            } else {
                result[i] = "absent";
                isCorrect = false;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("isCorrect", isCorrect);
        response.put("attemptNumber", request.getAttemptNumber());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-hint")
    public ResponseEntity<Map<String, String>> getHint() {
        Map<String, String> response = new HashMap<>();
        response.put("hint", hint);
        return ResponseEntity.ok(response);
    }

    // GuessRequest 클래스 정의
    static class GuessRequest {
        private String guess;
        private int attemptNumber;

        // Getters and setters
        public String getGuess() {
            return guess;
        }

        public void setGuess(String guess) {
            this.guess = guess;
        }

        public int getAttemptNumber() {
            return attemptNumber;
        }

        public void setAttemptNumber(int attemptNumber) {
            this.attemptNumber = attemptNumber;
        }
    }
}