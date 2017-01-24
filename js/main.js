'use strict';

// Job Role
var $title = $('#title');
var $otherJobRole = $('<input type="text" id="title_other" name="user_title_other" placeholder="Your job role">');

// T-Shirt
var $design = $('#design');
var $color = $('#color');
var $colorPlaceholder = $('<option>Please select a T-shirt theme</option>');
var colorOptions = {
    heart_js: [],
    js_puns: []
};

// Activities
var $activities = $('.activities');
var activityOptions = [];

var jobRoleSelected = function () {
    // Add otherJobRole text input when "other" is selected as the job role's value
    // Otherwise, remove it
    if (this.value === 'other') {
        $title.after($otherJobRole);
    } else {
        $otherJobRole.remove();
    }
};

var designSelected = function () {
    var $colorDiv = $('#colors-js-puns').show();
    switch (this.value) {
        case 'js puns':
        case 'heart js':
            // displayColorOptions(this.value);
            // Empty selection and append options for design (this.value) only
            $color.empty();
            $color.append(colorOptions[this.value.replace(' ', '_')]);
            $colorDiv.show();
            break;
        default:
            // No design selected
            // Hide colors
            hideColorOptions();
            $colorDiv.hide();
            break;
    }
};

// Hide color options and display placeholder option.
var hideColorOptions = function () {
    $color.empty();
    $color.append($colorPlaceholder);
};

// Populate color options for each design
var populateColorOptions = function () {
    var colorOptionArray = $color.find('option');
    // Loop through colorOptions
    for (var i = 0; i < colorOptionArray.length; i++) {
        // Get raw color option text
        var optionText = colorOptionArray[i].text.toLowerCase();
        // Clean up the color's text
        colorOptionArray[i].text = colorOptionArray[i].text.replace(/\(.*shirt only\)/gi, '').trim();

        // Add color option to proper design
        // for heart design, since the wording in the text is different
        if (optionText.indexOf('i ♥ js') > -1) {
            colorOptions.heart_js.push(colorOptionArray[i]);
        } else if (optionText.indexOf('js puns') > -1) {
            colorOptions.js_puns.push(colorOptionArray[i]);
        } else {
            // console.log('color option not found ' + optionText);
        }
    }
};

var populateActivityOptions = function () {
    var activityOptionArray = $('.activities label');
    for (var i = 0; i < activityOptionArray.length; i++) {
        // Regex to get activity data
        var matchResult = activityOptionArray[i].textContent.match(/(.*) — (.*, )?(\$\d*)/);
        if (matchResult) {
            // [1] = activity
            // [2] = time (optional)
            // [3] = cost
            var activity = {
                name: $(activityOptionArray[i]).find('input').attr('name'),
                activity: matchResult[1].trim(),
                time: matchResult[2] ? matchResult[2].replace(', ', '') : null,
                cost: matchResult[3].replace('$', ''),
                element: $(activityOptionArray[i])
            };
            activityOptions.push(activity);
        } else {
            // console.log('no match result: ' + matchResult);
        }
    }
};

var getActivity = function (activityName) {
    for (var i = 0; i < activityOptions.length; i++) {
        if (activityOptions[i].name.toLowerCase() === activityName.toLowerCase()) {
            return activityOptions[i];
        }
    }
};

var handleActivityConflicts = function (activity, disable) {
    for (var i = 0; i < activityOptions.length; i++) {
        // If it is not the activity itself, check
        if (activityOptions[i].name.toLowerCase() !== activity.name.toLowerCase()) {
            // If times match
            if (activityOptions[i].time === activity.time) {
                console.log('match');
                if (disable === true) {
                    // Disable conflicts
                    activityOptions[i].element.addClass('text-muted');
                    activityOptions[i].element.find('input').prop('disabled', true)
                } else {
                    // Enable conflicts
                    activityOptions[i].element.removeClass('text-muted');
                    activityOptions[i].element.find('input').prop('disabled', false)
                }
            }
        }
    }
};

// When job role selection is changed, run jobRoleSelected
$title.on('change', jobRoleSelected);

// When the t-shirt design option is changed, run designSelected
$design.on('change', designSelected);

$('.activities label').on('change', function (event) {
    var $input = $(this).find('input');
    var activity = getActivity($input.attr('name'));
    // If the input was checked
    if ($input[0].checked) {
        // See if other options conflict and disable them
        handleActivityConflicts(activity, true);
    } else {
        // Re-enable disabled options
        handleActivityConflicts(activity, false);
    }

});

// Hide color div initially
$('#colors-js-puns').hide();

window.onload = function () {
    // Focus Name field
    $('#name').focus();

    populateColorOptions();
    populateActivityOptions();
};