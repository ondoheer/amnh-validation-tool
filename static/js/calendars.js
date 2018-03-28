$(document).ready(function() {
  const collectedFromCal = $("#collected-from");

  collectedFromCal.datepicker({
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
});
