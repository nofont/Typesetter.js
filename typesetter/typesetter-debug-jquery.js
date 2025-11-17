/*
TYPESETTER.JS - DEBUG MODE
Debug version that highlights regex matches visually

Known bugs
- " inside a html tag gets replaced. See code-example on http://www.opentypography.org
*/

// GLOBAL DEBUG FLAG
var TYPESETTER_DEBUG = false;

// Debug wrapper function to highlight matches
function debugHighlight(text, type, description) {
	if (!TYPESETTER_DEBUG) return text;
	var colors = {
		'ellipsis': '#ffeb3b',
		'ligature-fl': '#4caf50',
		'ligature-fi': '#8bc34a',
		'dash': '#ff9800',
		'quote-close-double': '#2196f3',
		'quote-open-double': '#03a9f4',
		'quote-close-single': '#9c27b0',
		'quote-open-single': '#ba68c8',
		'possessive': '#e91e63',
		'number': '#f44336',
		'symbol-copy': '#795548',
		'symbol-reg': '#9e9e9e',
		'abbr': '#00bcd4'
	};
	var color = colors[type] || '#ffc107';
	return '<span class="debug-match" data-type="' + type + '" data-desc="' + description + '" style="background: ' + color + '; padding: 0 2px; border: 1px solid #000; position: relative;" title="' + type + ': ' + description + '">' + text + '</span>';
}

//-------------------------------------
// REPLACEMENT OF INDIVIDUAL characterS
//-------------------------------------

