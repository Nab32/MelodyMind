import { COLORS, MIN_SCORE } from './consts.js';


export default class ModelRenderer {
    constructor(ctx, webcamRef) {
        this.ctx = ctx.current.getContext('2d');
        this.webcam = webcamRef.current;
        this.skeleton = [
            ["left_shoulder", "right_shoulder"],
            ["left_shoulder", "left_elbow"],
            ["left_elbow", "left_wrist"],
            ["right_shoulder", "right_elbow"],
            ["right_elbow", "right_wrist"],
            ["left_shoulder", "left_hip"],
            ["left_hip", "right_hip"],
            ["right_shoulder", "right_hip"],
            ["left_hip", "left_knee"],
            ["left_knee", "left_ankle"],
            ["right_hip", "right_knee"],
            ["right_knee", "right_ankle"]
        ]
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
        //this.renderCameraImage();
        this.ctx.clearRect(0, 0, this.webcam.video.width, this.webcam.video.height);
        keypointList.map((keypoint) => {
            if (keypoint.score > MIN_SCORE) {
                this.renderKeypoint(keypoint, color);
            }
        });
        this.renderSkeleton(keypointList, color);
        this.renderFace(keypointList);
    }

    async renderSkeleton(keypointList, color) {
        this.skeleton.map((bone) => {
            const start = keypointList.find((keypoint) => keypoint.name === bone[0]);
            const end = keypointList.find((keypoint) => keypoint.name === bone[1]);

            if (start && end && start.score > MIN_SCORE && end.score > MIN_SCORE) {
                this.ctx.beginPath();
                this.ctx.moveTo(start.x, start.y);
                this.ctx.lineTo(end.x, end.y);
                this.ctx.lineWidth = 5;
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
            }
        });
    }


    async renderFace(keypointLst){
        const faceCoords = keypointLst.find((keypoint) => keypoint.name === "nose");
        const faceImage = new Image();
        faceImage.src = 'https://www.musicologie.org/Biographies/m/mozart.jpg';
        if (faceCoords && faceCoords.score > MIN_SCORE) {
            this.ctx.drawImage(faceImage, faceCoords.x - 100, faceCoords.y - 100, 150, 150);
            console.log("test");
        }
    }
}

