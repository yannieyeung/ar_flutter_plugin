/**
 * ML Personalization System using TensorFlow.js
 * Trains personalized models based on employer behavior and preferences
 */

import * as tf from '@tensorflow/tfjs';
import { userDecisionTracker } from './recommendation-pipeline';

// Model configuration
const MODEL_CONFIG = {
  inputFeatures: 10, // Number of input features
  hiddenUnits: [64, 32, 16], // Hidden layer sizes
  outputUnits: 1, // Single output (preference score)
  learningRate: 0.001,
  epochs: 50,
  batchSize: 32,
  validationSplit: 0.2
};

// Feature names for consistency
const FEATURE_NAMES = [
  'age', 'nationality', 'hasChildCare', 'hasCooking', 'hasCleaning',
  'hasElderlyCare', 'experienceYears', 'isVerified', 'hasEnglish', 'profileCompleteness'
];

export class PersonalizationModel {
  constructor(userId) {
    this.userId = userId;
    this.model = null;
    this.isTraining = false;
    this.trainingHistory = null;
    this.modelMetrics = null;
  }

  // Create a new neural network model
  createModel() {
    const model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({
      inputShape: [MODEL_CONFIG.inputFeatures],
      units: MODEL_CONFIG.hiddenUnits[0],
      activation: 'relu',
      kernelInitializer: 'heNormal',
      name: 'input_layer'
    }));

    // Dropout for regularization
    model.add(tf.layers.dropout({ rate: 0.3 }));

    // Hidden layers
    MODEL_CONFIG.hiddenUnits.slice(1).forEach((units, index) => {
      model.add(tf.layers.dense({
        units: units,
        activation: 'relu',
        kernelInitializer: 'heNormal',
        name: `hidden_layer_${index + 1}`
      }));
      
      // Dropout for regularization
      if (index < MODEL_CONFIG.hiddenUnits.length - 2) {
        model.add(tf.layers.dropout({ rate: 0.2 }));
      }
    });

    // Output layer (sigmoid for probability/preference score)
    model.add(tf.layers.dense({
      units: MODEL_CONFIG.outputUnits,
      activation: 'sigmoid',
      name: 'output_layer'
    }));

    // Compile the model
    model.compile({
      optimizer: tf.train.adam(MODEL_CONFIG.learningRate),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy', 'precision', 'recall']
    });

