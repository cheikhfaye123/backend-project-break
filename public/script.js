
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    alert('Connexion réussie !');
                    window.location.href = '/products/dashboard';
                } else {
                    const data = await response.json();
                    alert(`Erreur : ${data.message}`);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la connexion.');
            }
        });