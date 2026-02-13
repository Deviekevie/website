// Get filter buttons and portfolio items
const filters = document.querySelectorAll('#portfolio-flters li');
const items = document.querySelectorAll('.portfolio-item');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        const filterValue = filter.getAttribute('data-filter');

        // Remove active class from all filters
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        // Show/hide items based on filter
        items.forEach(item => {
            if (filterValue === '*' || item.classList.contains(filterValue.replace('.', ''))) {
                 item.style.visibility = 'visible';
                item.style.height = ''; // restore height
                item.style.margin = '0';
            } else {
                 item.style.visibility = 'hidden';
                item.style.height = '0';
                item.style.margin = '0';
            }
        });

        // Force container to recalc height
        const container = document.querySelector('.portfolio-container');
        if (container) {
            container.style.display = 'flex'; // ensure flex stays
            container.style.flexWrap = 'wrap';
        }
    });
});
