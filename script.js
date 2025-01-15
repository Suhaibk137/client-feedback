// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const starRating = document.getElementById('starRating');
    const stars = starRating.getElementsByClassName('fa-star');
    const satisfactionRating = document.getElementById('satisfactionRating');
    const successMessage = document.getElementById('successMessage');

    // Google Sheet submission URL - Replace with your deployment URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyTR5Q3MyYokZ8YLqPTC7rKiJ09FjQXMFg4IYMtBIgIuzfhb9vLlAtuwhEELkHLElCY/exec';

    // Star Rating Functionality
    starRating.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-star')) {
            const rating = e.target.getAttribute('data-rating');
            satisfactionRating.value = rating;
            
            // Update stars visual
            Array.from(stars).forEach(star => {
                const starRating = parseInt(star.getAttribute('data-rating'));
                if (starRating <= parseInt(rating)) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });

            document.getElementById('ratingError').textContent = '';
        }
    });

    // Form Validation and Submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        clearErrors();
        
        // Validate required fields
        let isValid = true;
        
        // Name validation
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            showError('nameError', 'Name is required');
            isValid = false;
        }
        
        // HR validation
        const hr = document.getElementById('hr');
        if (!hr.value) {
            showError('hrError', 'Please select an HR representative');
            isValid = false;
        }
        
        // Star rating validation
        if (!satisfactionRating.value) {
            showError('ratingError', 'Please provide a satisfaction rating');
            isValid = false;
        }
        
        if (isValid) {
            // Set current date
            const now = new Date();
            const formattedDate = now.toLocaleString();
            document.getElementById('submissionDate').value = formattedDate;

            // Create FormData object
            const formData = new FormData(form);

            // Show loading spinner
            const loadingSpinner = document.getElementById('loadingSpinner');
            form.style.display = 'none';
            loadingSpinner.classList.remove('hidden');

            // Submit to Google Sheets
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    console.log('Success!', response);
                    
                    // Hide loading spinner and show success message
                    loadingSpinner.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    
                    // Reset form
                    form.reset();
                    Array.from(stars).forEach(star => star.classList.remove('active'));
                    satisfactionRating.value = '';
                    
                    // Optional: Reset form display after a delay
                    setTimeout(() => {
                        form.style.display = 'block';
                        successMessage.classList.add('hidden');
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    // Hide loading spinner and show form again
                    loadingSpinner.classList.add('hidden');
                    form.style.display = 'block';
                    alert('There was an error submitting the form. Please try again.');
                });
        }
    });

    // Helper functions
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }

    function clearErrors() {
        const errorElements = document.getElementsByClassName('error-message');
        Array.from(errorElements).forEach(element => {
            element.textContent = '';
        });
    }
});
