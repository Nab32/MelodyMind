import { COLORS } from './consts.js';


export default class ModelRenderer {
    constructor(ctx, webcamRef) {
        this.ctx = ctx.current.getContext('2d');
        this.webcam = webcamRef.current;
    }

    async renderCameraImage() {
        const video = this.webcam.video;
        this.ctx.drawImage(video, 0, 0, video.width, video.height);
    }

    async renderKeypoint(keypoint, color) {
        if (!keypoint) {
            return null;
        }

        const x = keypoint.x;
        const y = keypoint.y;
        this.ctx.fillStyle = COLORS.color;
        this.ctx.beginPath();
        this.renderCameraImage();
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}