const webAppUrl = "https://script.google.com/macros/s/AKfycbzz4HaWaAhTxzPXh2dciFMNX0k0La_mqAsWQ7zZiS06/dev";

let currentUserId = null;
let currentChallengeCount = null;

// 登入/建立
document.getElementById("login-button").addEventListener("click", () => {
    const selectedUser = document.getElementById("user-select").value;
    const newUser = document.getElementById("new-user-input").value;

    let userId = selectedUser;
    if (newUser) {
        userId = newUser;
    }

    fetch(webAppUrl + "?action=login", {
        method: "POST",
        body: JSON.stringify({ userId: userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            currentUserId = data.userId;
            currentChallengeCount = data.challengeCount;
            document.getElementById("challenge-count").textContent = currentChallengeCount;
            document.getElementById("publish-section").style.display = "block";
        } else {
            alert(data.message);
        }
    });
});

// 修改剩餘挑戰次數
document.getElementById("challenge-edit-button").addEventListener("click", () => {
    const newChallengeCount = document.getElementById("challenge-edit").value;

    fetch(webAppUrl + "?action=editChallenge", {
        method: "POST",
        body: JSON.stringify({ userId: currentUserId, challengeCount: newChallengeCount })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            currentChallengeCount = newChallengeCount;
            document.getElementById("challenge-count").textContent = currentChallengeCount;
        } else {
            alert(data.message);
        }
    });
});

// 發布報名
document.getElementById("publish-button").addEventListener("click", () => {
    const publisher = document.getElementById("publisher-input").value;
    const mushroomType = document.getElementById("mushroom-type-select").value;
    const openTime = document.getElementById("open-time-input").value;
    const maxPlayers = document.getElementById("max-players-input").value;

    fetch(webAppUrl + "?action=publish", {
        method: "POST",
        body: JSON.stringify({ publisher, mushroomType, openTime, maxPlayers })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            fetchSignupList(); // 重新載入報名清單
        } else {
            alert(data.message);
        }
    });
});

// 刷新報名清單
document.getElementById("refresh-button").addEventListener("click", () => {
    fetchSignupList();
});

// 載入報名清單
function fetchSignupList() {
    fetch(webAppUrl + "?action=getSignupList")
    .then(response => response.json())
    .then(data => {
        const signupItems = document.getElementById("signup-items");
        signupItems.innerHTML = ""; // 清空現有清單

        data.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `發布者：${item.publisher}, 蘑菇類型：${item.mushroomType}, 開放時間：${item.openTime}, 報名人數：${item.maxPlayers}`;
            signupItems.appendChild(listItem);
        });
    });
}

// 載入使用者清單
fetch(webAppUrl + "?action=getUserList")
    .then(response => response.json())
    .then(data => {
        const userSelect = document.getElementById("user-select");
        data.forEach(user => {
            const option = document.createElement("option");
            option.value = user.userId;
            option.textContent = user.userId;
            userSelect.appendChild(option);
        });
    });

fetchSignupList(); // 初始載入報名清單
