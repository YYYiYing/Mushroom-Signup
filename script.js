document.addEventListener('DOMContentLoaded', function() {
    // 在網頁載入時讀取已報名資料
    loadRegistrations();

    document.getElementById('mushroomForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://script.google.com/macros/s/AKfycbxqIhv6HGkrqF9-BV1L8y0L_ctTxeKnU7vMzB3EqkjKryv3mLZbszsaa-b0jIfjTpU1ww/exec');
        xhr.send(formData);
        xhr.onload = function() {
            alert(xhr.responseText);
            // 重新載入報名資料以顯示新增的資料
            loadRegistrations();
            document.getElementById('mushroomForm').reset(); // 清空表單
        };
    });

    function loadRegistrations() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://script.google.com/macros/s/AKfycbxqIhv6HGkrqF9-BV1L8y0L_ctTxeKnU7vMzB3EqkjKryv3mLZbszsaa-b0jIfjTpU1ww/exec');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var registrations = JSON.parse(xhr.responseText);
                displayRegistrations(registrations);
            } else {
                console.error('讀取報名資料失敗：', xhr.status);
            }
        };
        xhr.send();
    }

    function displayRegistrations(registrations) {
        var tableBody = document.getElementById('registrationTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // 清空現有的表格內容

        registrations.forEach(function(reg) {
            var row = tableBody.insertRow();
            var nameCell = row.insertCell();
            var phoneCell = row.insertCell();
            var emailCell = row.insertCell();
            var itemCell = row.insertCell();
            var deleteCell = row.insertCell();

            nameCell.textContent = reg.name;
            phoneCell.textContent = reg.phone;
            emailCell.textContent = reg.email;
            itemCell.textContent = reg.item;

            var deleteButton = document.createElement('button');
            deleteButton.textContent = '刪除';
            deleteButton.className = 'delete-btn';
            deleteButton.dataset.rowNumber = reg.rowNumber; // 將列號儲存在 data 屬性中
            deleteButton.addEventListener('click', deleteRegistration);
            deleteCell.appendChild(deleteButton);
        });
    }

    function deleteRegistration(event) {
        var rowNumberToDelete = event.target.dataset.rowNumber;
        if (confirm('確定要刪除這筆報名資料嗎？')) {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', 'https://script.google.com/macros/s/AKfycbxqIhv6HGkrqF9-BV1L8y0L_ctTxeKnU7vMzB3EqkjKryv3mLZbszsaa-b0jIfjTpU1ww/exec?rowNumber=' + rowNumberToDelete);
            xhr.onload = function() {
                alert(xhr.responseText);
                // 重新載入報名資料以更新顯示
                loadRegistrations();
            };
            xhr.send();
        }
    }
});
