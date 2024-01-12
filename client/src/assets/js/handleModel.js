import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
};

export default class ModelManager {
    constructor() {
        this.model = null;
    }

    /*
    * Load the model
    * @returns {Promise}
    * */
    async loadModel() {
        await tf.setBackend('webgl');
        this.model = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            detectorConfig
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
}