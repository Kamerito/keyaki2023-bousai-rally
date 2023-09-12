const quizData = {
    "101": {
        question: "【1F-01非常口】防災特別委員会の顧問は?",
        choices: ["小島先生", "Mr.Reid", "鹿内先生", "小沼先生"],
        correct: 0, // 正解の選択肢のインデックス
    },
    "102": {
        question: "【1F-02非常口】クイズ2の問題文",
        choices: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
        correct: 1,
    },
    // 他のクイズデータも同様に追加
};

let currentQuizId = "";
let stampData = {}; // スタンプデータを保持するオブジェクト

// ローカルストレージからデータを読み込む関数
function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem("stampData");
    if (storedData) {
        stampData = JSON.parse(storedData);
    }
}

// ローカルストレージにデータを保存する関数
function saveDataToLocalStorage() {
    localStorage.setItem("stampData", JSON.stringify(stampData));
}

// ページロード時にデータを読み込む
window.addEventListener('load', () => {
    loadDataFromLocalStorage();
    // スタンプデータを表示に反映
    const stampResult = document.getElementById("stamp-result");
    for (const quizId in stampData) {
        if (stampData.hasOwnProperty(quizId)) {
            stampResult.innerHTML += `<div class="${stampData[quizId].correct ? 'correct-stamp' : 'incorrect-stamp'}">${quizId.slice(-1)}</div>`;
        }
    }
});

function loadQuiz() {
    const quizIdInput = document.getElementById("quiz-id");
    const quizSection = document.querySelector(".quiz");
    const stampResult = document.getElementById("stamp-result");
    const choicesElement = document.getElementById("choices");
    const answerButton = document.getElementById("answer-button");

    currentQuizId = quizIdInput.value;

    if (quizData[currentQuizId]) {
        // クイズが存在する場合
        quizSection.style.display = "block";
        stampResult.innerHTML = ""; // スタンプをクリア

        const questionElement = document.getElementById("question");
        const currentQuiz = quizData[currentQuizId];
        questionElement.innerText = currentQuiz.question;
        choicesElement.innerHTML = "";

        currentQuiz.choices.forEach((choice, index) => {
            const choiceItem = document.createElement("li");
            const choiceLabel = document.createElement("label");
            const choiceInput = document.createElement("input");

            choiceInput.type = "radio";
            choiceInput.name = "choice";
            choiceInput.value = index;

            choiceLabel.className = "choice-label";
            choiceLabel.appendChild(choiceInput);
            choiceLabel.appendChild(document.createTextNode(choice));

            choiceItem.appendChild(choiceLabel);
            choicesElement.appendChild(choiceItem);

            choiceInput.addEventListener("change", () => {
                // ラジオボタンが選択されたときに選択肢の背景色を変更
                const allChoiceLabels = document.querySelectorAll(".choice-label");
                allChoiceLabels.forEach((label) => {
                    label.style.backgroundColor = "#fff"; // すべてのラベルをリセット
                });
                choiceLabel.style.backgroundColor = "#fff3b8"; // 選択したラベルを強調
            });
        });

        answerButton.disabled = false;

        // クイズ番号入力欄の内容をクリア
        quizIdInput.value = "";
    } else {
        // クイズが存在しない場合、アラート通知を表示
        alert("クイズが見つかりません");
    }
}

function checkAnswer() {
    const stampResult = document.getElementById("stamp-result");
    const answerButton = document.getElementById("answer-button");
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");

    const selectedChoice = document.querySelector('input[name="choice"]:checked');

    if (!selectedChoice) {
        return;
    }

    const selectedAnswerIndex = parseInt(selectedChoice.value);
    const currentQuiz = quizData[currentQuizId];

    if (!stampData[currentQuizId]) {
        // スタンプデータがまだ存在しない場合、スタンプを保存
        stampData[currentQuizId] = { correct: selectedAnswerIndex === currentQuiz.correct };
        saveDataToLocalStorage();
    }

    if (selectedAnswerIndex === currentQuiz.correct) {
        stampResult.innerHTML = `<div class="correct-stamp">${currentQuizId.slice(-1)}</div>`;
    } else {
        stampResult.innerHTML = `<div class="incorrect-stamp">${currentQuizId.slice(-1)}</div>`;
    }

    // 回答ボタンを無効化
    answerButton.disabled = true;

    // 選択肢を無効化
    const choiceLabels = document.querySelectorAll('.choice-label');
    choiceLabels.forEach((label) => {
        label.style.pointerEvents = "none";
        label.style.backgroundColor = "#eee";
    });

    // 問題の表示を消す
    questionElement.style.display = "none";
    choicesElement.style.display = "none";

    // スタンプ表示後に0.5秒待ってページをリロード
    setTimeout(() => {
        location.reload();
    }, 500); 
}

function resetStampData() {
    const quizIdInput = document.getElementById("quiz-id");
    const stampResult = document.getElementById("stamp-result");

    const resetCode = prompt("クイズ終了コードを入力してください:");

    if (resetCode === "bousai2023") {
        // スタンプデータをクリア
        stampData = {};
        saveDataToLocalStorage();
        stampResult.innerHTML = ""; // スタンプ表示もクリア
        quizIdInput.value = ""; // クイズ
    } else {
        alert("クイズ終了コードが正しくありません。");
    }
}
