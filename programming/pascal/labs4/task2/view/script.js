// Пример кода для отправки AJAX запроса на сервер
fetch('http://localhost:5000/api/data')
  .then(response => response.json())
  .then(data => {
    document.getElementById('result').innerText = data.message;
  })
  .catch(error => console.error('Ошибка:', error));
