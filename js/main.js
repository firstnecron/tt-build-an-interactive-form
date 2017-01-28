'use strict';

// Job Role
var $title = $('#title');
var $otherJobRole = $('#title_other');

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
var $total = $('<div id="total"></div>');
var totalCost = 0;

// Errors / Validation
var $errorBox = $(
    '<div id="error-box">' +
        '<div class="fixed-error-box">' +
            '<ul id="errors">' +
                '<li id="name-error"><span class="is-valid x-mark"></span> Name is entered</li>' +
                '<li id="email-error"><span class="is-valid x-mark"></span> Email is entered</li>' +
                '<li id="activity-error"><span class="is-valid x-mark"></span> One or more activity is selected</li>' +
            '</ul>' +
        '</div>' +
    '</div>');
var $activityErrorMessage = $('<div id="activity-error-message" class="text-error">At least one activity must be selected</div>');

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
                cost: parseInt(matchResult[3].replace('$', '')),
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

var handleActivityCost = function (activity, add) {
    if (add) {
        totalCost += activity.cost;
    } else {
        totalCost -= activity.cost;
    }

    $total.text('Total: $' + totalCost);

    if (totalCost === 0) {
        // Hide total cost
        $total.hide();
    } else {
        // Display total cost
        $total.show();
    }
};

// Name validation
var isNameValid = function () {
    var isValid = true;

    var name = $('#name').val();
    if (!name || name === '') {
        isValid = false;
    }

    return isValid;
};

// Email validation
var isEmailValid = function () {
    var isValid = true;

    var email = $('#mail').val();
    // Check if blank
    if (!email || email === '') {
        isValid = false;
    } else {
        // See if email address entered is invalid (if it does not match)
        if (!email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
            isValid = false;
        }
    }

    return isValid;
};

// Activities validation (At least one must be selected)
var isActivitiesValid = function () {
    var isValid = true;

    if ($('.activities input').filter(':checked').length <= 0) {
        // If there are none (or somehow less) selectedisValid = false;
    }

    return isValid;
};

// Credit Card validation
var isPaymentNumberValid = function () {
    var isValid = true;

    //16-digit credit card number
    var ccNum = $('#cc-num').val();
    if (!ccNum || ccNum === '') {
        // Credit card number is empty
        isValid = false;
    } else {
        // See if credit card number entered is invalid (if it does not match)
        if (!ccNum.match(/^[\d]{16}$/)) {
            isValid = false;
        }
    }

    return isValid;
};

var isPaymentZipValid = function () {
    var isValid = true;

    // 5-digit zip code
    var zip = $('#zip').val();
    if (!zip || zip === '') {
        // Zip code is empty
        isValid = false;
    } else {
        // See if zip code entered is invalid (if it does not match)
        if (!zip.match(/^[\d]{5}$/)) {
            isValid = false;
        }
    }

    return isValid;
};

var isPaymentCvvValid = function() {
    var isValid = true;

    // 3-digit CVV
    var cvv = $('#cvv').val();
    if (!cvv || cvv === '') {
        // CVV is empty
        isValid = false;
    } else {
        // See if CVV entered is invalid (if it does not match)
        if (!cvv.match(/^[\d]{3}$/)) {
            isValid = false;
        }
    }

    return isValid;
};

var isPaymentValid = function () {
    var isValid = true;

    if ($('#payment').val() === 'credit card') {
        return isPaymentNumberValid() && isPaymentZipValid() && isPaymentCvvValid();
    }

    return isValid;
};

// Validates if all required form fields are filled (and filled properly)
var isFormValid = function () {
    return isNameValid() && isEmailValid() && isActivitiesValid() && isPaymentValid();
};

// Toggle between X and Check mark for an error message, given the id of the error message and if it is valid
var toggleValidationMessage = function (target, isValid) {
    var $target = $(target + ' span.is-valid');
    if ($target.hasClass('x-mark') && isValid) {
        $target.removeClass('x-mark');
        $target.addClass('check-mark');
    } else if ($target.hasClass('check-mark') && !isValid) {
        $target.removeClass('check-mark');
        $target.addClass('x-mark');
    }
};

// Insert a validation message after target
// Target - target to insert after
// ID - id of the new message list item
// Message - message to display
var insertValidationMessage = function(target, id, message) {
    $(target).after('<li id="' + id + '" class="fadeInDown animated"><span class="is-valid x-mark"></span> ' + message + '</li>');
};

