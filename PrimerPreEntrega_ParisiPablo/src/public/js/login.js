document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        const data = new FormData(loginForm);
        const obj = {};
        data.forEach((value, key) => obj[key] = value);

        try {
            const response = await fetch('/api/sessions/login', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                window.location.href = '/profile';
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Login failed: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    });
});