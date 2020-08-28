"use strict";

const
    onFinished = require("on-finished");

function main(opts) {
    let guidGen = Date.now;
    if(opts && opts.guidGen && opts.guidGen instanceof Function) {
        guidGen = opts.guidGen;
    }

    let logWriter = console.log;
    if(opts && opts.logWriter && opts.logWriter instanceof Function) {
        logWriter = opts.logWriter;
    }

    let middleware = function (req, res, next) {
        req.requestTime = Date.now();
        req.requestId = guidGen();
        onFinished(res, () => {
            if (res.statusCode) {
                var path = res.req.url;
                if (res.req && res.req.route) {
                    path = res.req.route.path;
                }
                logWriter(path, req.requestId, "Response Time Log", 
                    {
                        duration: Date.now() - req.requestTime,
                        requestParams : req.params,
                        requestQuery: req.query,
                        requestBody: req.body,
                        responseCode: res.statusCode
                    });
            }
        });
        next();
    };
    return middleware;
}
    
module.exports = main;