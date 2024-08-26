
function getEventsDurations(){
    const eventsMap = {};

    $("[data-eventchip]").each(function () {
        var eventEl = this;
        if (eventEl === null) return;
        if (eventEl.children.length <= 1) {
            return;
        }
        var timeEl = eventEl.querySelector('.gVNoLb');
    
        if (!timeEl) {
            return;
        }
    
        var eventMetadata = eventEl.querySelector('.gVNoLb')?.textContent;
        if (!eventMetadata) return;
        var eventName = eventEl.querySelector('.I0UMhf')?.textContent;

        const duration = getDifference(eventMetadata);
        if (eventsMap[eventName] == null){
            eventsMap[eventName] = duration.hours * 60 + duration.minutes;
        }
        else{
            eventsMap[eventName] += duration.hours * 60 + duration.minutes;
        }
        
    });
    return eventsMap;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getEventsDurations') {
        sendResponse(getEventsDurations());
    }
});


