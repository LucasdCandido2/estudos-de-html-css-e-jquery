// (function() {
//     'use strict'
//     var forms = document.querySelectorAll('.needs-validation');

//     Array.prototype.slice.call(forms)
//         .forEach(function(form){
//             form.addEventListener('submit',function(e){
//                 if(!form.checkValidity()){
//                     e.preventDefault();
//                     e.stopPropagation();
//                 }

//                 form.classList.add('was-validated');
//             }, false);
//         });
// })()

(function(){
    'use strict';
    let forms = $('.needs-validation');
    forms.each(function(index, form) {
        $(form).on('submit', function(e){
            if(!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            $(form).addClass('was-validated');
        });
    });
})();