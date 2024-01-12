import { COLORS, MIN_SCORE } from './consts.js';


export default class ModelRenderer {
    constructor(ctx, webcamRef) {
        this.ctx = ctx.current.getContext('2d');
        this.webcam = webcamRef.current;
    }


    /*
    * Render the video of camera
    * */    
    async renderCameraImage() {
        const video = this.webcam.video;
        this.ctx.drawImage(video, 0, 0, video.width, video.height);
    }

    /*
    * Render keypoint (dot)
    * @param {Object} keypoint - keypoint to render
    * @param {String} color - color of dot
    * */
    async renderKeypoint(keypoint, color) {
        if (!keypoint) {
            return null;
        }

        const x = keypoint.x;
        const y = keypoint.y;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(parseInt(x) - 2, parseInt(y) - 2, 4, 4);
    }

    /*
    * Render multiple keypoints
    * @param {Array} keypointList - list of keypoints to render
    * @param {String} color - color of dots
    * */
    async renderKeypoints(keypointList, color) {
        this.renderCameraImage();
        keypointList.map((keypoint) => {
            if (keypoint.score > MIN_SCORE) {
                this.renderKeypoint(keypoint, color);
            }
        });
    }

    async antiShaking() {
        
    }
}

