document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission


        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const data = {
            email: email,
            password: password
        };

        // Perform AJAX request using Axios
        axios.post('http://localhost:4000/api/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    window.location.href = '/home'; // Redirect to home page if response is successful
                } else {
                    console.log(response.data); // Return response data
                }
            })
            .then(data => {
                // Display error message in a JSON popup
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
