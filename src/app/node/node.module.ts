import Konva from 'konva';

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
    const rectPadding = 5; // Set the desired padding for the text within the rectangle

    const textContent = `From: ${from}\nTo: ${to}\nAmount: ${this.weiFormat(amount)} ETH\nGas Fee: ${this.weiFormat(gasFee)} ETH`;

    // Create a temporary text node to measure dimensions
    const tempText = new Konva.Text({
      fontSize: 12,
      lineHeight: 1.2,
      text: textContent,
    });

    const textWidth = tempText.getWidth();
    const textHeight = tempText.getHeight();

    tempText.destroy(); // Clean up temporary text node

    const rectWidth = textWidth + 2 * rectPadding;
    const rectHeight = textHeight + 2 * rectPadding;

    const group = new Konva.Group({ draggable: true });

    const rect = new Konva.Rect({
      x: -rectWidth / 2,
      y: -rectHeight / 2,
      width: rectWidth,
      height: rectHeight,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 0.5,
      cornerRadius: 5,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 2 },
      shadowOpacity: 0.7,
    });

    const text = new Konva.Text({
      x: -rectWidth / 2 + rectPadding,
      y: -rectHeight / 2 + rectPadding,
      fontSize: 12,
      fill: 'black',
      width: rectWidth - 2 * rectPadding,
      align: 'left',
      lineHeight: 1.2,
      text: textContent,
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

    group.add(rect, text);

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
