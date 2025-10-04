function updateLiveDateTime() {
  const liveDateTimeBelowLogo = document.getElementById('liveDateTimeBelowLogo');
  if (!liveDateTimeBelowLogo) return;

  const now = new Date();
  const optionsDate = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

  liveDateTimeBelowLogo.textContent = now.toLocaleDateString(undefined, optionsDate) + ' ' + now.toLocaleTimeString(undefined, optionsTime);
}

document.addEventListener('DOMContentLoaded', () => {
  setInterval(updateLiveDateTime, 1000);
  updateLiveDateTime();
});
