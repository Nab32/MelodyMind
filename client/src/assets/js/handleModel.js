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

    async loadModel() {
        await tf.setBackend('webgl');
        this.model = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            detectorConfig
        );
    };

    async estimatePoseOnImage(imageElement) {
        if (!this.model) {
            return "Model not loaded";
        }
        const result = await this.model.estimatePoses(imageElement);
        return result;
    }
}