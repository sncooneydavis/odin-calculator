# Calculator Project

## Functionality 
- add
- subtract
- multiply
- divide 

Takes two numbers and an operator, which are passed to `operate()` for calculation when either 
1) equal sign is pressed, or
2) another second operator is pressed.
Displayed result is rounded, such that all digits can be contained on the display.

## File Structure
*`index.html`* contains HTML for calculator display structure
- display
- buttons: numbers (10), operators (4),`.`, `=`, `BACK/CLEAR`

| 1 | 2 | 3 | / |
| 4 | 5 | 6 | * |
| 7 | 8 | 9 | - |
| <-| 0 | . |+/=|

*`style.css`* contains CSS for calculator styling

*`script.js`* 
- links buttons to display
- links keyboard to display 
- links display to `operate()`   
- links `operate()` to display


