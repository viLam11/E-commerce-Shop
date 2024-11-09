function actionMenu(){
    document.getElementById('dropdownButton').addEventListener('click', function(event) {
        event.preventDefault();
        const actionMenu = document.getElementById('actionMenu');
        actionMenu.style.display = actionMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Hide dropdown when clicking outside
    window.addEventListener('click', function(event) {
        const actionMenu = document.getElementById('actionMenu');
        if (!event.target.closest('.dropdown-container')) {
            actionMenu.style.display = 'none';
        }
    });
}

export default actionMenu;