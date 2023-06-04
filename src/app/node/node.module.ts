import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import Konva from 'konva';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: 'Konva', useValue: Konva } // Provide Konva as a value for dependency injection
  ]
})
export class Node {
  private group!: Konva.Group;

  constructor() {}

  weiFormat(amount: string): string {
    const amountInWei = parseInt(amount);
    const amountInEther = amountInWei / 1e18; // Convert wei to ether
    const formattedAmount = amountInEther.toFixed(4); // Format as a decimal with 4 decimal places

    return formattedAmount;
  }

  create(from: string, to: string, amount: string, gasFee: string): Node {
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;

    const rectWidth = 160;
    const rectHeight = 80;
    const rectRadius = 10;

    const group = new Konva.Group({ draggable: true });

    const rect = new Konva.Rect({
      x: -rectWidth / 2,
      y: -rectHeight / 2,
      width: rectWidth,
      height: rectHeight,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
      cornerRadius: rectRadius,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 2 },
      shadowOpacity: 0.7,
    });

    const fromText = new Konva.Text({
      text: `From: ${from}`,
      fontSize: 12,
      fill: 'black',
      offsetY: -rectHeight / 2 + 10,
      align: 'center',
    });

    const toText = new Konva.Text({
      text: `To: ${to}`,
      fontSize: 12,
      fill: 'black',
      offsetY: -rectHeight / 2 + 30,
      align: 'center',
    });

    const amountText = new Konva.Text({
      text: `Amount: ${this.weiFormat(amount)} ETH`,
      fontSize: 12,
      fill: 'black',
      offsetY: -rectHeight / 2 + 50,
      align: 'center',
    });

    const gasFeeText = new Konva.Text({
      text: `Gas Fee: ${this.weiFormat(gasFee)} ETH`,
      fontSize: 12,
      fill: 'black',
      offsetY: -rectHeight / 2 + 70,
      align: 'center',
    });

    // Add event listeners for dragging
    rect.on('dragstart', () => {
      group.setDraggable(false); // Disable group dragging during rectangle dragging
    });

    rect.on('dragend', () => {
      group.setDraggable(true); // Enable group dragging after rectangle dragging ends
    });

    rect.on('dragmove', (event) => {
      const pos = event.target.getPosition();
      group.setPosition(pos);
    });

    group.add(rect, fromText, toText, amountText, gasFeeText);

    // Calculate random X and Y coordinates within the canvas boundaries
    const x = Math.random() * (stageWidth - rectWidth);
    const y = Math.random() * (stageHeight - rectHeight);

    group.position({ x, y });

    this.group = group;

    return this;
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  enableDragDrop() {
    this.group.on('dragstart', () => {
      this.group.moveToTop(); // Move the node to the top when dragging starts
    });
  }
}
