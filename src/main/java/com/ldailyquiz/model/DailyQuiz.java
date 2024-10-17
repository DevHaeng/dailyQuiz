package com.ldailyquiz.model;

public class DailyQuiz {
    private String answer;
    private String hint;
    private boolean result;

    public String[] game() {
        return new String[]{""};
    }

    public boolean isResult() {
        return result;
    }
}