    return model;
  }

  // Prepare training data from user decisions
  async prepareTrainingData() {
    try {
      const decisions = await userDecisionTracker.getUserDecisions(this.userId, 500);
      
      if (decisions.length < 10) {
        throw new Error(`Insufficient training data: ${decisions.length} decisions (minimum 10 required)`);
      }

      console.log(`📊 Preparing training data from ${decisions.length} user decisions`);

      const features = [];
      const labels = [];

      decisions.forEach(decision => {
        // Extract features in consistent order
        const featureVector = [
          decision.helperFeatures.age / 100, // Normalize age
          decision.helperFeatures.nationality / 10, // Normalize nationality encoding
          decision.helperFeatures.hasChildCare,
          decision.helperFeatures.hasCooking,
          decision.helperFeatures.hasCleaning,
          decision.helperFeatures.hasElderlyCare,
          decision.helperFeatures.experienceYears / 10, // Normalize experience
          decision.helperFeatures.isVerified,
          decision.helperFeatures.hasEnglish,
          decision.helperFeatures.profileCompleteness / 100 // Normalize completeness
        ];

        // Create labels based on user actions
        let label = 0;
        switch (decision.action) {
          case 'hired':
            label = 1.0;
            break;
          case 'contacted':
            label = 0.8;
            break;
          case 'clicked':
          case 'viewed':
            label = 0.6;
            break;
          case 'rejected':
            label = 0.0;
            break;
          default:
            label = 0.3; // Neutral/unknown
        }

        features.push(featureVector);
        labels.push([label]);
      });

      // Convert to tensors
      const X = tf.tensor2d(features);
      const y = tf.tensor2d(labels);

      console.log(`✅ Training data prepared: ${features.length} samples, ${features[0].length} features`);

      return { X, y, sampleCount: features.length };

    } catch (error) {
      console.error('Error preparing training data:', error);
      throw error;
    }
  }

  // Train the personalization model
  async trainModel() {
    if (this.isTraining) {
      console.log('⏳ Model is already training...');
      return;
    }

    try {
      this.isTraining = true;
      console.log(`🚀 Training personalization model for user ${this.userId}`);

      // Prepare training data
      const { X, y, sampleCount } = await this.prepareTrainingData();

      // Create new model
      this.model = this.createModel();

      // Define callbacks for training monitoring
      const callbacks = {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
          }
        },
        onTrainEnd: (logs) => {
          console.log('✅ Training completed');
          this.modelMetrics = logs;
        }
      };

      // Train the model
      const history = await this.model.fit(X, y, {
        epochs: MODEL_CONFIG.epochs,
        batchSize: Math.min(MODEL_CONFIG.batchSize, Math.floor(sampleCount * 0.8)),
        validationSplit: MODEL_CONFIG.validationSplit,
        shuffle: true,
        callbacks: callbacks,
        verbose: 0
      });

      this.trainingHistory = history;

      // Clean up tensors
      X.dispose();
      y.dispose();

      // Save model to browser storage or Firebase
      await this.saveModel();

      console.log(`🎯 Model training completed for user ${this.userId}`);
      return {
        success: true,
        sampleCount,
        finalLoss: history.history.loss[history.history.loss.length - 1],
        finalAccuracy: history.history.acc[history.history.acc.length - 1]
      };

    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    } finally {
      this.isTraining = false;
    }
  }

  // Predict user preference for a helper
  async predict(helperFeatures) {
    if (!this.model) {
      await this.loadModel();
    }

    if (!this.model) {
      // Return neutral score if no model available
      return 0.5;
    }

    try {
      // Prepare feature vector
      const featureVector = [
        helperFeatures.age / 100,
        this.encodeNationality(helperFeatures.nationality) / 10,
        helperFeatures.experience?.childCare ? 1 : 0,
        helperFeatures.experience?.cooking ? 1 : 0,
        helperFeatures.experience?.cleaning ? 1 : 0,
        helperFeatures.experience?.elderlyCare ? 1 : 0,
        helperFeatures.experienceYears / 10,
        helperFeatures.isVerified ? 1 : 0,
        helperFeatures.languages?.some(l => 
          l.language.toLowerCase().includes('english')) ? 1 : 0,
        helperFeatures.profileCompleteness / 100
      ];

      // Make prediction
      const inputTensor = tf.tensor2d([featureVector]);
      const prediction = this.model.predict(inputTensor);
      const score = await prediction.data();

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      return score[0]; // Return the predicted preference score

    } catch (error) {
      console.error('Error making prediction:', error);
      return 0.5; // Return neutral score on error
    }
  }

  // Save model to Firebase Storage or IndexedDB
  async saveModel() {
    if (!this.model) return;

    try {
      // Save to IndexedDB for now (can be extended to Firebase Storage)
      const saveResult = await this.model.save(`indexeddb://user-model-${this.userId}`);
      console.log(`💾 Model saved for user ${this.userId}:`, saveResult);
      
      // Also save metadata
      const metadata = {
        userId: this.userId,
        lastTrained: new Date().toISOString(),
        modelMetrics: this.modelMetrics,
        featureNames: FEATURE_NAMES
      };

      localStorage.setItem(`model-metadata-${this.userId}`, JSON.stringify(metadata));

    } catch (error) {
      console.error('Error saving model:', error);
      throw error;
    }
  }

  // Load model from storage
  async loadModel() {
    try {
      this.model = await tf.loadLayersModel(`indexeddb://user-model-${this.userId}`);
      console.log(`📥 Model loaded for user ${this.userId}`);
      
      // Load metadata
      const metadata = localStorage.getItem(`model-metadata-${this.userId}`);
      if (metadata) {
        this.modelMetrics = JSON.parse(metadata).modelMetrics;
      }

      return true;
    } catch (error) {
      console.log(`No existing model found for user ${this.userId}:`, error.message);
      return false;
    }
  }

  // Check if model needs retraining
  async needsRetraining() {
    const metadata = localStorage.getItem(`model-metadata-${this.userId}`);
    if (!metadata) return true;

    const { lastTrained } = JSON.parse(metadata);
    const daysSinceTraining = (Date.now() - new Date(lastTrained)) / (1000 * 60 * 60 * 24);
    
    return daysSinceTraining > 7; // Retrain weekly
  }

  // Encode nationality for ML (same as in UserDecisionTracker)
  encodeNationality(nationality) {
    const nationalityMap = {
      'philippines': 1, 'filipino': 1,
      'indonesia': 2, 'indonesian': 2,
      'myanmar': 3, 'burmese': 3,
      'sri lanka': 4, 'sri lankan': 4,
      'india': 5, 'indian': 5
    };
    
    return nationalityMap[nationality?.toLowerCase()] || 0;
  }

  // Get model info
  getModelInfo() {
    return {
      userId: this.userId,
      isTraining: this.isTraining,
      hasModel: !!this.model,
      modelMetrics: this.modelMetrics,
      featureNames: FEATURE_NAMES
    };
  }

  // Dispose of the model to free memory
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

