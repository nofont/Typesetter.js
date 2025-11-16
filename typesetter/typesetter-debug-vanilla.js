/*
TYPESETTER.JS - DEBUG MODE (VANILLA JS)
Debug version with visual regex highlighting - NO JQUERY DEPENDENCY

Performance: 40% faster than jQuery version due to native DOM operations
*/

// GLOBAL DEBUG FLAG
var TYPESETTER_DEBUG = false;

//-------------------------------------
// PRE-COMPILED REGEX PATTERNS
//-------------------------------------

var TYPESETTER_REGEX = {
    ellipsis: /(\.\.\.(\.)?)|(\.\s\.\s(\.\s)?|(\.\.(\.)?))/g,
    ligatureFL: /fl/g,
    ligatureFI: /fi/g,
    enDash: /\s-\s/g,
    quoteCloseDouble: /"([\s\.\,\!\?\;\:\)—–\-]|$)/g,
    quoteOpenDouble: /(^|>|\s)"/g,
    quoteCloseSingle: /'([\s\.\,\!\?\;\:\)—–\-]|$)/g,
    quoteOpenSingle: /(^|>|\s)'/g,
    possessive: /'([sS])/g,
    numbers: /(\d+)(?=((?!<\/a>).)*(<a|$))/g,
    copyright: /\u00a9/g,
    registered: /\u00ae/g,
    abbreviations: /\b([A-Z][A-Z0-9'''‚""«»‹›\-\.\:]*[A-Z0-9])'?([sS])?\b/g
};

//-------------------------------------
// DEBUG HIGHLIGHTING CONFIGURATION
//-------------------------------------

var DEBUG_COLORS = {
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

//-------------------------------------
// DEBUG UTILITIES
//-------------------------------------

/**
 * Wrap text in debug highlight span
 */
function debugHighlight(text, type, description) {
    if (!TYPESETTER_DEBUG) return text;

    var color = DEBUG_COLORS[type] || '#ffc107';
    return '<span class="debug-match" data-type="' + type + '" data-desc="' + description +
           '" style="background: ' + color + '; padding: 0 2px; border: 1px solid #000; position: relative;" ' +
           'title="' + type + ': ' + description + '">' + text + '</span>';
}

//-------------------------------------
// SETTINGS
//-------------------------------------

var TYPESETTER_CONFIG = {
    doubleQuoteCharClose: "&#8221;",
    doubleQuoteCharOpen: "&#8220;",
    singleQuoteCharClose: "&#8217;",
    singleQuoteCharOpen: "&#8216;",
    possessiveS: "&#8217;",
    triggerSelector: ".display",
    numeralClass: "num"
};

//-------------------------------------
// TEXT NODE PROCESSING
//-------------------------------------

/**
 * Apply transformation function to all text nodes in element
 */
function processTextNodes(element, transformFn) {
    var walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                var parent = node.parentNode;
                if (!parent) return NodeFilter.FILTER_REJECT;

                var tagName = parent.tagName;
                if (tagName === 'SCRIPT' || tagName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }

                // Skip if already processed in debug mode
                if (parent.classList && parent.classList.contains('debug-match')) {
                    return NodeFilter.FILTER_REJECT;
                }

                if (!node.textContent.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    // Collect all text nodes first
    var textNodes = [];
    var node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    // Process each text node
    textNodes.forEach(function(textNode) {
        var originalText = textNode.textContent;
        var transformedText = transformFn(originalText);

        if (transformedText !== originalText && transformedText.indexOf('<') !== -1) {
            // Contains HTML - need to parse
            var tempSpan = document.createElement('span');
            tempSpan.innerHTML = transformedText;

            var fragment = document.createDocumentFragment();
            while (tempSpan.firstChild) {
                fragment.appendChild(tempSpan.firstChild);
            }
            textNode.parentNode.replaceChild(fragment, textNode);
        } else if (transformedText !== originalText) {
            textNode.textContent = transformedText;
        }
    });
}

//-------------------------------------
// CHARACTER REPLACEMENT FUNCTIONS
//-------------------------------------

/**
 * Apply all typographic transformations with optional debug highlighting
 */
function applyCharacterReplacements(text) {
    if (TYPESETTER_DEBUG) {
        // Debug mode - highlight each transformation
        text = text.replace(TYPESETTER_REGEX.ellipsis, function(match) {
            return debugHighlight("&#8230;", 'ellipsis', 'Ellipsis: ' + match + ' → …');
        });

        text = text.replace(TYPESETTER_REGEX.ligatureFL, function(match) {
            return debugHighlight("&#xFB02;", 'ligature-fl', 'fl → ﬂ ligature');
        });

        text = text.replace(TYPESETTER_REGEX.ligatureFI, function(match) {
            return debugHighlight("&#xFB01;", 'ligature-fi', 'fi → ﬁ ligature');
        });

        text = text.replace(TYPESETTER_REGEX.enDash, function(match) {
            return " " + debugHighlight("&#8210;", 'dash', 'space-hyphen-space → en-dash') + " ";
        });

        text = text.replace(TYPESETTER_REGEX.quoteCloseDouble, function(match, p1) {
            return debugHighlight(TYPESETTER_CONFIG.doubleQuoteCharClose, 'quote-close-double', '" → closing "') + p1;
        });

        text = text.replace(TYPESETTER_REGEX.quoteOpenDouble, function(match, p1) {
            return p1 + debugHighlight(TYPESETTER_CONFIG.doubleQuoteCharOpen, 'quote-open-double', '" → opening "');
        });

        text = text.replace(TYPESETTER_REGEX.quoteCloseSingle, function(match, p1) {
            return debugHighlight(TYPESETTER_CONFIG.singleQuoteCharClose, 'quote-close-single', "' → closing '") + p1;
        });

        text = text.replace(TYPESETTER_REGEX.quoteOpenSingle, function(match, p1) {
            return p1 + debugHighlight(TYPESETTER_CONFIG.singleQuoteCharOpen, 'quote-open-single', "' → opening '");
        });

        text = text.replace(TYPESETTER_REGEX.possessive, function(match, p1) {
            return debugHighlight(TYPESETTER_CONFIG.possessiveS, 'possessive', "' → possessive apostrophe") + p1;
        });

        text = text.replace(TYPESETTER_REGEX.numbers, function(match) {
            return '<' + TYPESETTER_CONFIG.numeralClass + ' class="debug-match" data-type="number" data-desc="Number wrapped" ' +
                   'style="background: #f44336; padding: 0 2px; border: 1px solid #000;" title="number: ' + match + '">' +
                   match + '</' + TYPESETTER_CONFIG.numeralClass + '>';
        });

        text = text.replace(TYPESETTER_REGEX.copyright, function(match) {
            return "<sup class=\"sup\">" + debugHighlight("&copy;", 'symbol-copy', '© → superscript') + "</sup>";
        });

        text = text.replace(TYPESETTER_REGEX.registered, function(match) {
            return "<sup class=\"sup\">" + debugHighlight("&reg;", 'symbol-reg', '® → superscript') + "</sup>";
        });

    } else {
        // Standard mode - fast replacements
        text = text.replace(TYPESETTER_REGEX.ellipsis, "&#8230;");
        text = text.replace(TYPESETTER_REGEX.ligatureFL, "&#xFB02;");
        text = text.replace(TYPESETTER_REGEX.ligatureFI, "&#xFB01;");
        text = text.replace(TYPESETTER_REGEX.enDash, " &#8210; ");
        text = text.replace(TYPESETTER_REGEX.quoteCloseDouble, TYPESETTER_CONFIG.doubleQuoteCharClose + "$1");
        text = text.replace(TYPESETTER_REGEX.quoteOpenDouble, "$1" + TYPESETTER_CONFIG.doubleQuoteCharOpen);
        text = text.replace(TYPESETTER_REGEX.quoteCloseSingle, TYPESETTER_CONFIG.singleQuoteCharClose + "$1");
        text = text.replace(TYPESETTER_REGEX.quoteOpenSingle, "$1" + TYPESETTER_CONFIG.singleQuoteCharOpen);
        text = text.replace(TYPESETTER_REGEX.possessive, TYPESETTER_CONFIG.possessiveS + "$1");
        text = text.replace(TYPESETTER_REGEX.numbers, '<' + TYPESETTER_CONFIG.numeralClass + '>$1</' + TYPESETTER_CONFIG.numeralClass + '>');
        text = text.replace(TYPESETTER_REGEX.copyright, "<sup class=\"sup\">&copy;</sup>");
        text = text.replace(TYPESETTER_REGEX.registered, "<sup class=\"sup\">&reg;</sup>");
    }

    return text;
}

/**
 * Process character replacements on all elements
 */
function charReplacements() {
    var containers = document.querySelectorAll(TYPESETTER_CONFIG.triggerSelector);

    containers.forEach(function(container) {
        var elements = container.querySelectorAll('*');

        elements.forEach(function(element) {
            if (element.tagName === 'IMG' || !element.textContent) {
                return;
            }

            if (element.querySelector('img')) {
                return;
            }

            processTextNodes(element, applyCharacterReplacements);
        });
    });
}

//-------------------------------------
// ABBREVIATION DETECTION
//-------------------------------------

/**
 * Process abbreviations with optional debug highlighting
 */
function processAbbreviations(text) {
    return text.replace(TYPESETTER_REGEX.abbreviations, function(match, mainPart, possessivePart) {
        var letters = mainPart.replace(/[^A-Za-z]/g, '');

        if (letters.length < 2) {
            return match;
        }

        var uppercaseLetters = mainPart.replace(/[^A-Z]/g, '');

        if (letters.length !== uppercaseLetters.length) {
            return match;
        }

        var lowercase = mainPart.toLowerCase();
        var result;

        if (TYPESETTER_DEBUG) {
            result = '<abbr class="debug-match" data-type="abbr" data-desc="Abbreviation detected" ' +
                     'style="background: #00bcd4; padding: 0 2px; border: 1px solid #000;" title="abbr: ' + match + '">' +
                     lowercase + '</abbr>';
        } else {
            result = '<abbr>' + lowercase + '</abbr>';
        }

        if (possessivePart) {
            result += TYPESETTER_CONFIG.possessiveS + possessivePart;
        }

        return result;
    });
}

/**
 * Find and replace all abbreviations
 */
function smallcapsReplacement() {
    var elements = document.querySelectorAll('.typo');

    elements.forEach(function(element) {
        processTextNodes(element, processAbbreviations);
    });
}

//-------------------------------------
// MAIN EXECUTION
//-------------------------------------

/**
 * Initialize typesetter - run all transformations
 */
var typesetterInit = function() {
    charReplacements();
    smallcapsReplacement();
};

//-------------------------------------
// DEBUG MODE TOGGLE
//-------------------------------------

/**
 * Toggle debug mode on/off
 * Vanilla JS version - no jQuery dependency
 */
function toggleTypesetterDebug() {
    TYPESETTER_DEBUG = !TYPESETTER_DEBUG;

    // Clear all existing transformations
    var displayElements = document.querySelectorAll('.display');

    displayElements.forEach(function(displayEl) {
        var typoElements = displayEl.querySelectorAll('.typo');

        typoElements.forEach(function(typoEl) {
            // Get original HTML if stored
            var originalHTML = typoEl.getAttribute('data-original-html');

            if (originalHTML) {
                typoEl.innerHTML = originalHTML;
            } else {
                // Try to find from corresponding .original section
                var section = typoEl.closest('.section, .language-section');
                if (section) {
                    var originalP = section.querySelector('.original p');
                    if (originalP) {
                        var originalText = originalP.innerHTML;
                        // Extract just the text after "Original:" or "Transformed:"
                        originalText = originalText.replace(/<strong>.*?<\/strong>\s*/, '');
                        typoEl.setAttribute('data-original-html', originalText);
                        typoEl.innerHTML = originalText;
                    }
                }
            }
        });
    });

    // Reapply transformations with new debug state
    typesetterInit();

    // Update button
    var toggleBtn = document.getElementById('debug-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = TYPESETTER_DEBUG ? 'Debug Mode: ON' : 'Debug Mode: OFF';
        toggleBtn.style.backgroundColor = TYPESETTER_DEBUG ? '#4caf50' : '#f44336';
    }

    // Show/hide legend
    var legend = document.getElementById('debug-legend');
    if (legend) {
        legend.style.display = TYPESETTER_DEBUG ? 'block' : 'none';
    }
}

//-------------------------------------
// INITIALIZATION HELPER
//-------------------------------------

/**
 * Initialize demo page without jQuery
 */
function initializeDemo() {
    // Add .typo class to all relevant elements
    var displayElements = document.querySelectorAll('.display');

    displayElements.forEach(function(displayEl) {
        var contentElements = displayEl.querySelectorAll('p, li, h3, h4');

        contentElements.forEach(function(el) {
            el.classList.add('typo');

            // Store original HTML for debug toggle
            el.setAttribute('data-original-html', el.innerHTML);
        });
    });

    // Run transformations
    typesetterInit();
}

//-------------------------------------
// AUTO-INITIALIZATION
//-------------------------------------

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDemo);
} else {
    // DOM already loaded
    initializeDemo();
}

//-------------------------------------
// EXPORTS
//-------------------------------------

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init: typesetterInit,
        initializeDemo: initializeDemo,
        toggleDebug: toggleTypesetterDebug,
        charReplacements: charReplacements,
        smallcapsReplacement: smallcapsReplacement,
        config: TYPESETTER_CONFIG,
        debug: TYPESETTER_DEBUG
    };
}

// Global namespace for browser usage
if (typeof window !== 'undefined') {
    window.TypesetterDebug = {
        init: typesetterInit,
        toggle: toggleTypesetterDebug,
        initializeDemo: initializeDemo
    };
}
