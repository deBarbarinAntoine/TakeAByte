// Define a variable to store the clicked address suggestion temporarily
let clickedAddressLon = null;
let clickedAddressLat = null;

// Add event listener when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve DOM elements
    const addressInput = document.getElementById('address-street');
    const suggestionsContainer = document.getElementById('address-suggestions');
    const cityInput = document.getElementById('address-city');
    const provinceInput = document.getElementById('address-region');
    const countryInput = document.getElementById('address-country');
    const zipcodeInput = document.getElementById('address-zip');
    let debounceTimeout;

    // Event listener for input changes in the address field
    addressInput.addEventListener('input', function () {
        clearTimeout(debounceTimeout);
        const query = addressInput.value.trim();
        if (query.length > 2) {
            debounceTimeout = setTimeout(() => {
                fetch(`http://localhost:4000/api/getAddress/${query}`)
                    .then(response => response.json())
                    .then(data => {
                        suggestionsContainer.innerHTML = '';
                        if (data.length === 0) {
                            suggestionsContainer.style.display = 'none';
                            return;
                        }
                        data.forEach(item => {
                            const suggestion = document.createElement('div');
                            suggestion.classList.add('suggestion');
                            suggestion.textContent = item.address;
                            suggestion.addEventListener('click', function () {
                                const addressParts = item.address.split(',').map(part => part.trim());

                                // Combine the first parts to form the street address
                                let firstPart = addressParts.slice(0, addressParts.length - 5).join(' ');

                                const city = addressParts[addressParts.length - 5] || '';
                                const province = addressParts[addressParts.length - 4] || '';
                                const zipcode = addressParts[addressParts.length - 3] || '';
                                const country = addressParts[addressParts.length - 1] || '';

                                addressInput.value = firstPart;
                                cityInput.value = city;
                                provinceInput.value = province;
                                zipcodeInput.value = zipcode;
                                countryInput.value = country;

                                suggestionsContainer.innerHTML = '';
                                suggestionsContainer.style.display = 'none';

                                clickedAddressLon = item.longitude;
                                clickedAddressLat = item.latitude;
                            });
                            suggestionsContainer.appendChild(suggestion);
                        });
                        suggestionsContainer.style.display = 'block';
                    })
                    .catch(error => {
                        console.error('Error fetching address suggestions:', error);
                        suggestionsContainer.innerHTML = '<div class="error">Error fetching suggestions</div>';
                        suggestionsContainer.style.display = 'block';
                    });
            }, 300); // Delay in milliseconds
        } else {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });

    const goToShippingButton = document.querySelector('.blue.toShipping[type="submit"]');
    goToShippingButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Check if both longitude and latitude are not null
        if (clickedAddressLon === null || clickedAddressLat === null) {
            // If either longitude or latitude is null, show a warning message
            console.warn("Please select an address before proceeding.");
        } else {
            // Serialize the form data
            const form = document.querySelector('.order-form');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Add the coordinates to the data object
            data.lon = clickedAddressLon;
            data.lat = clickedAddressLat;

            // Encode the data object in the URL path
            const encodedData = btoa(JSON.stringify(data)); // Encoding data to Base64 for URL safety
            window.location.href = `/order/shipping/${encodedData}`;
        }
    });

    // Event listener to close suggestions when clicking outside the input and suggestions container
    document.addEventListener('click', function (event) {
        if (!addressInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
});
