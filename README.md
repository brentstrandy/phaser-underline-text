# Phaser UnderlineText

## Features
- Keep all functionality of Phaser.Text object
- Add as many underlines as needed
- Works with variable font sizes
- Works with variable line spacing
- Works with word wrap

## Example
```
this.myTextObj = new UnderlineText(this.game, 84, 79, 'Hello World', { font: '18px Verdana', fill: '#000000' });
this.myTextObj.addUnderline(0, 4);

...

this.myTextObj.clearUnderlines();
this.myTextObj.addUnderline(10, 20);
this.myTextObj.addUnderline(22, 10);

```