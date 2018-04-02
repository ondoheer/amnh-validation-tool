let fahrenheitInput = document.getElementById('fahrenheit-input');
let celsiusInput = document.getElementById('celsius-input')

fahrenheitInput.addEventListener('keyup', () => {
    if ((Number(fahrenheitInput.value) && fahrenheitInput.value != '') || fahrenheitInput.value == '0') {
        celsiusTemp = (fahrenheitInput.value - 32) * .5556;
        celsiusInput.value = Math.round(celsiusTemp);
    }
    else {
        celsiusInput.value = '';
    }

});

celsiusInput.addEventListener('keyup', () => {
    if ((Number(celsiusInput.value) && celsiusInput.value != '') || celsiusInput.value == '0') {
        fahrenheitTemp = celsiusInput.value * 1.8 + 32;
        fahrenheitInput.value = Math.round(fahrenheitTemp);
    }
    else {
        fahrenheitInput.value = '';
    }
});
