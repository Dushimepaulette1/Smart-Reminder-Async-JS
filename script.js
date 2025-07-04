const form = document.getElementById("reminder-form");
const taskInput = document.getElementById("task");
const minutesInput = document.getElementById("minutes");
const reminderList = document.getElementById("reminder-list");
const quoteBox = document.getElementById("quote");

let reminders = [];

form.addEventListener("submit", throttle(handleAddReminder, 1000)); // throttle adds 1s limit

function handleAddReminder(e) {
  e.preventDefault();
  const task = taskInput.value.trim();
  const minutes = parseInt(minutesInput.value);

  if (!task || isNaN(minutes)) return;

  const id = Date.now();
  const endTime = Date.now() + minutes * 60 * 1000;

  const reminder = { id, task, endTime, intervalId: null };
  reminders.push(reminder);
  renderReminder(reminder);

  taskInput.value = "";
  minutesInput.value = "";
}
function renderReminder(reminder) {
  const container = document.createElement("div");
  container.className = "reminder";
  container.id = `reminder-${reminder.id}`;

  const countdown = document.createElement("span");
  countdown.textContent = "⏳ Calculating...";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => cancelReminder(reminder.id);

  container.innerHTML = `<strong>${reminder.task}</strong><br>`;
  container.appendChild(countdown);
  container.appendChild(document.createElement("br"));
  container.appendChild(cancelBtn);

  reminderList.appendChild(container);
  // Start countdown
  reminder.intervalId = setInterval(() => {
    const timeLeft = reminder.endTime - Date.now();
    if (timeLeft <= 0) {
      clearInterval(reminder.intervalId);
      countdown.textContent = "⏰ Time’s up!";
      fetchQuoteWithRetry(3, 1000);
    } else {
      const mins = Math.floor(timeLeft / 60000);
      const secs = Math.floor((timeLeft % 60000) / 1000);
      countdown.textContent = `⏳ ${mins}m ${secs}s left`;
    }
  }, 1000);
}

function cancelReminder(id) {
  const index = reminders.findIndex((r) => r.id === id);
  if (index !== -1) {
    clearInterval(reminders[index].intervalId);
    document.getElementById(`reminder-${id}`).remove();
    reminders.splice(index, 1);
  }
}
