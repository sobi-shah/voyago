const errorHandler = (err, req, res, next) => {
    // If the error comes with a specific status code, use it, otherwise default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode);

    // Zod validation errors
    if (err.name === 'ZodError') {
        const issues = err.issues || err.errors || [];
        return res.status(400).json({
            message: 'Validation Error',
            errors: issues.map(e => ({ path: e.path ? e.path.join('.') : 'unknown', message: e.message }))
        });
    }

    res.json({
        message: err.message,
        // Only show stack trace in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
