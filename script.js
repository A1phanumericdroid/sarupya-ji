let highestZ = 100;

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

        // Support dragging with mouse, touch, and stylus.
        paper.style.touchAction = "none";
        paper.style.userSelect = "none";
        paper.style.cursor = "grab";

        // Prevent the browser from dragging images separately.
        paper.querySelectorAll("img").forEach((img) => {
            img.draggable = false;
        });

        paper.addEventListener("pointerdown", (event) => {
            // Only respond to the primary mouse button or touch.
            if (!event.isPrimary) return;
            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }

            // Stop another paper's handler from responding.
            event.stopPropagation();

            this.dragging = true;

            this.startX = event.clientX;
            this.startY = event.clientY;

            this.initialX = this.x;
            this.initialY = this.y;

            // Bring the selected paper to the front.
            paper.style.zIndex = ++highestZ;
            paper.style.cursor = "grabbing";

            // Continue tracking even outside the paper.
            paper.setPointerCapture(event.pointerId);

            event.preventDefault();
        });

        paper.addEventListener("pointermove", (event) => {
            if (!this.dragging) return;

            event.stopPropagation();

            const deltaX = event.clientX - this.startX;
            const deltaY = event.clientY - this.startY;

            this.x = this.initialX + deltaX;
            this.y = this.initialY + deltaY;

            // Move ONLY the selected paper.
            paper.style.transform =
                `translate(${this.x}px, ${this.y}px) ` +
                `rotateZ(${this.rotation}deg)`;
        });

        const stopDragging = () => {
            if (!this.dragging) return;

            this.dragging = false;
            paper.style.cursor = "grab";
        };

        paper.addEventListener("pointerup", stopDragging);
        paper.addEventListener("pointercancel", stopDragging);
        paper.addEventListener("lostpointercapture", stopDragging);
    }
}

// Give every paper its own independent drag controller.
document.querySelectorAll(".paper").forEach((element) => {
    new Paper(element);
});
