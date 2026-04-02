const { stat } = require("original-fs");

window.addEventListener('DOMContentLoaded', async () => {
    const textarea = document.getElementById('note');
    const saveBtn = document.getElementById('save');


    const savedNote = await window.electronAPI.loadNote();
    textarea.value = savedNote;
    let lastSavedText = textarea.value;

    // Manual save
    saveBtn.addEventListener('click', async () => {
        try {
            await window.electronAPI.saveNote(textarea.value);
            lastSavedText = textarea.value;
            alert('Note saved successfully!');
        } catch (err) {
            console.error('Manual save failed:', err);
        }
    });

    async function autoSave() {
        const currentText = textarea.value;

        if (currentText === lastSavedText) {
            statusEl.textContent = 'No changes to save.';
            return;
        }

        try {
            await window.electronAPI.saveNote(currentText);
            lastSavedText = currentText;

            const now = new Date().toLocaleTimeString();
            statusEl.textContent = ` auto-saved at ${now}`;
        } catch (err) {
            console.error('Auto-save failed:', err);
            statusEl.textContent = 'Auto-save error!';
        }
    }
    let debounceTimer;
    textarea.addEventListener('input', () => {
        statusEl.textContent = 'Changes detected - auto-saving in 5sec....';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(autoSave, 5000);
    })
});