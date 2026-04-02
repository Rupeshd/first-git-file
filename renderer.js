window.addEventListener('DOMContentLoaded', async () => {
        const textarea = document.getElementById('note');
        const saveBtn = document.getElementById('save');
        const statusEl = document.getElementById('status');

        const savedNote = await window.electronAPI.loadNote();
        textarea.value = savedNote;

        let lastSavedText=textarea.value;

    saveBtn.addEventListener('click', async () => {
            try{
                await window.electronAPI.saveNote(textarea.value);
                lastSavedText = textarea.value;
                alert('Note saved successfully!');
                if(statusEl) statusEl.textContent = 'Manually saved!';
            }catch(err){
                console.error('Manual save failed:',err);
                if(statusEl) statusEl.textContent = 'Save failed - check console';
            }
        }
    )

    let debouncerTimer;
    async function autoSave(){
        const currentText = textarea.value;
        if(currentText === lastSavedText){
            if(statusEl) statusEl.textContent = 'No changes - already saved';
            return;
        }
        try{
            await window.electronAPI.saveNote(currentText);
            lastSavedText = currentText;
            const now = new Date().toLocaleTimeString();
            if (statusEl) statusEl.textContent = `Auto-saved at ${now}`;
        }catch (err){
            console.error('Auto-save FAILED:', err);
            if(statusEl) statusEl.textContent = 'Auto-save error - check console';
        }
    }

    textarea.addEventListener('input',()=>{
        if(statusEl) statusEl.textContent = 'Changes detected - auto-save in 5s...';
        clearTimeout(debouncerTimer);
        debouncerTimer = setTimeout(autoSave, 5000);
    });
}
);
