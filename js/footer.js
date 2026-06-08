document.addEventListener('DOMContentLoaded', initFooter);

function initFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
  });
}
