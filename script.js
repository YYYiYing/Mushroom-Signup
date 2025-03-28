function displayRegistrationList() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://script.google.com/macros/s/AKfycbwLFFSpJfh3jXH-ClulXzpqO6Pw-28yPNcSusgtpMByGoPNENpjdQqk3nTlPWC77gb0Rw/exec'); // 替換為您的應用程式 URL
  xhr.onload = function() {
    var registrationData = JSON.parse(xhr.responseText);
    var listHtml = '';
    for (var i = 0; i < registrationData.length; i++) {
      listHtml += '<p>' + registrationData[i].join(', ') + '</p>'; // 將每筆資料以逗號分隔顯示
    }
    document.getElementById('registrationList').innerHTML = listHtml;
  };
  xhr.send();
}

// 在網頁載入時呼叫 displayRegistrationList 函式
window.onload = displayRegistrationList;

// 刷新按鈕事件處理函式
document.getElementById('refreshButton').addEventListener('click', displayRegistrationList);
