'use strict';

// Job Role
var $title = $('#title');
var $otherJobRole = $('<label for="title_other">Your Job Role:</label>' +
    '<input type="text" id="title_other" name="user_title_other">');

var jobRoleSelected = function () {
    // Add otherJobRole text input when "other" is selected as the job role's value
    // Otherwise, remove it
    if (this.value === 'other') {
        $title.after($otherJobRole);
    } else {
        $otherJobRole.remove();
    }
};

$title.on('change', jobRoleSelected);

window.onload = function() {
    // Focus Name field
    $('#name').focus();
};