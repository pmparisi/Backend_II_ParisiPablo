const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', async () => {
    await fetch('/api/sessions/logout', {
        method: 'GET',
    });
    window.location.href = '/login';
});