document.addEventListener('DOMContentLoaded', function () {
   
    // Fetch existing maintenance requests and display them in a data table
    fetch('/maintenance-requests')
        .then(response => response.json())
        .then(data => {
            // Display maintenance requests in a data table
            $('#maintenance-table').DataTable({
                data: data,
                columns: [
                    { data: 'requestID' },
                    { data: 'apartmentNumber' },
                    { data: 'areaOfProblem' },
                    { data: 'description' },
                    { data: 'dateTime' },
                    { data: 'status' }
                ],
            });
        })
        .catch(error => console.error('Error fetching maintenance requests:', error));

    // Attach event listener to the "Submit Request" button
    document.getElementById('submit-request-btn').addEventListener('click', function () {
        // Get values from the form
        const apartmentNumber = document.getElementById('apartment-number').value;
        const areaOfProblem = document.getElementById('area-of-problem').value;
        const description = document.getElementById('description').value;
        const photoFile = document.getElementById('photo').files[0]; // Assuming a file input for the photo

        // Client-side validation
        if (!apartmentNumber || !areaOfProblem || !description) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if the tenant has already submitted a request for their apartment
        const existingRequest = data.find(request => request.apartmentNumber === apartmentNumber && request.status === 'pending');
        if (existingRequest) {
            alert('You already have a pending maintenance request for your apartment.');
            return;
        }

        // Check if the description includes multiple problems
        if (description.includes(',')) {
            alert('Please submit separate requests for each problem.');
            return;
        }

        // Check if the tenant has already submitted a request with a photo
        const requestWithPhoto = data.find(request => request.tenantID === tenantID && request.photo);
        if (photoFile && requestWithPhoto) {
            alert('You can only submit one photo per request.');
            return;
        }

        // Assuming tenantID is available from the backend or elsewhere
        const tenantID = 'tenant123';

        // Prepare the request data
        const requestData = {
            apartmentNumber,
            areaOfProblem,
            description,
            photo: photoFile ? true : false,
            tenantID,
        };

        // Send the maintenance request to the backend
        fetch('/submit-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(newRequest => {
                // Add the new request to the data table
                const table = $('#maintenance-table').DataTable();
                table.row.add(newRequest).draw();
            })
            .catch(error => console.error('Error submitting maintenance request:', error));
    });
});
