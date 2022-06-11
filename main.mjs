// dont move top/left while dragging an element
class FidgetViewport extends HTMLDivElement {
	constructor() {
		super();
		this.scrollX = 0;
		this.scrollY = 0;
		this.scale = 2;
		this.updatePosition();
	}
	updatePosition() {
		//this.style.transform = `translate(${this.scrollX}px, ${this.scrollY}px) scale(${this.scale})`; // TODO not working on children
	}
};
class FidgetDraggable extends HTMLDivElement { // TODO z indexing
	constructor(dragTarget) {
		super();
		this._startDrag = this._startDrag.bind(this);

		this.x = +this.attributes.x?.value || 0;
		this.y = +this.attributes.y?.value || 0;
		this.updatePosition();
		if (dragTarget ?? this) {
			this.addDragTarget(dragTarget ?? this);
		}
	}
	addDragTarget(dt) {
		dt.addEventListener("mousedown", this._startDrag);
	}
	removeDragTarget(dt) {
		dt.addEventListener("mousedown", this._startDrag);
	}
	_startDrag(e) {
		const relX = this.x - e.screenX;
		const relY = this.y - e.screenY;
		const mouseMove = e => {
			this.x = relX + e.screenX;
			this.y = relY + e.screenY;
			this.updatePosition();
		};
		const mouseUp = e => {
			window.removeEventListener("mousemove", mouseMove);
			window.removeEventListener("mouseup", mouseUp);
		};
		window.addEventListener("mousemove", mouseMove);
		window.addEventListener("mouseup", mouseUp);
	}
	updatePosition() {
		this.style.left = `${this.x}px`;
		this.style.top = `${this.y}px`;
	}
};
class FidgetWindow extends FidgetDraggable {
	constructor() {
		super(false);
		const shadow = this.attachShadow({mode: "open"});

		const title = document.createElement("slot");
		title.name = "title";
		shadow.append(title);
		this.addDragTarget(title);

		const content = document.createElement("slot");
		content.name = "content";
		shadow.append(content);
	}
};
customElements.define("fidget-viewport", FidgetViewport, { extends: "div" });
customElements.define("fidget-draggable", FidgetDraggable, { extends: "div" });
customElements.define("fidget-window", FidgetWindow, { extends: "div" });
