$j(document).ready(function(){
	
	var currentPage = 1;
	
	// show the proper icons when the page is first loaded
	$j('#cross-red').show();	
	
	// start off by showing the first page
	showPage(currentPage);
	
	/** Handle left arrow click event **/
	// if the left arrow is clicked, step one page backwards
	// redirect to the back url if on the first page
	$j('#left-arrow-white').click(function(){
		if (currentPage == 1) {
			window.location.href=pageContextAddress + backUrl;
		}
		else {
			// SUPERHACK: to handle properly backing into the skip encounter date page
			if (currentPage - 4 > 0 && $j('#question' + (currentPage - 4)).val() == 'SkipEncounterDate') {
				currentPage = currentPage - 3;
			}

			currentPage--;
			showPage(currentPage);
			// show the right arrow, because if you back into a page, you can always go forward again 
			$j('#right-arrow-yellow').show();
		}
	});
	

	/** Handle right arrow click event **/
	// if the right arrow is clicked, step one page forwards
	// do a submit if on the last page
	$j('#right-arrow-yellow').click(function(){
			
		// only do something if there is a value for this page, and it is valid
		if (isValid($j('#question' + currentPage).val(), currentPage)) {
			// handle if this is the last page
			if (currentPage != pageCount) {
				
				// if this is a text question, make sure we update the corresponding review item
				if ($j('#question' + currentPage).hasClass('inputField')) {
					$j('.review' + currentPage).text($j('#question' + currentPage).val());
				} 

				// SUPERHACK: for skipping the set encounter date functionality
				if ($j('#question' + currentPage).val() == 'SkipEncounterDate') {
					// make sure the date is set to today's date
					var date = new Date();
					$j('#question' + (currentPage + 1)).val(date.getFullYear());
					$j('.review' + (currentPage + 1)).text(date.getFullYear());
					selectRadioButton($j('#page' + (currentPage + 2)).find('.radioClass[value=' + (date.getMonth() + 1) + ']').closest('.radioItem'), currentPage + 2)
					$j('#question' + (currentPage + 3)).val(date.getDate());
					$j('.review' + (currentPage + 3)).text(date.getDate());
					// skip forward three pages (and then skip forward one more when we increment below)
					currentPage = currentPage + 3;
				}

				// increment to the next page and go to it
				currentPage++;
				showPage(currentPage);
			}
		}
		// otherwise, there has been a mistake, hide the arrow
		else {
			$j('#right-arrow-yellow').hide();
		}
	});
	
	/** Handle the checkmark click event **/
	$j('#checkmark-yellow').click(function() {
		// submit the form
		$j('#encounterTaskItemForm').submit();
	});
	
	/** Handle the red cross click event **/
	$j('#cross-red').click(function() {
		// TODO: should we append the patient id here?
		window.location.href=pageContextAddress + backUrl;
	});
	
	
	/** Handle edit button click event **/
	$j('.editButton').click(function() {
		// jump to the page referenced in the button id
		var pattern = /edit(\d+)/;
		var result = this.id.match(pattern);
		currentPage = result[1];
		showPage(currentPage);
	});
		
	/** Handlers for handling TEXT questions **/
	// handle what happens a text field value changes (i.e., when a user enters text in one of the text fields)
	// trap "keyup" as opposed to "keypress" so we get the current value of the field
	$j('.inputField').keyup(function() {
		// show the right arrow on a keypress if we have a valid entry
		if (isValid($j('#question' + currentPage).val(), currentPage) && currentPage != pageCount) {
			$j('#right-arrow-yellow').show();
		}
		else {
			$j('#right-arrow-yellow').hide()
		}
	});
	
	/** Handlers for handling questions with SELECT answers **/
	// handle the click on an answer for the a coded question
	$j('.questionAnswer').click(function() {
		selectQuestionAnswer(this, currentPage, currentAnswerArray);
	});
	
	// handle up and down arrows for coded questions, as well as up, down, left, and right arrow for radio buttons
	$j(document).keydown(function(event) {
		
		// handle SELECT pages 
		if (currentAnswerArray[currentPage] != undefined) {	
			// down arrow
			if (event.keyCode == 40) {
				var answers = $j('#page' + currentPage).find('.questionAnswer');
				if (currentAnswerArray[currentPage] < answers.length - 1) {
					currentAnswerArray[currentPage]++;
					selectQuestionAnswer(answers[currentAnswerArray[currentPage]], currentPage, currentAnswerArray);
				}
			}
			
			// up arrow
			if (event.keyCode == 38) {
				var answers = $j('#page' + currentPage).find('.questionAnswer');
				if (currentAnswerArray[currentPage] > 0) {
					currentAnswerArray[currentPage]--;
					selectQuestionAnswer(answers[currentAnswerArray[currentPage]], currentPage, currentAnswerArray);
				}
			}
		}
		
		// special case to handle radio buttons on month selection page
		// TODO: would be nice to make the row and column sizes configurable
		if ($j('#page' + currentPage).find('.radioItem').length) {
				
			// find the currently selected radio button
			var selected = parseInt($j('#page' + currentPage).find('#question' + currentPage).val());			
			
			// down arrow for radio buttons
			if (event.keyCode == 40) {
				// if we aren't on the bottom row, jump down a row
				if (selected + 4 <= 12) {				
					selectRadioButton($j('#page' + currentPage).find('.radioClass[value=' + (selected + 4) + ']').closest('.radioItem'), currentPage);
				}			
			}
			
			// up arrow for radio buttons
			if (event.keyCode == 38) {
				// if we aren't on the bottom row, jump down a row
				if (selected > 4) {				
					selectRadioButton($j('#page' + currentPage).find('.radioClass[value=' + (selected - 4) + ']').closest('.radioItem'), currentPage);
				}			
			}
			
			// right arrow for radio buttons
			if (event.keyCode == 39) {
				// move one to the right if not on the rightmost row
				if (selected % 4 != 0) {
					selectRadioButton($j('#page' + currentPage).find('.radioClass[value=' + (selected + 1) + ']').closest('.radioItem'), currentPage);
				}
			}
			
			// left arrow for radio buttons
			if (event.keyCode == 37) {
				// move one to the left if not on the leftmost row
				if ((selected - 1) != 0 && ((selected-1) % 4) != 0) {
					selectRadioButton($j('#page' + currentPage).find('.radioClass[value=' + (selected - 1) + ']').closest('.radioItem'), currentPage);
				}
			}
		}
		
		
		
	});	
	
	/** Special handler for radio buttons (currently used only for the month selector **/
	$j('.radioItem').click(function() {
		selectRadioButton(this, currentPage);
	});
	
	
	/** Trap all enter presses at the document level **/
	$j(document).keydown(function(event) {										
			if (event.keyCode == 13){
				event.stopPropagation();
				event.preventDefault();
				
				if (currentPage < pageCount) {
					$j('#right-arrow-yellow').click();
				}
				else {
					$j('#checkmark-yellow').click();
				}
			}
	});
	
	// highlight the first answer by default
	// TODO: I believe will only highlight the first answer of the first questions, while we want to highlight the first answer of all the questions
	$j(".questionAnswer:first").click();
});


