document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const data = new FormData(registerForm);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);
        if (obj.birthdate) {
            const birthdate = new Date(obj.birthdate);
            const today = new Date();
            let age = today.getFullYear() - birthdate.getFullYear();
            const monthDifference = today.getMonth() - birthdate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
                age--;
            }
            obj.age = age;
        }
        try {
            const response = await fetch('/api/sessions/register', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Error registering user: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('User already registered.');
        }
    });
});