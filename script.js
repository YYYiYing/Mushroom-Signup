document.getElementById('mushroomForm').addEventListener('submit', function(event) {
  event.preventDefault(); // 阻止表單預設的提交行為
  var formData = new FormData(this);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://script.google.com/macros/library/d/1eiYs7uKXw0idmpyqNh1jAcaaVpCcXIOTmL0LXFIG8Im2QwftHVv94pIH/1');
  xhr.send(formData);
  xhr.onload = function() {
    alert(xhr.responseText); // 顯示 Google Apps Script 回傳的訊息
  };
});
