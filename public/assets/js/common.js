(function(window) {
    'use strict';
    var Common = (function(document) {
        
        if(typeof window.console === 'undefined') {
            window.console = {};
        }

        if(typeof window.console.log === 'undefined') {
            window.console.log = function (mixed) {
                alert(mixed);
            };
        }

        var VAR_DUMP = function() {
            var output = '',
                PAD_CHAR = ' ',
                PAD_VAL = 4,
                counter = 0;

            var GET_FUNC_NAME = function (fn) {
                var NAME = (/\W*function\s+([\w$]+)\s*\(/).exec(fn);
                if (! NAME) {
                    return '(Anonymous)';
                }
                return NAME[1];
            };
            var REPEAT_CHAR = function (length, padChar) {
                var str = '';
                for (var i = 0; i < length; i++) {
                    str += padChar;
                }
                return str;
            };
            var GET_INNER_VAL = function (val$, thickPad) {
                var ret = '';
                if (val$ === null) {
                    ret = 'NULL';
                } else if (typeof val$ === 'boolean') {
                    ret = 'bool(' + val$ + ')';
                } else if (typeof value === 'string') {
                    ret = 'string(' + val$.length + ') "' + val$ + '"';
                } else if (typeof val$ === 'number') {
                    if (parseFloat(val$) === parseInt(val$, 10)) {
                        ret = 'int(' + val$ + ')';
                    } else {
                        ret = 'float(' + val$ + ')';
                    }
                } else if (typeof val$ === 'undefined') {
                    ret = 'undefined';
                } else if (typeof val$ === 'function') {
                    var funcLines = val$.toString().split('\n');
                    ret = '';
                    for (var i = 0;  i < funcLines.length; i++) {
                        ret += (i !== 0 ? '\n' + thickPad : '') + funcLines[i];
                    }
                } else if (val$ instanceof Date) {
                    ret = 'Date(' + val$ + ')';
                } else if (val$ instanceof RegExp) {
                    ret = 'RegExp(' + val$ + ')';
                } else if (val$.nodeName) {
                    switch (val$.nodeType) {
                        case 1:
                            if (
                                typeof val$.namespaceURI === 'undefined' ||
                                val$.namespaceURI === 'http://www.w3.org/1999/xhtml'
                            ) {
                                ret = 'HTMLElement("' + val$.nodeName + '")';
                            } else {
                                ret = 'XML Element("' + val$.nodeName + '")';
                            }
                            break;
                        case 2:
                            ret = 'ATTRIBUTE_NODE(' + val$.nodeName + ')';
                            break;
                        case 3:
                            ret = 'TEXT_NODE(' + val$.nodeValue + ')';
                            break;
                        case 4:
                            ret = 'CDATA_SECTION_NODE(' + val$.nodeValue + ')';
                            break;
                        case 5:
                            ret = 'ENTITY_REFERENCE_NODE';
                            break;
                        case 6:
                            ret = 'ENTITY_NODE';
                            break;
                        case 7:
                            ret = 'PROCESSING_INSTRUCTION_NODE(' + val$.nodeName + ':' + val$.nodeValue + ')';
                            break;
                        case 8:
                            ret = 'COMMENT_NODE(' + val$.nodeValue + ')';
                            break;
                        case 9:
                            ret = 'DOCUMENT_NODE';
                            break;
                        case 10:
                            ret = 'DOCUMENT_TYPE_NODE';
                            break;
                        case 11:
                            ret = 'DOCUMENT_FRAGMENT_NODE';
                            break;
                        case 12:
                            ret = 'NOTATION_NODE';
                            break;
                    }
                }
                return ret;
            };
            var FORMAT_ARRAY = function (obj$, curDepth, padVal, padChar) {
                if (curDepth > 0) {
                    curDepth++;
                }
                var BASE_PAD = REPEAT_CHAR(padVal * (curDepth - 1), padChar),
                    THICK_PAD = REPEAT_CHAR(padVal * (curDepth + 1), padChar),
                    str = '',
                    val = '';
                if (
                    typeof obj$ === 'object' && 
                    obj$ !== null
                ) {
                    counter = 0;
                    for (var someProp in obj$) {
                        if (obj$.hasOwnProperty(someProp)) {
                            counter++;
                        }
                    }
                    str += 'array(' + counter + ') {\n';
                    for (var key in obj$) {
                        var objVal = obj$[key];
                        if (
                            typeof objVal === 'object' &&
                            objVal !== null &&
                            ! (objVal instanceof Date) &&
                            ! (objVal instanceof RegExp) &&
                            ! objVal.nodeName
                        ) {
                            str += THICK_PAD;
                            str += '[';
                            str += key;
                            str += '] =>\n';
                            str += THICK_PAD;
                            str += FORMAT_ARRAY(objVal, curDepth + 1, padVal, padChar);
                        } else {
                            val = GET_INNER_VAL(objVal, THICK_PAD);
                            str += THICK_PAD;
                            str += '[';
                            str += key;
                            str += '] =>\n';
                            str += THICK_PAD;
                            str += val;
                            str += '\n';
                        }
                    }
                    str += BASE_PAD + '}\n';
                } else {
                    str = GET_INNER_VAL(obj$, THICK_PAD);
                }
                return str;
            };
            output = FORMAT_ARRAY(arguments[0], 0, PAD_VAL, PAD_CHAR);

            for (var i = 1; i < arguments.length; i++) {
                output += '\n' + FORMAT_ARRAY(arguments[i], 0, PAD_VAL, PAD_CHAR);
            }
            
            return output;
        };

        var ua = (function() {
            // Const.
            var USER_AGENT = window.navigator.userAgent.toLowerCase(),
                TEST_NODE = document.createElement('div'),
                OS_ANDROID = 'android',
                OS_WINDOWS = 'windows',
                DEVICE_MOBILE = 'mobile',
                DEVICE_TABLET = 'tablet',
                DEVICE_OTHER = 'other',
                DEVICE_PHONE = 'phone',
                DEVICE_TABLET_PC = 'tablet pc',
                DEVICE_TOUCH = 'touch',
                DEVICE_KINDLE = 'kindle',
                DEVICE_IPHONE = 'iphone',
                DEVICE_IPOD = 'ipod',
                DEVICE_BLACKBERRY = 'blackberry',
                DEVICE_IPAD = 'ipad',
                DEVICE_PLAYBOOK = 'playbook',
                BROWSER_TRIDENT = 'trident',
                BROWSER_OPERA = 'opera',
                BROWSER_WEBKIT = 'webkit',
                BROWSER_GECCO = 'gecko',
                BROWSER_FIREFOX = 'firefox',
                BROWSER_SILK = 'silk',
                BROWSER_UNKNOWN = 'unknown',
                BROWSER_TYPE = (function() {
                    if (
                        isActiveX || 
                        'documentMode' in document && 
                        'number' == typeof document.documentMode
                    ) {
                        return BROWSER_TRIDENT;
                    }
                    if (
                        BROWSER_OPERA in window && 
                        ! window.opera.nodeName
                    ) {
                        return BROWSER_OPERA;
                    }
                    if (
                        'defaultstatus' in window && 
                        ! window.defaultstatus.nodeName
                    ) {
                        return BROWSER_WEBKIT;
                    }
                    if (
                        (
                            'XULElement' in window && 
                            ! window.XULElement.nodeType
                        ) || 
                        (
                            'CSS' in window && 
                            'function' == typeof window.CSS.supports && 
                            window.CSS.supports('-moz-binding', 'url("http://example.com/#foo")')
                        )
                    ) {
                        return BROWSER_GECCO;
                    }
                    
                    if (-1 !== USER_AGENT.indexOf(BROWSER_TRIDENT)) {
                        return BROWSER_TRIDENT;
                    } else if (-1 !== USER_AGENT.indexOf(BROWSER_WEBKIT)) {
                        return BROWSER_WEBKIT;
                    } else if (-1 !== USER_AGENT.indexOf(BROWSER_FIREFOX)) {
                        return BROWSER_GECCO;
                    }
                    return BROWSER_UNKNOWN;
                })();
            
            // Valiables.
            var currentDevice = DEVICE_OTHER,
                isActiveX = 'ActiveXObject' in window && 'function' === typeof window.ActiveXObject,
                isGecko = BROWSER_TYPE === BROWSER_GECCO,
                isOpera = BROWSER_TYPE === BROWSER_OPERA,
                isWebkit = BROWSER_TYPE === BROWSER_WEBKIT,
                isTrident = BROWSER_TYPE === BROWSER_TRIDENT,
                isUnknown = BROWSER_TYPE === BROWSER_UNKNOWN,
                cssPrefix = isOpera ? 'o' : isTrident ? 'ms' : isGecko ? 'moz' : isWebkit ? 'webkit' : cssPrefix,
                version = isOpera ? Number(window.opera.version()) :
                        isWebkit ? window.Worker ? 4 : document.evaluate ? 3 : 2 :
                        isGecko ? document.elementFromPoint ? 3 : 2 :
                        isTrident ? document.documentMode || (
                            'maxHeight' in TEST_NODE.style ? 7 : 6
                        ) : 0;

            if (
                USER_AGENT.indexOf(DEVICE_IPHONE) > 0 || 
                USER_AGENT.indexOf(DEVICE_IPOD) > 0 || 
                (
                    USER_AGENT.indexOf(OS_ANDROID) > 0 && 
                    USER_AGENT.indexOf(DEVICE_MOBILE) > 0
                ) ||
                (
                    USER_AGENT.indexOf(OS_WINDOWS) > 0 && 
                    USER_AGENT.indexOf(DEVICE_PHONE) > 0
                ) ||
                (
                    USER_AGENT.indexOf(BROWSER_FIREFOX) > 0 && 
                    USER_AGENT.indexOf(DEVICE_MOBILE) > 0
                ) ||
                USER_AGENT.indexOf(DEVICE_BLACKBERRY) > 0
            ) {
                currentDevice = DEVICE_MOBILE;
            } else if (
                USER_AGENT.indexOf(DEVICE_IPAD) > 0 ||
                (
                    USER_AGENT.indexOf(OS_WINDOWS) > 0 && 
                    USER_AGENT.indexOf(DEVICE_TOUCH) > 0 &&
                    USER_AGENT.indexOf(DEVICE_TABLET_PC) > 0
                ) ||
                (
                    USER_AGENT.indexOf(OS_ANDROID) > 0 && 
                    USER_AGENT.indexOf(DEVICE_MOBILE) === -1
                ) ||
                (
                    USER_AGENT.indexOf(BROWSER_FIREFOX) > 0 && 
                    USER_AGENT.indexOf(DEVICE_TABLET) > 0
                ) ||
                (
                    USER_AGENT.indexOf(DEVICE_KINDLE) > 0 && 
                    USER_AGENT.indexOf(BROWSER_SILK) > 0
                ) ||
                USER_AGENT.indexOf(DEVICE_PLAYBOOK) > 0
            ) {
                currentDevice = DEVICE_TABLET;
            }
            
            return {
                name: name,
                isMobile: currentDevice === DEVICE_MOBILE,
                isTablet: currentDevice === DEVICE_TABLET,
                isOther: currentDevice === DEVICE_OTHER,
                isGecko: isGecko,
                isOpera: isOpera,
                isWebkit: isWebkit,
                isTrident: isTrident,
                isUnknown: isUnknown,
                isActiveX: isActiveX,
                cssPrefix: cssPrefix,
                cssPrefixWithHyphen: cssPrefix ? '-' + cssPrefix + '-' : cssPrefix
            };

        })();

        // Common Valiables Storage.
        var global$ = {};

        return {
            ua: ua,
            data: {
                set: function(key, datas) {
                    global$[key] = datas;
                },
                get: function(key) {
                    if (global$.hasOwnProperty(key)) {
                        return global$[key];
                    }
                    return undefined;
                },
                destroy: function(key) {
                    if (global$.hasOwnProperty(key)) {
                        delete global$[key];
                    }
                }
            },
            debug: function(mixed) {
                var debug = VAR_DUMP(mixed);
                try {
                    throw new Error();
                } catch(error) {
                    if (error.stack) {
                        var stack = error.stack.toString().split(/\r\n|\n/),
                            currentUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                        var frameRegExp = new RegExp(currentUrl + '/([^:]+):([0-9]+):([0-9]+)');
                        for (var i = 0; i < stack.length; i++) {
                            var frame = stack[i];
                            if (
                                frameRegExp.test(frame) === true &&
                                frame.indexOf('.debug') === -1
                            ) {
                                var execFrame = frameRegExp.exec(frame);
                                debug = '[' + execFrame[1] + ' ' + execFrame[2] + ':' + execFrame[3] + ']\n\n' + debug;
                                break;
                            }
                        }
                    }
                }
                console.log(debug);
            }
        };    
    })(window.document);
    
    window.Common = Common;
})(this.window);