let submitBtn = document.getElementById('submit-btn');

submitBtn.addEventListener('click',function(event){
    window.event.preventDefault();
    let user = document.getElementById('userName').value;
    let password = document.getElementById('pass').value;
    user = user.trim();
    password = password.trim();

    if(user == '' || password == ''){
        alert("User or password is empty");
        return ;
    }
    // console.log(obj);
    let obj ={"user":user,"password":password};
    let form = document.querySelector('form');
    let request = new XMLHttpRequest;
    request.open(form.getAttribute('method'),form.getAttribute('action'));
    request.setRequestHeader("Content-Type","application/JSON");
    request.send(JSON.stringify(obj));
    request.addEventListener("load",function(){
        console.log(request.status);
        switch(request.status){
            case 303:{
                window.location.href = '/user';
                break;
            }
            case 200:{
                window.location.href = '/user';
                break;
            }
            case 401:{
                alert("Username or password wrong");
                break;
            }
            case 404:{
                alert("Server is not reacable");
                break;
            }
            case 305:{
                alert("User already exist");
                break;
            }
            case 400:{
                alert("Bad Request");
                break;
            }
        }
    })

})