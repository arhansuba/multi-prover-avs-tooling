// utils/helpers.js

// Example helper function to log messages with timestamps
const logWithTimestamp = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
};

module.exports = {
    logWithTimestamp,
};
