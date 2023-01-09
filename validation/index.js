const validateData = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    errors: {
      wrap: {
        label: ''
      }
    }
  });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.json({
      error: true,
      errorType: 'data-validation',
      message: 'invalid input',
      errors
    });
  }
  next();
};

module.exports = validateData;
