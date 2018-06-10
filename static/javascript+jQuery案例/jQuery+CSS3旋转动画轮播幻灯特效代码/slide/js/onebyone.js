function slider () {
    var show_navigation = true;

    var slideShowDelayOption = 5000;

    if ( typeof(tf_script.slideShowDelayOption) == 'string' && tf_script.slideShowDelayOption !== 5000) slideShowDelayOption = tf_script.slideShowDelayOption;

    var effect = 'random';
    if (tf_script.easeEffect) effect = tf_script.easeEffect;
    if (tf_script.rem_anim == true) effect = 'fadeIn';

    var enableDragOption = true;

    if (tf_script.disableDragOption == true)
    {
        enableDragOption = false;
    }

    if (tf_script.img_number == 1)
    {
        show_navigation = false;
        //effect = 'fadeIn';
        enableDragOption = false;
    }


    jQuery('.topSlider').oneByOne({
        className: 'oneByOne1',
        sliderClassName: 'oneByOne_slide',
        easeType: effect,
        slideShow: true,
        width: 940,
        height: 429,
        slideShowDelay: slideShowDelayOption,
        enableDrag: enableDragOption,
        showArrow: show_navigation,  // display the previous/next arrow or not
        showButton: show_navigation  // display the circle buttons or not
    });
}

jQuery(function() {
    slider();
    jQuery('.topSlider').css("display","block")
});