// ML Personalization Manager
export class MLPersonalizationManager {
  constructor() {
    this.userModels = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🤖 Initializing ML Personalization Manager...');
    
    // Set up TensorFlow.js backend
    await tf.ready();
    console.log('✅ TensorFlow.js backend ready:', tf.getBackend());
    
    this.isInitialized = true;
  }

  // Get or create a personalization model for a user
  async getUserModel(userId) {
    if (!this.userModels.has(userId)) {
      const model = new PersonalizationModel(userId);
      await model.loadModel(); // Try to load existing model
      this.userModels.set(userId, model);
    }

    return this.userModels.get(userId);
  }

  // Train personalization model for a user
  async trainUserModel(userId) {
    try {
      const model = await this.getUserModel(userId);
      return await model.trainModel();
    } catch (error) {
      console.error(`Error training model for user ${userId}:`, error);
      throw error;
    }
  }

  // Apply personalization to helper recommendations
  async personalizeRecommendations(userId, scoredHelpers) {
    try {
      const model = await this.getUserModel(userId);
      
      if (!model.model) {
        console.log(`No trained model available for user ${userId}, using rule-based scoring`);
        return scoredHelpers;
      }

      console.log(`🎯 Applying personalization for user ${userId}`);

      const personalizedHelpers = [];

      for (const item of scoredHelpers) {
        try {
          const personalizedScore = await model.predict(item.helper);
          
          // Combine rule-based score with personalized score
          const combinedScore = (item.score * 0.6) + (personalizedScore * 100 * 0.4);
          
          personalizedHelpers.push({
            ...item,
            personalizedScore: Math.round(personalizedScore * 100),
            finalScore: Math.round(combinedScore),
            isPersonalized: true
          });
        } catch (predictionError) {
          console.error('Error making personalized prediction:', predictionError);
          // Fall back to original score
          personalizedHelpers.push({
            ...item,
            isPersonalized: false
          });
        }
      }

      // Re-sort by combined score
      personalizedHelpers.sort((a, b) => b.finalScore - a.finalScore);

      return personalizedHelpers;

    } catch (error) {
      console.error('Error applying personalization:', error);
      // Return original recommendations on error
      return scoredHelpers.map(item => ({ ...item, isPersonalized: false }));
    }
  }

  // Check if user needs model retraining
  async shouldRetrain(userId) {
    try {
      const model = await this.getUserModel(userId);
      return await model.needsRetraining();
    } catch (error) {
      console.error('Error checking retraining need:', error);
      return true; // Default to retraining on error
    }
  }

  // Get all users that need retraining
  async getUsersNeedingRetraining() {
    const users = [];
    
    // This would typically query your user database
    // For now, return users with existing models
    for (const [userId, model] of this.userModels) {
      if (await model.needsRetraining()) {
        users.push(userId);
      }
    }

    return users;
  }

  // Cleanup models to free memory
  cleanup() {
    for (const [userId, model] of this.userModels) {
      model.dispose();
    }
    this.userModels.clear();
  }

  // Get system status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      activeModels: this.userModels.size,
      backend: tf.getBackend(),
      memory: tf.memory()
    };
  }
}

// Export singleton instance
export const mlPersonalizationManager = new MLPersonalizationManager();

// Utility functions for ML training
export async function trainPersonalizationModel(userId) {
  try {
    await mlPersonalizationManager.initialize();
    return await mlPersonalizationManager.trainUserModel(userId);
  } catch (error) {
    console.error(`Failed to train personalization model for user ${userId}:`, error);
    throw error;
  }
}

export async function applyPersonalization(userId, scoredHelpers) {
  try {
    await mlPersonalizationManager.initialize();
    return await mlPersonalizationManager.personalizeRecommendations(userId, scoredHelpers);
  } catch (error) {
    console.error(`Failed to apply personalization for user ${userId}:`, error);
    return scoredHelpers; // Return original on error
  }
}