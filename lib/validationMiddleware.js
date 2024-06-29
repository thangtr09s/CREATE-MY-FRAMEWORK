// lib/validationMiddleware.js
class ValidationMiddleware {
    static validate(rules) {
        return (req, res, next) => {
            const errors = [];

            for (const [field, rule] of Object.entries(rules)) {
                const value = req.body[field];

                // if (rule.required && !value) {
                //     errors.push(`${field} is required`);
                // }
                if (rule.required && (value === undefined || value === null || value === '')) {
                    errors.push(`${field} is required`);
                }

                if (rule.type && typeof value !== rule.type) {
                    errors.push(`${field} must be of type ${rule.type}`);
                }

                if(rule.minLength && value.length < rule.minLength) {
                    errors.push(`${field} must be at least ${rule.minLength} character`);
                }

                //more rules
            }

            if (errors.length > 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({errors}));
            } else {
                next();
            }
        };
    }
}

module.exports = ValidationMiddleware;