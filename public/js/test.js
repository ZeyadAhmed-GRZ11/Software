function validateForm(email){
    const isUserEmailValid = email.includes("@");

    return isUserEmailValid;
}

document.addEventListener('DOMContentLoaded', function(){
    const registrationForm = document.getElementById('addForm');
    registrationForm.addEventListener('submit', function(event){
      event.preventDefault();

      const email = document.getElementById('inputemail4').value;
      
      const isValid = validateForm(email)
      if(isValid){
            console.log("Done")
       }else{
            console.error('Wrong')
            alert("Please enter a valid email address.");
       }

    })
})