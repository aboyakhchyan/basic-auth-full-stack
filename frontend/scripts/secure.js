const loginText = document.querySelector('.login-text')

const token = localStorage.getItem('token')

const response = fetch('http://localhost:3001/secure', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(response => response.json())
.then(data => console.log(data))
