/*=========================================================
            word and character counter for jQuery
            Author : Gilles Migliori
            Version : 1.0
=========================================================*/

/*

$('#textareaID').wordCharCount({'maxAuthorized': 200});

résult :

<div class="counter-wrapper" id="counter-wrappertextareaID">
    <textarea id="textareaID" ...></textarea>
    <p class="compteur"><span id="word-counttextareaID">0</span> mot(s) | <span id="char-counttextareaID">0</span> Caractère(s) / settings.maxAuthorized</p>
</div>

*/

(function($)
{
    $.fn.wordCharCount = function(options){
        var settings = $.extend({
            // defaults settings.
            wordCount: true,
            characterCount: true,
            maxAuthorized: 200,
            wordText: "word(s)",
            characterText: "character(s)",
            className: "text-primary",
            errorClassName: "text-danger"
        }, options );
        var textareaID = $(this).attr('ID');
        var content = '<p id="p-' + textareaID + '" class="' + settings.className + '">';
        if(settings.wordCount === true) {
            content += '<span id="word-count' + textareaID + '">0</span> ' + settings.wordText;
            if(settings.characterCount === true) {
                content += ' | ';
            }
        }
        if(settings.characterCount === true) {
            content += '<span id="char-count' + textareaID + '">0</span> ' + settings.characterText;
        }
        content += ' / ' + settings.maxAuthorized;
        $('<div class="help-block text-left">').html(content).insertAfter(this);
        $(this).keyup(function(e) {
            var numberOfCaracters = $(this).val().length;
            var numberOfWords = jQuery.trim($(this).val()).split(' ').length;
            if($(this).val() === '') {
                numberOfWords = 0;
            }
            if($('#word-count' + textareaID)[0]) {
                $('#word-count' + textareaID).text(numberOfWords);
            }
            if($('#char-count' + textareaID)[0]) {
                $('#char-count' + textareaID).text(numberOfCaracters);
            }
            if(settings.characterCount === false) {
                if (numberOfWords > settings.maxAuthorized) {
                    $('#p-' + textareaID).addClass(settings.errorClassName);
                } else if($('#p-' + textareaID).hasClass(settings.errorClassName)) {
                    $('#p-' + textareaID).removeClass(settings.errorClassName);
                }
            } else {
                if (numberOfCaracters > settings.maxAuthorized) {
                    $('#p-' + textareaID).addClass(settings.errorClassName);
                } else if($('#p-' + textareaID).hasClass(settings.errorClassName)) {
                    $('#p-' + textareaID).removeClass(settings.errorClassName);
                }
            }
        });
        $(this).trigger('keyup');
    };
})(jQuery);