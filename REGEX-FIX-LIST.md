# TYPESETTER.JS REGEX FIX-LIST
**Comprehensive list of regex pattern issues and proposed fixes**

---

## CRITICAL ISSUES (High Priority)

### 1. ELLIPSIS REGEX - Line 45
**Current Pattern:** `/(\.\.\.(\.)?)|(\.\s\.\s(\.\s)?|(\.\.(\.)?))/g`

**Issues:**
- ❌ Does NOT match two dots only (`..`)
- ❌ Complex pattern is hard to maintain
- ✅ Does handle three or more dots
- ✅ Does handle spaced dots (`. . .`)

**Failing Cases:**
```
Wait.. No.. Stop..                    → NOT converted
Wait....                              → Converted (but to single ellipsis)
```

**Proposed Fix:**
```javascript
// Option 1: Simple - match 2 or more dots
/\.{2,}/g

// Option 2: More sophisticated - handle spaced dots too
/\.{2,}|(?:\.\s){2,}\./g
```

**Recommended:** Option 1 (simpler, covers most cases)

---

### 2. QUOTE AT PARAGRAPH START - Line 50
**Current Pattern:** `/\s"/g` (opening double quote)

**Issues:**
- ❌ Requires preceding space
- ❌ Won't match quote at very start of paragraph/text
- ❌ Won't match quote after opening tag like `<p>"Hello`

**Failing Cases:**
```
"Hello world" at start               → First " NOT converted to opening quote
<p>"Quote here"</p>                  → First " NOT converted to opening quote
```

**Proposed Fix:**
```javascript
// Match space OR start of string/tag
/(^|>|\s)"/g
// Replace with: $1 + openingQuote
```

---

### 3. QUOTE FOLLOWED BY PUNCTUATION - Line 49
**Current Pattern:** `/"([\s\.\,])/g` (closing double quote)

**Issues:**
- ❌ Only matches if followed by space, period, or comma
- ❌ Doesn't handle `"!`, `"?`, `";`, `":`, `")`, etc.

**Failing Cases:**
```
"Hello"! "Goodbye"?                  → Quotes NOT converted
"Maybe"; "Perhaps":                  → Quotes NOT converted
```

**Proposed Fix:**
```javascript
// Match space, punctuation, or end of string
/"([\s\.\,\!\?\;\:\)—–-]|$)/g
```

---

### 4. LIGATURES IN URLS - Lines 46-47
**Current Patterns:** `/fl/g` and `/fi/g`

**Issues:**
- ❌ Global replacement without context checking
- ❌ Replaces in URLs: `files.com` → `ﬁles.com` (broken!)
- ❌ Replaces in code/technical terms
- ❌ No word boundary checking

**Failing Cases:**
```
http://files.example.com             → Becomes http://ﬁles.example.com (BROKEN)
ftp://financial.org                  → Becomes ftp://ﬁnancial.org (BROKEN)
```

**Proposed Fix:**
```javascript
// Option 1: Negative lookahead to avoid URLs
/(?!https?:\/\/[^\s]*)\bfl/g
/(?!https?:\/\/[^\s]*)\bfi/g

// Option 2: Only match in word contexts (better)
/\b(\w*)(fl)(\w*)\b/g
// Then check if word contains :// or other URL indicators

// Option 3: Skip elements containing URLs (safest)
if (!$(this).text().match(/https?:\/\/|ftp:\/\//)) {
    // Apply ligature replacements
}
```

**Recommended:** Option 3 (safest, prevents all URL corruption)

---

### 5. NUMBERS IN DECIMALS - Line 55
**Current Pattern:** `/(\d+)(?=((?!<\/a>).)*(<a|$))/g`

**Issues:**
- ❌ Wraps each number sequence separately
- ❌ Decimals become: `<num>3</num>.<num>14</num>` instead of `<num>3.14</num>`
- ❌ Negative numbers: `<num>5</num>` instead of `<num>-5</num>`
- ✅ Does correctly avoid numbers in links

**Failing Cases:**
```
3.14                                 → <num>3</num>.<num>14</num>
-5 degrees                          → -<num>5</num>
192.168.1.1                         → <num>192</num>.<num>168</num>.<num>1</num>.<num>1</num>
```

