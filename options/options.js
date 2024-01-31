const timeOption = document.getElementById("time-option");
const saveOption = document.getElementById("save-option");

timeOption.addEventListener("change", (event) => {
  const time = event.target.value;
  if (time < 1) timeOption.value = 1;
  if (time > 60) timeOption.value = 60;
});

saveOption.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    timerOption: timerOption.value,
    isRunning: false,
  });
});
