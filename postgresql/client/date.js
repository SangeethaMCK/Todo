function minDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    today =  yyyy + '-' + mm + '-' +  dd;
    return today;
}
window.onload = function() {
    document.getElementById("taskdate").setAttribute("min", minDate());
}