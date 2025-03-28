const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFFSpJfh3jXH-ClulXzpqO6Pw-28yPNcSusgtpMByGoPNENpjdQqk3nTlPWC77gb0Rw/exec';

// 取得使用者資料
function getUserData() {
  fetch(SCRIPT_URL + '?action=getUserData')
    .then(response => response.json())
    .then(data => {
      const userSelect = document.getElementById('user-select');
      userSelect.innerHTML = '<option value="">請選擇使用者</option>';
      data.forEach(user => {
        const option = document.createElement('option');
        option.value = user.User_ID;
        option.textContent = user.使用者名稱;
        userSelect.appendChild(option);
      });
    });
}

// 新增使用者
function addUser() {
  const username = document.getElementById('new-username').value;
  const remainChallenge = document.getElementById('remain-challenge').value;

  fetch(SCRIPT_URL + '?action=addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=${username}&remainChallenge=${remainChallenge}`,
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('使用者新增成功！');
      getUserData(); // 更新使用者列表
    } else {
      alert('使用者新增失敗：' + data.message);
    }
  });
}

// 登入
function login() {
  const userId = document.getElementById('user-select').value;
  const username = document.getElementById('new-username').value;
  let selectedUserId;

  if (userId) {
    selectedUserId = userId;
  } else {
    selectedUserId = null;
  }

  if (selectedUserId) {
    // 登入現有使用者
    fetch(SCRIPT_URL + '?action=getUserData')
      .then(response => response.json())
      .then(users => {
        const selectedUser = users.find(user => user.User_ID === selectedUserId);
        if (selectedUser) {
          document.getElementById('challenge-display').textContent = `剩餘挑戰次數：${selectedUser.剩餘挑戰次數}`;
          // 儲存使用者資訊到 sessionStorage 或 localStorage
          sessionStorage.setItem('userId', selectedUser.User_ID);
          sessionStorage.setItem('username', selectedUser.使用者名稱);
          // 隱藏登入區塊，顯示報名區塊
          document.getElementById('login-section').style.display = 'none';
          document.getElementById('signup-form').style.display = 'block';
          loadSignupData();
        } else {
          alert('使用者不存在');
        }
      });
  } else if (username) {
    // 新增使用者
    addUser();
  } else {
    alert('請選擇使用者或輸入新名稱');
  }
}

// 取得報名資料
function loadSignupData() {
  fetch(SCRIPT_URL + '?action=getSignupData')
    .then(response => response.json())
    .then(data => {
      const signupList = document.getElementById('signup-list');
      signupList.innerHTML = '';
      data.forEach(signup => {
        const signupDiv = document.createElement('div');
        signupDiv.textContent = `${signup.發布者} - ${signup.蘑菇類型} - ${signup.開放報名時間}`;
        signupList.appendChild(signupDiv);
      });
    });
}

// 建立報名
function createSignup() {
  const publisher = document.getElementById('publisher').value;
  const mushroomType = document.getElementById('mushroom-type').value;
  const openTime = document.getElementById('open-time').value;
  const signupLimit = document.getElementById('signup-limit').value;

  fetch(SCRIPT_URL + '?action=addSignup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `publisher=${publisher}&mushroomType=${mushroomType}&openTime=${openTime}&signupLimit=${signupLimit}`,
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('報名建立成功！');
      loadSignupData(); // 更新報名列表
    } else {
      alert('報名建立失敗：' + data.message);
    }
  });
}

// 初始化
function init() {
  getUserData();

  document.getElementById('login-button').addEventListener('click', login);
  document.getElementById('create-signup-button').addEventListener('click', createSignup);
  document.getElementById('show-signup-form').addEventListener('click', () => {
    document.getElementById('signup-form').style.display = 'block';
  });
}

init();
