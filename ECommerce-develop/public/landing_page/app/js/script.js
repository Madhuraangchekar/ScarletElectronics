const header = document.querySelector('.header')
const body = document.querySelector('body')
const btnHamburger = document.querySelector('#btnHamburger');
const overlay = document.querySelector('.overlay');
const fadeElements =document.querySelectorAll('.has-fade');

btnHamburger.addEventListener('click', function(){
    console.log("open hamburger");
    
    if(header.classList.contains('open')) {
        body.classList.remove('scrollLock');
        header.classList.remove('open');
        fadeElements.forEach(function(element){
            element.classList.remove('fade-in');
            element.classList.add('fade-out');
        });    
    }
    else {
        body.classList.add('scrollLock');
        header.classList.add('open');
        fadeElements.forEach(function(element){
            element.classList.remove('fade-out');
            element.classList.add('fade-in');
        });        
    }
});
