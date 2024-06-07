const path = require('path');
const express = require("express");
const app = express();
// Function to set multiple view directories
const setMultipleViews = (directories) => {
    return (req, res, next) => {
        res.render = (view, options, callback) => {
            for (const dir of directories) {
                try {
                    // Try to render from each directory
                    const viewPath = path.join(dir, view);
                    return app.render((viewPath + ".ejs"), options, callback);
                } catch (err) {
                    // If not found, continue to the next directory

                }
            }
            // If not found in any directory, throw an error
            throw new Error(`View '${view}' not found in any of the specified directories`);
        };
        next();
    };
};

module.exports = {setMultipleViews}