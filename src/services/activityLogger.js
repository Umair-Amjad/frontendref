import axios from 'axios';
import API from './api';

class ActivityLogger {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.BATCH_SIZE = 5;
    this.INTERVAL = 10000; // 10 seconds

    // Set up interval to process queued activities
    setInterval(() => this.processQueue(), this.INTERVAL);
  }

  // Log page visit
  logPageView(page, metadata = {}) {
    this.queueActivity({
      type: 'page_view',
      page,
      timestamp: new Date().toISOString(),
      metadata
    });
  }

  // Log user action (click, form submission, etc.)
  logAction(action, details = {}) {
    this.queueActivity({
      type: 'user_action',
      action,
      timestamp: new Date().toISOString(),
      details
    });
  }

  // Add activity to queue
  queueActivity(activity) {
    const token = localStorage.getItem('token');
    if (!token) return; // Only log activities for authenticated users
    
    this.queue.push(activity);
    
    // Process immediately if queue is full
    if (this.queue.length >= this.BATCH_SIZE) {
      this.processQueue();
    }
  }

  // Process queued activities
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      const batch = this.queue.splice(0, this.BATCH_SIZE);
      await API.post('/user/activity', { activities: batch });
    } catch (error) {
      console.error('Failed to log activities:', error);
      // Put failed activities back in queue
      this.queue.unshift(...this.queue.splice(0, this.BATCH_SIZE));
    } finally {
      this.isProcessing = false;
    }
  }
}

export default new ActivityLogger(); 