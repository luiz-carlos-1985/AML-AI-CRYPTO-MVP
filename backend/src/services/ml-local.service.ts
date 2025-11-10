import { spawn, ChildProcess } from 'child_process';
import { logger } from '../utils/logger';
import path from 'path';
import axios from 'axios';

let mlProcess: ChildProcess | null = null;
let mlServiceReady = false;

export const startMLService = async () => {
  const mlPath = path.join(__dirname, '../../../ml-service');
  
  logger.info('Starting ML Service...');
  
  mlProcess = spawn('python', ['app.py'], {
    cwd: mlPath,
    stdio: 'pipe'
  });

  mlProcess.stdout?.on('data', (data) => {
    const output = data.toString();
    logger.info(`ML Service: ${output.trim()}`);
    if (output.includes('Running on')) {
      mlServiceReady = true;
      logger.info('✅ ML Service ready');
    }
  });

  mlProcess.stderr?.on('data', (data) => {
    logger.error(`ML Service error: ${data.toString()}`);
  });

  mlProcess.on('close', (code) => {
    logger.warn(`ML Service exited with code ${code}`);
    mlServiceReady = false;
  });

  // Wait for service to be ready
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Verify it's running
  try {
    await axios.get('http://localhost:8000/health', { timeout: 2000 });
    logger.info('✅ ML Service verified');
    return true;
  } catch (error) {
    logger.warn('⚠️ ML Service not responding, using fallback');
    return false;
  }
};

export const stopMLService = () => {
  if (mlProcess) {
    mlProcess.kill();
    mlProcess = null;
    mlServiceReady = false;
    logger.info('ML Service stopped');
  }
};

export const isMLServiceReady = () => mlServiceReady;