// Toggles activity requirement displayed directly in the form depending on if it is valid
var toggleActivityFormMessage = function (isValid) {
    if (isValid) {
        $activityErrorMessage.hide();
    } else {
        $activityErrorMessage.show();
    }
};

var handleSubmitError = function () {
    // Clear all input-error classes
    var pastInvalids = $('.input-error');
    if (pastInvalids.length > 0) {
        for (var i = 0; i < pastInvalids.length; i++) {
            $(pastInvalids[i]).removeClass('input-error');
        }
    }

    // Check for invalids and add input-error classes

    if (!isNameValid()) {
        $('#name').addClass('input-error');
    }

    if (!isEmailValid()) {
        $('#mail').addClass('input-error');
    }

    // Skip activities - this is done in real time

    // Validate if credit card is selected
    if ($('#payment').val() === 'credit card') {
        if (!isPaymentNumberValid()) {
            $('#cc-num').addClass('input-error');
        }

        if (!isPaymentZipValid()) {
            $('#zip').addClass('input-error');
        }

        if (!isPaymentCvvValid()) {
            $('#cvv').addClass('input-error');
        }
    }
};

// When job role selection is changed, run jobRoleSelected
$title.on('change', jobRoleSelected);

// When the t-shirt design option is changed, run designSelected
$design.on('change', designSelected);

$('.activities label').on('change', function () {
    var $input = $(this).find('input');
    var activity = getActivity($input.attr('name'));
    handleActivityConflicts(activity, $input[0].checked); // Disable if checked
    handleActivityCost(activity, $input[0].checked); // Add if checked

    // Check activity selection is valid
    // and toggle error if needed
    if (isActivitiesValid()) {
        toggleActivityFormMessage(true);
        toggleValidationMessage('#activity-error', true);
    } else {
        toggleActivityFormMessage(false);
        toggleValidationMessage('#activity-error', false);
    }
});

$('#payment').on('change', function () {
    // Hide visible payment method
    $('#credit-card, #paypal, #bitcoin').filter(':visible').hide();
    // Show desired payment method
    $('#' + this.value.trim().replace(' ', '-')).show();

    // Validation
    // Show if credit card if not already, otherwise hide
    var $paymentError = $('#payment-error');
    if (this.value === 'credit card' && !$paymentError[0]) {
        // Insert if error does not exist
        insertValidationMessage('#activity-error', 'payment-error', 'Credit card information is valid');
    } else {
        $paymentError.remove();
    }
});

$('#name').on('keyup', function () {
    // Check if payment is valid and toggle error if needed
    toggleValidationMessage('#name-error', isNameValid());
});

$('#mail').on('keyup', function () {
    var $emailValidError = $('#email-valid-error');
    // Check if email is empty
    if (!this.value || this.value === '') {
        toggleValidationMessage('#email-error', false);
        // Remove validation error if exists
        if ($emailValidError[0]) {
            $emailValidError.remove();
        }
    } else {
        // Insert validation error if it does not exist
        if (!$emailValidError[0]) {
            insertValidationMessage('#email-error', 'email-valid-error', 'Email address is valid');
        }

        // If not empty
        toggleValidationMessage('#email-error', true);
        // Check if email is valid and toggle error if needed
        toggleValidationMessage('#email-valid-error', isEmailValid());
    }

});

$('#cc-num, #zip, #cvv').on('keyup', function () {
    // Check if payment is valid and toggle error if needed
    toggleValidationMessage('#payment-error', isPaymentValid());
});

$('button[type="submit"]').on('click', function (event) {
    // If form is not valid
    if (!isFormValid()) {
        event.preventDefault();
        handleSubmitError();
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    }
});

// Remove job role other by default (support for non-javascript to see it still)
$otherJobRole.remove();

// Hide color div initially
$('#colors-js-puns').hide();

// Append total to activities, hidden by default
$activities.append($total.hide());
$activities.append($activityErrorMessage);

// Hide visible payment method
$('#credit-card, #paypal, #bitcoin').hide();

// Append error box
$('.container').append($errorBox);

window.onload = function () {
    // Focus Name field
    $('#name').focus();

    populateColorOptions();
    populateActivityOptions();
};