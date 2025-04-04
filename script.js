document.getElementById('mushroomForm').addEventListener('submit', function(event) {
  event.preventDefault(); // 阻止表單預設的提交行為
  var formData = new FormData(this);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '您的 Google Apps Script 應用程式 URL');
  xhr.send(formData);
  xhr.onload = function() {
    alert(xhr.responseText); // 顯示 Google Apps Script 回傳的訊息
  };
});
