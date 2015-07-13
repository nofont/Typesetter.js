/*
Known bugs
- " inside a html tag gets replaced. See code-example on http://www.opentypography.org
*/  
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
		‘ = &#8216;
		’ = &#8217;
		“ = &#8220;
		” = &#8221;
		*/
		
		// String.fromCharCode(newUnicodeLetter); 

		var doubleQuoteCharClose = "&#8221;";
		var doubleQuoteCharOpen = "&#8220;";
		var singleQuoteCharClose = "&#8217;";
		var singleQuoteCharOpen = "&#8216;";
		var triggerID = "#display";
		var numeralClass = "num"
		
		// END SETTINGS
	  		
  		$(triggerID).each(function() {
  		
        	$(this).find('*').each(function() {
        	        	
   			    if (($(this).html()) != 0) {
   			    
   			    	if (($(this).find('img').length) === 0) { // Finds any element that is not an <img>
   			    
		  	    		$(this).html( $(this).html().replace(/(\.\.\.(\.)?)|(\.\s\.\s(\.\s)?|(\.\.(\.)?))/g, "&#8230;")); // Finds and replaces .. | ... | ....
		  	    		$(this).html( $(this).html().replace(/fl/g, "&#xFB02;")); // Replaces fl with ligature
		  	    		$(this).html( $(this).html().replace(/fi/g, "&#xFB01;")); // Replaces fi with ligature
			    		$(this).html( $(this).html().replace(/\s-\s/g, " &#8210; ")); // Replaces | space | en-dash | space | with | space | em-dash | space |
			    		$(this).html( $(this).html().replace(/"([\s\.\,])/g, doubleQuoteCharClose + "$1")); // Replaces | " | space | with | » | space |
			    		$(this).html( $(this).html().replace(/\s"/g, " " +  doubleQuoteCharOpen)); // Replaces | space | " | with | space | « |
			    		$(this).html( $(this).html().replace(/'([\s\.\,])/g, singleQuoteCharClose + "$1")); // Replaces | " | space | with | » | space |
			    		$(this).html( $(this).html().replace(/\s'/g, " " +  singleQuoteCharOpen)); // Replaces | space | " | with | space | « |

			    		$(this).html( $(this).html().replace(/(\d+)(?=((?!<\/a>).)*(<a|$))/g, '<'+numeralClass+'>$1</'+numeralClass+'>')); // wraps digits in <num>-tag but ignors digits within a <a>-tag. Read full explanation here http://www.phpbuilder.com/board/archive/index.php/t-10221442.html

   	     	    		if ( (($(this).children().length) === 0) || ($('this:contains("u00a9")')) ) {
   			    		   	$(this).html( $(this).html().replace(/\u00a9/g, "<sup class=\"sup\">&copy;</sup>") ); // Superscripts (c)
   			    			$(this).html( $(this).html().replace(/\u00ae/g, "<sup class=\"sup\">&reg;</sup>") ); // Superscripts (R)
			    		};
			    	};
   			    };
    		});

		});

 }; // END REPLACEMENT INDIVIDUAL characterS
 

/***********************

TYPESETTER.JS

Current version 0.3.5 

Updated 2012-02-01 by Andreas Carlsson.

Ideas:
Need to rewrite the testing logics so that it checks if the first character is NOT a lowercase and then if the second is an uppercase.

Known bugs
- Words ending with . : ; , gets an <abbr> around the first character.

Changes in 0.3.5:
- Cleaned up the code
- Translated comments
- Merged Individual character replacement and Typesetter.js into one file.

Changes in 0.3:
- Removed all jQuery and switched back to pure javascript.
- Cleaned up comments and optional code.
- Added exceptions to deal with bug that places empty <abbr> before single & - – between words. 
- Added support for words like ".PPT"

Fixed in 0.2:
- En-teckens ord som inleder en mening sätta som < abbr > trots att det inte skall vara det.
- Inline html i textfilerna strippas av typography.js scriptet. T.ex. försvinner allt efter < cite > i em mening.

Changes in 0.2:
- Switched the find classes function to jQuery
- Switched the find insert html at the end to jQuery

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
							console.log('Testing: '+currentWord);
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
										‘ = &#8216;
										’ = &#8217;
										“ = &#8220;
										” = &#8221;
										*/
									
									if ( 	(unicodeValue === 8217) || // Special charachter Apotstrophe test
											(unicodeValue === 8249) ||
											(unicodeValue === 8250) ||
											(unicodeValue === 8220) ||
											(unicodeValue === 8221) ||
											(unicodeValue === 147) ||
											(unicodeValue === 148) ||
											(unicodeValue === 145) ||
											(unicodeValue === 146) ||
											(unicodeValue === 174) ||
											(unicodeValue === 175) ||
											(unicodeValue === 45) ||
											(unicodeValue === 40) || 
											(unicodeValue === 34) || 
											(unicodeValue === 44) || 
											(unicodeValue === 46) || 
											(unicodeValue === 58) 
										) { // APOSTROPHE-TEST This is a test/exception that is made if the word that is being tested contains all uppercase letters AND an apostrophe or hyphen or such. If it does then it shall be treated like a "all-caps"-word. If the word contains all caps and apostrophe/hyphen BUT ends with lowercase letters then the word shall not be treated as an "all-caps"-word. This is a decision made by me cos there are no good/clear rules in typography on how to handle such words.
									// 8217 = Apostrophe
									// 45 = en-dash
									// 58 = colon
									// 46 = period
									// 40 = paranthesis
									// 34 = double quotationmark
									// 44 = single quotationmark
									// 147 = left double quotation mark “
									// 148 = right double quotation mark ”
									// 145 = left single quotation mark ‘
									// 146 = right single quotation mark 
									// 174 = «
									// 175 = »
										
										console.log(currentLetter+ ' har unicodeValue: '+ unicodeValue +' skall räknas som versal');
										//console.log('CapsIndex ökas i Apostrof-testet');
										
										upperCaseCounter++; // Increased every time a uppercase character is found.
									
									} else {
										if ((unicodeValue >= 33) == (unicodeValue <= 90)) {
										// If the unicode-value of currentLetter is within 65-90 then it is an uppercase letter or a diacrit. 
											console.log(currentLetter+ ' har unicodeValue: '+ unicodeValue +' och är en versal');
											upperCaseCounter++; // Increased every time a uppercase character is found.
										
										} // END If Unicode är inom Versal Value

									} // END APOSTROPH & UPPERCASE TEST 

									if ((lengthOfCurrentWord == upperCaseCounter) && (lengthOfCurrentWord > 1)) {
											
										// If the length of the word is equal to the count of uppercase letters then it's an uppercase abbrevation. Aphostrophes are included so that a word like API's is treated as an uppercase-abbrevation. 'lengthOfCurrentWord > 1' is used to avoid setting one letter "words" in small-caps.
												
										console.log('CapsIndex ökas för att det är ett versalt ord');
										capsIndex[y] = i; // capsIndex is assigned the index of the word that has been tested. When every word has been tested capsIndex contains indexes for all the words that shall be replaced.
										y++;
									}

							} // END CURRENTWORD LOOP 
					}  // END LOWERCASE TEST LOOP 
				// } // END SPECIAL CHAR TEST
			} // END CurrentString loop	
			
			console.log('Dessa ord skall ersättas: '+capsIndex);
			//debugger;
			var wordIndex = 0; // Is declared "globaly" so that it can be used outside the loop below.
			
			for (var z=0;z<capsIndex.length;z++) // Every all-uppercase word is "traversed" and every individual character is replaced.
			
				{	
					wordIndex = capsIndex[z]; // Index of the word to relpace 
					console.log('Replacing word with index: '+wordIndex);
					console.log('currentStringArray[wordIndex]: '+currentStringArray[wordIndex]);
					var wordToReplace = currentStringArray[wordIndex]; // The actual word from currentStringArray
					var lettersToReplace = new Array(); 
					// An array is created to contain every character from the word.
					lettersToReplace = wordToReplace.split(''); 
					// The array is filled with the characters
					
					currentStringArray[wordIndex] = '<abbr>'; 

					console.log('currentStringArray[wordIndex] efter <abbr>-addition: '+currentStringArray[wordIndex]);
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
							if ((unicodeCounter < 64) || (unicodeCounter > 91)) {
							// If a words first character is a . (period), example .PPT or .DDT, the period canno´t be converted to lower-case but the CloseTagIndex shall be increased so that the </abbr> is places correctly.
								console.log(theLetter+ ' har unicodeCounter: '+ unicodeCounter +' och skall räknas med för closeTagIndex men inte konverteras till gemen');

								closeTagIndex = closeTagIndex + 1;
							
							} else if ((unicodeCounter > 64) && (unicodeCounter < 91)) {
								var newUnicodeLetter = unicodeCounter + 32; // The Unicode value is increased to point at the lowercase character. 
													
								lettersToReplace[p] = String.fromCharCode(newUnicodeLetter); 
								// The new lowercase character is inserded into the original string
								
								console.log(theLetter+ ' har unicodeCounter: '+ unicodeCounter +' och skall konverteras till gemen');

								closeTagIndex = closeTagIndex + 1;
							
							}  // END unicodeCounter test that converts uppercase to lowercase. 
						
					} // END lettersToReplace loop
					
					lettersToReplace.splice(closeTagIndex,0,"</abbr>"); 
					// When the whole word is tested/replaced then the </abbr> is inserted.
					
					console.log('Inserting new string (lettersToReplace): '+lettersToReplace);

					currentStringArray[wordIndex] = currentStringArray[wordIndex] + lettersToReplace.join(''); 

					console.log('New currentStringArray[wordIndex] is: '+currentStringArray[wordIndex]);
					// The new all-lowercase word is inserted into the original array.
				} // END capsIndex loop 
				
				console.log('Will insert '+currentStringArray.join(' ')+' into: '+foundObjects[a].innerHTML);
				foundObjects[a].innerHTML=currentStringArray.join(' '); 
				// The original array is converted to a string and that string is inserted into the DOM.
				
			} // END foundObjects = null test
		} // END foundObjects for-loop
	} // END findAbbrevations function

charReplacements();
findAbbrevations();

}; // END VARIABLE

  		
	 