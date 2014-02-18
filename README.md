jquery.monoscroll
=================

Use the browser scrollbar to control the scroll position of some random element.


## Installation

`bower install jquery.monoscroll`


## Usage

1. Make your page container `position: fixed`
2. Call `$('.myel').monoscroll()` and the browser scrollbar will controll the
   scroll position of the ".myel" element.
3. Call `$('.myel').monoscroll('release')` to release the element. Or call
   `monoscroll` on another element.

See the examples folder for an example.


Note: Make sure your document contains a valid DOCTYPE!
