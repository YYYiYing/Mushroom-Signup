document.getElementById('mushroomForm').addEventListener('submit', function(event) {
  event.preventDefault(); // 阻止表單預設的提交行為
  var formData = new FormData(this);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://script.google.com/macros/s/AKfycbxqIhv6HGkrqF9-BV1L8y0L_ctTxeKnU7vMzB3EqkjKryv3mLZbszsaa-b0jIfjTpU1ww/exec');
  xhr.send(formData);
  xhr.onload = function() {
    alert(xhr.responseText); // 顯示 Google Apps Script 回傳的訊息
  };
});
