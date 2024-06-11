document.addEventListener('DOMContentLoaded', function () {
    const goToShippingButton = document.querySelector('.blue.buttonToPayment[type="submit"]');
    goToShippingButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission
        const form = document.querySelector('.order-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Additional data
        const contactEmail = document.querySelector('.contact .content').innerText;
        const shipToAddress = document.querySelector('.shipping-address .content').innerText;

        // Attempt to find shipping method radio button within the shipping method section
        const shippingMethodRadio = document.querySelector('.shipping-method input[name="shipping-method"]:checked');

        // If not found, try to find it within the recap section
        if (!shippingMethodRadio) {
            const shippingMethodRadioRecap = document.querySelector('.recap input[name="shipping-method"]:checked');
            if (shippingMethodRadioRecap) {
                const shippingMethod = shippingMethodRadioRecap.nextElementSibling.innerText;

                // Add additional data to the data object
                data.contactEmail = contactEmail;
                data.shipToAddress = shipToAddress;
                data.shippingMethod = shippingMethod;
                const encodedData = btoa(JSON.stringify(data)); // Encoding data to Base64 for URL safety
                window.location.href = `/order/payment/${encodedData}`;
            } else {
                console.error('Shipping method radio button not found.');
            }
        } else {
            const shippingMethod = shippingMethodRadio.nextElementSibling.innerText;

            // Add additional data to the data object
            data.contactEmail = contactEmail;
            data.shipToAddress = shipToAddress;
            data.shippingMethod = shippingMethod;
            const encodedData = btoa(JSON.stringify(data)); // Encoding data to Base64 for URL safety
            window.location.href = `/order/payment/${encodedData}`;
        }
    });
});
