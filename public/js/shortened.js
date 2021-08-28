const copyBtn = document.getElementById('copy-btn');
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(copyUrl);
})