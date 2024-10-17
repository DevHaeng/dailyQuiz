let currentAttempt = 1;
let currentInputIndex = 0;
let isGameOver = false;

const inputs = document.querySelectorAll('.word-input');

function focusNextInput() {
    if (currentInputIndex < 5) {
        inputs[currentAttempt * 5 - 5 + currentInputIndex].focus();
    }
}

function addChar(char) {
    if (currentInputIndex < 5) {
        const currentInput = document.getElementById(`guess${currentAttempt}-${currentInputIndex + 1}`);
        if (!currentInput.value) {
            currentInput.value = char.toUpperCase();
            currentInputIndex++;
            focusNextInput();
        }
    }
}

function deleteLastChar() {
    if (currentInputIndex > 0) {
        currentInputIndex--;
        const currentInput = document.getElementById(`guess${currentAttempt}-${currentInputIndex + 1}`);
        currentInput.value = '';
        currentInput.focus();
    }
}

document.querySelectorAll('.keyboard-item').forEach(button => {
    button.addEventListener('click', function() {
        const key = this.textContent;
        handleKeyInput(key);
    });
});

function handleKeyInput(key) {
    if (isGameOver) return;

    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'DELETE') {
        deleteLastChar();
    } else if (key.length === 1 && /[A-Z]/i.test(key)) {
        addChar(key);
    }
}

inputs.forEach((input, index) => {
    input.addEventListener('input', function (e) {
        this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        if (this.value.length === 1) {
            currentInputIndex = (index % 5) + 1;
            focusNextInput();
        }
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === "Backspace" && this.value.length === 0) {
            if (index % 5 > 0) {
                currentInputIndex = (index % 5) - 1;
                inputs[Math.floor(index / 5) * 5 + currentInputIndex].focus();
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            submitGuess();
        }
    });
});

function updateUI(result) {
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`guess${currentAttempt}-${i + 1}`);
        const letter = input.value.toUpperCase();
        const status = result[i] ? result[i].toLowerCase().trim() : '';

        if (status && ['correct', 'present', 'absent'].includes(status)) {
            input.classList.add(status);

            const keyboardButton = document.querySelector(`.keyboard-item[data-key="${letter}"]`);
            if (keyboardButton) {
                if (status === 'correct' ||
                    (status === 'present' && !keyboardButton.classList.contains('correct')) ||
                    (status === 'absent' && !keyboardButton.classList.contains('correct') && !keyboardButton.classList.contains('present'))) {
                    keyboardButton.className = `keyboard-item ${status}`;
                }
            }
        } else {
            console.warn(`Invalid status for letter ${i + 1}: ${status}`);
        }
    }

    document.querySelectorAll(`#guess${currentAttempt}-1, #guess${currentAttempt}-2, #guess${currentAttempt}-3, #guess${currentAttempt}-4, #guess${currentAttempt}-5`)
        .forEach(input => input.disabled = true);
}

function moveToNextAttempt() {
    if (isGameOver) return;

    if (currentAttempt < 6) {
        currentAttempt++;
        currentInputIndex = 0;
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`guess${currentAttempt}-${i}`);
            input.disabled = false;
        }
        document.getElementById(`guess${currentAttempt}-1`).focus();
    } else {
        isGameOver = true;
        alert('게임 오버! 모든 시도를 사용하셨습니다.');
    }
}

function submitGuess() {
    if (currentAttempt > 6 || currentInputIndex < 5) return;

    let guess = '';
    for (let i = 1; i <= 5; i++) {
        guess += document.getElementById(`guess${currentAttempt}-${i}`).value;
    }

    const guessData = {
        guess: guess,
        attemptNumber: currentAttempt
    };

    fetch('/check-guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guessData)
    })
        .then(response => response.json())
        .then(data => {
            updateUI(data.result);
            if (data.isCorrect) {
                alert('축하합니다! 정답을 맞추셨습니다!');
                // 게임 종료 로직
            } else if (currentAttempt >= 6) {
                alert('게임 오버! 모든 시도를 사용하셨습니다.');
                // 게임 종료 로직
            } else {
                moveToNextAttempt();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('서버 오류가 발생했습니다. 다시 시도해 주세요.');
        });
    currentInputIndex = 0;
}

document.querySelector('.word-submit').addEventListener('click', function (e) {
    if (isGameOver) return;
    e.preventDefault();
    submitGuess();
});

document.addEventListener('keydown', function(event) {
    if (isGameOver) return;
    if (event.key === 'Enter') {
        event.preventDefault();
        submitGuess();
    }
});

// 페이지 로드 시 첫 번째 입력 칸에 포커스
window.onload = function() {
    document.getElementById('guess1-1').focus();
};

// 힌트 버튼 이벤트 리스너
document.querySelector('.game-hint-view').addEventListener('click', function() {
    if (this.textContent === '힌트 사용하기') {
        fetchHint();
    } else {
        toggleHintVisibility();
    }
});

function fetchHint() {
    fetch('/get-hint', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('hint-text').textContent = data.hint;
            toggleHintVisibility();
            document.querySelector('.game-hint-view').textContent = '힌트 숨기기';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('힌트를 가져오는 데 실패했습니다.');
        });
}

function toggleHintVisibility() {
    const hintText = document.getElementById('hint-text');
    const hintButton = document.querySelector('.game-hint-view');
    if (hintText.style.display === 'none') {
        hintText.style.display = 'block';
        hintButton.textContent = '힌트 숨기기';
    } else {
        hintText.style.display = 'none';
        hintButton.textContent = '힌트 사용하기';
    }
}