function showPage(page) {
	// first need to hide old pages
	hideAllPages();
	
	// show the selected page and highlight in the navigation menu
	$j('#page' + page).show();
	$j('.nameMenu' + page).addClass('highlighted');
	
	// make sure the proper element has focus
	if ($j('#autocomplete' + page).length) {
		$j('#autocomplete' + page).focus();
	}
	else {
		$j('#question' + page).focus();
	}
			
	// hide the checkmark
	$j('#checkmark-yellow').hide();
	
	// show or hide the back arrow as needed (we don't show the back arrow if this is the first page)
	if (page == 1) {      
		$j('#left-arrow-white').hide();
	}
	else {
		$j('#left-arrow-white').show();
	}
	
	// show the checkbox if this is the last page in the workflow
	if (page == pageCount) {
		$j('#right-arrow-yellow').hide();
		$j('#checkmark-yellow').show();
	}
	// otherwise, show or hide the forward arrow as needed
	else if (isValid($j('#question' + page).val(), page)) {
		$j('#right-arrow-yellow').show();
	}
	else {
		$j('#right-arrow-yellow').hide();
	}
}


function hideAllPages() {
	for (i = 1; i <= pageCount; i++) {
		$j('#page' + i).hide();
		$j('.nameMenu' + i).removeClass('highlighted');
	}
}



