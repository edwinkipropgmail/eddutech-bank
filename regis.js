
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 


    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    
    if (password !== confirmPassword) {
        document.querySelector('.error').textContent = "Password do not Match. kindly confirm and try agai!!";

    }
    if (password.length < 4) {
        document.querySelector('.error').textContent = 'Password must be at least 4 characters long!';
    }

    else if (password === confirmPassword && password.length>=4) {
    window.location.href = 'bank.html';
}});