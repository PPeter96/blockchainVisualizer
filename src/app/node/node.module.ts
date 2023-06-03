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
  private group: Konva.Group;

  constructor() {
    this.group = new Konva.Group();

    // ... rest of the code
  }

  weiFormat(amount: string): string{

    const amountInWei = parseInt(amount);
    const amountInEther = amountInWei / 1e18; // Convert wei to ether
    const formattedAmount = amountInEther.toFixed(4); // Format as a decimal with 4 decimal places

    return formattedAmount;
  }

  create(from: string, to: string, amount: string, gasFee: string): Node {
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;


    const fromText = new Konva.Text({
      text: `From: ${from}`,
      fontSize: 12,
      fill: 'black',
      offsetY: -20,
    });

    const toText = new Konva.Text({
      text: `To: ${to}`,
      fontSize: 12,
      fill: 'black',
      offsetY: -10,
    });

    const amountText = new Konva.Text({
      text: `Amount: ${this.weiFormat(amount)} ETH`,
      fontSize: 12,
      fill: 'black',
      offsetY: 0,
    });

    const gasFeeText = new Konva.Text({
      text: `Gas Fee: ${this.weiFormat(gasFee)} ETH`,
      fontSize: 12,
      fill: 'black',
      offsetY: 10,
    });

      // Calculate random X and Y coordinates within the canvas boundaries
  const x = Math.random() * (stageWidth - 100); // Adjust the range and offset as needed
  const y = Math.random() * (stageHeight - 100); // Adjust the range and offset as needed

  this.group.position({ x, y });
  this.group.add(fromText, toText, amountText, gasFeeText);

    return this;
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
