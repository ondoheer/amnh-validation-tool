$(document).ready(function() {
  const collectedFromCal = $("#collected-from");
  const collectedToCal = $("#collected-to");

  collectedFromCal.datepicker({
    changeMonth: true,
    changeYear: true
  });
  collectedToCal.datepicker({
    changeMonth: true,
    changeYear: true
  });

  collectedFromCal.on("change", function(e) {
    date = new Date(e.target.value);
    const fromYear = document.getElementById("from-year");
    const fromMonth = document.getElementById("from-month");
    const fromDay = document.getElementById("from-day");

    document.date = date;
    fromYear.value = date.getFullYear();
    fromMonth.value = parseInt(date.getMonth()) + 1;
    fromDay.value = date.getDate();
  });
  collectedToCal.on("change", function(e) {
    date = new Date(e.target.value);
    const toYear = document.getElementById("to-year");
    const toMonth = document.getElementById("to-month");
    const toDay = document.getElementById("to-day");

    document.date = date;
    toYear.value = date.getFullYear();
    toMonth.value = parseInt(date.getMonth()) + 1;
    toDay.value = date.getDate();
  });
});
