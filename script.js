// ... (其他程式碼)

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
      // ... (更新使用者列表)
    } else {
      alert('使用者新增失敗：' + data.message);
    }
  });
}

// ... (其他程式碼)
