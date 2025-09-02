document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const gregorianYear = document.getElementById('gregorian-year');
    const gregorianMonth = document.getElementById('gregorian-month');
    const gregorianDay = document.getElementById('gregorian-day');
    const bcToggle = document.getElementById('bc-toggle');
    const baktun = document.getElementById('baktun');
    const katun = document.getElementById('katun');
    const tun = document.getElementById('tun');
    const uinal = document.getElementById('uinal');
    const kin = document.getElementById('kin');
    const cycleDisplay = document.getElementById('cycle-display');
    const todayBtn = document.getElementById('today-btn');
    const mayanFormatDate = document.getElementById('mayan-format-date');
    
    // Set current date as initial values
    setCurrentDate();
    
    // Add event listeners to Gregorian inputs
    gregorianYear.addEventListener('input', updateMayanFromGregorian);
    gregorianMonth.addEventListener('change', updateMayanFromGregorian);
    gregorianDay.addEventListener('input', updateMayanFromGregorian);
    bcToggle.addEventListener('change', updateMayanFromGregorian);
    
    // Add event listeners to Mayan inputs
    baktun.addEventListener('input', updateGregorianFromMayan);
    katun.addEventListener('input', updateGregorianFromMayan);
    tun.addEventListener('input', updateGregorianFromMayan);
    uinal.addEventListener('input', updateGregorianFromMayan);
    kin.addEventListener('input', updateGregorianFromMayan);
    
    // Today button event listener
    todayBtn.addEventListener('click', setCurrentDate);
    
    // Set current date function
    function setCurrentDate() {
        const today = new Date();
        gregorianYear.value = today.getFullYear();
        gregorianMonth.value = today.getMonth();
        gregorianDay.value = today.getDate();
        bcToggle.checked = true;
        
        updateMayanFromGregorian();
    }
    
    // Update Mayan calendar from Gregorian
    function updateMayanFromGregorian() {
        const year = parseInt(gregorianYear.value);
        const month = parseInt(gregorianMonth.value);
        const day = parseInt(gregorianDay.value);
        const isCE = bcToggle.checked;
        
        // Calculate Julian Day Number
        const jd = gregorianToJulianDay(isCE ? year : -year, isCE ? month + 1 : -month - 1, isCE ? day : -day);
        
        // Convert to Mayan Long Count
        const mayanLongCount = julianDayToMayanLongCount(jd);
        
        // Update Mayan inputs
        const baktunVal = mayanLongCount.baktun;
        const katunVal = mayanLongCount.katun;
        const tunVal = mayanLongCount.tun;
        const uinalVal = mayanLongCount.uinal;
        const kinVal = mayanLongCount.kin;
        
        baktun.value = mayanLongCount.baktun;
        katun.value = mayanLongCount.katun;
        tun.value = mayanLongCount.tun;
        uinal.value = mayanLongCount.uinal;
        kin.value = mayanLongCount.kin;
        
        if(!isNaN(baktunVal) && !isNaN(katunVal) && !isNaN(tunVal) && !isNaN(uinalVal) && !isNaN(kinVal))
            mayanFormatDate.textContent = baktunVal + "." + katunVal + "." + tunVal + "." + uinalVal + "." + kinVal;
        else
            mayanFormatDate.textContent = "";
        
        // Update cycle display
        updateCycleDisplay(mayanLongCount.cycle);
    }
    
    // Update Gregorian calendar from Mayan
    function updateGregorianFromMayan() {
        const baktunVal = parseInt(baktun.value) || 0;
        const katunVal = parseInt(katun.value) || 0;
        const tunVal = parseInt(tun.value) || 0;
        const uinalVal = parseInt(uinal.value) || 0;
        const kinVal = parseInt(kin.value) || 0;
        
        // Calculate cycle
        let totalBaktuns = baktunVal;
        let cycle = 0;
        
        // Handle cyclic nature (every 13 Baktuns = 1 cycle)
        if (totalBaktuns < 0) {
            cycle = Math.ceil(Math.abs(totalBaktuns) / 13) * -1;
            totalBaktuns = 13 - (Math.abs(totalBaktuns) % 13 || 13);
        } else if (totalBaktuns >= 13) {
            cycle = Math.floor(totalBaktuns / 13);
            totalBaktuns = totalBaktuns % 13;
        }
        
        // Update cycle display
        updateCycleDisplay(cycle);
        
        // Calculate Julian Day Number from Mayan Long Count
        const jd = mayanLongCountToJulianDay({
            baktun: totalBaktuns,
            katun: katunVal,
            tun: tunVal,
            uinal: uinalVal,
            kin: kinVal,
            cycle: cycle
        });
        
        // Convert to Gregorian date
        const gregorianDate = julianDayToGregorian(jd);
        
        // Update Gregorian inputs
        const year = Math.abs(gregorianDate.year);
        gregorianYear.value = year;
        gregorianMonth.value = gregorianDate.month - 1;
        gregorianDay.value = gregorianDate.day;
        bcToggle.checked = gregorianDate.year >= 0;
    }
    
    // Update cycle display
    function updateCycleDisplay(cycle) {
        if(!isNaN(cycle))
            cycleDisplay.textContent = `Current Sun Cycle: ${cycle}`;
        else
            cycleDisplay.textContent = `Current Sun Cycle: `;
        
        if (cycle > 0) {
            cycleDisplay.style.backgroundColor = '#e8f5e9';
            cycleDisplay.style.color = '#2e7d32';
        } else if (cycle < 0) {
            cycleDisplay.style.backgroundColor = '#ffebee';
            cycleDisplay.style.color = '#c62828';
        } else {
            cycleDisplay.style.backgroundColor = '#fff3e0';
            cycleDisplay.style.color = '#ef6c00';
        }
    }
    
    // Gregorian to Julian Day Number conversion
    function gregorianToJulianDay(year, month, day) {
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        
        return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 
            Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    }
    
    // Julian Day Number to Gregorian conversion
    function julianDayToGregorian(jd) {
        const a = jd + 32044;
        const b = Math.floor((4 * a + 3) / 146097);
        const c = a - Math.floor((146097 * b) / 4);
        const d = Math.floor((4 * c + 3) / 1461);
        const e = c - Math.floor((1461 * d) / 4);
        const m = Math.floor((5 * e + 2) / 153);
        
        const day = e - Math.floor((153 * m + 2) / 5) + 1;
        const month = m + 3 - 12 * Math.floor(m / 10);
        const year = 100 * b + d - 4800 + Math.floor(m / 10);
        
        return { year, month, day };
    }
    
    // Julian Day Number to Mayan Long Count conversion
    function julianDayToMayanLongCount(jd) {
        // Mayan Long Count epoch: September 6, 3114 BCE (Julian) = JD 584283
        const mayanEpoch = 584283;
        const daysSinceEpoch = jd - mayanEpoch;
        
        // Calculate cycles (each cycle is 13 baktuns = 1872000 days)
        let cycles = Math.floor(daysSinceEpoch / 1872000) + 5;
        let remainingDays = daysSinceEpoch % 1872000;
        
        if (remainingDays < 0) {
            //cycles--;
            remainingDays += 1872000;
        }
        
        // Calculate baktuns (each baktun is 144000 days)
        let baktuns = Math.floor(remainingDays / 144000);
        remainingDays %= 144000;
        
        // Calculate katuns (each katun is 7200 days)
        let katuns = Math.floor(remainingDays / 7200);
        remainingDays %= 7200;
        
        // Calculate tuns (each tun is 360 days)
        let tuns = Math.floor(remainingDays / 360);
        remainingDays %= 360;
        
        // Calculate uinals (each uinal is 20 days)
        let uinals = Math.floor(remainingDays / 20);
        
        // Calculate kins (remaining days)
        let kins = remainingDays % 20;
        
        return {
            baktun: baktuns,
            katun: katuns,
            tun: tuns,
            uinal: uinals,
            kin: kins,
            cycle: cycles
        };
    }
    
    // Mayan Long Count to Julian Day Number conversion
    function mayanLongCountToJulianDay(mayan) {
        const mayanEpoch = 584283;
        
        // Calculate days from Long Count components
        const days = mayan.baktun * 144000 +
                    mayan.katun * 7200 +
                    mayan.tun * 360 +
                    mayan.uinal * 20 +
                    mayan.kin;
        
        // Add cycles (each cycle is 13 baktuns = 1872000 days)
        const cycleDays = mayan.cycle * 1872000;
        
        return mayanEpoch + days + cycleDays;
    }
});
