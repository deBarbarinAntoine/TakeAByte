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
                                countryInput.value = country.substring(0, 3);

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

    // Event listener to close suggestions when clicking outside the input and suggestions container
    document.addEventListener('click', function (event) {
        if (!addressInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
});
