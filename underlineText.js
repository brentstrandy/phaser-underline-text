/**
* @author       Brent Strandy <brent@teaching.com>
* @copyright    2017 Teaching.com
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

import Phaser from 'phaser';

class UnderlineText extends Phaser.Text {
  constructor(game, x, y, text, style) {
    super(game, x, y, text, style);

    this.parentGroup = this.game.add.group();
    // Break apart each line into its own string to construct underlines that wrap text lines
    this.wordWraps = this.precalculateWordWrap(this.text);
    this.underlines = [];

    game.add.existing(this);
  }

  /**
   * Draws an underline between the start and end indexes of the text
   * @param {Number} startIndex - starting index to begin underline (inclusive)
   * @param {Number} endIndex - ending index to stop underline (inclusive)
   */
  addUnderline(startIndex, endIndex) {
    // Loop through each word wrap and create an underline where needed
    this.wordWraps.forEach((element, i) => {
      let lineStartIndex = this.getWrapStartingIndex(i);
      let lineEndIndex = lineStartIndex + element.length;

      // Underline starts somewhere within the line of text
      if(startIndex >= lineStartIndex && startIndex <= lineEndIndex) {
        this.drawUnderline(element, startIndex - lineStartIndex, endIndex, i);
      }
      // Underline ends somewhere within the line of text
      else if(endIndex > lineStartIndex && endIndex <= lineEndIndex) {
        this.drawUnderline(element, 0, endIndex - lineStartIndex, i);
      }
      // Underline spans the entire length of the line of text
      else if(startIndex <= lineStartIndex && endIndex >= lineEndIndex) {
        this.drawUnderline(element, 0, element.length, i);
      }
    });
  }

  /**
   * Creates an underline within the text based on the indexes provided
   * @param {string} textString - full line of text where the underline resides
   * @param {Number} startIndex - starting index within the textString to being underlining
   * @param {Number} endIndex - ending index within the textString to end underlining
   * @param {Number} wrapLineIndex - the wrapped line where the textString is found
   */
  drawUnderline(textString, startIndex, endIndex, wrapLineIndex) {
    // FYI - substring does not include the endIndex character
    let underlineText = textString.substring(startIndex, Math.min(endIndex, textString.length));
    let underlineDimensions = this.getTextDimensions(underlineText);
    let startOffsetX = this.getTextDimensions(textString.substring(0, startIndex)).width;
    let startOffsetY = (underlineDimensions.height * 0.8) + ((underlineDimensions.height + this.lineSpacing) * (wrapLineIndex));

    let obj = this.game.add.graphics(startOffsetX, startOffsetY);//this.position.x + startOffsetX, this.position.y + startOffsetY);
    obj.lineStyle(2, 0xE21838);
    obj.moveTo(0, 0);
    obj.lineTo(underlineDimensions.width, 0);
    this.underlines.push(obj);
    this.addChild(obj);
  }

  /**
   * Remove all underlines currently being displayed
   */
  clearUnderlines() {
    this.underlines.forEach((element) => { element.destroy() });
    this.underlines = [];
  }

  /**
   * Uses the current text's font and size to determine the pixel width of the string being passed
   * @return {Object} - {width, height} dimensions representing the text's width and height
   */
  getTextDimensions(text) {
    // Temporarily disable word wrap or you *might* get a string that wraps (doubling the height)
    this.wordWrap = false;
    let origText = this.text;
    this.text = text;
    let width = this.width;
    let height = this.height;
    this.text = origText;
    this.wordWrap = true;

    return { width, height };
  }

  /**
   * Gets the wrapped line's index in relation to the whole string
   * @return {Number} index within main string
   */
  getWrapStartingIndex(wrapIndex) {
    let index = 0;

    for(let i = 0; i < wrapIndex; i++)
      index = index + this.wordWraps[i].length;

    return index;
  }

  destroy() {
    super.destroy();

    this.clearUnderlines();
  }
}

export default UnderlineText;
