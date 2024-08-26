//Parses the time range and returns the duration of this time range.
function getDifference(timeRange) {
    //Split time range into two
    const match = timeRange.split(" – ");
    
    if (match.length == 1) {
        throw new Error('Invalid time range format');
    }

    //Split each time into numeric part and AM/PM 
    let {time: startTime, period: startPeriod} = splitTimeAndPeriod(match[0]);
    let {time: endTime, period: endPeriod} = splitTimeAndPeriod(match[1])

    //endPeriod will always be given in the correct format. startPeriod will not be if it is the same as the endPeriod
    if (endPeriod == undefined) throw new Error('Invalid time range format');
    if (startPeriod == undefined) startPeriod = endPeriod;

    let [startHours, startMinutes] = startTime.split(":"); 
    let [endHours, endMinutes] = endTime.split(":"); 

    //If minutes were not given, equal them to 0
    startMinutes = startMinutes? parseInt(startMinutes) : 0;
    endMinutes = endMinutes? parseInt(endMinutes) : 0;
    
    // Convert times to 24-hour format
    const start24Hour = convertTo24Hour(parseInt(startHours), startPeriod);
    const end24Hour = convertTo24Hour(parseInt(endHours), endPeriod);

    // Create date objects for start and end times
    const startDate = new Date();
    startDate.setHours(start24Hour, startMinutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(end24Hour, endMinutes, 0, 0);

    // Calculate duration in milliseconds
    const durationMs = endDate - startDate;

    // Convert duration to hours and minutes
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
        hours: durationHours,
        minutes: durationMinutes
    };
}

function convertTo24Hour(hour, period) {
    if (period === 'pm' && hour !== 12) {
        return hour + 12;
    }
    if (period === 'am' && hour === 12) {
        return 0;
    }
    return hour;
}

function splitTimeAndPeriod(timeString) {
    const regex = /(\d{1,2}(:\d{2}|\d{1,2})?)([AaPp][Mm])?/i;
    const match = timeString.match(regex);

    if (match) {
        return {
            time: match[1],
            period: match[3]
        };
    } else {
        throw new Error("Invalid time format");
    }
}