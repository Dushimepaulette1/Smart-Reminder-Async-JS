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
