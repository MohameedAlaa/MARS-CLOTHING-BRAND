function validateForm() {
  var name = document.getElementById("fname").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var password = document.getElementById("pw1").value;
  var confirmPassword = document.getElementById("pw2").value;
  let valid = true;

  // Validate Name
  if (name === "") {
    document.getElementById("blankMsg").textContent = "Name cannot be empty.";
    document.getElementById("blankMsg").style.display = "block";
    valid = false;
  } else {
    document.getElementById("blankMsg").style.display = "none";
  }

  // Validate Phone
  const phoneError = document.getElementById("phone").nextElementSibling; // Use next sibling for error
  if (!/^\d{11}$/.test(phone)) {
    phoneError.textContent = "Phone number must be 11 digits.";
    phoneError.style.display = "block";
    valid = false;
  } else {
    phoneError.style.display = "none";
  }

  // Validate Password
  const passwordError = document.getElementById("message1");
  if (password === "") {
    passwordError.textContent = "Enter the password, please!";
    passwordError.style.display = "block";
    valid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters.";
    passwordError.style.display = "block";
    valid = false;
  } else if (password.length > 15) {
    passwordError.textContent = "Password must not exceed 15 characters.";
    passwordError.style.display = "block";
    valid = false;
  } else {
    passwordError.style.display = "none";
  }

  // Confirm Password
  const confirmPasswordError = document.getElementById("message1").nextElementSibling; // Use next sibling
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match.";
    confirmPasswordError.style.display = "block";
    valid = false;
  } else {
    confirmPasswordError.style.display = "none";
  }

  return valid;
}
