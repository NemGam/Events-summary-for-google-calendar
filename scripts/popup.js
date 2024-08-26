const maxAttempts = 5;

function requestData(){
    let tab;

    const timer = setInterval(() => {
        (async () => {
            if (!tab){
                [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            }
            
            let attempt = 0;
        
            try {
                const response = await chrome.tabs.sendMessage(tab.id, { action: 'getEventsDurations' });
                console.log("Google Calendar is detected");
                clearInterval(timer);
                populateTable(response);

            } catch (error) {
                console.log("An error occurred:", error);
                
                //Try again a few times.
                attempt++;
                //Oh well, just give up
                if (attempt > maxAttempts){
                    clearInterval(timer);
                    $("#message")[0].innerHTML = "No events available";
                }
            }
        
        })();
    }, 200)
}

function populateTable(durations) {
    
    const tableBody = $("tbody")[0];
    tableBody.innerHTML = ''; // Clear existing content
    let show = false;
    for (const [event, duration] of Object.entries(durations)) {
        show = true;
        const row = document.createElement('tr');
        const eventCell = document.createElement('td');
        const durationCell = document.createElement('td');

        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        eventCell.textContent = event;
        durationCell.textContent = `${hours > 1? 
            `${hours} hours` : `${hours == 1? `${hours} hour` : ""}`}
            ${minutes > 1? `${minutes} minutes` : `${minutes == 1? `minute` : ""}`}`;

        row.appendChild(eventCell);
        row.appendChild(durationCell);
        tableBody.appendChild(row);
    }

    if (!show){
        $("#message")[0].innerHTML = "No events available";
    }
    else{
        $("#message")[0].classList.add("hidden");
        $("#table-wrapper")[0].classList.remove("hidden");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    requestData();
});