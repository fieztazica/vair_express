let loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let formData = new FormData(this)
    let data = {
        username: formData.get('username'),
        password: formData.get('password'),
    }

    console.log(formData, data, formData.entries())
})