/** Used by the handlers for selection questions **/
function selectQuestionAnswer(element, currentPage, currentAnswerArray) {
	// make sure the proper row is highlighted
	$j('#page' + currentPage).find('.questionAnswer').removeClass('highlighted');
	$j(element).addClass('highlighted');
	
	// pull out the question and answer concept for this selection
	var pattern = /question(\d+)AnswerValue(\w+)/;
	var result = element.id.match(pattern);
	var question = result[1];
	var conceptId = result[2];
			
	// set the hidden value of this question to the specified answer
	$j('#question' + question).val(conceptId);
	
	// update the review box for this question
	$j('.review' + question).text($j(element).text());
	
	// update the answer index for this question
	var answers = $j('#page' + currentPage).find('.questionAnswer');
	var i = 0;	
	while (!(answers[i] === element)){ 
		i++;
	}	
	
	currentAnswerArray[currentPage] = i;
	
	// show the right arrow
	$j('#right-arrow-yellow').show();
}

/** Used by the handlers for selecting radio buttons **/
function selectRadioButton(element, currentPage) {
	// make sure the proper button is highlighted
	$j('#page' + currentPage).find('.radioItem').removeClass('highlighted');
	$j('#page' + currentPage).find('.radioItem').find('.radioClass').attr('checked',false);
	$j(element).addClass('highlighted');
	$j(element).find('.radioClass').attr('checked',true);
	
	// set the hidden value of this question to the specified answer
	$j('#question' + currentPage).val($j(element).find('.radioClass').val());
	
	// update the review box
	$j('.review' + currentPage).text($j(element).find('.radioLabel').text());
	
	// test if the current value is valid
    if (isValid($j('#question' + currentPage).val(), currentPage)) {
    	$j('#right-arrow-yellow').show();
    }
    else {
    	$j('#right-arrow-yellow').hide();
    }
}

/** Validator **/
function isValid(value, page) {
	// don't allow empty values
	if (validatorBlankAllowedArray[page] != 'true' && !value) {
		return false;
	}

	// check to make sure that the value is not less than any specified min
	if (validatorMinArray[page] != null && value < validatorMinArray[page]) {
		return false;
	}
	
	// check to make sure that the value is not greater than any specified max
	if (validatorMaxArray[page] != null && value > validatorMaxArray[page]) {
		return false;
	}
	
	// confirm that the answer is numeric
	if (validatorTypeArray[page] != null && validatorTypeArray[page].toUpperCase() === 'NUMERIC' && isNaN(value)) {
		return false;
	}
	
	// handle the specific date cases
	// TODO: note that in the future we may have widgets that DO accept future dates; in which case we whould have to turn this widget off
	if (validatorTypeArray[page] != null && validatorTypeArray[page].toUpperCase() === 'YEAR') {
		// must be a number
		if (isNaN(value)) {
			return false;
		}
		// must not be in the future
		if (value > new Date().getFullYear()) {
			return false;
		}
	}
	
	if (validatorTypeArray[page] != null && validatorTypeArray[page].toUpperCase() === 'MONTH') {
		// must be a number
		if (isNaN(value)) {
			return false;
		}
		// must not be in the future
		// NOTE: the assumption here is that the year was collected as an answer to the previous question (prob not a good assumption?)
		if (parseInt($j('#question' + (page - 1)).val()) == new Date().getFullYear() &&
				value > (new Date().getMonth() + 1)) {
			return false;
		}
	}
	
	if (validatorTypeArray[page] != null && validatorTypeArray[page].toUpperCase() === 'DAY') {
		// must be a number
		if (isNaN(value)) {
			return false;
		}
		// must not be in the future
		// NOTE: the assumption here is that the month was collected as an answer to the previous question (prob not a good assumption?)
		if (parseInt($j('#question' + (page - 1)).val()) == (new Date().getMonth() + 1) &&
				value > new Date().getDate()) {
			return false;
		}
	}
	
	// otherwise, we are good
	return true;
}
