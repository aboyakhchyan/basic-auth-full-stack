const inputLogin = document.querySelector('.input-login')
const inputPassword = document.querySelector('.input-password')
const form = document.querySelector('.form')
const errorText = document.querySelector('.error-text')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const login = inputLogin.value.trim()
    const password = inputPassword.value.trim()

    if (!login || !password) {
        return (errorText.textContent = 'Please fill all properties')
    }

    if (login.length < 3) {
        return (errorText.textContent = 'Login must be more than three characters')
    }

    if (password.length < 6) {
        return (errorText.textContent = 'Password must be more than six characters')
    }

    const payload = { login, password }

    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json()
            return (errorText.textContent = error.message || 'Something went wrong')
        }

        errorText.textContent = ''

        window.location.href = '/frontend/index.html'
    } catch (err) {
        errorText.textContent = 'An error occurred. Please try again.'
    }
})
