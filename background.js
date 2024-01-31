chrome.alarms.create("pomodoro-timer", { periodInMinutes: 1 / 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoro-timer") {
    chrome.storage.local.get(
      ["timer", "isRunning", "timerOption"],
      (response) => {
        if (response.isRunning) {
          let timer = response.timer + 1;
          chrome.storage.local.set({ timer });
          if (timer === 60 * response.timerOption) {
            this.registration.showNotification("Pomodoro Timer", {
              body: response.timerOption + " minutes has passed",
              icon: "icon.png",
            });
          }
        }
      }
    );
  }
});

chrome.storage.local.get(["timer", "isRunning", "timerOption"], (response) => {
  chrome.storage.local.set({
    timer: "timer" in response ? response.timer : 0,
    isRunning: "isRunning" in response ? response.isRunning : false,
    timerOption: "timerOption" in response ? response.timerOption : 25,
  });
});
