Utils = function(){
    this.toggleNav = function(){
        if(window.innerWidth>=1028){
            document.querySelector('div.portfolio-navigation-row').style.display = 'inherit';
        }else{
            document.querySelector('div.portfolio-navigation-row').style.display = 'none';
        }
    }
}