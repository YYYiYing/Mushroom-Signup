document.getElementById('mushroomForm').addEventListener('submit', function(event) {
  event.preventDefault(); // 阻止表單預設的提交行為
  var formData = new FormData(this);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://script.google.com/macros/s/AKfycbwLFFSpJfh3jXH-ClulXzpqO6Pw-28yPNcSusgtpMByGoPNENpjdQqk3nTlPWC77gb0Rw/exec'); // 替換為您的應用程式 URL
  xhr.send(formData);
  xhr.onload = function() {
    alert(xhr.responseText); // 顯示 Google Apps Script 回傳的訊息
  };
});
