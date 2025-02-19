const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate value error',
        field: Object.keys(err.keyValue)[0]
      });
    }
    
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };
  
  module.exports = errorHandler;