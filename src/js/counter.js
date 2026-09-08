/**
 * Live Relationship Time Counter (Image 5)
 * Dynamically computes years, months, days, hours, minutes, seconds
 */

export function initCounter() {
  const elYears = document.getElementById('count-years');
  const elMonths = document.getElementById('count-months');
  const elDays = document.getElementById('count-days');
  const elHours = document.getElementById('count-hours');
  const elMinutes = document.getElementById('count-minutes');
  const elSeconds = document.getElementById('count-seconds');
  const elAnniversaryBadge = document.getElementById('anniversary-badge');
  const elMilestoneDays = document.getElementById('milestone-days-text');
  const elMilestoneNext = document.getElementById('milestone-next-text');

  function getStartDate() {
    const savedDate = localStorage.getItem('love_anniversary_date');
    if (savedDate) {
      return new Date(savedDate + 'T00:00:00');
    }
    // Default from screenshot: September 5, 2025
    return new Date('2025-09-05T00:00:00');
  }

  function formatPad(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, '0');
  }

  function update() {
    const start = getStartDate();
    const now = new Date();

    // Format badge text e.g. "📍 SINCE SEPTEMBER 5, 2025"
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateFormatted = start.toLocaleDateString('en-US', options).toUpperCase();
    if (elAnniversaryBadge) {
      elAnniversaryBadge.textContent = `📍 SINCE ${dateFormatted}`;
    }

    const diffMs = now - start;

    if (diffMs >= 0) {
      // Elapsed time calculation
      let cur = new Date(start);
      let years = 0;
      let months = 0;

      // Increment years
      while (new Date(cur.getFullYear() + 1, cur.getMonth(), cur.getDate(), cur.getHours(), cur.getMinutes(), cur.getSeconds()) <= now) {
        years++;
        cur.setFullYear(cur.getFullYear() + 1);
      }

      // Increment months
      while (new Date(cur.getFullYear(), cur.getMonth() + 1, cur.getDate(), cur.getHours(), cur.getMinutes(), cur.getSeconds()) <= now) {
        months++;
        cur.setMonth(cur.getMonth() + 1);
      }

      // Remaining difference in ms
      const remainingMs = now - cur;
      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
      const seconds = Math.floor((remainingMs / 1000) % 60);

      if (elYears) elYears.textContent = formatPad(years);
      if (elMonths) elMonths.textContent = formatPad(months);
      if (elDays) elDays.textContent = formatPad(days);
      if (elHours) elHours.textContent = formatPad(hours);
      if (elMinutes) elMinutes.textContent = formatPad(minutes);
      if (elSeconds) elSeconds.textContent = formatPad(seconds);

      // Total days together
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (elMilestoneDays) {
        elMilestoneDays.textContent = `${totalDays} days together`;
      }

      // Next milestone
      const nextYearAnniversary = new Date(start);
      nextYearAnniversary.setFullYear(start.getFullYear() + years + 1);
      const daysToNext = Math.ceil((nextYearAnniversary - now) / (1000 * 60 * 60 * 24));
      if (elMilestoneNext) {
        if (daysToNext <= 0) {
          elMilestoneNext.textContent = `🎉 Happy Anniversary Today!`;
        } else {
          elMilestoneNext.textContent = `${daysToNext} days to ${years + 1} year${years + 1 > 1 ? 's' : ''} together`;
        }
      }
    } else {
      // If start date is set to future date
      const futureDiff = Math.abs(diffMs);
      const days = Math.floor(futureDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((futureDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((futureDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((futureDiff / 1000) % 60);

      if (elYears) elYears.textContent = '00';
      if (elMonths) elMonths.textContent = '00';
      if (elDays) elDays.textContent = formatPad(days);
      if (elHours) elHours.textContent = formatPad(hours);
      if (elMinutes) elMinutes.textContent = formatPad(minutes);
      if (elSeconds) elSeconds.textContent = formatPad(seconds);

      if (elMilestoneDays) elMilestoneDays.textContent = `Countdown begins!`;
      if (elMilestoneNext) elMilestoneNext.textContent = `${days} days remaining`;
    }
  }

  update();
  setInterval(update, 1000);
}
