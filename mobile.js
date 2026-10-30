let highestZ = 10;

class Paper {
  constructor(element) {
    this.paper = element;
    this.x = 0;
    this.y = 0;
    this.rotation = Math.random() * 30 - 15;
    this.dragging = false;

    this.startX = 0;
    this.startY = 0;
    this.initialX = 0;
    this.initialY = 0;

    this.init();
  }

  init() {
    const paper = this.paper;

    paper.style.touchAction = "none";
    paper.style.userSelect = "none";

    paper.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;

      this.dragging = true;

      this.startX = e.clientX;
      this.startY = e.clientY;

      this.initialX = this.x;
      this.initialY = this.y;

      paper.style.zIndex = ++highestZ;
      paper.style.cursor = "grabbing";

      paper.setPointerCapture(e.pointerId);

      e.preventDefault();
    });

    paper.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;

      this.x = this.initialX + e.clientX - this.startX;
      this.y = this.initialY + e.clientY - this.startY;

      paper.style.transform =
        `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    });

    const stopDragging = () => {
      this.dragging = false;
      paper.style.cursor = "grab";
    };

    paper.addEventListener("pointerup", stopDragging);
    paper.addEventListener("pointercancel", stopDragging);

    paper.style.cursor = "grab";
  }
}

document.querySelectorAll(".paper").forEach((paper) => {
  new Paper(paper);
});