import { Component, OnInit, HostListener } from '@angular/core';
import axios from 'axios';
import { Node } from '../node/node.module';
import Konva from 'konva';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {
  address: string = '';
  private konva: any;
  private stage: any;
  private layer: any;
  private stageWidth: number = 0;
  private stageHeight: number = 0;

  constructor() {
    this.konva = Konva;
  }

  ngOnInit() {
    this.adjustStageSize();

    this.stage = new this.konva.Stage({
      container: 'container',
      width: this.stageWidth,
      height: this.stageHeight
    });

      // Initialize the layer
    this.layer = new this.konva.Layer();
    this.stage.add(this.layer);

    if (!this.stage) {
      return;
    }

    // Track the initial click position
    let initialClickPos: { x: number, y: number } | null = null;

    // Handle panning
    this.stage.on('mousedown', (e: any) => {
      // Check if left mouse button is pressed
      if (e.evt.button === 0) {
        initialClickPos = this.stage.getPointerPosition();
      }
    });

    this.stage.on('mouseup', () => {
      if (initialClickPos) {
        const currentPos = this.stage.getPointerPosition();
        if (currentPos) {
          const dx = currentPos.x - initialClickPos.x;
          const dy = currentPos.y - initialClickPos.y;

          const newX = this.stage.x() + dx;
          const newY = this.stage.y() + dy;

          this.stage.position({ x: newX, y: newY });
          this.stage.batchDraw();
        }
      }

      initialClickPos = null;
    });

    this.stage.on('mousemove', (e: any) => {
      if (initialClickPos) {
        const currentPos = this.stage.getPointerPosition();
        if (currentPos) {
          const dx = currentPos.x - initialClickPos.x;
          const dy = currentPos.y - initialClickPos.y;

          const newX = this.stage.x() + dx;
          const newY = this.stage.y() + dy;

          this.stage.position({ x: newX, y: newY });
          this.stage.batchDraw();

          initialClickPos = currentPos; // Update the initial click position
        }
      }
    });

    // Handle zooming
    const scaleBy = 1.2;
    this.stage.on('wheel', (e: any) => {
      e.evt.preventDefault();
      const oldScale = this.stage.scaleX();
      const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      this.stage.scale({ x: newScale, y: newScale });

      // Adjust stage position to keep the zoom centered
      const pointer = this.stage.getPointerPosition();
      if (pointer) {
        const mousePointTo = {
          x: (pointer.x - this.stage.x()) / oldScale,
          y: (pointer.y - this.stage.y()) / oldScale
        };
        const newX = pointer.x - mousePointTo.x * newScale;
        const newY = pointer.y - mousePointTo.y * newScale;
        this.stage.position({ x: newX, y: newY });
      }

      this.stage.batchDraw();
    });
  }


  @HostListener('window:resize')
  onWindowResize() {
    this.adjustStageSize();
    const stage = this.konva.stages[0]; // Get the first stage in the stages array
    if (stage) {
      stage.width(this.stageWidth);
      stage.height(this.stageHeight);
      stage.position({ x: 0, y: 0 }); // Reset the stage position
      stage.batchDraw();
    }
  }

  adjustStageSize() {
    this.stageWidth = window.innerWidth;
    this.stageHeight = window.innerHeight;
    const container = document.getElementById('container');
    if (container) {
      container.style.width = `${this.stageWidth}px`;
      container.style.height = `${this.stageHeight}px`;
    }
  }

  async visualizeTransactions(address: string) {
    address = this.address.trim();
    if (address === '') {
      return;
    }

    const apiKey = 'GXUJ8JKUEBJ7XNK5AZ9R4VTFHRHU11QHQ9';
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const transactionHistory = response.data.result;

      this.layer.removeChildren();

      const nodes = transactionHistory.map((transaction: any) => {
        const node = new Node();
        node.create(transaction.from, transaction.to, transaction.value, transaction.gas);
        node.enableDragDrop();


        node.getGroup().on('dragstart', () => {
          this.stage.draggable(false); // Pause canvas panning when node dragging starts
        });

        node.getGroup().on('dragend', () => {
          this.stage.draggable(true); // Resume canvas panning when node dragging ends
        });


        return node.getGroup();
      });



      this.layer.add(...nodes);
      this.stage.batchDraw();
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  }
}
