document.addEventListener('DOMContentLoaded', function () {
    // Fetch existing tenant information and display it in a data table
    fetch('/tenants')
        .then(response => response.json())
        .then(data => {
            // Display tenant information in a data table
            const table = $('#tenants-table').DataTable({
                data: data,
                columns: [
                    { data: 'tenantID' },
                    { data: 'name' },
                    { data: 'phoneNumber' },
                    { data: 'email' },
                    { data: 'checkInDate' },
                    { data: 'checkOutDate' },
                    { data: 'apartmentNumber' },
                    {
                        data: null,
                        render: function (data, type, row) {
                            // Action column with buttons for moving and deleting tenants
                            return '<button class="move-tenant-btn" data-id="' + data.tenantID + '">Move</button>' +
                                '<button class="delete-tenant-btn" data-id="' + data.tenantID + '">Delete</button>';
                        }
                    }
                ],
            });

            // Attach event listener to the "Move" buttons
            $('#tenants-table').on('click', '.move-tenant-btn', function () {
                const tenantID = $(this).data('id');
                moveTenantModal(tenantID);
            });

            // Attach event listener to the "Delete" buttons
            $('#tenants-table').on('click', '.delete-tenant-btn', function () {
                const tenantID = $(this).data('id');
                deleteTenant(tenantID);
            });
        })
        .catch(error => console.error('Error fetching tenant information:', error));

    function moveTenantModal(tenantID) {
        // In a real application, you might show a modal for moving the tenant to another apartment
        const newApartment = prompt('Enter new apartment number:');
        if (newApartment) {
            // Send the move request to the backend
            fetch(`/move-tenant/${tenantID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newApartment }),
            })
                .then(response => response.json())
                .then(movedTenant => {
                    // Update the apartment number in the data table
                    const table = $('#tenants-table').DataTable();
                    const rowIndex = table.row($(`button[data-id="${tenantID}"]`).parents('tr')).index();
                    table.row(rowIndex).data(movedTenant).draw();
                })
                .catch(error => console.error('Error moving tenant:', error));
        }
    }

    function deleteTenant(tenantID) {
        // Confirm with the manager before deleting the tenant
        const confirmDelete = confirm('Are you sure you want to delete this tenant?');
        if (confirmDelete) {
            // Send the delete request to the backend
            fetch(`/delete-tenant/${tenantID}`, {
                method: 'DELETE',
            })
                .then(() => {
                    // Remove the row from the data table
                    const table = $('#tenants-table').DataTable();
                    const rowIndex = table.row($(`button[data-id="${tenantID}"]`).parents('tr')).index();
                    table.row(rowIndex).remove().draw();
                })
                .catch(error => console.error('Error deleting tenant:', error));
        }
    }
});


