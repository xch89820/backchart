/*********************************************************************************
*     File Name           :     main.js
*     Created By          :     Jone Casper(xu.chenhui@live.com)
*     Creation Date       :     [2014-03-25 22:59]
*     Last Modified       :     [2014-04-03 05:35]
*     Description         :     The entry point for backchart.utils
**********************************************************************************/

define([
    "./logger", 
    "./loader",
    "./codepage/cptable",
    "./codepage/cputils",
    "./jszip/jszip",
    "./parser",
    ], function(logger, loader){
    return {
        logger : logger,
        loader : loader
    };
});