var charReplacements = function() {

	// SETTINGS

	/* Quotationmarks
	‹ = &#8249;
	› = &#8250;
	« = &laquo;
	» = &raquo;
	' = &#8216;
	' = &#8217;
	" = &#8220;
	" = &#8221;
	*/

	// String.fromCharCode(newUnicodeLetter);

	var doubleQuoteCharClose = "&#8221;";
	var doubleQuoteCharOpen = "&#8220;";
	var singleQuoteCharClose = "&#8217;";
	var singleQuoteCharOpen = "&#8216;";
	var posessiveS = "&#8217;";
	var triggerID = ".display";
	var numeralClass = "num"

	// END SETTINGS

  	$(triggerID).each(function() {

    	$(this).find('*').each(function() {

			    if (($(this).html()) != 0) {

			    	if (($(this).find('img').length) === 0) { // Finds any element that is not an <img>

			    		// Skip if already processed (has debug spans)
			    		if ($(this).find('.debug-match').length > 0 && TYPESETTER_DEBUG) {
			    			return;
			    		}

	  	    		// ELLIPSIS
	  	    		if (TYPESETTER_DEBUG) {
	  	    			$(this).html( $(this).html().replace(/(\.\.\.(\.)?)|(\.\s\.\s(\.\s)?|(\.\.(\.)?))/g, function(match) {
	  	    				return debugHighlight("&#8230;", 'ellipsis', 'Ellipsis: ' + match + ' → …');
	  	    			}));
	  	    		} else {
	  	    			$(this).html( $(this).html().replace(/(\.\.\.(\.)?)|(\.\s\.\s(\.\s)?|(\.\.(\.)?))/g, "&#8230;"));
	  	    		}

	  	    		// LIGATURES
	  	    		if (TYPESETTER_DEBUG) {
	  	    			$(this).html( $(this).html().replace(/fl/g, function(match) {
	  	    				return debugHighlight("&#xFB02;", 'ligature-fl', 'fl → ﬂ ligature');
	  	    			}));
	  	    			$(this).html( $(this).html().replace(/fi/g, function(match) {
	  	    				return debugHighlight("&#xFB01;", 'ligature-fi', 'fi → ﬁ ligature');
	  	    			}));
	  	    		} else {
	  	    			$(this).html( $(this).html().replace(/fl/g, "&#xFB02;"));
	  	    			$(this).html( $(this).html().replace(/fi/g, "&#xFB01;"));
	  	    		}

	  	    		// EN-DASH
	  	    		if (TYPESETTER_DEBUG) {
	  	    			$(this).html( $(this).html().replace(/\s-\s/g, function(match) {
	  	    				return " " + debugHighlight("&#8210;", 'dash', 'space-hyphen-space → en-dash') + " ";
	  	    			}));
	  	    		} else {
			    		$(this).html( $(this).html().replace(/\s-\s/g, " &#8210; "));
			    	}

			    	// QUOTES - DOUBLE CLOSE
			    	if (TYPESETTER_DEBUG) {
			    		$(this).html( $(this).html().replace(/"([\s\.\,])/g, function(match, p1) {
			    			return debugHighlight(doubleQuoteCharClose, 'quote-close-double', '" → closing "') + p1;
			    		}));
			    	} else {
			    		$(this).html( $(this).html().replace(/"([\s\.\,])/g, doubleQuoteCharClose + "$1"));
			    	}

			    	// QUOTES - DOUBLE OPEN
			    	if (TYPESETTER_DEBUG) {
			    		$(this).html( $(this).html().replace(/\s"/g, function(match) {
			    			return " " + debugHighlight(doubleQuoteCharOpen, 'quote-open-double', '" → opening "');
			    		}));
			    	} else {
			    		$(this).html( $(this).html().replace(/\s"/g, " " +  doubleQuoteCharOpen));
			    	}

			    	// QUOTES - SINGLE CLOSE
			    	if (TYPESETTER_DEBUG) {
			    		$(this).html( $(this).html().replace(/'([\s\.\,])/g, function(match, p1) {
			    			return debugHighlight(singleQuoteCharClose, 'quote-close-single', "' → closing '") + p1;
			    		}));
			    	} else {
			    		$(this).html( $(this).html().replace(/'([\s\.\,])/g, singleQuoteCharClose + "$1"));
			    	}

			    	// QUOTES - SINGLE OPEN
			    	if (TYPESETTER_DEBUG) {
			    		$(this).html( $(this).html().replace(/\s'/g, function(match) {
			    			return " " + debugHighlight(singleQuoteCharOpen, 'quote-open-single', "' → opening '");
			    		}));
			    	} else {
			    		$(this).html( $(this).html().replace(/\s'/g, " " +  singleQuoteCharOpen));
			    	}

			    	// POSSESSIVE S
			    	if (TYPESETTER_DEBUG) {
			    		$(this).html( $(this).html().replace(/'([sS])/g, function(match, p1) {
			    			return debugHighlight(posessiveS, 'possessive', "' → possessive apostrophe") + p1;
			    		}));
			    	} else {
			    		$(this).html( $(this).html().replace(/'([sS])/g, posessiveS + "$1"));
			    	}

					// NUMBERS
					if (TYPESETTER_DEBUG) {
						$(this).html( $(this).html().replace(/(\d+)(?=((?!<\/a>).)*(<a|$))/g, function(match) {
							return '<' + numeralClass + ' class="debug-match" data-type="number" data-desc="Number wrapped" style="background: #f44336; padding: 0 2px; border: 1px solid #000;" title="number: ' + match + '">' + match + '</' + numeralClass + '>';
						}));
					} else {
						$(this).html( $(this).html().replace(/(\d+)(?=((?!<\/a>).)*(<a|$))/g, '<'+numeralClass+'>$1</'+numeralClass+'>'));
					}

  	     	    	// SYMBOLS
  	     	    	if ( (($(this).children().length) === 0) || ($('this:contains("u00a9")')) ) {
  	     	    		if (TYPESETTER_DEBUG) {
	  			    		$(this).html( $(this).html().replace(/\u00a9/g, function(match) {
	  			    			return "<sup class=\"sup\">" + debugHighlight("&copy;", 'symbol-copy', '© → superscript') + "</sup>";
	  			    		}));
	  			    		$(this).html( $(this).html().replace(/\u00ae/g, function(match) {
	  			    			return "<sup class=\"sup\">" + debugHighlight("&reg;", 'symbol-reg', '® → superscript') + "</sup>";
	  			    		}));
	  			    	} else {
		  			    	$(this).html( $(this).html().replace(/\u00a9/g, "<sup class=\"sup\">&copy;</sup>") );
		  			    	$(this).html( $(this).html().replace(/\u00ae/g, "<sup class=\"sup\">&reg;</sup>") );
		  			    }
		    		};
		    	};
			    };
    	});

	});

}; // END REPLACEMENT INDIVIDUAL characterS


/***********************

TYPESETTER.JS

Ideas:
Need to rewrite the testing logics so that it checks if the first character is NOT a lowercase and then if the second is an uppercase.

Known bugs
- Words ending with . : ; , gets an <abbr> around the first character.

************************/

var smallcapsReplacement = function() {

	var foundObjects;

	function getElementsByClass(node,searchClass,tag) {
		var classElements = new Array();
		var els = node.getElementsByTagName(tag); // use "*" for all elements
		var elsLen = els.length;
		var pattern = new RegExp("\\b"+searchClass+"\\b");
		for (i = 0, j = 0; i < elsLen; i++) {
	 		if ( pattern.test(els[i].className) ) {
	 			classElements[j] = els[i];
	 			j++;
	 		}
		}
		return classElements;
	}

	function findAbbrevations() {

	foundObjects = getElementsByClass(document,'typo','*'); // Gets all the elements with the "typo"-class

	for (var a=0;a<foundObjects.length;a++) // Loops typo-objects
	{

		if (foundObjects[a] != null) { // Check if current "typo"-object is empty (contains an image for example). If null the loop moves on to the next object.

			var textObjects = foundObjects[a].innerHTML; // Assigns textObjects the string from foundObjects[a]
			var y=0; // Counter that is used to count every uppercase word that is found.
			var capsIndex = new Array();
			var currentStringArray = new Array();

			currentStringArray = textObjects.split(' '); // Array filled with all the words from the textObjects string.

			for (var i=0;i<currentStringArray.length;i++) // Loops through every word in currentStringArray.
			{
				var upperCaseCounter = 0; // Counter that is increased every time currentLetter is uppercase. If currentWord.length = upperCaseCounter then the word is all uppercase and the index of the word shall be stored in capsIndex.
				var currentWord = currentStringArray[i]; // The word that is going to be tested for "all-caps" is assigned to currentWord.
				var lastCharTester = (currentWord.length)-1; // lastCharTester is assigned the last character of currentWord. This is used o test if the last character is ≠ uppercase
				var lowercaseTester = currentWord.charAt(0);

				/* THIS IS NOT WORKING, THE WORD WITH A COLON AT THE END IS TESTED IN NEXT IF-STATEMENT
				if (currentWord.charCodeAt(lastCharTester) == 58) { // If last character is a colon then do nothing.
					console.log('Last charachter of word : do nothing');
				}
				*/

				/*
				if ( (lowercaseTester.charCodeAt(0) < 47) && (lowercaseTester.charCodeAt(0) != 46) && (lowercaseTester.charCodeAt(0) != 34) )  { // SPECIAL character TEST that checks if the first letter in the word is a space - " or such AND if it's not a period. If TRUE then the "all caps"-test is not run. This is to avoid that a <abbr>-tag is wrapped around quotes or a hyphenated word. If this test was not performed there would be a lot of useless/unclean markup, plus that it would mess up the charReplacements-function.
					console.log('Not testing: '+currentWord);
				} else {
				*/
					if /* If not a lowercase OR number then do test */ (
							((lowercaseTester.charCodeAt(0) < 97) || (lowercaseTester.charCodeAt(0) > 122)) // Not uppercase
							&&
							((lowercaseTester.charCodeAt(0) < 47) || (lowercaseTester.charCodeAt(0) > 58)) // Not digit
							)

							/* && (currentWord.charCodeAt(lastCharTester) != 46) ) */ { // LOWERCASETEST - if the first character in the word is not within lowercase ASCII-value range or a "space" AND the last character is not a : then the test below shall be run.

							// TO-DO! Is it possible to build an "inArray"-function/check that checks every exception; words that has . - space as the first character and words that has . : ; , and such as the last character?.

							// IMPORTANT! Add && (currentWord.charCodeAt(lastCharTester) != 46) in the above and find out why words ending with . or :  gets an <abbr>-tag wrapped around its first character.

							for (var x=0;x<currentWord.length;x++) // CURRENTWORD LOOP loop through every letter in currentWord
							{
									var currentLetter = currentWord.charAt(x); // currentLetter is assigned the individual letter that is going to be checked is uppercase.

									var lengthOfCurrentWord = currentWord.length; // lengthOfCurrentLetter is assigned the character count of the current word so that we can check if count of letters is equal to the count of uppercase letters. If equal then we have a "all caps" word :-)

									var unicodeValue = currentLetter.charCodeAt(0); // unicodeValue is assigned the decimal ASCII value of the individual unicode-character that is stored in currentLetter.

										/* Quotationmarks
										‹ = &#8249;
										› = &#8250;
										« = &laquo;
										» = &raquo;
										' = &#8216;
										' = &#8217;
										" = &#8220;
										" = &#8221;
										*/

									if ( 	(unicodeValue === 8217) || // Special charachter Apotstrophe test
											(unicodeValue === 8249) ||
											(unicodeValue === 8250) ||
											(unicodeValue === 8220) ||
											(unicodeValue === 8221) ||
											(unicodeValue === 8211) ||
											(unicodeValue === 8212) ||
											(unicodeValue === 147) ||
											(unicodeValue === 148) ||
											(unicodeValue === 145) ||
											(unicodeValue === 146) ||
											(unicodeValue === 174) ||
											(unicodeValue === 175) ||
											(unicodeValue === 45) ||
											(unicodeValue === 40) ||
											(unicodeValue === 34) ||
											(unicodeValue === 39) ||
											(unicodeValue === 46) ||
											(unicodeValue === 196) ||
											(unicodeValue === 58)
										) { // APOSTROPHE-TEST This is a test/exception that is made if the word that is being tested contains all uppercase letters AND an apostrophe or hyphen or such. If it does then it shall be treated like a "all-caps"-word. If the word contains all caps and apostrophe/hyphen BUT ends with lowercase letters then the word shall not be treated as an "all-caps"-word. This is a decision made by me cos there are no good/clear rules in typography on how to handle such words.
									// 8217 = Apostrophe
									// 45 = minus sign - hyphen
									// 8211 = en-dash
									// 8212 = em-dash
									// 58 = colon
									// 46 = period
									// 40 = paranthesis
									// 34 = inch-mark
									// 39 = foot-mark
									// 147 = left double quotation mark "
									// 148 = right double quotation mark "
									// 145 = left single quotation mark '
									// 146 = right single quotation mark
									// 174 = «
									// 175 = »

										upperCaseCounter++; // Increased every time a uppercase character is found.

									} else {
										if (
											((unicodeValue >= 33) == (unicodeValue <= 90))
											|| (unicodeValue === 115) )
										{
										// If the unicode-value of currentLetter is within 65-90 then it is an uppercase letter or a diacrit.
										// The OR statement at the end is to catch abbrevations with posessive 's at the end. Like NASA's
											upperCaseCounter++; // Increased every time a uppercase character is found.

										} // END If Unicode är inom Versal Value

									} // END APOSTROPH & UPPERCASE TEST

									if ((lengthOfCurrentWord == upperCaseCounter) && (lengthOfCurrentWord > 1)) {

										// If the length of the word is equal to the count of uppercase letters then it's an uppercase abbrevation. Aphostrophes are included so that a word like API's is treated as an uppercase-abbrevation. 'lengthOfCurrentWord > 1' is used to avoid setting one letter "words" in small-caps.

										capsIndex[y] = i; // capsIndex is assigned the index of the word that has been tested. When every word has been tested capsIndex contains indexes for all the words that shall be replaced.
										y++;
									}

							} // END CURRENTWORD LOOP

					}  // END LOWERCASE TEST LOOP
				// } // END SPECIAL CHAR TEST
			} // END CurrentString loop

			//debugger;
			var wordIndex = 0; // Is declared "globaly" so that it can be used outside the loop below.

			for (var z=0;z<capsIndex.length;z++) // Every all-uppercase word is "traversed" and every individual character is replaced.

				{
					wordIndex = capsIndex[z]; // Index of the word to relpace
					var wordToReplace = currentStringArray[wordIndex]; // The actual word from currentStringArray
					var lettersToReplace = new Array();
					// An array is created to contain every character from the word.
					lettersToReplace = wordToReplace.split('');
					// The array is filled with the characters

					if (TYPESETTER_DEBUG) {
						currentStringArray[wordIndex] = '<abbr class="debug-match" data-type="abbr" data-desc="Abbreviation detected" style="background: #00bcd4; padding: 0 2px; border: 1px solid #000;" title="abbr: ' + wordToReplace + '">';
					} else {
						currentStringArray[wordIndex] = '<abbr>';
					}

					// An <abbr> tag is inserted before the word that is about to get replaced. Once the replacement is completed an </abbr> tag is inserted after the word.

					var closeTagIndex = 0;
					// This variable is used to keep track of where in the word the last uppercase character is so that the </abbr> tag is inserted at the correct place.

					for (var p=0;p<lettersToReplace.length;p++) // Loops each individual character
					{
						var theLetter = lettersToReplace[p]; // theLetter is assigned the character that shall be replaced
						var unicodeCounter = theLetter.charCodeAt(0); // unicodeCounter is assigned the unicode-value of the character being replaced.
						// DDT:er   68 68 84 58 101 114
						// .DDT   46 68 68 84

						/*
							if ( 	(unicodeCounter === 8217) ||
									(unicodeCounter === 8249) ||
									(unicodeCounter === 8250) ||
									(unicodeCounter === 8220) ||
									(unicodeCounter === 8221) ||
									(unicodeCounter === 147) ||
									(unicodeCounter === 148) ||
									(unicodeCounter === 145) ||
									(unicodeCounter === 146) ||
									(unicodeCounter === 174) ||
									(unicodeCounter === 175) ||
									(unicodeCounter === 45) ||
									(unicodeCounter === 40) ||
									(unicodeCounter === 34) ||
									(unicodeCounter === 44) ||
									(unicodeCounter === 46) ||
									(unicodeCounter === 58)
								) {
							*/
							if (
								((unicodeCounter < 64) || (unicodeCounter > 91))
								&&
								((unicodeCounter < 47) || (unicodeCounter > 58)) // Not digit
								) {
							// If a words first character is a . (period), example .PPT or .DDT, the period canno´t be converted to lower-case but the CloseTagIndex shall be increased so that the </abbr> is places correctly.

								closeTagIndex = closeTagIndex + 1;

							} else if ((unicodeCounter > 64) && (unicodeCounter < 91)) {
								var newUnicodeLetter = unicodeCounter + 32; // The Unicode value is increased to point at the lowercase character.

								lettersToReplace[p] = String.fromCharCode(newUnicodeLetter);
								// The new lowercase character is inserded into the original string

								closeTagIndex = closeTagIndex + 1;

							}  // END unicodeCounter test that converts uppercase to lowercase.

					} // END lettersToReplace loop

					lettersToReplace.splice(closeTagIndex,0,"</abbr>");
					// When the whole word is tested/replaced then the </abbr> is inserted.

					currentStringArray[wordIndex] = currentStringArray[wordIndex] + lettersToReplace.join('');
					// The new all-lowercase word is inserted into the original array.

				} // END capsIndex loop

				foundObjects[a].innerHTML=currentStringArray.join(' ');
				// The original array is converted to a string and that string is inserted into the DOM.

			} // END foundObjects = null test
		} // END foundObjects for-loop
	} // END findAbbrevations function

charReplacements();
findAbbrevations();

}; // END VARIABLE

// Toggle function for debug mode
function toggleTypesetterDebug() {
	TYPESETTER_DEBUG = !TYPESETTER_DEBUG;

	// Clear all existing transformations
	$('.display').find('*').each(function() {
		if ($(this).hasClass('typo')) {
			// Store original if not already stored
			if (!$(this).data('original-html')) {
				// Try to get from the corresponding .original section
				var originalText = $(this).closest('.section').find('.original p').html();
				if (!originalText) {
					originalText = $(this).closest('.language-section').find('.original p').html();
				}
				if (originalText) {
					// Extract just the text after "Original:" or "Transformed:"
					originalText = originalText.replace(/<strong>.*?<\/strong>\s*/, '');
					$(this).data('original-html', originalText);
				}
			}

			// Restore original
			var original = $(this).data('original-html');
			if (original) {
				$(this).html(original);
			}
		}
	});

	// Reapply transformations with new debug state
	smallcapsReplacement();

	// Update button text
	$('#debug-toggle').text(TYPESETTER_DEBUG ? 'Debug Mode: ON' : 'Debug Mode: OFF');
	$('#debug-toggle').css('background-color', TYPESETTER_DEBUG ? '#4caf50' : '#f44336');

	// Show/hide legend
	if (TYPESETTER_DEBUG) {
		$('#debug-legend').show();
	} else {
		$('#debug-legend').hide();
	}
}
