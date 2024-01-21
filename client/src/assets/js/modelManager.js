import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { MIN_SCORE } from './consts.js';

const MODEL_CONFIG = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    minPoseScore: MIN_SCORE,
    enableSmoothing: true,
    multiPoseMaxDimension: 512
};


export default class ModelManager {
    constructor() {
        this.model = null;
        this.allAngles = [];
    }

    /*
    * Load the model
    * @returns {Promise}
    * */
    async loadModel() {
        await tf.setBackend('webgl');
        this.model = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            MODEL_CONFIG
        );
    };

    /*
    * Estimate pose on an image
    * @param {HTMLImageElement} imageElement - image to estimate pose on
    * @returns {Object} - pose object
    * */
    async estimatePoseOnImage(imageElement) {
        if (!this.model) {
            return null;
        }
        const result = await this.model.estimatePoses(imageElement);
        return result[0];
    }


    /*
    * Get a keypoint from an image (TODO)
    * @param {String} keypoint - keypoint to get
    * @param {HTMLImageElement} imageElement - image to get keypoint from
    * @returns {Object} - keypoint object
    *  */
    async getKeypoint(poseElement, imageElement) {
        const poses = await this.estimatePoseOnImage(imageElement);

        if (!poses || !poses.keypoints) {
            return null;
        }

        const keypoints = poses.keypoints;

        const foundKeypoint = keypoints.find((keypoint) => keypoint.name === poseElement);

        if (foundKeypoint) {
            return foundKeypoint;
        } else {
            return null;
        }
    }

    /*
    * Get multiple keypoints from an image (TODO)
    * @param {Array} poseArray - array of keypoints to get
    * @param {HTMLImageElement} imageElement - image to get keypoints from
    * @returns {Array} - array of keypoint objects
    * */
    async getKeypoints(poseArray, imageElement) {
        const poses = await this.estimatePoseOnImage(imageElement);

        if (!poses || !poses.keypoints) {
            return null;
        }

        const keypoints = poses.keypoints;

        const foundKeypoints = keypoints.filter((keypoint) => poseArray.includes(keypoint.name));

        if (foundKeypoints) {
            return foundKeypoints;
        } else {
            return null;
        }
    }

    getAngle(x1, y1, x2, y2, x3, y3) {
        // Calculate vectors
        const vector1 = { x: x1 - x2, y: y1 - y2 };
        const vector2 = { x: x3 - x2, y: y3 - y2 };

        // Calculate dot product
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

        // Calculate magnitudes
        const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
        const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

        // Calculate cosine of the angle
        const cosAngle = dotProduct / (magnitude1 * magnitude2);

        // Calculate angle in radians
        let angleInRadians = Math.acos(cosAngle);

        // Convert radians to degrees
        let angleInDegrees = (angleInRadians * 180) / Math.PI;

        // Check the orientation of the angle (clockwise or counterclockwise)
        const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;
        if (crossProduct < 0) {
            angleInDegrees = 360 - angleInDegrees;
        }
        this.allAngles.push(angleInDegrees);
        return angleInDegrees;
    }
}