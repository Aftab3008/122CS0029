document.getElementById("inputform").addEventListener("submit", function (e) {
  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirmpassword").value;

  if (password !== confirmpassword) {
    alert("Password and confrim Password should be same");
    return;
  }

  alert("Successfully submitted");
});