**Proposed Fix:**
```javascript
// Match complete numbers including decimals and negatives
/(-?\d+(?:\.\d+)?)(?=((?!<\/a>).)*(<a|$))/g

// Explanation:
// -?           = optional minus sign
// \d+          = one or more digits
// (?:\.\d+)?   = optional decimal part (non-capturing group)
```

---

## MEDIUM PRIORITY ISSUES

### 6. CONTRACTIONS AT START - Line 52
**Current Pattern:** `/\s'/g` (opening single quote)

**Issues:**
- ❌ Requires preceding space
- ❌ Won't match contractions at text start: `'twas`, `'til`, `'cause`

**Failing Cases:**
```
'twas the night before               → Apostrophe NOT converted
'til we meet again                   → Apostrophe NOT converted
```

**Proposed Fix:**
```javascript
// Match space OR start, but use lookahead to distinguish from contractions
/(^|>|\s)'(?=[a-z])/gi
// This matches opening quote before a lowercase letter
```

---

### 7. ABBREVIATIONS ENDING WITH PUNCTUATION
**Location:** Lines 100-312 (findAbbrevations function)

**Issues:**
- ❌ Words ending with `.`, `:`, `;`, `,` get incorrect `<abbr>` wrapping
- ❌ Only first character gets wrapped: `HTML.` → `<abbr>h</abbr>TML.`
- ⚠️  Known bug mentioned in comments (line 78)

**Failing Cases:**
```
HTML. CSS: JSON;                     → Wrong wrapping on first char only
NASA. FBI: CIA;                      → Same issue
```

**Proposed Fix:**
```javascript
// In the word splitting logic, strip trailing punctuation first
var currentWord = currentStringArray[i];
var trailingPunc = '';

// Extract trailing punctuation
if (/[\.\,\:\;\!\?]$/.test(currentWord)) {
    trailingPunc = currentWord.slice(-1);
    currentWord = currentWord.slice(0, -1);
}

// ... do all-caps test on cleaned word ...

// ... then re-add trailing punctuation after </abbr> tag
```

---

### 8. ABBREVIATIONS WITH PERIODS
**Issues:**
- ❌ `U.S.A.` gets split by spaces into `U.S.A.` (each period breaks it)
- ❌ `Ph.D.`, `M.D.`, etc. not recognized as abbreviations

**Failing Cases:**
```
U.S.A.                               → Not recognized as abbreviation
Ph.D. M.D. B.A.                     → Not recognized
```

**Proposed Fix:**
```javascript
// Pre-process to identify dotted abbreviations
// Before the main loop, find patterns like:
/\b([A-Z]\.){2,}/g  // Matches U.S.A., Ph.D., etc.

