document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll('.tab');
    const tabPages = document.querySelectorAll('.tab-page');

    tabs.forEach(tab => {
         tab.addEventListener('click', () => {
              const targetId = tab.getAttribute('data-target');

              tabs.forEach(tab => tab.classList.remove('active'));
              tabPages.forEach(page => {
                   page.classList.remove('active');
                   page.style.display = 'none';
              });

              tab.classList.add('active');

              const activePage = document.getElementById(targetId);
              activePage.style.display = 'block';
              setTimeout(() => {
                   activePage.classList.add('active');
              }, 10);
         });
    });
});