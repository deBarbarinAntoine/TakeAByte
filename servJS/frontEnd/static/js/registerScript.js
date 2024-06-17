document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm_password').value;

        const data = {
            username: username,
            email: email,
            password: password,
            confirm_password: confirm_password
        };

        console.log('panda');
        console.log(data);

        // Perform AJAX request using Axios
        axios.post('http://localhost:4000/api/registerUser', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 201) {
                    window.location.href = '/login'; // Redirect to home page if response is successful
                } else {
                    console.log(response); // Return response data
                }
            })
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error) {
                    const errorDetails = error.response.data.error;

                    if (typeof errorDetails === 'object') {
                        // Handle structured error response
                        for (const [key, value] of Object.entries(errorDetails)) {
                            console.log(`${key}: ${value}`);
                             alert(`${key}: ${value}`);
                        }
                    } else {
                        // Handle unstructured error response
                        console.log(errorDetails);
                        alert(errorDetails);
                    }
                } else {
                    // Handle case where error response format is unexpected
                    console.error('Unexpected error format:', error);
                }
            });
    });
});