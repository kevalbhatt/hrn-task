 $(document).ready(function() {
     AOS.init({
         duration: 500,
         easing: 'ease-in-sine',
         once: true
     });
     $(document).on('click', 'a.page-scroll', function(event) {
         event.preventDefault();
         var $anchor = $(this);
         $('html, body').stop().animate({
             scrollTop: ($('#' + $anchor.attr('href')).offset().top - 60)
         }, 1500, 'easeInOutExpo');
     });
 });