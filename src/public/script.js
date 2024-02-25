const getById = (id) => {
    return document.getElementById(id);
}

const password = getById('password')
const confirmPassword = getById('confirm-password')
const container = getById('container')
const loader = getById('loader')
const form = getById('form')
const button = getById('submit')
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";



let token, userId;
window.addEventListener('DOMContentLoaded', async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop)
        }
    })
    token = params.token;
    userId = params.userId
    // console.log(params.token,params.userId)
    // http://localhost:8989/reset-password.html?token=alsdfjasdfl&userId=12334

    const res = await fetch("/auth/verify-pass-reset-token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            token, userId
        })
    })
    if (!res.ok) {
        const { error } = await res.json()
        loader.innerText = error
        return
    }

    loader.style.display = "none";
    container.style.display = "block";
})
const displayError = (errorMessage) => {
    //first we need to remove any success messages
    success.style.display = "none";
    error.innerText = errorMessage;
    error.style.display = "block"
}
const displaySuccess = (successMessage) => {
    //first we need to remove any success messages
    error.style.display = "none"
    success.innerText = successMessage;
    success.style.display = "block";
}

const passRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const handleSubmit = async (evt) => {

    evt.preventDefault(); //to stop refresh
    // console.log("Submitiig")

    //validate
    if (!passRegx.test(password.value)) {
        return displayError("Password is too simple, use alpha numeric with special character!")
    }
    if (password.value !== confirmPassword.value) {
        return displayError("Password do not match")
    }

    button.disabled = true;
    button.innerText="Please wait..."
    //handle the submit
    const res = await fetch("/auth/update-password", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            token, userId,
            password: password.value
        })
    })
    button.disabled = false;
    button.innerText = "Reset Password"
    if (!res.ok) {
        const { error } = await res.json()
        return displayError(error)
    }

    displaySuccess("Your password is resets successfully")
    password.value ="";
    confirmPassword.value = "";

}

form.addEventListener('submit', handleSubmit)
