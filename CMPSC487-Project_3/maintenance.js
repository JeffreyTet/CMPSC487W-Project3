document.addEventListener('DOMContentLoaded', function () {
    // Fetch existing maintenance requests and display them in a data table
    fetch('/maintenance-requests')
        .then(response => response.json())
        .then(data => {
            // Display maintenance requests in a data table
            const table = $('#maintenance-table').DataTable({
                data: data,
                columns: [
                    { data: 'requestID' },
                    { data: 'apartmentNumber' },
                    { data: 'areaOfProblem' },
                    { data: 'description' },
                    { data: 'dateTime' },
                    { data: 'status' },
                    {
                        data: null,
                        render: function (data, type, row) {
                            // Action column with a button to update status
                            return '<button class="update-status-btn" data-id="' + data.requestID + '">Update Status</button>';
                        }
                    }
                ],
            });

            // Attach event listener to the "Update Status" buttons
            $('#maintenance-table').on('click', '.update-status-btn', function () {
                const requestID = $(this).data('id');
                // Open a modal or perform the status update here
                updateStatusModal(requestID);
            });
        })
        .catch(error => console.error('Error fetching maintenance requests:', error));

    function updateStatusModal(requestID) {
        // In a real application, you might show a modal for updating the status
        const newStatus = prompt('Enter new status (e.g., completed):');
        if (newStatus) {
            // Send the status update to the backend
            fetch(`/update-status/${requestID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })
                .then(response => response.json())
                .then(updatedRequest => {
                    // Update the status in the data table
                    const table = $('#maintenance-table').DataTable();
                    const rowIndex = table.row($(`button[data-id="${requestID}"]`).parents('tr')).index();
                    table.row(rowIndex).data(updatedRequest).draw();
                })
                .catch(error => console.error('Error updating status:', error));
        }
    }
});
