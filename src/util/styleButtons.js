export {styleInteractiveButtons}

function styleInteractiveButtons(){
    document.querySelectorAll('button, a').forEach(button => {
        if ((button.querySelector('i') && button.textContent.trim().length > 0) || (button.closest(".options") != null && button.querySelector("i") == null && button.children.length === 0)) {
    
            button.classList.add('text_button'); 
        } else if ((button.children.length === 1 && button.children[0].tagName.toLowerCase() === 'i') || (button.children.length == 0 && button.textContent.trim().length < 4)) {
    
            button.classList.add('icon_button'); 
        }
      });
}