// Then wrap these separately with <abbr> tag
// OR modify the splitting to treat periods between caps as special
```

---

### 9. EMPTY QUOTES
**Current Patterns:** Lines 49-52

**Issues:**
- ⚠️  `""` and `''` create mismatched opening/closing quotes
- Not really a failure, but unexpected behavior

**Failing Cases:**
```
He said ""                           → Might create "" or ""
```

**Proposed Fix:**
```javascript
// Add special case to skip empty quotes
if ($(this).html().match(/[""'']{2}/)) {
    // Don't process empty quote pairs
}
```

---

## LOW PRIORITY ISSUES

### 10. MULTIPLE CONSECUTIVE QUOTES
**Issues:**
- ⚠️  `"""` or `'''` creates unpredictable results
- Edge case, rarely occurs in real text

**Failing Cases:**
```
He said ""urgent""                   → Unpredictable output
```

**Proposed Fix:**
```javascript
// Normalize multiple quotes first
.replace(/"{2,}/g, '"')  // Reduce multiple to single
.replace(/'{2,}/g, "'")  // Before other replacements
```

---

### 11. DASH AT START/END OF TEXT - Line 48
**Current Pattern:** `/\s-\s/g`

**Issues:**
- ❌ Won't match `- beginning` or `end -`
- ❌ Only matches if BOTH sides have spaces

**Failing Cases:**
```
- beginning and end -                → Dashes NOT converted
```

**Proposed Fix:**
```javascript
// Match space or word boundary on either side
/(^|\s)-(\s|$)/g
```

---

### 12. SYMBOLS - TRADEMARK NOT SUPPORTED - Lines 58-59
**Current Patterns:** `/\u00a9/g` and `/\u00ae/g`

**Issues:**
- ❌ Only handles © and ®
- ❌ Doesn't handle ™ (trademark) or ℠ (service mark)

**Failing Cases:**
```
Product™ Service℠                    → Not superscripted
```

**Proposed Fix:**
```javascript
// Add patterns for other symbols
$(this).html( $(this).html().replace(/\u2122/g, "<sup class=\"sup\">&trade;</sup>") );  // ™
$(this).html( $(this).html().replace(/\u2120/g, "<sup class=\"sup\">&#8480;</sup>") );  // ℠
```

---

## EDGE CASES TO CONSIDER

### 13. MIXED CASE LIGATURES
**Issues:**
- Current patterns only catch lowercase `fl` and `fi`
- `Fl`, `Fi`, `FL`, `FI` are not handled

**Should They Be Fixed?**
- Uppercase ligatures (FL, FI) should NOT be converted (correct behavior)
- Mixed case (Fl, Fi) is debatable - typically don't ligate at word start

**Recommendation:** No fix needed (current behavior is correct)

---

### 14. APOSTROPHES IN MIDDLE OF WORDS
**Current Pattern:** `/'([sS])/g` (possessive)

**Issues:**
- ✅ Handles possessive s correctly
- ❌ Doesn't handle other contractions: `can't`, `won't`, `don't`
- But this might be intentional (only convert possessives?)

**Failing Cases:**
```
rock'n'roll                          → Middle apostrophe not converted
o'clock                              → Apostrophe not converted
```

**Proposed Fix (if desired):**
```javascript
// Convert all apostrophes in word contexts
/(\w)'(\w)/g
// But this might be too aggressive
```

**Recommendation:** Keep as-is if only possessives should be converted

---

## REGEX EXECUTION ORDER ISSUES

### 15. ORDER MATTERS
**Current Order:**
1. Ellipsis
2. Ligatures
3. Dashes
4. Quote closing (double)
5. Quote opening (double)
6. Quote closing (single)
7. Quote opening (single)
8. Possessive
9. Numbers
10. Symbols

**Potential Issues:**
- Quote replacements might interfere with each other
- Numbers should probably run before quotes (to avoid matching inside `<num>` tags)

**Proposed Fix:**
```javascript
// Reorder for safety:
// 1. Numbers (creates structure)
// 2. Ellipsis (simple)
// 3. Dashes (simple)
// 4. Possessive (before other quotes)
// 5. Quote closing
// 6. Quote opening
// 7. Ligatures (last, as they're most likely to cause issues)
// 8. Symbols (last)
```

---

## SUMMARY

### Critical Fixes Needed:
1. ✅ **Ellipsis** - Add support for two dots
2. ✅ **Quotes at paragraph start** - Handle start of text
3. ✅ **Quotes before punctuation** - Expand character class
4. ✅ **Ligatures in URLs** - Skip URL-containing elements
5. ✅ **Decimal numbers** - Match as complete units

### Important Fixes:
6. ✅ **Contractions at start** - Handle `'twas`, `'til`
7. ✅ **Abbreviations with punctuation** - Strip trailing punctuation
8. ✅ **Dotted abbreviations** - Handle `U.S.A.`, `Ph.D.`

### Nice-to-Have:
9. ⚠️  Empty quotes handling
10. ⚠️  Multiple consecutive quotes
11. ⚠️  Dashes at boundaries
12. ⚠️  Trademark symbols

### Working Correctly:
- Possessive apostrophes ✓
- Numbers avoiding links ✓
- Basic quotes (with spaces) ✓
- Basic ligatures (in plain text) ✓

---

## TESTING STRATEGY

For each fix, test against:
1. Basic case (should match)
2. Edge case (should/shouldn't match)
3. False positive case (should NOT match)
4. Combined with other transformations

Example for decimal fix:
```
✓ 3.14 → <num>3.14</num>
✓ -3.14 → <num>-3.14</num>
✓ 192.168.1.1 → <num>192.168.1.1</num>
✗ http://example.com → should NOT add <num> tags
```

---

## IMPLEMENTATION NOTES

1. **Backup Original Code** - Keep original regex patterns in comments
2. **Test One Fix at a Time** - Don't change multiple patterns simultaneously
3. **Use Debug Mode** - Visual feedback helps verify fixes
4. **Document Changes** - Add comments explaining what each fix addresses
5. **Consider Performance** - More complex regex = slower execution

---

Generated: 2024-11-16
For: Typesetter.js (OpenTypography project)
Based on: Comprehensive edge case testing in demo.html
