export class ScoreCounter {
    canvas;
    ctx;
    fontWeight = 10;
    value = 0;

    constructor(canvas, ctx, fontWeight = 10) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.fontWeight = fontWeight;
    }

    _draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); //fundo do canvas

        //[x,y,w,h]
        const segments = {
            top: [this.fontWeight + 5, this.fontWeight / 2, this.canvas.width - this.fontWeight - this.fontWeight - 5, this.fontWeight],
            topLeft: [this.fontWeight / 2, this.fontWeight + 5, this.fontWeight, this.canvas.height / 2 - this.fontWeight - 5],
            topRight: [this.canvas.width - this.fontWeight, this.fontWeight + 5, this.fontWeight, this.canvas.height / 2 - this.fontWeight - 5],
            middle: [this.fontWeight + 5, this.canvas.height / 2, this.canvas.width - this.fontWeight - 15, this.fontWeight],
            bottomRight: [this.canvas.width - this.fontWeight, this.canvas.height / 2 + this.fontWeight, this.fontWeight, this.canvas.height / 2 - this.fontWeight - 10],
            bottomLeft: [this.fontWeight / 2, this.canvas.height / 2 + this.fontWeight, this.fontWeight, this.canvas.height / 2 - this.fontWeight - 10],
            bottom: [this.fontWeight + 5, this.canvas.height - this.fontWeight, this.canvas.width - this.fontWeight - 15, this.fontWeight],
        }

        this.ctx.fillStyle = "#FFF";
        for (let [_, rect] of Object.entries(segments)) {
            this.ctx.fillRect(...rect)
        }

        this.ctx.fillStyle = "#000";
        switch (this.value) {
            case 0:
                this.ctx.fillRect(...segments.middle); // Hide middle
                break;
            case 1:
                this.ctx.fillRect(...segments.top);
                this.ctx.fillRect(...segments.middle);
                this.ctx.fillRect(...segments.bottom);
                this.ctx.fillRect(...segments.topLeft);
                this.ctx.fillRect(...segments.bottomLeft);
                break;
            case 2:
                this.ctx.fillRect(...segments.topLeft);
                this.ctx.fillRect(...segments.bottomRight);
                break;
            case 3:
                this.ctx.fillRect(...segments.topLeft);
                this.ctx.fillRect(...segments.bottomLeft);
                break;
            case 4:
                this.ctx.fillRect(...segments.top);
                this.ctx.fillRect(...segments.bottom);
                this.ctx.fillRect(...segments.bottomLeft);
                break;
            case 5:
                this.ctx.fillRect(...segments.topRight);
                this.ctx.fillRect(...segments.bottomLeft);
                break;
            case 6:
                this.ctx.fillRect(...segments.topRight);
                break;
            case 7:
                this.ctx.fillRect(...segments.topLeft);
                this.ctx.fillRect(...segments.middle);
                this.ctx.fillRect(...segments.bottomLeft);
                this.ctx.fillRect(...segments.bottom);
                break;
            case 8:
                break;
            case 9:
                this.ctx.fillRect(...segments.bottomLeft);
                break;
            default:
                break;
        }
    }

    setValue(value) {
        this.value = value;
        this._draw();
    }
}
