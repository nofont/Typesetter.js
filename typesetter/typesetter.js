/*
Known bugs
- " inside a html tag gets replaced. See code-example on http://www.opentypography.org
*/  
    //-------------------------------------
    // REPLACEMENT OF INDIVIDUAL CHARACHTERS
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
		
		var quoteCharClose = "&raquo;";
		var quoteCharOpen = "&laquo;";
		var triggerID = "#display";
		var smallcapsClass = "num"
		
		// END SETTINGS
	  		
  		$(triggerID).each(function() {
  		
        	$(this).find('*').each(function() {
        	        	
   			    if (($(this).html()) != 0) {
   			    
   			    	if (($(this).find('img').length) === 0) { // Finds any element that is not an <img>
   			    
		  	    		$(this).html( $(this).html().replace(/(\.\.\.(\.)?)|(\.\s\.\s(\.\s)?|(\.\.(\.)?))/g, "&#8230;")); // Finds and replaces .. | ... | ....
		  	    		$(this).html( $(this).html().replace(/fl/g, "&#xFB02;")); // Replaces fl with ligature
		  	    		$(this).html( $(this).html().replace(/fi/g, "&#xFB01;")); // Replaces fi with ligature
			    		$(this).html( $(this).html().replace(/\s-\s/g, " &#8210; ")); // Replaces | space | en-dash | space | with | space | em-dash | space |
			    		$(this).html( $(this).html().replace(/"([\s\.\,])/g, quoteCharClose + "$1")); // Replaces | " | space | with | » | space |
			    		$(this).html( $(this).html().replace(/\s"/g, " " +  quoteCharOpen)); // Replaces | space | " | with | space | « |
			    		
			    		$(this).html( $(this).html().replace(/(\d+)(?=((?!<\/a>).)*(<a|$))/g, '<' + smallcapsClass + '>$1</span>')); // wraps digits in <smallcaps>-tag but ignors digits within a <a>-tag. Read full explanation here http://www.phpbuilder.com/board/archive/index.php/t-10221442.html
			    		
   	     	    		if ( (($(this).children().length) === 0) || ($('this:contains("u00a9")')) ) {
   			    		   	$(this).html( $(this).html().replace(/\u00a9/g, "<sup class=\"sup\">&copy;</sup>") ); // Superscripts (c)
   			    			$(this).html( $(this).html().replace(/\u00ae/g, "<sup class=\"sup\">&reg;</sup>") ); // Superscripts (R)
			    		};
			    	};
   			    };
    		});

		});

 }; // END REPLACEMENT INDIVIDUAL CHARACHTERS
 

/***********************

TYPESETTER.JS

Current version 0.3.5 

Updated 2012-02-01 by Andreas Carlsson.

Ideas:
Need to rewrite the testing logics so that it checks if the first charachter is NOT a lowercase and then if the second is an uppercase.

Known bugs
- Words ending with . : ; , gets an <abbr> around the first character.

Changes in 0.3.5:
- Cleaned up the code
- Translated comments
- Merged Individual charachter replacement and Typesetter.js into one file.

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
	  	
	function replaceTypo() {
	
	foundObjects = getElementsByClass(document,'typo','*'); // Gets all the elements with the "typo"-class
	
	for (var a=0;a<foundObjects.length;a++) // Loops typo-objects
	{
			
		if (foundObjects[a] != null) { // Check if current "typo"-object is empty (contains an image for example). If null the loop moves on to the next object.
		
			var textObjects = foundObjects[a].innerHTML; // Assigns textObjects the string from foundObjects[a]
			var y=0; // Counter that is used to count every uppercase wod that is found.
			var capsIndex = new Array();
	
			var currentStringArray = new Array(); 
			currentStringArray = textObjects.split(' '); // Array filled with all the words from the textObjects string.
			
			for (var i=0;i<currentStringArray.length;i++) // Loops through every word in currentStringArray.
			{  
				var upperCaseCounter = 0; // Counter that is increased every time currentLetter is uppercase. If currentWord.length = upperCaseCounter then the word is all uppercase and the index of the word shall be stored in capsIndex.
				var currentWord = currentStringArray[i]; // The word that is going to be tested for "all-caps" is assigned to currentWord.
				var lastCharTester = (currentWord.length)-1; // lastCharTester is assigned the last charachter of currentWord. This is used o test if the last charachter is ≠ uppercase
				var lowercaseTester = currentWord.charAt(0);
				
				if (currentWord.charCodeAt(lastCharTester) == 58) { // If last charachter is a colon then do nothing.
				}
				
				if ((lowercaseTester.charCodeAt(0) < 47) && (lowercaseTester.charCodeAt(0) != 46))  { // SPECIAL CHARACHTER TEST that checks if the first letter in the word is a space - " or such AND if it's not a period. If TRUE then the "all caps"-test is not run. This is to avoid that a <abbr>-tag is wrapped around quotes or a hyphenated word. If this test was not performed there would be a lot of useless/unclean markup, plus that it would messup the charReplacements-function.
					} else {
				
				if /* ( */ ((lowercaseTester.charCodeAt(0) < 97) || (lowercaseTester.charCodeAt(0) > 122)) /* && (currentWord.charCodeAt(lastCharTester) != 46) ) */ { // LOWERCASETEST - if the first charachter in the word is not within lowercase ASCII-value range or a "space" AND the last charachter is not a : then the test below sshal be run.
				
					// TO-DO! Is it possible to build an "inArray"-function/check that checks every exception; words that has . - space as the first charachter and words that has . : ; , and such as the last charachter?.
				
					// IMPORTANT! Add && (currentWord.charCodeAt(lastCharTester) != 46) in the above and find uout why words ending with . or :  gets an <abbr>-tag wrapped around its first charachter.
					
					for (var x=0;x<currentWord.length;x++) // CURRENTWORD LOOP loop through every letter in currentWord
					{
							var currentLetter = currentWord.charAt(x); // currentLetter is assigned the individual letter that is going to be checked is uppercase.
							var lengthOfCurrentWord = currentWord.length; // lengthOfCurrentLetter is assigned the charachter count of the current word so that we can check if count of letters is equal to the count of uppercase letters. If equal then we have a "all caps" word :-)
							
							var unicodeValue = currentLetter.charCodeAt(0); // unicodeValue is assigned the decimal ASCII value of the individual unicode-charachter that is stored in currentLetter. 
							
							if ((unicodeValue == 8217) || (unicodeValue == 45) || (unicodeValue == 58)) { // APOSTROPHE-TEST This is a test/exception that is made if the word that is beeing tested contains all uppercase letters AND an apostrophe or huphen or such. If it does then it shall be traeted like a "all-caps"-word. If the word contains all caps and apostrophe/huphen BUT ands with lowercase letters then the word shall not be treated as an "all-caps"-word. This is a decision made by me cos there are no good/clear rules in typography on how to handle such words.
							// 8217 = Apostrophe
							// 45 = en-dash
							// 58 = colon
							
								capsIndex[y] = i; // capsIndex is assigned the array-index of the word that is beeing tested.
								y++;
		
							} else {
								if ((unicodeValue >= 33) == (unicodeValue <= 90)) // If the unicode-value of currentLetter is within 65-90 then it is an uppercase letter or a diacrit.
								{
									upperCaseCounter++; // Increased every time a uppercase carachter is found.
								
									if ((lengthOfCurrentWord == upperCaseCounter) && (lengthOfCurrentWord > 1)) 
									
									// If the length of the word is equal to the count of uppercase letters then it's an uppercase abbrevation. Aphostrophes are included so that a word like API's is treated as an uppercase-abbrevation. 'lengthOfCurrentWord > 1' is used to avoid setting one letter "words" in small-caps.
									
										{
											capsIndex[y] = i; // capsIndex is assigned the index of the word that has been tested. When every word has been tested capsIndex contains indexes for all the words that shall be replaced.
											y++;
										}
								} // END If Unicode är inom Versal Value
							} // END APOSTROPH-TEST
					} // END CURRENTWORD LOOP 
				}  // END LOWECASE TEST LOOP 
				} // END SPECIAL CHAR TEST
			} // END CurrentString loop	
			
			var wordIndex = 0; // Is declared "globaly" so that it can be used outside the loop below.
			
			for (var z=0;z<capsIndex.length;z++) // Every all-uppercase word is "traversed" and every individual charachter is replaced.
			
				{	
					wordIndex = capsIndex[z]; // Index of the word to relace 
					var wordToReplace = currentStringArray[wordIndex]; // The actual word from currentStringArray
					var lettersToReplace = new Array(); 
					// An array is created to contain every carachter from the word.
					lettersToReplace = wordToReplace.split(''); 
					// The array is filled with the characters
					
					currentStringArray[wordIndex] = '<abbr>'; 
					// An <abbr> tag is inserted before the word that is about to get replaced. Once the replacement is completed an </abbr> tag is inserted after the word.
					
					var closeTagIndex = 0; 
					// This variable is used to keep track of where in the word the last uppercase character is so that the </abbr> tag is inserted at the correct place.
					
					for (var p=0;p<lettersToReplace.length;p++) // Loops each individual character
					{
						var theLetter = lettersToReplace[p]; // theLetter is assigned the character that shall be replaced
						var unicodeCounter = theLetter.charCodeAt(0); // unicodeCounter is assigned the unicode-value of the character beeing replaced.
						// DDT:er   68 68 84 58 101 114
						// .DDT   46 68 68 84
						
							if (unicodeCounter === 46) { 
							// If a words first character is a . (period), example .PPT or .DDT, the period canno´t be converted to lower-case but the CloseTagIndex shall be increased so that the </abbr> is places correctly.
							
								closeTagIndex = closeTagIndex + 1;
							
							} else if ((unicodeCounter > 64) && (unicodeCounter < 91)) {
								var newUnicodeLetter = unicodeCounter + 32; // The Unicode value is increased to point at the lowercase charachter. 
													
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
	
		if (((foundObjects.length)-1)==(a+1)) { 
		// When all ".typo"-objects are tested we are calling the charReplacements-function that checks and replaces special-charachters.
		charReplacements();
			}
		} // END foundObjects for-loop
	} // END replaceTypo function

replaceTypo();

}; // END VARIABLE

  		
	 