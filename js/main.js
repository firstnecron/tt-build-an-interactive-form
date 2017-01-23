'use strict';

// Job Role
var $title = $('#title');
var $otherJobRole = $('<label for="title_other">Your Job Role:</label>' +
    '<input type="text" id="title_other" name="user_title_other">');

// T-Shirt
var $design = $('#design');
var $color = $('#color').hide(); // Start color hidden
var $colorPlaceholder = $('<option>Please select a T-shirt theme</option>');
var colorOptions = $color.find('option');

var jobRoleSelected = function () {
    // Add otherJobRole text input when "other" is selected as the job role's value
    // Otherwise, remove it
    if (this.value === 'other') {
        $title.after($otherJobRole);
    } else {
        $otherJobRole.remove();
    }
};

var designSelected = function() {
    // If the color selection is hidden (assume label is too), show them.
    if ($color.is(':hidden')) {
        $('label[for=color]').show();
        $color.show();
    }

    switch (this.value) {
        case 'js puns':
            break;
        case 'heart js':
            break;
        default:
            // No design selected
            // Hide colors
            hideColorOptions();
            break;
    }
};

// Hide color options and display placeholder option.
var hideColorOptions = function() {
    $color.empty();
    $color.append($colorPlaceholder);
};

// When job role selection is changed, run jobRoleSelected
$title.on('change', jobRoleSelected);

// When the t-shirt design option is changed, run designSelected
$design.on('change', designSelected);

// Hide color's label initially
$('label[for=color]').hide();

window.onload = function() {
    // Focus Name field
    $('#name').focus();
};