// Simple interactive enhancements
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    console.log('Navigating to:', link.getAttribute('href'));
  });
});

console.log('LogicLearn site loaded successfully!');