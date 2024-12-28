const inputLogin = document.querySelector('.input-login')
const inputPassword = document.querySelector('.input-password')
const form = document.querySelector('.form')
const errorText = document.querySelector('.error-text')


form.addEventListener('submit', async(e) => {
    e.preventDefault()

    const login = inputLogin.value
    const password = inputPassword.value

    if (!login || !password) {
        return (errorText.textContent = 'Please fill all properties')
    }

    if (login.length < 3) {
        return (errorText.textContent = 'Login must be more than three characters')
    }

    if (password.length < 6) {
        return (errorText.textContent = 'Password must be more than six characters')
    }

    const payload = {login, password}

    try {
         const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

       

        if(response.status === 201) {
            const result = await response.json()

            localStorage.setItem('token', JSON.stringify(result.token))

            window.location.href = '/frontend/secure.html'
        }

        errorText.textContent = ''

    }catch (err){
        console.log(err)
    }

})