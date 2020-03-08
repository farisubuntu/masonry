! function (e) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    var f;
    "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.example = e()
  }
}(function () {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];
          return s(n ? n : e)
        }, l, l.exports, e, t, n, r)
      }
      return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
  })({
    1: [function (require, module, exports) {
      'use strict';

      var woofmark = require('..');
      var megamark = require('megamark');
      var domador = require('domador');
      var demo = 'https://raw.githubusercontent.com/bevacqua/woofmark/master/resources/demo.png';
      var rfence = /(^|\s)md-lang-((?:[^\s]|$)+)/;
      var rimage = /^image\/(gif|png|p?jpe?g)$/i;

      woofmark(document.querySelector('#ta'), {
        parseMarkdown: megamark,
        parseHTML: parseHTML,
        fencing: true,
        defaultMode: 'wysiwyg',
        images: {
          url: '/uploads/images',
          validate: imageValidator
        },
        attachments: {
          url: '/uploads/attachments'
        }
      });

      function parseHTML(value, options) {
        return domador(value, {
          fencing: true,
          fencinglanguage: fences,
          markers: options.markers
        });
      }

      function fences(el) {
        var match = el.firstChild.className.match(rfence);
        if (match) {
          return match.pop();
        }
      }

      function mockXhr(options, done) {
        setTimeout(function uploading() {
          done(null, {
            statusCode: 200
          }, {
            title: 'Surely you should be using real XHR!',
            href: demo + '?t=' + new Date().valueOf()
          });
        }, 2500);
      }

      function imageValidator(file) {
        return rimage.test(file.type);
      }

    }, {
      "..": 175,
      "domador": 15,
      "megamark": 113
    }],
    2: [function (require, module, exports) {
      'use strict';

      function assignment(result) {
        var stack = Array.prototype.slice.call(arguments, 1);
        var item;
        var key;
        while (stack.length) {
          item = stack.shift();
          for (key in item) {
            if (item.hasOwnProperty(key)) {
              if (typeof result[key] === 'object' && result[key] && Object.prototype.toString.call(result[key]) !== '[object Array]') {
                result[key] = assignment(result[key], item[key]);
              } else {
                result[key] = item[key];
              }
            }
          }
        }
        return result;
      }

      module.exports = assignment;

    }, {}],
    3: [function (require, module, exports) {
      module.exports = function atoa(a, n) {
        return Array.prototype.slice.call(a, n);
      }

    }, {}],
    4: [function (require, module, exports) {
      'use strict';

      var crossvent = require('crossvent');
      var throttle = require('./throttle');
      var tailormade = require('./tailormade');

      function bullseye(el, target, options) {
        var o = options;
        var domTarget = target && target.tagName;

        if (!domTarget && arguments.length === 2) {
          o = target;
        }
        if (!domTarget) {
          target = el;
        }
        if (!o) {
          o = {};
        }

        var destroyed = false;
        var throttledWrite = throttle(write, 30);
        var tailorOptions = {
          update: o.autoupdateToCaret !== false && update
        };
        var tailor = o.caret && tailormade(target, tailorOptions);

        write();

        if (o.tracking !== false) {
          crossvent.add(window, 'resize', throttledWrite);
        }

        return {
          read: readNull,
          refresh: write,
          destroy: destroy,
          sleep: sleep
        };

        function sleep() {
          tailorOptions.sleeping = true;
        }

        function readNull() {
          return read();
        }

        function read(readings) {
          var bounds = target.getBoundingClientRect();
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          if (tailor) {
            readings = tailor.read();
            return {
              x: (readings.absolute ? 0 : bounds.left) + readings.x,
              y: (readings.absolute ? 0 : bounds.top) + scrollTop + readings.y + 20
            };
          }
          return {
            x: bounds.left,
            y: bounds.top + scrollTop
          };
        }

        function update(readings) {
          write(readings);
        }

        function write(readings) {
          if (destroyed) {
            throw new Error('Bullseye can\'t refresh after being destroyed. Create another instance instead.');
          }
          if (tailor && !readings) {
            tailorOptions.sleeping = false;
            tailor.refresh();
            return;
          }
          var p = read(readings);
          if (!tailor && target !== el) {
            p.y += target.offsetHeight;
          }
          el.style.left = p.x + 'px';
          el.style.top = p.y + 'px';
        }

        function destroy() {
          if (tailor) {
            tailor.destroy();
          }
          crossvent.remove(window, 'resize', throttledWrite);
          destroyed = true;
        }
      }

      module.exports = bullseye;

    }, {
      "./tailormade": 5,
      "./throttle": 6,
      "crossvent": 12
    }],
    5: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var sell = require('sell');
        var crossvent = require('crossvent');
        var seleccion = require('seleccion');
        var throttle = require('./throttle');
        var getSelection = seleccion.get;
        var props = [
          'direction',
          'boxSizing',
          'width',
          'height',
          'overflowX',
          'overflowY',
          'borderTopWidth',
          'borderRightWidth',
          'borderBottomWidth',
          'borderLeftWidth',
          'paddingTop',
          'paddingRight',
          'paddingBottom',
          'paddingLeft',
          'fontStyle',
          'fontVariant',
          'fontWeight',
          'fontStretch',
          'fontSize',
          'fontSizeAdjust',
          'lineHeight',
          'fontFamily',
          'textAlign',
          'textTransform',
          'textIndent',
          'textDecoration',
          'letterSpacing',
          'wordSpacing'
        ];
        var win = global;
        var doc = document;
        var ff = win.mozInnerScreenX !== null && win.mozInnerScreenX !== void 0;

        function tailormade(el, options) {
          var textInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
          var throttledRefresh = throttle(refresh, 30);
          var o = options || {};

          bind();

          return {
            read: readPosition,
            refresh: throttledRefresh,
            destroy: destroy
          };

          function noop() {}

          function readPosition() {
            return (textInput ? coordsText : coordsHTML)();
          }

          function refresh() {
            if (o.sleeping) {
              return;
            }
            return (o.update || noop)(readPosition());
          }

          function coordsText() {
            var p = sell(el);
            var context = prepare();
            var readings = readTextCoords(context, p.start);
            doc.body.removeChild(context.mirror);
            return readings;
          }

          function coordsHTML() {
            var sel = getSelection();
            if (sel.rangeCount) {
              var range = sel.getRangeAt(0);
              var needsToWorkAroundNewlineBug = range.startContainer.nodeName === 'P' && range.startOffset === 0;
              if (needsToWorkAroundNewlineBug) {
                return {
                  x: range.startContainer.offsetLeft,
                  y: range.startContainer.offsetTop,
                  absolute: true
                };
              }
              if (range.getClientRects) {
                var rects = range.getClientRects();
                if (rects.length > 0) {
                  return {
                    x: rects[0].left,
                    y: rects[0].top,
                    absolute: true
                  };
                }
              }
            }
            return {
              x: 0,
              y: 0
            };
          }

          function readTextCoords(context, p) {
            var rest = doc.createElement('span');
            var mirror = context.mirror;
            var computed = context.computed;

            write(mirror, read(el).substring(0, p));

            if (el.tagName === 'INPUT') {
              mirror.textContent = mirror.textContent.replace(/\s/g, '\u00a0');
            }

            write(rest, read(el).substring(p) || '.');

            mirror.appendChild(rest);

            return {
              x: rest.offsetLeft + parseInt(computed['borderLeftWidth']),
              y: rest.offsetTop + parseInt(computed['borderTopWidth'])
            };
          }

          function read(el) {
            return textInput ? el.value : el.innerHTML;
          }

          function prepare() {
            var computed = win.getComputedStyle ? getComputedStyle(el) : el.currentStyle;
            var mirror = doc.createElement('div');
            var style = mirror.style;

            doc.body.appendChild(mirror);

            if (el.tagName !== 'INPUT') {
              style.wordWrap = 'break-word';
            }
            style.whiteSpace = 'pre-wrap';
            style.position = 'absolute';
            style.visibility = 'hidden';
            props.forEach(copy);

            if (ff) {
              style.width = parseInt(computed.width) - 2 + 'px';
              if (el.scrollHeight > parseInt(computed.height)) {
                style.overflowY = 'scroll';
              }
            } else {
              style.overflow = 'hidden';
            }
            return {
              mirror: mirror,
              computed: computed
            };

            function copy(prop) {
              style[prop] = computed[prop];
            }
          }

          function write(el, value) {
            if (textInput) {
              el.textContent = value;
            } else {
              el.innerHTML = value;
            }
          }

          function bind(remove) {
            var op = remove ? 'remove' : 'add';
            crossvent[op](el, 'keydown', throttledRefresh);
            crossvent[op](el, 'keyup', throttledRefresh);
            crossvent[op](el, 'input', throttledRefresh);
            crossvent[op](el, 'paste', throttledRefresh);
            crossvent[op](el, 'change', throttledRefresh);
          }

          function destroy() {
            bind(true);
          }
        }

        module.exports = tailormade;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9idWxsc2V5ZS90YWlsb3JtYWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHNlbGwgPSByZXF1aXJlKCdzZWxsJyk7XG52YXIgY3Jvc3N2ZW50ID0gcmVxdWlyZSgnY3Jvc3N2ZW50Jyk7XG52YXIgc2VsZWNjaW9uID0gcmVxdWlyZSgnc2VsZWNjaW9uJyk7XG52YXIgdGhyb3R0bGUgPSByZXF1aXJlKCcuL3Rocm90dGxlJyk7XG52YXIgZ2V0U2VsZWN0aW9uID0gc2VsZWNjaW9uLmdldDtcbnZhciBwcm9wcyA9IFtcbiAgJ2RpcmVjdGlvbicsXG4gICdib3hTaXppbmcnLFxuICAnd2lkdGgnLFxuICAnaGVpZ2h0JyxcbiAgJ292ZXJmbG93WCcsXG4gICdvdmVyZmxvd1knLFxuICAnYm9yZGVyVG9wV2lkdGgnLFxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdib3JkZXJMZWZ0V2lkdGgnLFxuICAncGFkZGluZ1RvcCcsXG4gICdwYWRkaW5nUmlnaHQnLFxuICAncGFkZGluZ0JvdHRvbScsXG4gICdwYWRkaW5nTGVmdCcsXG4gICdmb250U3R5bGUnLFxuICAnZm9udFZhcmlhbnQnLFxuICAnZm9udFdlaWdodCcsXG4gICdmb250U3RyZXRjaCcsXG4gICdmb250U2l6ZScsXG4gICdmb250U2l6ZUFkanVzdCcsXG4gICdsaW5lSGVpZ2h0JyxcbiAgJ2ZvbnRGYW1pbHknLFxuICAndGV4dEFsaWduJyxcbiAgJ3RleHRUcmFuc2Zvcm0nLFxuICAndGV4dEluZGVudCcsXG4gICd0ZXh0RGVjb3JhdGlvbicsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ3dvcmRTcGFjaW5nJ1xuXTtcbnZhciB3aW4gPSBnbG9iYWw7XG52YXIgZG9jID0gZG9jdW1lbnQ7XG52YXIgZmYgPSB3aW4ubW96SW5uZXJTY3JlZW5YICE9PSBudWxsICYmIHdpbi5tb3pJbm5lclNjcmVlblggIT09IHZvaWQgMDtcblxuZnVuY3Rpb24gdGFpbG9ybWFkZSAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIHRleHRJbnB1dCA9IGVsLnRhZ05hbWUgPT09ICdJTlBVVCcgfHwgZWwudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJztcbiAgdmFyIHRocm90dGxlZFJlZnJlc2ggPSB0aHJvdHRsZShyZWZyZXNoLCAzMCk7XG4gIHZhciBvID0gb3B0aW9ucyB8fCB7fTtcblxuICBiaW5kKCk7XG5cbiAgcmV0dXJuIHtcbiAgICByZWFkOiByZWFkUG9zaXRpb24sXG4gICAgcmVmcmVzaDogdGhyb3R0bGVkUmVmcmVzaCxcbiAgICBkZXN0cm95OiBkZXN0cm95XG4gIH07XG5cbiAgZnVuY3Rpb24gbm9vcCAoKSB7fVxuICBmdW5jdGlvbiByZWFkUG9zaXRpb24gKCkgeyByZXR1cm4gKHRleHRJbnB1dCA/IGNvb3Jkc1RleHQgOiBjb29yZHNIVE1MKSgpOyB9XG5cbiAgZnVuY3Rpb24gcmVmcmVzaCAoKSB7XG4gICAgaWYgKG8uc2xlZXBpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIChvLnVwZGF0ZSB8fCBub29wKShyZWFkUG9zaXRpb24oKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjb29yZHNUZXh0ICgpIHtcbiAgICB2YXIgcCA9IHNlbGwoZWwpO1xuICAgIHZhciBjb250ZXh0ID0gcHJlcGFyZSgpO1xuICAgIHZhciByZWFkaW5ncyA9IHJlYWRUZXh0Q29vcmRzKGNvbnRleHQsIHAuc3RhcnQpO1xuICAgIGRvYy5ib2R5LnJlbW92ZUNoaWxkKGNvbnRleHQubWlycm9yKTtcbiAgICByZXR1cm4gcmVhZGluZ3M7XG4gIH1cblxuICBmdW5jdGlvbiBjb29yZHNIVE1MICgpIHtcbiAgICB2YXIgc2VsID0gZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICB2YXIgcmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgIHZhciBuZWVkc1RvV29ya0Fyb3VuZE5ld2xpbmVCdWcgPSByYW5nZS5zdGFydENvbnRhaW5lci5ub2RlTmFtZSA9PT0gJ1AnICYmIHJhbmdlLnN0YXJ0T2Zmc2V0ID09PSAwO1xuICAgICAgaWYgKG5lZWRzVG9Xb3JrQXJvdW5kTmV3bGluZUJ1Zykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHJhbmdlLnN0YXJ0Q29udGFpbmVyLm9mZnNldExlZnQsXG4gICAgICAgICAgeTogcmFuZ2Uuc3RhcnRDb250YWluZXIub2Zmc2V0VG9wLFxuICAgICAgICAgIGFic29sdXRlOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAocmFuZ2UuZ2V0Q2xpZW50UmVjdHMpIHtcbiAgICAgICAgdmFyIHJlY3RzID0gcmFuZ2UuZ2V0Q2xpZW50UmVjdHMoKTtcbiAgICAgICAgaWYgKHJlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcmVjdHNbMF0ubGVmdCxcbiAgICAgICAgICAgIHk6IHJlY3RzWzBdLnRvcCxcbiAgICAgICAgICAgIGFic29sdXRlOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB4OiAwLCB5OiAwIH07XG4gIH1cblxuICBmdW5jdGlvbiByZWFkVGV4dENvb3JkcyAoY29udGV4dCwgcCkge1xuICAgIHZhciByZXN0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB2YXIgbWlycm9yID0gY29udGV4dC5taXJyb3I7XG4gICAgdmFyIGNvbXB1dGVkID0gY29udGV4dC5jb21wdXRlZDtcblxuICAgIHdyaXRlKG1pcnJvciwgcmVhZChlbCkuc3Vic3RyaW5nKDAsIHApKTtcblxuICAgIGlmIChlbC50YWdOYW1lID09PSAnSU5QVVQnKSB7XG4gICAgICBtaXJyb3IudGV4dENvbnRlbnQgPSBtaXJyb3IudGV4dENvbnRlbnQucmVwbGFjZSgvXFxzL2csICdcXHUwMGEwJyk7XG4gICAgfVxuXG4gICAgd3JpdGUocmVzdCwgcmVhZChlbCkuc3Vic3RyaW5nKHApIHx8ICcuJyk7XG5cbiAgICBtaXJyb3IuYXBwZW5kQ2hpbGQocmVzdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogcmVzdC5vZmZzZXRMZWZ0ICsgcGFyc2VJbnQoY29tcHV0ZWRbJ2JvcmRlckxlZnRXaWR0aCddKSxcbiAgICAgIHk6IHJlc3Qub2Zmc2V0VG9wICsgcGFyc2VJbnQoY29tcHV0ZWRbJ2JvcmRlclRvcFdpZHRoJ10pXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGVsKSB7XG4gICAgcmV0dXJuIHRleHRJbnB1dCA/IGVsLnZhbHVlIDogZWwuaW5uZXJIVE1MO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlcGFyZSAoKSB7XG4gICAgdmFyIGNvbXB1dGVkID0gd2luLmdldENvbXB1dGVkU3R5bGUgPyBnZXRDb21wdXRlZFN0eWxlKGVsKSA6IGVsLmN1cnJlbnRTdHlsZTtcbiAgICB2YXIgbWlycm9yID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZhciBzdHlsZSA9IG1pcnJvci5zdHlsZTtcblxuICAgIGRvYy5ib2R5LmFwcGVuZENoaWxkKG1pcnJvcik7XG5cbiAgICBpZiAoZWwudGFnTmFtZSAhPT0gJ0lOUFVUJykge1xuICAgICAgc3R5bGUud29yZFdyYXAgPSAnYnJlYWstd29yZCc7XG4gICAgfVxuICAgIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnO1xuICAgIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBzdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgcHJvcHMuZm9yRWFjaChjb3B5KTtcblxuICAgIGlmIChmZikge1xuICAgICAgc3R5bGUud2lkdGggPSBwYXJzZUludChjb21wdXRlZC53aWR0aCkgLSAyICsgJ3B4JztcbiAgICAgIGlmIChlbC5zY3JvbGxIZWlnaHQgPiBwYXJzZUludChjb21wdXRlZC5oZWlnaHQpKSB7XG4gICAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIH1cbiAgICByZXR1cm4geyBtaXJyb3I6IG1pcnJvciwgY29tcHV0ZWQ6IGNvbXB1dGVkIH07XG5cbiAgICBmdW5jdGlvbiBjb3B5IChwcm9wKSB7XG4gICAgICBzdHlsZVtwcm9wXSA9IGNvbXB1dGVkW3Byb3BdO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlIChlbCwgdmFsdWUpIHtcbiAgICBpZiAodGV4dElucHV0KSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kIChyZW1vdmUpIHtcbiAgICB2YXIgb3AgPSByZW1vdmUgPyAncmVtb3ZlJyA6ICdhZGQnO1xuICAgIGNyb3NzdmVudFtvcF0oZWwsICdrZXlkb3duJywgdGhyb3R0bGVkUmVmcmVzaCk7XG4gICAgY3Jvc3N2ZW50W29wXShlbCwgJ2tleXVwJywgdGhyb3R0bGVkUmVmcmVzaCk7XG4gICAgY3Jvc3N2ZW50W29wXShlbCwgJ2lucHV0JywgdGhyb3R0bGVkUmVmcmVzaCk7XG4gICAgY3Jvc3N2ZW50W29wXShlbCwgJ3Bhc3RlJywgdGhyb3R0bGVkUmVmcmVzaCk7XG4gICAgY3Jvc3N2ZW50W29wXShlbCwgJ2NoYW5nZScsIHRocm90dGxlZFJlZnJlc2gpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gICAgYmluZCh0cnVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhaWxvcm1hZGU7XG4iXX0=
    }, {
      "./throttle": 6,
      "crossvent": 12,
      "seleccion": 124,
      "sell": 126
    }],
    6: [function (require, module, exports) {
      'use strict';

      function throttle(fn, boundary) {
        var last = -Infinity;
        var timer;
        return function bounced() {
          if (timer) {
            return;
          }
          unbound();

          function unbound() {
            clearTimeout(timer);
            timer = null;
            var next = last + boundary;
            var now = Date.now();
            if (now > next) {
              last = now;
              fn();
            } else {
              timer = setTimeout(unbound, next - now);
            }
          }
        };
      }

      module.exports = throttle;

    }, {}],
    7: [function (require, module, exports) {
      'use strict';

      var xhr = require('xhr');
      var crossvent = require('crossvent');
      var emitter = require('contra/emitter');
      var validators = {
        image: isItAnImageFile
      };
      var rimagemime = /^image\/(gif|png|p?jpe?g)$/i;

      function setup(fileinput, options) {
        var bureaucrat = create(options);
        crossvent.add(fileinput, 'change', handler, false);

        return bureaucrat;

        function handler(e) {
          stop(e);
          if (fileinput.files.length) {
            bureaucrat.submit(fileinput.files);
          }
          fileinput.value = '';
          fileinput.value = null;
        }
      }

      function create(options) {
        var o = options || {};
        o.formData = o.formData || {};
        o.fieldKey = o.fieldKey || 'uploads';
        var bureaucrat = emitter({
          submit: submit
        });
        return bureaucrat;

        function submit(rawFiles) {
          bureaucrat.emit('started', rawFiles);
          var allFiles = Array.prototype.slice.call(rawFiles);
          var validFiles = filter(allFiles);
          if (!validFiles) {
            bureaucrat.emit('invalid', allFiles);
            return;
          }
          bureaucrat.emit('valid', validFiles);
          var form = new FormData();
          Object.keys(o.formData).forEach(function copyFormData(key) {
            form.append(key, o.formData[key]);
          });
          var req = {
            'Content-Type': 'multipart/form-data',
            headers: {
              Accept: 'application/json'
            },
            method: o.method || 'PUT',
            url: o.endpoint || '/api/files',
            body: form
          };

          validFiles.forEach(appendFile);
          xhr(req, handleResponse);

          function appendFile(file) {
            form.append(o.fieldKey, file, file.name);
          }

          function handleResponse(err, res, body) {
            res.body = body = getData(body);
            var results = body && body.results && Array.isArray(body.results) ? body.results : [];
            var failed = err || res.statusCode < 200 || res.statusCode > 299 || body instanceof Error;
            if (failed) {
              bureaucrat.emit('error', err);
            } else {
              bureaucrat.emit('success', results, body);
            }
            bureaucrat.emit('ended', err, results, body);
          }
        }

        function filter(files) {
          return o.validate ? files.filter(whereValid) : files;

          function whereValid(file) {
            var validator = validators[o.validate] || o.validate;
            return validator(file);
          }
        }
      }

      function stop(e) {
        e.stopPropagation();
        e.preventDefault();
      }

      function isItAnImageFile(file) {
        return rimagemime.test(file.type);
      }

      function getData(body) {
        try {
          return JSON.parse(body);
        } catch (err) {
          return err;
        }
      }

      module.exports = {
        create: create,
        setup: setup
      };

    }, {
      "contra/emitter": 11,
      "crossvent": 8,
      "xhr": 131
    }],
    8: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var customEvent = require('custom-event');
        var eventmap = require('./eventmap');
        var doc = global.document;
        var addEvent = addEventEasy;
        var removeEvent = removeEventEasy;
        var hardCache = [];

        if (!global.addEventListener) {
          addEvent = addEventHard;
          removeEvent = removeEventHard;
        }

        module.exports = {
          add: addEvent,
          remove: removeEvent,
          fabricate: fabricateEvent
        };

        function addEventEasy(el, type, fn, capturing) {
          return el.addEventListener(type, fn, capturing);
        }

        function addEventHard(el, type, fn) {
          return el.attachEvent('on' + type, wrap(el, type, fn));
        }

        function removeEventEasy(el, type, fn, capturing) {
          return el.removeEventListener(type, fn, capturing);
        }

        function removeEventHard(el, type, fn) {
          var listener = unwrap(el, type, fn);
          if (listener) {
            return el.detachEvent('on' + type, listener);
          }
        }

        function fabricateEvent(el, type, model) {
          var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
          if (el.dispatchEvent) {
            el.dispatchEvent(e);
          } else {
            el.fireEvent('on' + type, e);
          }

          function makeClassicEvent() {
            var e;
            if (doc.createEvent) {
              e = doc.createEvent('Event');
              e.initEvent(type, true, true);
            } else if (doc.createEventObject) {
              e = doc.createEventObject();
            }
            return e;
          }

          function makeCustomEvent() {
            return new customEvent(type, {
              detail: model
            });
          }
        }

        function wrapperFactory(el, type, fn) {
          return function wrapper(originalEvent) {
            var e = originalEvent || global.event;
            e.target = e.target || e.srcElement;
            e.preventDefault = e.preventDefault || function preventDefault() {
              e.returnValue = false;
            };
            e.stopPropagation = e.stopPropagation || function stopPropagation() {
              e.cancelBubble = true;
            };
            e.which = e.which || e.keyCode;
            fn.call(el, e);
          };
        }

        function wrap(el, type, fn) {
          var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
          hardCache.push({
            wrapper: wrapper,
            element: el,
            type: type,
            fn: fn
          });
          return wrapper;
        }

        function unwrap(el, type, fn) {
          var i = find(el, type, fn);
          if (i) {
            var wrapper = hardCache[i].wrapper;
            hardCache.splice(i, 1); // free up a tad of memory
            return wrapper;
          }
        }

        function find(el, type, fn) {
          var i, item;
          for (i = 0; i < hardCache.length; i++) {
            item = hardCache[i];
            if (item.element === el && item.type === type && item.fn === fn) {
              return i;
            }
          }
        }

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9idXJlYXVjcmFjeS9ub2RlX21vZHVsZXMvY3Jvc3N2ZW50L3NyYy9jcm9zc3ZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3VzdG9tRXZlbnQgPSByZXF1aXJlKCdjdXN0b20tZXZlbnQnKTtcbnZhciBldmVudG1hcCA9IHJlcXVpcmUoJy4vZXZlbnRtYXAnKTtcbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgYWRkRXZlbnQgPSBhZGRFdmVudEVhc3k7XG52YXIgcmVtb3ZlRXZlbnQgPSByZW1vdmVFdmVudEVhc3k7XG52YXIgaGFyZENhY2hlID0gW107XG5cbmlmICghZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgYWRkRXZlbnQgPSBhZGRFdmVudEhhcmQ7XG4gIHJlbW92ZUV2ZW50ID0gcmVtb3ZlRXZlbnRIYXJkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkOiBhZGRFdmVudCxcbiAgcmVtb3ZlOiByZW1vdmVFdmVudCxcbiAgZmFicmljYXRlOiBmYWJyaWNhdGVFdmVudFxufTtcblxuZnVuY3Rpb24gYWRkRXZlbnRFYXN5IChlbCwgdHlwZSwgZm4sIGNhcHR1cmluZykge1xuICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgY2FwdHVyaW5nKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRIYXJkIChlbCwgdHlwZSwgZm4pIHtcbiAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KCdvbicgKyB0eXBlLCB3cmFwKGVsLCB0eXBlLCBmbikpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudEVhc3kgKGVsLCB0eXBlLCBmbiwgY2FwdHVyaW5nKSB7XG4gIHJldHVybiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBjYXB0dXJpbmcpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudEhhcmQgKGVsLCB0eXBlLCBmbikge1xuICB2YXIgbGlzdGVuZXIgPSB1bndyYXAoZWwsIHR5cGUsIGZuKTtcbiAgaWYgKGxpc3RlbmVyKSB7XG4gICAgcmV0dXJuIGVsLmRldGFjaEV2ZW50KCdvbicgKyB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmFicmljYXRlRXZlbnQgKGVsLCB0eXBlLCBtb2RlbCkge1xuICB2YXIgZSA9IGV2ZW50bWFwLmluZGV4T2YodHlwZSkgPT09IC0xID8gbWFrZUN1c3RvbUV2ZW50KCkgOiBtYWtlQ2xhc3NpY0V2ZW50KCk7XG4gIGlmIChlbC5kaXNwYXRjaEV2ZW50KSB7XG4gICAgZWwuZGlzcGF0Y2hFdmVudChlKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5maXJlRXZlbnQoJ29uJyArIHR5cGUsIGUpO1xuICB9XG4gIGZ1bmN0aW9uIG1ha2VDbGFzc2ljRXZlbnQgKCkge1xuICAgIHZhciBlO1xuICAgIGlmIChkb2MuY3JlYXRlRXZlbnQpIHtcbiAgICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICBlLmluaXRFdmVudCh0eXBlLCB0cnVlLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGRvYy5jcmVhdGVFdmVudE9iamVjdCkge1xuICAgICAgZSA9IGRvYy5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgIH1cbiAgICByZXR1cm4gZTtcbiAgfVxuICBmdW5jdGlvbiBtYWtlQ3VzdG9tRXZlbnQgKCkge1xuICAgIHJldHVybiBuZXcgY3VzdG9tRXZlbnQodHlwZSwgeyBkZXRhaWw6IG1vZGVsIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdyYXBwZXJGYWN0b3J5IChlbCwgdHlwZSwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZXIgKG9yaWdpbmFsRXZlbnQpIHtcbiAgICB2YXIgZSA9IG9yaWdpbmFsRXZlbnQgfHwgZ2xvYmFsLmV2ZW50O1xuICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuICAgIGUucHJldmVudERlZmF1bHQgPSBlLnByZXZlbnREZWZhdWx0IHx8IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0ICgpIHsgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlOyB9O1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uID0gZS5zdG9wUHJvcGFnYXRpb24gfHwgZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uICgpIHsgZS5jYW5jZWxCdWJibGUgPSB0cnVlOyB9O1xuICAgIGUud2hpY2ggPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICBmbi5jYWxsKGVsLCBlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcCAoZWwsIHR5cGUsIGZuKSB7XG4gIHZhciB3cmFwcGVyID0gdW53cmFwKGVsLCB0eXBlLCBmbikgfHwgd3JhcHBlckZhY3RvcnkoZWwsIHR5cGUsIGZuKTtcbiAgaGFyZENhY2hlLnB1c2goe1xuICAgIHdyYXBwZXI6IHdyYXBwZXIsXG4gICAgZWxlbWVudDogZWwsXG4gICAgdHlwZTogdHlwZSxcbiAgICBmbjogZm5cbiAgfSk7XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5mdW5jdGlvbiB1bndyYXAgKGVsLCB0eXBlLCBmbikge1xuICB2YXIgaSA9IGZpbmQoZWwsIHR5cGUsIGZuKTtcbiAgaWYgKGkpIHtcbiAgICB2YXIgd3JhcHBlciA9IGhhcmRDYWNoZVtpXS53cmFwcGVyO1xuICAgIGhhcmRDYWNoZS5zcGxpY2UoaSwgMSk7IC8vIGZyZWUgdXAgYSB0YWQgb2YgbWVtb3J5XG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZCAoZWwsIHR5cGUsIGZuKSB7XG4gIHZhciBpLCBpdGVtO1xuICBmb3IgKGkgPSAwOyBpIDwgaGFyZENhY2hlLmxlbmd0aDsgaSsrKSB7XG4gICAgaXRlbSA9IGhhcmRDYWNoZVtpXTtcbiAgICBpZiAoaXRlbS5lbGVtZW50ID09PSBlbCAmJiBpdGVtLnR5cGUgPT09IHR5cGUgJiYgaXRlbS5mbiA9PT0gZm4pIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxufVxuIl19
    }, {
      "./eventmap": 9,
      "custom-event": 14
    }],
    9: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var eventmap = [];
        var eventname = '';
        var ron = /^on/;

        for (eventname in global) {
          if (ron.test(eventname)) {
            eventmap.push(eventname.slice(2));
          }
        }

        module.exports = eventmap;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9idXJlYXVjcmFjeS9ub2RlX21vZHVsZXMvY3Jvc3N2ZW50L3NyYy9ldmVudG1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXZlbnRtYXAgPSBbXTtcbnZhciBldmVudG5hbWUgPSAnJztcbnZhciByb24gPSAvXm9uLztcblxuZm9yIChldmVudG5hbWUgaW4gZ2xvYmFsKSB7XG4gIGlmIChyb24udGVzdChldmVudG5hbWUpKSB7XG4gICAgZXZlbnRtYXAucHVzaChldmVudG5hbWUuc2xpY2UoMikpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXZlbnRtYXA7XG4iXX0=
    }, {}],
    10: [function (require, module, exports) {
      'use strict';

      var ticky = require('ticky');

      module.exports = function debounce(fn, args, ctx) {
        if (!fn) {
          return;
        }
        ticky(function run() {
          fn.apply(ctx || null, args || []);
        });
      };

    }, {
      "ticky": 129
    }],
    11: [function (require, module, exports) {
      'use strict';

      var atoa = require('atoa');
      var debounce = require('./debounce');

      module.exports = function emitter(thing, options) {
        var opts = options || {};
        var evt = {};
        if (thing === undefined) {
          thing = {};
        }
        thing.on = function (type, fn) {
          if (!evt[type]) {
            evt[type] = [fn];
          } else {
            evt[type].push(fn);
          }
          return thing;
        };
        thing.once = function (type, fn) {
          fn._once = true; // thing.off(fn) still works!
          thing.on(type, fn);
          return thing;
        };
        thing.off = function (type, fn) {
          var c = arguments.length;
          if (c === 1) {
            delete evt[type];
          } else if (c === 0) {
            evt = {};
          } else {
            var et = evt[type];
            if (!et) {
              return thing;
            }
            et.splice(et.indexOf(fn), 1);
          }
          return thing;
        };
        thing.emit = function () {
          var args = atoa(arguments);
          return thing.emitterSnapshot(args.shift()).apply(this, args);
        };
        thing.emitterSnapshot = function (type) {
          var et = (evt[type] || []).slice(0);
          return function () {
            var args = atoa(arguments);
            var ctx = this || thing;
            if (type === 'error' && opts.throws !== false && !et.length) {
              throw args.length === 1 ? args[0] : args;
            }
            et.forEach(function emitter(listen) {
              if (opts.async) {
                debounce(listen, args, ctx);
              } else {
                listen.apply(ctx, args);
              }
              if (listen._once) {
                thing.off(type, listen);
              }
            });
            return thing;
          };
        };
        return thing;
      };

    }, {
      "./debounce": 10,
      "atoa": 3
    }],
    12: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var customEvent = require('custom-event');
        var eventmap = require('./eventmap');
        var doc = document;
        var addEvent = addEventEasy;
        var removeEvent = removeEventEasy;
        var hardCache = [];

        if (!global.addEventListener) {
          addEvent = addEventHard;
          removeEvent = removeEventHard;
        }

        function addEventEasy(el, type, fn, capturing) {
          return el.addEventListener(type, fn, capturing);
        }

        function addEventHard(el, type, fn) {
          return el.attachEvent('on' + type, wrap(el, type, fn));
        }

        function removeEventEasy(el, type, fn, capturing) {
          return el.removeEventListener(type, fn, capturing);
        }

        function removeEventHard(el, type, fn) {
          return el.detachEvent('on' + type, unwrap(el, type, fn));
        }

        function fabricateEvent(el, type, model) {
          var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
          if (el.dispatchEvent) {
            el.dispatchEvent(e);
          } else {
            el.fireEvent('on' + type, e);
          }

          function makeClassicEvent() {
            var e;
            if (doc.createEvent) {
              e = doc.createEvent('Event');
              e.initEvent(type, true, true);
            } else if (doc.createEventObject) {
              e = doc.createEventObject();
            }
            return e;
          }

          function makeCustomEvent() {
            return new customEvent(type, {
              detail: model
            });
          }
        }

        function wrapperFactory(el, type, fn) {
          return function wrapper(originalEvent) {
            var e = originalEvent || global.event;
            e.target = e.target || e.srcElement;
            e.preventDefault = e.preventDefault || function preventDefault() {
              e.returnValue = false;
            };
            e.stopPropagation = e.stopPropagation || function stopPropagation() {
              e.cancelBubble = true;
            };
            e.which = e.which || e.keyCode;
            fn.call(el, e);
          };
        }

        function wrap(el, type, fn) {
          var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
          hardCache.push({
            wrapper: wrapper,
            element: el,
            type: type,
            fn: fn
          });
          return wrapper;
        }

        function unwrap(el, type, fn) {
          var i = find(el, type, fn);
          if (i) {
            var wrapper = hardCache[i].wrapper;
            hardCache.splice(i, 1); // free up a tad of memory
            return wrapper;
          }
        }

        function find(el, type, fn) {
          var i, item;
          for (i = 0; i < hardCache.length; i++) {
            item = hardCache[i];
            if (item.element === el && item.type === type && item.fn === fn) {
              return i;
            }
          }
        }

        module.exports = {
          add: addEvent,
          remove: removeEvent,
          fabricate: fabricateEvent
        };

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9jcm9zc3ZlbnQvc3JjL2Nyb3NzdmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBjdXN0b21FdmVudCA9IHJlcXVpcmUoJ2N1c3RvbS1ldmVudCcpO1xudmFyIGV2ZW50bWFwID0gcmVxdWlyZSgnLi9ldmVudG1hcCcpO1xudmFyIGRvYyA9IGRvY3VtZW50O1xudmFyIGFkZEV2ZW50ID0gYWRkRXZlbnRFYXN5O1xudmFyIHJlbW92ZUV2ZW50ID0gcmVtb3ZlRXZlbnRFYXN5O1xudmFyIGhhcmRDYWNoZSA9IFtdO1xuXG5pZiAoIWdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gIGFkZEV2ZW50ID0gYWRkRXZlbnRIYXJkO1xuICByZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50SGFyZDtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRFYXN5IChlbCwgdHlwZSwgZm4sIGNhcHR1cmluZykge1xuICByZXR1cm4gZWwuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgY2FwdHVyaW5nKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRIYXJkIChlbCwgdHlwZSwgZm4pIHtcbiAgcmV0dXJuIGVsLmF0dGFjaEV2ZW50KCdvbicgKyB0eXBlLCB3cmFwKGVsLCB0eXBlLCBmbikpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudEVhc3kgKGVsLCB0eXBlLCBmbiwgY2FwdHVyaW5nKSB7XG4gIHJldHVybiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBjYXB0dXJpbmcpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudEhhcmQgKGVsLCB0eXBlLCBmbikge1xuICByZXR1cm4gZWwuZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIHVud3JhcChlbCwgdHlwZSwgZm4pKTtcbn1cblxuZnVuY3Rpb24gZmFicmljYXRlRXZlbnQgKGVsLCB0eXBlLCBtb2RlbCkge1xuICB2YXIgZSA9IGV2ZW50bWFwLmluZGV4T2YodHlwZSkgPT09IC0xID8gbWFrZUN1c3RvbUV2ZW50KCkgOiBtYWtlQ2xhc3NpY0V2ZW50KCk7XG4gIGlmIChlbC5kaXNwYXRjaEV2ZW50KSB7XG4gICAgZWwuZGlzcGF0Y2hFdmVudChlKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5maXJlRXZlbnQoJ29uJyArIHR5cGUsIGUpO1xuICB9XG4gIGZ1bmN0aW9uIG1ha2VDbGFzc2ljRXZlbnQgKCkge1xuICAgIHZhciBlO1xuICAgIGlmIChkb2MuY3JlYXRlRXZlbnQpIHtcbiAgICAgIGUgPSBkb2MuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICBlLmluaXRFdmVudCh0eXBlLCB0cnVlLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGRvYy5jcmVhdGVFdmVudE9iamVjdCkge1xuICAgICAgZSA9IGRvYy5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgIH1cbiAgICByZXR1cm4gZTtcbiAgfVxuICBmdW5jdGlvbiBtYWtlQ3VzdG9tRXZlbnQgKCkge1xuICAgIHJldHVybiBuZXcgY3VzdG9tRXZlbnQodHlwZSwgeyBkZXRhaWw6IG1vZGVsIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdyYXBwZXJGYWN0b3J5IChlbCwgdHlwZSwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZXIgKG9yaWdpbmFsRXZlbnQpIHtcbiAgICB2YXIgZSA9IG9yaWdpbmFsRXZlbnQgfHwgZ2xvYmFsLmV2ZW50O1xuICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuICAgIGUucHJldmVudERlZmF1bHQgPSBlLnByZXZlbnREZWZhdWx0IHx8IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0ICgpIHsgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlOyB9O1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uID0gZS5zdG9wUHJvcGFnYXRpb24gfHwgZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uICgpIHsgZS5jYW5jZWxCdWJibGUgPSB0cnVlOyB9O1xuICAgIGUud2hpY2ggPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICBmbi5jYWxsKGVsLCBlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcCAoZWwsIHR5cGUsIGZuKSB7XG4gIHZhciB3cmFwcGVyID0gdW53cmFwKGVsLCB0eXBlLCBmbikgfHwgd3JhcHBlckZhY3RvcnkoZWwsIHR5cGUsIGZuKTtcbiAgaGFyZENhY2hlLnB1c2goe1xuICAgIHdyYXBwZXI6IHdyYXBwZXIsXG4gICAgZWxlbWVudDogZWwsXG4gICAgdHlwZTogdHlwZSxcbiAgICBmbjogZm5cbiAgfSk7XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5mdW5jdGlvbiB1bndyYXAgKGVsLCB0eXBlLCBmbikge1xuICB2YXIgaSA9IGZpbmQoZWwsIHR5cGUsIGZuKTtcbiAgaWYgKGkpIHtcbiAgICB2YXIgd3JhcHBlciA9IGhhcmRDYWNoZVtpXS53cmFwcGVyO1xuICAgIGhhcmRDYWNoZS5zcGxpY2UoaSwgMSk7IC8vIGZyZWUgdXAgYSB0YWQgb2YgbWVtb3J5XG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZCAoZWwsIHR5cGUsIGZuKSB7XG4gIHZhciBpLCBpdGVtO1xuICBmb3IgKGkgPSAwOyBpIDwgaGFyZENhY2hlLmxlbmd0aDsgaSsrKSB7XG4gICAgaXRlbSA9IGhhcmRDYWNoZVtpXTtcbiAgICBpZiAoaXRlbS5lbGVtZW50ID09PSBlbCAmJiBpdGVtLnR5cGUgPT09IHR5cGUgJiYgaXRlbS5mbiA9PT0gZm4pIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkOiBhZGRFdmVudCxcbiAgcmVtb3ZlOiByZW1vdmVFdmVudCxcbiAgZmFicmljYXRlOiBmYWJyaWNhdGVFdmVudFxufTtcbiJdfQ==
    }, {
      "./eventmap": 13,
      "custom-event": 14
    }],
    13: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var eventmap = [];
        var eventname = '';
        var ron = /^on/;

        for (eventname in global) {
          if (ron.test(eventname)) {
            eventmap.push(eventname.slice(2));
          }
        }

        module.exports = eventmap;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9jcm9zc3ZlbnQvc3JjL2V2ZW50bWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBldmVudG1hcCA9IFtdO1xudmFyIGV2ZW50bmFtZSA9ICcnO1xudmFyIHJvbiA9IC9eb24vO1xuXG5mb3IgKGV2ZW50bmFtZSBpbiBnbG9iYWwpIHtcbiAgaWYgKHJvbi50ZXN0KGV2ZW50bmFtZSkpIHtcbiAgICBldmVudG1hcC5wdXNoKGV2ZW50bmFtZS5zbGljZSgyKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBldmVudG1hcDtcbiJdfQ==
    }, {}],
    14: [function (require, module, exports) {
      (function (global) {

        var NativeCustomEvent = global.CustomEvent;

        function useNative() {
          try {
            var p = new NativeCustomEvent('cat', {
              detail: {
                foo: 'bar'
              }
            });
            return 'cat' === p.type && 'bar' === p.detail.foo;
          } catch (e) {}
          return false;
        }

        /**
         * Cross-browser `CustomEvent` constructor.
         *
         * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
         *
         * @public
         */

        module.exports = useNative() ? NativeCustomEvent :

          // IE >= 9
          'function' === typeof document.createEvent ? function CustomEvent(type, params) {
            var e = document.createEvent('CustomEvent');
            if (params) {
              e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
            } else {
              e.initCustomEvent(type, false, false, void 0);
            }
            return e;
          } :

          // IE <= 8
          function CustomEvent(type, params) {
            var e = document.createEventObject();
            e.type = type;
            if (params) {
              e.bubbles = Boolean(params.bubbles);
              e.cancelable = Boolean(params.cancelable);
              e.detail = params.detail;
            } else {
              e.bubbles = false;
              e.cancelable = false;
              e.detail = void 0;
            }
            return e;
          }

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9jdXN0b20tZXZlbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBOYXRpdmVDdXN0b21FdmVudCA9IGdsb2JhbC5DdXN0b21FdmVudDtcblxuZnVuY3Rpb24gdXNlTmF0aXZlICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgcCA9IG5ldyBOYXRpdmVDdXN0b21FdmVudCgnY2F0JywgeyBkZXRhaWw6IHsgZm9vOiAnYmFyJyB9IH0pO1xuICAgIHJldHVybiAgJ2NhdCcgPT09IHAudHlwZSAmJiAnYmFyJyA9PT0gcC5kZXRhaWwuZm9vO1xuICB9IGNhdGNoIChlKSB7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyb3NzLWJyb3dzZXIgYEN1c3RvbUV2ZW50YCBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQuQ3VzdG9tRXZlbnRcbiAqXG4gKiBAcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IE5hdGl2ZUN1c3RvbUV2ZW50IDpcblxuLy8gSUUgPj0gOVxuJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID8gZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICBpZiAocGFyYW1zKSB7XG4gICAgZS5pbml0Q3VzdG9tRXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfSBlbHNlIHtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIHZvaWQgMCk7XG4gIH1cbiAgcmV0dXJuIGU7XG59IDpcblxuLy8gSUUgPD0gOFxuZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKHR5cGUsIHBhcmFtcykge1xuICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gIGUudHlwZSA9IHR5cGU7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBlLmJ1YmJsZXMgPSBCb29sZWFuKHBhcmFtcy5idWJibGVzKTtcbiAgICBlLmNhbmNlbGFibGUgPSBCb29sZWFuKHBhcmFtcy5jYW5jZWxhYmxlKTtcbiAgICBlLmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gIH0gZWxzZSB7XG4gICAgZS5idWJibGVzID0gZmFsc2U7XG4gICAgZS5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgZS5kZXRhaWwgPSB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG4iXX0=
    }, {}],
    15: [function (require, module, exports) {
      'use strict';

      require('string.prototype.repeat');

      var replacements = {
        '\\\\': '\\\\',
        '\\[': '\\[',
        '\\]': '\\]',
        '>': '\\>',
        '_': '\\_',
        '\\*': '\\*',
        '`': '\\`',
        '#': '\\#',
        '([0-9])\\.(\\s|$)': '$1\\.$2',
        '\u00a9': '(c)',
        '\u00ae': '(r)',
        '\u2122': '(tm)',
        '\u00a0': ' ',
        '\u00b7': '\\*',
        '\u2002': ' ',
        '\u2003': ' ',
        '\u2009': ' ',
        '\u2018': '\'',
        '\u2019': '\'',
        '\u201c': '"',
        '\u201d': '"',
        '\u2026': '...',
        '\u2013': '--',
        '\u2014': '---'
      };
      var replacers = Object.keys(replacements).reduce(replacer, {});
      var rspaces = /^\s+|\s+$/g;
      var rdisplay = /(display|visibility)\s*:\s*[a-z]+/gi;
      var rhidden = /(none|hidden)\s*$/i;
      var rheading = /^H([1-6])$/;
      var shallowTags = [
        'APPLET', 'AREA', 'AUDIO', 'BUTTON', 'CANVAS', 'DATALIST', 'EMBED', 'HEAD', 'INPUT', 'MAP',
        'MENU', 'METER', 'NOFRAMES', 'NOSCRIPT', 'OBJECT', 'OPTGROUP', 'OPTION', 'PARAM', 'PROGRESS',
        'RP', 'RT', 'RUBY', 'SCRIPT', 'SELECT', 'STYLE', 'TEXTAREA', 'TITLE', 'VIDEO'
      ];
      var paragraphTags = [
        'ADDRESS', 'ARTICLE', 'ASIDE', 'DIV', 'FIELDSET', 'FOOTER', 'HEADER', 'NAV', 'P', 'SECTION'
      ];
      var blockTags = [
        'ADDRESS', 'ARTICLE', 'ASIDE', 'DIV', 'FIELDSET', 'FOOTER', 'HEADER', 'NAV', 'P', 'SECTION', 'UL', 'LI', 'BLOCKQUOTE', 'BR'
      ];
      var windowContext = require('./virtualWindowContext');

      function replacer(result, key) {
        result[key] = new RegExp(key, 'g');
        return result;
      }

      function many(text, times) {
        return new Array(times + 1).join(text);
      }

      function padLeft(text, times) {
        return many(' ', times) + text;
      }

      function trim(text) {
        if (text.trim) {
          return text.trim();
        }
        return text.replace(rspaces, '');
      }

      function attr(el, prop, direct) {
        var proper = direct === void 0 || direct;
        if (proper || typeof el.getAttribute !== 'function') {
          return el[prop] || '';
        }
        return el.getAttribute(prop) || '';
      }

      function has(el, prop, direct) {
        var proper = direct === void 0 || direct;
        if (proper || typeof el.hasAttribute !== 'function') {
          return el.hasOwnProperty(prop);
        }
        return el.hasAttribute(prop);
      }

      function processPlainText(text, tagName) {
        var key;
        var block = paragraphTags.indexOf(tagName) !== -1 || tagName === 'BLOCKQUOTE';
        text = text.replace(/\n([ \t]*\n)+/g, '\n');
        text = text.replace(/\n[ \t]+/g, '\n');
        text = text.replace(/[ \t]+/g, ' ');
        for (key in replacements) {
          text = text.replace(replacers[key], replacements[key]);
        }
        text = text.replace(/(\s*)\\#/g, block ? removeUnnecessaryEscapes : '$1#');
        return text;

        function removeUnnecessaryEscapes(escaped, spaces, i) {
          return i ? spaces + '#' : escaped;
        }
      }

      function processCode(text) {
        return text.replace(/`/g, '\\`');
      }

      function outputMapper(fn, tagName) {
        return function bitProcessor(bit) {
          if (bit.marker) {
            return bit.marker;
          }
          if (!fn) {
            return bit.text;
          }
          return fn(bit.text, tagName);
        };
      }

      function noop() {}

      function parse(html, options) {
        return new Domador(html, options).parse();
      }

      function Domador(html, options) {
        this.html = html || '';
        this.htmlIndex = 0;
        this.options = options || {};
        this.markers = this.options.markers ? this.options.markers.sort(asc) : [];
        this.windowContext = windowContext(this.options);
        this.atLeft = this.noTrailingWhitespace = this.atP = true;
        this.buffer = this.childBuffer = '';
        this.exceptions = [];
        this.order = 1;
        this.listDepth = 0;
        this.inCode = this.inPre = this.inOrderedList = this.inTable = false;
        this.last = null;
        this.left = '\n';
        this.links = [];
        this.linkMap = {};
        this.unhandled = {};
        if (this.options.absolute === void 0) {
          this.options.absolute = false;
        }
        if (this.options.fencing === void 0) {
          this.options.fencing = false;
        }
        if (this.options.fencinglanguage === void 0) {
          this.options.fencinglanguage = noop;
        }
        if (this.options.transform === void 0) {
          this.options.transform = noop;
        }

        function asc(a, b) {
          return a[0] - b[0];
        }
      }

      Domador.prototype.append = function append(text) {
        if (this.last != null) {
          this.buffer += this.last;
        }
        this.childBuffer += text;
        return this.last = text;
      };

      Domador.prototype.br = function br() {
        this.append('  ' + this.left);
        return this.atLeft = this.noTrailingWhitespace = true;
      };

      Domador.prototype.code = function code() {
        var old;
        old = this.inCode;
        this.inCode = true;
        return (function (_this) {
          return function after() {
            return _this.inCode = old;
          };
        })(this);
      };

      Domador.prototype.li = function li() {
        var result;
        result = this.inOrderedList ? (this.order++) + '. ' : '- ';
        result = padLeft(result, (this.listDepth - 1) * 2);
        return this.append(result);
      };

      Domador.prototype.td = function td(header) {
        this.noTrailingWhitespace = false;
        this.output(' ');
        this.childBuffer = '';
        this.noTrailingWhitespace = false;
        return function after() {
          var spaces = header ? 0 : Math.max(0, this.tableCols[this.tableCol++] - this.childBuffer.length);
          this.append(' '.repeat(spaces + 1) + '|');
          this.noTrailingWhitespace = true;
        };
      };

      Domador.prototype.ol = function ol() {
        var inOrderedList, order;
        if (this.listDepth === 0) {
          this.p();
        }
        inOrderedList = this.inOrderedList;
        order = this.order;
        this.inOrderedList = true;
        this.order = 1;
        this.listDepth++;
        return (function (_this) {
          return function after() {
            _this.inOrderedList = inOrderedList;
            _this.order = order;
            return _this.listDepth--;
          };
        })(this);
      };

      Domador.prototype.ul = function ul() {
        var inOrderedList, order;
        if (this.listDepth === 0) {
          this.p();
        }
        inOrderedList = this.inOrderedList;
        order = this.order;
        this.inOrderedList = false;
        this.order = 1;
        this.listDepth++;
        return (function (_this) {
          return function after() {
            _this.inOrderedList = inOrderedList;
            _this.order = order;
            return _this.listDepth--;
          };
        })(this);
      };

      Domador.prototype.output = function output(text) {
        if (!text) {
          return;
        }
        if (!this.inPre) {
          text = this.noTrailingWhitespace ? text.replace(/^[ \t\n]+/, '') : /^[ \t]*\n/.test(text) ? text.replace(/^[ \t\n]+/, '\n') : text.replace(/^[ \t]+/, ' ');
        }
        if (text === '') {
          return;
        }
        this.atP = /\n\n$/.test(text);
        this.atLeft = /\n$/.test(text);
        this.noTrailingWhitespace = /[ \t\n]$/.test(text);
        return this.append(text.replace(/\n/g, this.left));
      };

      Domador.prototype.outputLater = function outputLater(text) {
        return (function (self) {
          return function after() {
            return self.output(text);
          };
        })(this);
      };

      Domador.prototype.p = function p() {
        if (this.atP) {
          return;
        }
        if (this.startingBlockquote) {
          this.append('\n');
        } else {
          this.append(this.left);
        }
        if (!this.atLeft) {
          this.append(this.left);
          this.atLeft = true;
        }
        return this.noTrailingWhitespace = this.atP = true;
      };

      Domador.prototype.parse = function parse() {
        var container;
        var i;
        var link;
        var ref;
        this.buffer = '';
        if (!this.html) {
          return this.buffer;
        }
        if (typeof this.html === 'string') {
          container = this.windowContext.document.createElement('div');
          container.innerHTML = this.htmlLeft = this.html;
        } else {
          container = this.html;
          this.html = this.htmlLeft = container.innerHTML;
        }
        this.process(container);
        if (this.links.length) {
          while (this.lastElement.parentElement !== container && this.lastElement.tagName !== 'BLOCKQUOTE') {
            this.lastElement = this.lastElement.parentElement;
          }
          if (this.lastElement.tagName !== 'BLOCKQUOTE') {
            this.append('\n\n');
          }
          ref = this.links;
          for (i = 0; i < ref.length; i++) {
            link = ref[i];
            if (link) {
              this.append('[' + (i + 1) + ']: ' + link + '\n');
            }
          }
        }
        this.append('');
        this.buffer = this.buffer.replace(/\n{3,}/g, '\n\n');
        return this.buffer = trim(this.buffer);
      };

      Domador.prototype.pre = function pre() {
        var old;
        old = this.inPre;
        this.inPre = true;
        return (function (_this) {
          return function after() {
            return _this.inPre = old;
          };
        })(this);
      };

      Domador.prototype.htmlTag = function htmlTag(type) {
        this.output('<' + type + '>');
        return this.outputLater('</' + type + '>');
      };

      Domador.prototype.advanceHtmlIndex = function advanceHtmlIndex(token) {
        if (this.markers.length === 0) {
          return;
        }

        var re = new RegExp(token, 'ig');
        var match = re.exec(this.htmlLeft);
        if (!match) {
          return;
        }
        var diff = re.lastIndex;
        this.htmlIndex += diff;
        this.htmlLeft = this.htmlLeft.slice(diff);
      };

      Domador.prototype.insertMarkers = function insertMarkers() {
        while (this.markers.length && this.markers[0][0] <= this.htmlIndex) {
          this.append(this.markers.shift()[1]);
        }
      };

      Domador.prototype.interleaveMarkers = function interleaveMarkers(text) {
        var marker;
        var markerStart;
        var lastMarkerStart = 0;
        var bits = [];
        while (this.markers.length && this.markers[0][0] <= this.htmlIndex + text.length) {
          marker = this.markers.shift();
          markerStart = Math.max(0, marker[0] - this.htmlIndex);
          bits.push({
            text: text.slice(lastMarkerStart, markerStart)
          }, {
            marker: marker[1]
          });
          lastMarkerStart = markerStart;
        }
        bits.push({
          text: text.slice(lastMarkerStart)
        });
        return bits;
      };

      Domador.prototype.process = function process(el) {
        var after;
        var base;
        var href;
        var i;
        var ref;
        var suffix;
        var summary;
        var title;
        var frameSrc;
        var interleaved;

        if (!this.isVisible(el)) {
          return;
        }

        if ((this.inTable || this.inPre) && blockTags.indexOf(el.tagName) !== -1) {
          return this.output(el.outerHTML);
        }

        if (el.nodeType === this.windowContext.Node.TEXT_NODE) {
          if (!this.inPre && el.nodeValue.replace(/\n/g, '').length === 0) {
            return;
          }
          interleaved = this.interleaveMarkers(el.nodeValue);
          if (this.inPre || this.inTable) {
            return this.output(interleaved.map(outputMapper()).join(''));
          }
          if (this.inCode) {
            return this.output(interleaved.map(outputMapper(processCode)).join(''));
          }
          return this.output(interleaved.map(outputMapper(processPlainText, el.parentElement && el.parentElement.tagName)).join(''));
        }

        if (el.nodeType !== this.windowContext.Node.ELEMENT_NODE) {
          return;
        }

        if (this.lastElement) { // i.e not the auto-inserted <div> wrapper
          this.insertMarkers();
          this.advanceHtmlIndex('<' + el.tagName);
          this.advanceHtmlIndex('>');

          var transformed = this.options.transform(el);
          if (transformed !== void 0) {
            return this.output(transformed);
          }
        }
        this.lastElement = el;

        if (shallowTags.indexOf(el.tagName) !== -1) {
          this.advanceHtmlIndex('\\/\\s?>');
          return;
        }

        switch (el.tagName) {
          case 'H1':
          case 'H2':
          case 'H3':
          case 'H4':
          case 'H5':
          case 'H6':
            this.p();
            this.output(many('#', parseInt(el.tagName.match(rheading)[1])) + ' ');
            break;
          case 'ADDRESS':
          case 'ARTICLE':
          case 'ASIDE':
          case 'DIV':
          case 'FIELDSET':
          case 'FOOTER':
          case 'HEADER':
          case 'NAV':
          case 'P':
          case 'SECTION':
            this.p();
            break;
          case 'BODY':
          case 'FORM':
            break;
          case 'DETAILS':
            this.p();
            if (!has(el, 'open', false)) {
              summary = el.getElementsByTagName('summary')[0];
              if (summary) {
                this.process(summary);
              }
              return;
            }
            break;
          case 'BR':
            this.br();
            break;
          case 'HR':
            this.p();
            this.output('---------');
            this.p();
            break;
          case 'CITE':
          case 'DFN':
          case 'EM':
          case 'I':
          case 'U':
          case 'VAR':
            this.output('_');
            this.noTrailingWhitespace = true;
            after = this.outputLater('_');
            break;
          case 'MARK':
            this.output('<mark>');
            after = this.outputLater('</mark>');
            break;
          case 'DT':
          case 'B':
          case 'STRONG':
            if (el.tagName === 'DT') {
              this.p();
            }
            this.output('**');
            this.noTrailingWhitespace = true;
            after = this.outputLater('**');
            break;
          case 'Q':
            this.output('"');
            this.noTrailingWhitespace = true;
            after = this.outputLater('"');
            break;
          case 'OL':
            after = this.ol();
            break;
          case 'UL':
            after = this.ul();
            break;
          case 'LI':
            this.replaceLeft('\n');
            this.li();
            break;
          case 'PRE':
            if (this.options.fencing) {
              this.append('\n\n');
              this.openCodeFence(el);
              after = [this.pre(), this.outputLater('\n```')];
            } else {
              after = [this.pushLeft('    '), this.pre()];
            }
            break;
          case 'CODE':
          case 'SAMP':
            if (this.inPre) {
              break;
            }
            this.output('`');
            after = [this.code(), this.outputLater('`')];
            break;
          case 'BLOCKQUOTE':
          case 'DD':
            this.startingBlockquote = true;
            after = this.pushLeft('> ');
            this.startingBlockquote = false;
            break;
          case 'KBD':
            after = this.htmlTag('kbd');
            break;
          case 'A':
          case 'IMG':
            href = attr(el, el.tagName === 'A' ? 'href' : 'src', this.options.absolute);
            if (!href) {
              break;
            }
            title = attr(el, 'title');
            if (title) {
              href += ' "' + title + '"';
            }
            if (this.options.inline) {
              suffix = '(' + href + ')';
            } else {
              suffix = '[' + ((base = this.linkMap)[href] != null ? base[href] : base[href] = this.links.push(href)) + ']';
            }
            if (el.tagName === 'IMG') {
              this.output('![' + attr(el, 'alt') + ']' + suffix);
              return;
            }
            this.output('[');
            this.noTrailingWhitespace = true;
            after = this.outputLater(']' + suffix);
            break;
          case 'IFRAME':
            try {
              if ((ref = el.contentDocument) != null ? ref.documentElement : void 0) {
                this.process(el.contentDocument.documentElement);
              } else {
                frameSrc = attr(el, 'src');
                if (frameSrc && this.options.allowFrame && this.options.allowFrame(frameSrc)) {
                  this.output('<iframe src="' + frameSrc + '"></iframe>');
                }
              }
            } catch (err) {}
            return;
        }

        after = this.tables(el) || after;

        for (i = 0; i < el.childNodes.length; i++) {
          this.process(el.childNodes[i]);
        }

        this.advanceHtmlIndex('<\\s?\\/\\s?' + el.tagName + '>');

        if (typeof after === 'function') {
          after = [after];
        }
        while (after && after.length) {
          after.shift().call(this);
        }
      };

      Domador.prototype.tables = function tables(el) {
        if (this.options.tables === false) {
          return;
        }

        var name = el.tagName;
        if (name === 'TABLE') {
          var oldInTable;
          oldInTable = this.inTable;
          this.inTable = true;
          this.append('\n\n');
          this.tableCols = [];
          return (function (_this) {
            return function after() {
              return _this.inTable = oldInTable;
            };
          })(this);
        }
        if (name === 'THEAD') {
          return function after() {
            return this.append('|' + this.tableCols.reduce(reducer, '') + '\n');

            function reducer(all, thLength) {
              return all + '-'.repeat(thLength + 2) + '|';
            }
          };
        }
        if (name === 'TH') {
          return [function after() {
            this.tableCols.push(this.childBuffer.length);
          }, this.td(true)];
        }
        if (name === 'TR') {
          this.tableCol = 0;
          this.output('|');
          this.noTrailingWhitespace = true;
          return function after() {
            this.append('\n');
          };
        }
        if (name === 'TD') {
          return this.td();
        }
      };

      Domador.prototype.pushLeft = function pushLeft(text) {
        var old;
        old = this.left;
        this.left += text;
        if (this.atP) {
          this.append(text);
        } else {
          this.p();
        }
        return (function (_this) {
          return function () {
            _this.left = old;
            _this.atLeft = _this.atP = false;
            return _this.p();
          };
        })(this);
      };

      Domador.prototype.replaceLeft = function replaceLeft(text) {
        if (!this.atLeft) {
          this.append(this.left.replace(/[ ]{2,4}$/, text));
          return this.atLeft = this.noTrailingWhitespace = this.atP = true;
        } else if (this.last) {
          return this.last = this.last.replace(/[ ]{2,4}$/, text);
        }
      };

      Domador.prototype.isVisible = function isVisible(el) {
        var display;
        var i;
        var property;
        var visibility;
        var visible = true;
        var style = attr(el, 'style', false);
        var properties = style != null ? typeof style.match === 'function' ? style.match(rdisplay) : void 0 : void 0;
        if (properties != null) {
          for (i = 0; i < properties.length; i++) {
            property = properties[i];
            visible = !rhidden.test(property);
          }
        }
        if (visible && typeof this.windowContext.getComputedStyle === 'function') {
          try {
            style = this.windowContext.getComputedStyle(el, null);
            if (typeof (style != null ? style.getPropertyValue : void 0) === 'function') {
              display = style.getPropertyValue('display');
              visibility = style.getPropertyValue('visibility');
              visible = display !== 'none' && visibility !== 'hidden';
            }
          } catch (err) {}
        }
        return visible;
      };

      Domador.prototype.openCodeFence = function openCodeFence(el) {
        var fencinglanguage = this.options.fencinglanguage(el);
        var child = el.childNodes[0];
        if (!fencinglanguage && child && child.tagName === 'CODE') {
          fencinglanguage = this.options.fencinglanguage(el.childNodes[0]);
        }
        this.output('```' + (fencinglanguage || '') + '\n');
      };

      module.exports = parse;

    }, {
      "./virtualWindowContext": 16,
      "string.prototype.repeat": 128
    }],
    16: [function (require, module, exports) {
      'use strict';

      if (!window.Node) {
        window.Node = {
          ELEMENT_NODE: 1,
          TEXT_NODE: 3
        };
      }

      function windowContext() {
        return window;
      }

      module.exports = windowContext;

    }, {}],
    17: [function (require, module, exports) {
      'use strict';

      var isCallable = require('is-callable');

      var toStr = Object.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;

      var forEachArray = function forEachArray(array, iterator, receiver) {
        for (var i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
              iterator(array[i], i, array);
            } else {
              iterator.call(receiver, array[i], i, array);
            }
          }
        }
      };

      var forEachString = function forEachString(string, iterator, receiver) {
        for (var i = 0, len = string.length; i < len; i++) {
          // no such thing as a sparse string.
          if (receiver == null) {
            iterator(string.charAt(i), i, string);
          } else {
            iterator.call(receiver, string.charAt(i), i, string);
          }
        }
      };

      var forEachObject = function forEachObject(object, iterator, receiver) {
        for (var k in object) {
          if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
              iterator(object[k], k, object);
            } else {
              iterator.call(receiver, object[k], k, object);
            }
          }
        }
      };

      var forEach = function forEach(list, iterator, thisArg) {
        if (!isCallable(iterator)) {
          throw new TypeError('iterator must be a function');
        }

        var receiver;
        if (arguments.length >= 3) {
          receiver = thisArg;
        }

        if (toStr.call(list) === '[object Array]') {
          forEachArray(list, iterator, receiver);
        } else if (typeof list === 'string') {
          forEachString(list, iterator, receiver);
        } else {
          forEachObject(list, iterator, receiver);
        }
      };

      module.exports = forEach;

    }, {
      "is-callable": 39
    }],
    18: [function (require, module, exports) {
      (function (global) {
        var win;

        if (typeof window !== "undefined") {
          win = window;
        } else if (typeof global !== "undefined") {
          win = global;
        } else if (typeof self !== "undefined") {
          win = self;
        } else {
          win = {};
        }

        module.exports = win;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgd2luO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbiA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbiA9IGdsb2JhbDtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgIHdpbiA9IHNlbGY7XG59IGVsc2Uge1xuICAgIHdpbiA9IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbjtcbiJdfQ==
    }, {}],
    19: [function (require, module, exports) {
      var Highlight = function () {

        /* Utility functions */

        function escape(value) {
          return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
        }

        function tag(node) {
          return node.nodeName.toLowerCase();
        }

        function testRe(re, lexeme) {
          var match = re && re.exec(lexeme);
          return match && match.index == 0;
        }

        function blockText(block) {
          return Array.prototype.map.call(block.childNodes, function (node) {
            if (node.nodeType == 3) {
              return options.useBR ? node.nodeValue.replace(/\n/g, '') : node.nodeValue;
            }
            if (tag(node) == 'br') {
              return '\n';
            }
            return blockText(node);
          }).join('');
        }

        function blockLanguage(block) {
          var classes = (block.className + ' ' + (block.parentNode ? block.parentNode.className : '')).split(/\s+/);
          classes = classes.map(function (c) {
            return c.replace(/^language-/, '');
          });
          return classes.filter(function (c) {
            return getLanguage(c) || c == 'no-highlight';
          })[0];
        }

        function inherit(parent, obj) {
          var result = {};
          for (var key in parent)
            result[key] = parent[key];
          if (obj)
            for (var key in obj)
              result[key] = obj[key];
          return result;
        };

        /* Stream merging */

        function nodeStream(node) {
          var result = [];
          (function _nodeStream(node, offset) {
            for (var child = node.firstChild; child; child = child.nextSibling) {
              if (child.nodeType == 3)
                offset += child.nodeValue.length;
              else if (tag(child) == 'br')
                offset += 1;
              else if (child.nodeType == 1) {
                result.push({
                  event: 'start',
                  offset: offset,
                  node: child
                });
                offset = _nodeStream(child, offset);
                result.push({
                  event: 'stop',
                  offset: offset,
                  node: child
                });
              }
            }
            return offset;
          })(node, 0);
          return result;
        }

        function mergeStreams(original, highlighted, value) {
          var processed = 0;
          var result = '';
          var nodeStack = [];

          function selectStream() {
            if (!original.length || !highlighted.length) {
              return original.length ? original : highlighted;
            }
            if (original[0].offset != highlighted[0].offset) {
              return (original[0].offset < highlighted[0].offset) ? original : highlighted;
            }

            /*
            To avoid starting the stream just before it should stop the order is
            ensured that original always starts first and closes last:

            if (event1 == 'start' && event2 == 'start')
              return original;
            if (event1 == 'start' && event2 == 'stop')
              return highlighted;
            if (event1 == 'stop' && event2 == 'start')
              return original;
            if (event1 == 'stop' && event2 == 'stop')
              return highlighted;

            ... which is collapsed to:
            */
            return highlighted[0].event == 'start' ? original : highlighted;
          }

          function open(node) {
            function attr_str(a) {
              return ' ' + a.nodeName + '="' + escape(a.value) + '"';
            }
            result += '<' + tag(node) + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
          }

          function close(node) {
            result += '</' + tag(node) + '>';
          }

          function render(event) {
            (event.event == 'start' ? open : close)(event.node);
          }

          while (original.length || highlighted.length) {
            var stream = selectStream();
            result += escape(value.substr(processed, stream[0].offset - processed));
            processed = stream[0].offset;
            if (stream == original) {
              /*
              On any opening or closing tag of the original markup we first close
              the entire highlighted node stack, then render the original tag along
              with all the following original tags at the same offset and then
              reopen all the tags on the highlighted stack.
              */
              nodeStack.reverse().forEach(close);
              do {
                render(stream.splice(0, 1)[0]);
                stream = selectStream();
              } while (stream == original && stream.length && stream[0].offset == processed);
              nodeStack.reverse().forEach(open);
            } else {
              if (stream[0].event == 'start') {
                nodeStack.push(stream[0].node);
              } else {
                nodeStack.pop();
              }
              render(stream.splice(0, 1)[0]);
            }
          }
          return result + escape(value.substr(processed));
        }

        /* Initialization */

        function compileLanguage(language) {

          function reStr(re) {
            return (re && re.source) || re;
          }

          function langRe(value, global) {
            return RegExp(
              reStr(value),
              'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
            );
          }

          function compileMode(mode, parent) {
            if (mode.compiled)
              return;
            mode.compiled = true;

            mode.keywords = mode.keywords || mode.beginKeywords;
            if (mode.keywords) {
              var compiled_keywords = {};

              function flatten(className, str) {
                if (language.case_insensitive) {
                  str = str.toLowerCase();
                }
                str.split(' ').forEach(function (kw) {
                  var pair = kw.split('|');
                  compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
                });
              }

              if (typeof mode.keywords == 'string') { // string
                flatten('keyword', mode.keywords);
              } else {
                Object.keys(mode.keywords).forEach(function (className) {
                  flatten(className, mode.keywords[className]);
                });
              }
              mode.keywords = compiled_keywords;
            }
            mode.lexemesRe = langRe(mode.lexemes || /\b[A-Za-z0-9_]+\b/, true);

            if (parent) {
              if (mode.beginKeywords) {
                mode.begin = mode.beginKeywords.split(' ').join('|');
              }
              if (!mode.begin)
                mode.begin = /\B|\b/;
              mode.beginRe = langRe(mode.begin);
              if (!mode.end && !mode.endsWithParent)
                mode.end = /\B|\b/;
              if (mode.end)
                mode.endRe = langRe(mode.end);
              mode.terminator_end = reStr(mode.end) || '';
              if (mode.endsWithParent && parent.terminator_end)
                mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
            }
            if (mode.illegal)
              mode.illegalRe = langRe(mode.illegal);
            if (mode.relevance === undefined)
              mode.relevance = 1;
            if (!mode.contains) {
              mode.contains = [];
            }
            var expanded_contains = [];
            mode.contains.forEach(function (c) {
              if (c.variants) {
                c.variants.forEach(function (v) {
                  expanded_contains.push(inherit(c, v));
                });
              } else {
                expanded_contains.push(c == 'self' ? mode : c);
              }
            });
            mode.contains = expanded_contains;
            mode.contains.forEach(function (c) {
              compileMode(c, mode);
            });

            if (mode.starts) {
              compileMode(mode.starts, parent);
            }

            var terminators =
              mode.contains.map(function (c) {
                return c.beginKeywords ? '\\.?\\b(' + c.begin + ')\\b\\.?' : c.begin;
              })
              .concat([mode.terminator_end])
              .concat([mode.illegal])
              .map(reStr)
              .filter(Boolean);
            mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {
              exec: function (s) {
                return null;
              }
            };

            mode.continuation = {};
          }

          compileMode(language);
        }

        /*
        Core highlighting function. Accepts a language name, or an alias, and a
        string with the code to highlight. Returns an object with the following
        properties:

        - relevance (int)
        - value (an HTML string with highlighting markup)

        */
        function highlight(name, value, ignore_illegals, continuation) {

          function subMode(lexeme, mode) {
            for (var i = 0; i < mode.contains.length; i++) {
              if (testRe(mode.contains[i].beginRe, lexeme)) {
                return mode.contains[i];
              }
            }
          }

          function endOfMode(mode, lexeme) {
            if (testRe(mode.endRe, lexeme)) {
              return mode;
            }
            if (mode.endsWithParent) {
              return endOfMode(mode.parent, lexeme);
            }
          }

          function isIllegal(lexeme, mode) {
            return !ignore_illegals && testRe(mode.illegalRe, lexeme);
          }

          function keywordMatch(mode, match) {
            var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
            return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
          }

          function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
            var classPrefix = noPrefix ? '' : options.classPrefix,
              openSpan = '<span class="' + classPrefix,
              closeSpan = leaveOpen ? '' : '</span>';

            openSpan += classname + '">';

            return openSpan + insideSpan + closeSpan;
          }

          function processKeywords() {
            var buffer = escape(mode_buffer);
            if (!top.keywords)
              return buffer;
            var result = '';
            var last_index = 0;
            top.lexemesRe.lastIndex = 0;
            var match = top.lexemesRe.exec(buffer);
            while (match) {
              result += buffer.substr(last_index, match.index - last_index);
              var keyword_match = keywordMatch(top, match);
              if (keyword_match) {
                relevance += keyword_match[1];
                result += buildSpan(keyword_match[0], match[0]);
              } else {
                result += match[0];
              }
              last_index = top.lexemesRe.lastIndex;
              match = top.lexemesRe.exec(buffer);
            }
            return result + buffer.substr(last_index);
          }

          function processSubLanguage() {
            if (top.subLanguage && !languages[top.subLanguage]) {
              return escape(mode_buffer);
            }
            var result = top.subLanguage ? highlight(top.subLanguage, mode_buffer, true, top.continuation.top) : highlightAuto(mode_buffer);
            // Counting embedded language score towards the host language may be disabled
            // with zeroing the containing mode relevance. Usecase in point is Markdown that
            // allows XML everywhere and makes every XML snippet to have a much larger Markdown
            // score.
            if (top.relevance > 0) {
              relevance += result.relevance;
            }
            if (top.subLanguageMode == 'continuous') {
              top.continuation.top = result.top;
            }
            return buildSpan(result.language, result.value, false, true);
          }

          function processBuffer() {
            return top.subLanguage !== undefined ? processSubLanguage() : processKeywords();
          }

          function startNewMode(mode, lexeme) {
            var markup = mode.className ? buildSpan(mode.className, '', true) : '';
            if (mode.returnBegin) {
              result += markup;
              mode_buffer = '';
            } else if (mode.excludeBegin) {
              result += escape(lexeme) + markup;
              mode_buffer = '';
            } else {
              result += markup;
              mode_buffer = lexeme;
            }
            top = Object.create(mode, {
              parent: {
                value: top
              }
            });
          }

          function processLexeme(buffer, lexeme) {

            mode_buffer += buffer;
            if (lexeme === undefined) {
              result += processBuffer();
              return 0;
            }

            var new_mode = subMode(lexeme, top);
            if (new_mode) {
              result += processBuffer();
              startNewMode(new_mode, lexeme);
              return new_mode.returnBegin ? 0 : lexeme.length;
            }

            var end_mode = endOfMode(top, lexeme);
            if (end_mode) {
              var origin = top;
              if (!(origin.returnEnd || origin.excludeEnd)) {
                mode_buffer += lexeme;
              }
              result += processBuffer();
              do {
                if (top.className) {
                  result += '</span>';
                }
                relevance += top.relevance;
                top = top.parent;
              } while (top != end_mode.parent);
              if (origin.excludeEnd) {
                result += escape(lexeme);
              }
              mode_buffer = '';
              if (end_mode.starts) {
                startNewMode(end_mode.starts, '');
              }
              return origin.returnEnd ? 0 : lexeme.length;
            }

            if (isIllegal(lexeme, top))
              throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

            /*
            Parser should not reach this point as all types of lexemes should be caught
            earlier, but if it does due to some bug make sure it advances at least one
            character forward to prevent infinite looping.
            */
            mode_buffer += lexeme;
            return lexeme.length || 1;
          }

          var language = getLanguage(name);
          if (!language) {
            throw new Error('Unknown language: "' + name + '"');
          }

          compileLanguage(language);
          var top = continuation || language;
          var result = '';
          for (var current = top; current != language; current = current.parent) {
            if (current.className) {
              result = buildSpan(current.className, result, true);
            }
          }
          var mode_buffer = '';
          var relevance = 0;
          try {
            var match, count, index = 0;
            while (true) {
              top.terminators.lastIndex = index;
              match = top.terminators.exec(value);
              if (!match)
                break;
              count = processLexeme(value.substr(index, match.index - index), match[0]);
              index = match.index + count;
            }
            processLexeme(value.substr(index));
            for (var current = top; current.parent; current = current.parent) { // close dangling modes
              if (current.className) {
                result += '</span>';
              }
            };
            return {
              relevance: relevance,
              value: result,
              language: name,
              top: top
            };
          } catch (e) {
            if (e.message.indexOf('Illegal') != -1) {
              return {
                relevance: 0,
                value: escape(value)
              };
            } else {
              throw e;
            }
          }
        }

        /*
        Highlighting with language detection. Accepts a string with the code to
        highlight. Returns an object with the following properties:

        - language (detected language)
        - relevance (int)
        - value (an HTML string with highlighting markup)
        - second_best (object with the same structure for second-best heuristically
          detected language, may be absent)

        */
        function highlightAuto(text, languageSubset) {
          languageSubset = languageSubset || options.languages || Object.keys(languages);
          var result = {
            relevance: 0,
            value: escape(text)
          };
          var second_best = result;
          languageSubset.forEach(function (name) {
            if (!getLanguage(name)) {
              return;
            }
            var current = highlight(name, text, false);
            current.language = name;
            if (current.relevance > second_best.relevance) {
              second_best = current;
            }
            if (current.relevance > result.relevance) {
              second_best = result;
              result = current;
            }
          });
          if (second_best.language) {
            result.second_best = second_best;
          }
          return result;
        }

        /*
        Post-processing of the highlighted markup:

        - replace TABs with something more useful
        - replace real line-breaks with '<br>' for non-pre containers

        */
        function fixMarkup(value) {
          if (options.tabReplace) {
            value = value.replace(/^((<[^>]+>|\t)+)/gm, function (match, p1, offset, s) {
              return p1.replace(/\t/g, options.tabReplace);
            });
          }
          if (options.useBR) {
            value = value.replace(/\n/g, '<br>');
          }
          return value;
        }

        /*
        Applies highlighting to a DOM node containing code. Accepts a DOM node and
        two optional parameters for fixMarkup.
        */
        function highlightBlock(block) {
          var text = blockText(block);
          var language = blockLanguage(block);
          if (language == 'no-highlight')
            return;
          var result = language ? highlight(language, text, true) : highlightAuto(text);
          var original = nodeStream(block);
          if (original.length) {
            var pre = document.createElementNS('http://www.w3.org/1999/xhtml', 'pre');
            pre.innerHTML = result.value;
            result.value = mergeStreams(original, nodeStream(pre), text);
          }
          result.value = fixMarkup(result.value);

          block.innerHTML = result.value;
          block.className += ' hljs ' + (!language && result.language || '');
          block.result = {
            language: result.language,
            re: result.relevance
          };
          if (result.second_best) {
            block.second_best = {
              language: result.second_best.language,
              re: result.second_best.relevance
            };
          }
        }

        var options = {
          classPrefix: 'hljs-',
          tabReplace: null,
          useBR: false,
          languages: undefined
        };

        /*
        Updates highlight.js global options with values passed in the form of an object
        */
        function configure(user_options) {
          options = inherit(options, user_options);
        }

        /*
        Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
        */
        function initHighlighting() {
          if (initHighlighting.called)
            return;
          initHighlighting.called = true;

          var blocks = document.querySelectorAll('pre code');
          Array.prototype.forEach.call(blocks, highlightBlock);
        }

        /*
        Attaches highlighting to the page load event.
        */
        function initHighlightingOnLoad() {
          addEventListener('DOMContentLoaded', initHighlighting, false);
          addEventListener('load', initHighlighting, false);
        }

        var languages = {};
        var aliases = {};

        function registerLanguage(name, language) {
          var lang = languages[name] = language(this);
          if (lang.aliases) {
            lang.aliases.forEach(function (alias) {
              aliases[alias] = name;
            });
          }
        }

        function getLanguage(name) {
          return languages[name] || languages[aliases[name]];
        }

        /* Interface definition */

        this.highlight = highlight;
        this.highlightAuto = highlightAuto;
        this.fixMarkup = fixMarkup;
        this.highlightBlock = highlightBlock;
        this.configure = configure;
        this.initHighlighting = initHighlighting;
        this.initHighlightingOnLoad = initHighlightingOnLoad;
        this.registerLanguage = registerLanguage;
        this.getLanguage = getLanguage;
        this.inherit = inherit;

        // Common regexps
        this.IDENT_RE = '[a-zA-Z][a-zA-Z0-9_]*';
        this.UNDERSCORE_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*';
        this.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
        this.C_NUMBER_RE = '(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
        this.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
        this.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

        // Common modes
        this.BACKSLASH_ESCAPE = {
          begin: '\\\\[\\s\\S]',
          relevance: 0
        };
        this.APOS_STRING_MODE = {
          className: 'string',
          begin: '\'',
          end: '\'',
          illegal: '\\n',
          contains: [this.BACKSLASH_ESCAPE]
        };
        this.QUOTE_STRING_MODE = {
          className: 'string',
          begin: '"',
          end: '"',
          illegal: '\\n',
          contains: [this.BACKSLASH_ESCAPE]
        };
        this.C_LINE_COMMENT_MODE = {
          className: 'comment',
          begin: '//',
          end: '$'
        };
        this.C_BLOCK_COMMENT_MODE = {
          className: 'comment',
          begin: '/\\*',
          end: '\\*/'
        };
        this.HASH_COMMENT_MODE = {
          className: 'comment',
          begin: '#',
          end: '$'
        };
        this.NUMBER_MODE = {
          className: 'number',
          begin: this.NUMBER_RE,
          relevance: 0
        };
        this.C_NUMBER_MODE = {
          className: 'number',
          begin: this.C_NUMBER_RE,
          relevance: 0
        };
        this.BINARY_NUMBER_MODE = {
          className: 'number',
          begin: this.BINARY_NUMBER_RE,
          relevance: 0
        };
        this.REGEXP_MODE = {
          className: 'regexp',
          begin: /\//,
          end: /\/[gim]*/,
          illegal: /\n/,
          contains: [
            this.BACKSLASH_ESCAPE,
            {
              begin: /\[/,
              end: /\]/,
              relevance: 0,
              contains: [this.BACKSLASH_ESCAPE]
            }
          ]
        };
        this.TITLE_MODE = {
          className: 'title',
          begin: this.IDENT_RE,
          relevance: 0
        };
        this.UNDERSCORE_TITLE_MODE = {
          className: 'title',
          begin: this.UNDERSCORE_IDENT_RE,
          relevance: 0
        };
      };
      module.exports = Highlight;
    }, {}],
    20: [function (require, module, exports) {
      var Highlight = require('./highlight');
      var hljs = new Highlight();
      hljs.registerLanguage('bash', require('./languages/bash.js'));
      hljs.registerLanguage('javascript', require('./languages/javascript.js'));
      hljs.registerLanguage('xml', require('./languages/xml.js'));
      hljs.registerLanguage('markdown', require('./languages/markdown.js'));
      hljs.registerLanguage('css', require('./languages/css.js'));
      hljs.registerLanguage('http', require('./languages/http.js'));
      hljs.registerLanguage('ini', require('./languages/ini.js'));
      hljs.registerLanguage('json', require('./languages/json.js'));
      module.exports = hljs;
    }, {
      "./highlight": 19,
      "./languages/bash.js": 21,
      "./languages/css.js": 22,
      "./languages/http.js": 23,
      "./languages/ini.js": 24,
      "./languages/javascript.js": 25,
      "./languages/json.js": 26,
      "./languages/markdown.js": 27,
      "./languages/xml.js": 28
    }],
    21: [function (require, module, exports) {
      module.exports = function (hljs) {
        var VAR = {
          className: 'variable',
          variants: [{
              begin: /\$[\w\d#@][\w\d_]*/
            },
            {
              begin: /\$\{(.*?)\}/
            }
          ]
        };
        var QUOTE_STRING = {
          className: 'string',
          begin: /"/,
          end: /"/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            VAR,
            {
              className: 'variable',
              begin: /\$\(/,
              end: /\)/,
              contains: [hljs.BACKSLASH_ESCAPE]
            }
          ]
        };
        var APOS_STRING = {
          className: 'string',
          begin: /'/,
          end: /'/
        };

        return {
          lexemes: /-?[a-z\.]+/,
          keywords: {
            keyword: 'if then else elif fi for break continue while in do done exit return set ' +
              'declare case esac export exec',
            literal: 'true false',
            built_in: 'printf echo read cd pwd pushd popd dirs let eval unset typeset readonly ' +
              'getopts source shopt caller type hash bind help sudo',
            operator: '-ne -eq -lt -gt -f -d -e -s -l -a' // relevance booster
          },
          contains: [{
              className: 'shebang',
              begin: /^#![^\n]+sh\s*$/,
              relevance: 10
            },
            {
              className: 'function',
              begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
              returnBegin: true,
              contains: [hljs.inherit(hljs.TITLE_MODE, {
                begin: /\w[\w\d_]*/
              })],
              relevance: 0
            },
            hljs.HASH_COMMENT_MODE,
            hljs.NUMBER_MODE,
            QUOTE_STRING,
            APOS_STRING,
            VAR
          ]
        };
      };
    }, {}],
    22: [function (require, module, exports) {
      module.exports = function (hljs) {
        var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
        var FUNCTION = {
          className: 'function',
          begin: IDENT_RE + '\\(',
          end: '\\)',
          contains: ['self', hljs.NUMBER_MODE, hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE]
        };
        return {
          case_insensitive: true,
          illegal: '[=/|\']',
          contains: [
            hljs.C_BLOCK_COMMENT_MODE,
            {
              className: 'id',
              begin: '\\#[A-Za-z0-9_-]+'
            },
            {
              className: 'class',
              begin: '\\.[A-Za-z0-9_-]+',
              relevance: 0
            },
            {
              className: 'attr_selector',
              begin: '\\[',
              end: '\\]',
              illegal: '$'
            },
            {
              className: 'pseudo',
              begin: ':(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\"\\\']+'
            },
            {
              className: 'at_rule',
              begin: '@(font-face|page)',
              lexemes: '[a-z-]+',
              keywords: 'font-face page'
            },
            {
              className: 'at_rule',
              begin: '@',
              end: '[{;]', // at_rule eating first "{" is a good thing
              // because it doesn’t let it to be parsed as
              // a rule set but instead drops parser into
              // the default mode which is how it should be.
              contains: [{
                  className: 'keyword',
                  begin: /\S+/
                },
                {
                  begin: /\s/,
                  endsWithParent: true,
                  excludeEnd: true,
                  relevance: 0,
                  contains: [
                    FUNCTION,
                    hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE,
                    hljs.NUMBER_MODE
                  ]
                }
              ]
            },
            {
              className: 'tag',
              begin: IDENT_RE,
              relevance: 0
            },
            {
              className: 'rules',
              begin: '{',
              end: '}',
              illegal: '[^\\s]',
              relevance: 0,
              contains: [
                hljs.C_BLOCK_COMMENT_MODE,
                {
                  className: 'rule',
                  begin: '[^\\s]',
                  returnBegin: true,
                  end: ';',
                  endsWithParent: true,
                  contains: [{
                    className: 'attribute',
                    begin: '[A-Z\\_\\.\\-]+',
                    end: ':',
                    excludeEnd: true,
                    illegal: '[^\\s]',
                    starts: {
                      className: 'value',
                      endsWithParent: true,
                      excludeEnd: true,
                      contains: [
                        FUNCTION,
                        hljs.NUMBER_MODE,
                        hljs.QUOTE_STRING_MODE,
                        hljs.APOS_STRING_MODE,
                        hljs.C_BLOCK_COMMENT_MODE,
                        {
                          className: 'hexcolor',
                          begin: '#[0-9A-Fa-f]+'
                        },
                        {
                          className: 'important',
                          begin: '!important'
                        }
                      ]
                    }
                  }]
                }
              ]
            }
          ]
        };
      };
    }, {}],
    23: [function (require, module, exports) {
      module.exports = function (hljs) {
        return {
          illegal: '\\S',
          contains: [{
              className: 'status',
              begin: '^HTTP/[0-9\\.]+',
              end: '$',
              contains: [{
                className: 'number',
                begin: '\\b\\d{3}\\b'
              }]
            },
            {
              className: 'request',
              begin: '^[A-Z]+ (.*?) HTTP/[0-9\\.]+$',
              returnBegin: true,
              end: '$',
              contains: [{
                className: 'string',
                begin: ' ',
                end: ' ',
                excludeBegin: true,
                excludeEnd: true
              }]
            },
            {
              className: 'attribute',
              begin: '^\\w',
              end: ': ',
              excludeEnd: true,
              illegal: '\\n|\\s|=',
              starts: {
                className: 'string',
                end: '$'
              }
            },
            {
              begin: '\\n\\n',
              starts: {
                subLanguage: '',
                endsWithParent: true
              }
            }
          ]
        };
      };
    }, {}],
    24: [function (require, module, exports) {
      module.exports = function (hljs) {
        return {
          case_insensitive: true,
          illegal: /\S/,
          contains: [{
              className: 'comment',
              begin: ';',
              end: '$'
            },
            {
              className: 'title',
              begin: '^\\[',
              end: '\\]'
            },
            {
              className: 'setting',
              begin: '^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*',
              end: '$',
              contains: [{
                className: 'value',
                endsWithParent: true,
                keywords: 'on off true false yes no',
                contains: [hljs.QUOTE_STRING_MODE, hljs.NUMBER_MODE],
                relevance: 0
              }]
            }
          ]
        };
      };
    }, {}],
    25: [function (require, module, exports) {
      module.exports = function (hljs) {
        return {
          aliases: ['js'],
          keywords: {
            keyword: 'in if for while finally var new function do return void else break catch ' +
              'instanceof with throw case default try this switch continue typeof delete ' +
              'let yield const class',
            literal: 'true false null undefined NaN Infinity',
            built_in: 'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
              'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
              'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
              'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
              'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
              'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require'
          },
          contains: [{
              className: 'pi',
              begin: /^\s*('|")use strict('|")/,
              relevance: 10
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.C_NUMBER_MODE,
            { // "value" container
              begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
              keywords: 'return throw case',
              contains: [
                hljs.C_LINE_COMMENT_MODE,
                hljs.C_BLOCK_COMMENT_MODE,
                hljs.REGEXP_MODE,
                { // E4X
                  begin: /</,
                  end: />;/,
                  relevance: 0,
                  subLanguage: 'xml'
                }
              ],
              relevance: 0
            },
            {
              className: 'function',
              beginKeywords: 'function',
              end: /\{/,
              contains: [
                hljs.inherit(hljs.TITLE_MODE, {
                  begin: /[A-Za-z$_][0-9A-Za-z$_]*/
                }),
                {
                  className: 'params',
                  begin: /\(/,
                  end: /\)/,
                  contains: [
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE
                  ],
                  illegal: /["'\(]/
                }
              ],
              illegal: /\[|%/
            },
            {
              begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
            },
            {
              begin: '\\.' + hljs.IDENT_RE,
              relevance: 0 // hack: prevents detection of keywords after dots
            }
          ]
        };
      };
    }, {}],
    26: [function (require, module, exports) {
      module.exports = function (hljs) {
        var LITERALS = {
          literal: 'true false null'
        };
        var TYPES = [
          hljs.QUOTE_STRING_MODE,
          hljs.C_NUMBER_MODE
        ];
        var VALUE_CONTAINER = {
          className: 'value',
          end: ',',
          endsWithParent: true,
          excludeEnd: true,
          contains: TYPES,
          keywords: LITERALS
        };
        var OBJECT = {
          begin: '{',
          end: '}',
          contains: [{
            className: 'attribute',
            begin: '\\s*"',
            end: '"\\s*:\\s*',
            excludeBegin: true,
            excludeEnd: true,
            contains: [hljs.BACKSLASH_ESCAPE],
            illegal: '\\n',
            starts: VALUE_CONTAINER
          }],
          illegal: '\\S'
        };
        var ARRAY = {
          begin: '\\[',
          end: '\\]',
          contains: [hljs.inherit(VALUE_CONTAINER, {
            className: null
          })], // inherit is also a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
          illegal: '\\S'
        };
        TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
        return {
          contains: TYPES,
          keywords: LITERALS,
          illegal: '\\S'
        };
      };
    }, {}],
    27: [function (require, module, exports) {
      module.exports = function (hljs) {
        return {
          contains: [
            // highlight headers
            {
              className: 'header',
              variants: [{
                  begin: '^#{1,6}',
                  end: '$'
                },
                {
                  begin: '^.+?\\n[=-]{2,}$'
                }
              ]
            },
            // inline html
            {
              begin: '<',
              end: '>',
              subLanguage: 'xml',
              relevance: 0
            },
            // lists (indicators only)
            {
              className: 'bullet',
              begin: '^([*+-]|(\\d+\\.))\\s+'
            },
            // strong segments
            {
              className: 'strong',
              begin: '[*_]{2}.+?[*_]{2}'
            },
            // emphasis segments
            {
              className: 'emphasis',
              variants: [{
                  begin: '\\*.+?\\*'
                },
                {
                  begin: '_.+?_',
                  relevance: 0
                }
              ]
            },
            // blockquotes
            {
              className: 'blockquote',
              begin: '^>\\s+',
              end: '$'
            },
            // code snippets
            {
              className: 'code',
              variants: [{
                  begin: '`.+?`'
                },
                {
                  begin: '^( {4}|\t)',
                  end: '$',
                  relevance: 0
                }
              ]
            },
            // horizontal rules
            {
              className: 'horizontal_rule',
              begin: '^[-\\*]{3,}',
              end: '$'
            },
            // using links - title and link
            {
              begin: '\\[.+?\\][\\(\\[].+?[\\)\\]]',
              returnBegin: true,
              contains: [{
                  className: 'link_label',
                  begin: '\\[',
                  end: '\\]',
                  excludeBegin: true,
                  returnEnd: true,
                  relevance: 0
                },
                {
                  className: 'link_url',
                  begin: '\\]\\(',
                  end: '\\)',
                  excludeBegin: true,
                  excludeEnd: true
                },
                {
                  className: 'link_reference',
                  begin: '\\]\\[',
                  end: '\\]',
                  excludeBegin: true,
                  excludeEnd: true,
                }
              ],
              relevance: 10
            },
            {
              begin: '^\\[\.+\\]:',
              end: '$',
              returnBegin: true,
              contains: [{
                  className: 'link_reference',
                  begin: '\\[',
                  end: '\\]',
                  excludeBegin: true,
                  excludeEnd: true
                },
                {
                  className: 'link_url',
                  begin: '\\s',
                  end: '$'
                }
              ]
            }
          ]
        };
      };
    }, {}],
    28: [function (require, module, exports) {
      module.exports = function (hljs) {
        var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
        var PHP = {
          begin: /<\?(php)?(?!\w)/,
          end: /\?>/,
          subLanguage: 'php',
          subLanguageMode: 'continuous'
        };
        var TAG_INTERNALS = {
          endsWithParent: true,
          illegal: /</,
          relevance: 0,
          contains: [
            PHP,
            {
              className: 'attribute',
              begin: XML_IDENT_RE,
              relevance: 0
            },
            {
              begin: '=',
              relevance: 0,
              contains: [{
                className: 'value',
                variants: [{
                    begin: /"/,
                    end: /"/
                  },
                  {
                    begin: /'/,
                    end: /'/
                  },
                  {
                    begin: /[^\s\/>]+/
                  }
                ]
              }]
            }
          ]
        };
        return {
          aliases: ['html'],
          case_insensitive: true,
          contains: [{
              className: 'doctype',
              begin: '<!DOCTYPE',
              end: '>',
              relevance: 10,
              contains: [{
                begin: '\\[',
                end: '\\]'
              }]
            },
            {
              className: 'comment',
              begin: '<!--',
              end: '-->',
              relevance: 10
            },
            {
              className: 'cdata',
              begin: '<\\!\\[CDATA\\[',
              end: '\\]\\]>',
              relevance: 10
            },
            {
              className: 'tag',
              /*
              The lookahead pattern (?=...) ensures that 'begin' only matches
              '<style' as a single word, followed by a whitespace or an
              ending braket. The '$' is needed for the lexeme to be recognized
              by hljs.subMode() that tests lexemes outside the stream.
              */
              begin: '<style(?=\\s|>|$)',
              end: '>',
              keywords: {
                title: 'style'
              },
              contains: [TAG_INTERNALS],
              starts: {
                end: '</style>',
                returnEnd: true,
                subLanguage: 'css'
              }
            },
            {
              className: 'tag',
              // See the comment in the <style tag about the lookahead pattern
              begin: '<script(?=\\s|>|$)',
              end: '>',
              keywords: {
                title: 'script'
              },
              contains: [TAG_INTERNALS],
              starts: {
                end: '</script>',
                returnEnd: true,
                subLanguage: 'javascript'
              }
            },
            {
              begin: '<%',
              end: '%>',
              subLanguage: 'vbscript'
            },
            PHP,
            {
              className: 'pi',
              begin: /<\?\w+/,
              end: /\?>/,
              relevance: 10
            },
            {
              className: 'tag',
              begin: '</?',
              end: '/?>',
              contains: [{
                  className: 'title',
                  begin: '[^ /><]+',
                  relevance: 0
                },
                TAG_INTERNALS
              ]
            }
          ]
        };
      };
    }, {}],
    29: [function (require, module, exports) {
      // http://highlightjs.readthedocs.org/en/latest/css-classes-reference.html

      module.exports = [
        'addition',
        'annotaion',
        'annotation',
        'argument',
        'array',
        'at_rule',
        'attr_selector',
        'attribute',
        'begin-block',
        'blockquote',
        'body',
        'built_in',
        'bullet',
        'cbracket',
        'cdata',
        'cell',
        'change',
        'char',
        'chunk',
        'class',
        'code',
        'collection',
        'command',
        'commands',
        'commen',
        'comment',
        'constant',
        'container',
        'dartdoc',
        'date',
        'decorator',
        'default',
        'deletion',
        'doctype',
        'emphasis',
        'end-block',
        'envvar',
        'expression',
        'filename',
        'filter',
        'flow',
        'foreign',
        'formula',
        'func',
        'function',
        'function_name',
        'generics',
        'header',
        'hexcolor',
        'horizontal_rule',
        'id',
        'import',
        'important',
        'infix',
        'inheritance',
        'input',
        'javadoc',
        'javadoctag',
        'keyword',
        'keywords',
        'label',
        'link_label',
        'link_reference',
        'link_url',
        'list',
        'literal',
        'localvars',
        'long_brackets',
        'matrix',
        'module',
        'number',
        'operator',
        'output',
        'package',
        'param',
        'parameter',
        'params',
        'parent',
        'phpdoc',
        'pi',
        'pod',
        'pp',
        'pragma',
        'preprocessor',
        'prompt',
        'property',
        'pseudo',
        'quoted',
        'record_name',
        'regex',
        'regexp',
        'request',
        'reserved',
        'rest_arg',
        'rules',
        'shader',
        'shading',
        'shebang',
        'special',
        'sqbracket',
        'status',
        'stl_container',
        'stream',
        'string',
        'strong',
        'sub',
        'subst',
        'summary',
        'symbol',
        'tag',
        'template_comment',
        'template_tag',
        'title',
        'type',
        'typedef',
        'typename',
        'value',
        'var_expand',
        'variable',
        'winutils',
        'xmlDocTag',
        'yardoctag'
      ]

    }, {}],
    30: [function (require, module, exports) {
      'use strict';

      var toMap = require('./toMap');
      var uris = ['background', 'base', 'cite', 'href', 'longdesc', 'src', 'usemap'];

      module.exports = {
        uris: toMap(uris) // attributes that have an href and hence need to be sanitized
      };

    }, {
      "./toMap": 38
    }],
    31: [function (require, module, exports) {
      'use strict';

      var defaults = {
        allowedAttributes: {
          a: ['href', 'name', 'target', 'title', 'aria-label'],
          iframe: ['allowfullscreen', 'frameborder', 'src'],
          img: ['src', 'alt', 'title', 'aria-label']
        },
        allowedClasses: {},
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedTags: [
          'a', 'abbr', 'article', 'b', 'blockquote', 'br', 'caption', 'code', 'del', 'details', 'div', 'em',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'main', 'mark',
          'ol', 'p', 'pre', 'section', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table',
          'tbody', 'td', 'th', 'thead', 'tr', 'ul'
        ],
        filter: null
      };

      module.exports = defaults;

    }, {}],
    32: [function (require, module, exports) {
      'use strict';

      var toMap = require('./toMap');
      var voids = ['area', 'br', 'col', 'hr', 'img', 'wbr', 'input', 'base', 'basefont', 'link', 'meta'];

      module.exports = {
        voids: toMap(voids)
      };

    }, {
      "./toMap": 38
    }],
    33: [function (require, module, exports) {
      'use strict';

      var he = require('he');
      var assign = require('assignment');
      var parser = require('./parser');
      var sanitizer = require('./sanitizer');
      var defaults = require('./defaults');

      function insane(html, options, strict) {
        var buffer = [];
        var configuration = strict === true ? options : assign({}, defaults, options);
        var handler = sanitizer(buffer, configuration);

        parser(html, handler);

        return buffer.join('');
      }

      insane.defaults = defaults;
      module.exports = insane;

    }, {
      "./defaults": 31,
      "./parser": 35,
      "./sanitizer": 36,
      "assignment": 2,
      "he": 37
    }],
    34: [function (require, module, exports) {
      'use strict';

      module.exports = function lowercase(string) {
        return typeof string === 'string' ? string.toLowerCase() : string;
      };

    }, {}],
    35: [function (require, module, exports) {
      'use strict';

      var he = require('he');
      var lowercase = require('./lowercase');
      var attributes = require('./attributes');
      var elements = require('./elements');
      var rstart = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/;
      var rend = /^<\s*\/\s*([\w:-]+)[^>]*>/;
      var rattrs = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g;
      var rtag = /^</;
      var rtagend = /^<\s*\//;

      function createStack() {
        var stack = [];
        stack.lastItem = function lastItem() {
          return stack[stack.length - 1];
        };
        return stack;
      }

      function parser(html, handler) {
        var stack = createStack();
        var last = html;
        var chars;

        while (html) {
          parsePart();
        }
        parseEndTag(); // clean up any remaining tags

        function parsePart() {
          chars = true;
          parseTag();

          var same = html === last;
          last = html;

          if (same) { // discard, because it's invalid
            html = '';
          }
        }

        function parseTag() {
          if (html.substr(0, 4) === '<!--') { // comments
            parseComment();
          } else if (rtagend.test(html)) {
            parseEdge(rend, parseEndTag);
          } else if (rtag.test(html)) {
            parseEdge(rstart, parseStartTag);
          }
          parseTagDecode();
        }

        function parseEdge(regex, parser) {
          var match = html.match(regex);
          if (match) {
            html = html.substring(match[0].length);
            match[0].replace(regex, parser);
            chars = false;
          }
        }

        function parseComment() {
          var index = html.indexOf('-->');
          if (index >= 0) {
            if (handler.comment) {
              handler.comment(html.substring(4, index));
            }
            html = html.substring(index + 3);
            chars = false;
          }
        }

        function parseTagDecode() {
          if (!chars) {
            return;
          }
          var text;
          var index = html.indexOf('<');
          if (index >= 0) {
            text = html.substring(0, index);
            html = html.substring(index);
          } else {
            text = html;
            html = '';
          }
          if (handler.chars) {
            handler.chars(text);
          }
        }

        function parseStartTag(tag, tagName, rest, unary) {
          var attrs = {};
          var low = lowercase(tagName);
          var u = elements.voids[low] || !!unary;

          rest.replace(rattrs, attrReplacer);

          if (!u) {
            stack.push(low);
          }
          if (handler.start) {
            handler.start(low, attrs, u);
          }

          function attrReplacer(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
            if (doubleQuotedValue === void 0 && singleQuotedValue === void 0 && unquotedValue === void 0) {
              attrs[name] = void 0; // attribute is like <button disabled></button>
            } else {
              attrs[name] = he.decode(doubleQuotedValue || singleQuotedValue || unquotedValue || '');
            }
          }
        }

        function parseEndTag(tag, tagName) {
          var i;
          var pos = 0;
          var low = lowercase(tagName);
          if (low) {
            for (pos = stack.length - 1; pos >= 0; pos--) {
              if (stack[pos] === low) {
                break; // find the closest opened tag of the same type
              }
            }
          }
          if (pos >= 0) {
            for (i = stack.length - 1; i >= pos; i--) {
              if (handler.end) { // close all the open elements, up the stack
                handler.end(stack[i]);
              }
            }
            stack.length = pos;
          }
        }
      }

      module.exports = parser;

    }, {
      "./attributes": 30,
      "./elements": 32,
      "./lowercase": 34,
      "he": 37
    }],
    36: [function (require, module, exports) {
      'use strict';

      var he = require('he');
      var lowercase = require('./lowercase');
      var attributes = require('./attributes');

      function sanitizer(buffer, options) {
        var last;
        var context;
        var o = options || {};

        reset();

        return {
          start: start,
          end: end,
          chars: chars
        };

        function out(value) {
          buffer.push(value);
        }

        function start(tag, attrs, unary) {
          var low = lowercase(tag);

          if (context.ignoring) {
            ignore(low);
            return;
          }
          if ((o.allowedTags || []).indexOf(low) === -1) {
            ignore(low);
            return;
          }
          if (o.filter && !o.filter({
              tag: low,
              attrs: attrs
            })) {
            ignore(low);
            return;
          }

          out('<');
          out(low);
          Object.keys(attrs).forEach(parse);
          out(unary ? '/>' : '>');

          function parse(key) {
            var value = attrs[key];
            var classesOk = (o.allowedClasses || {})[low] || [];
            var attrsOk = (o.allowedAttributes || {})[low] || [];
            var valid;
            var lkey = lowercase(key);
            if (lkey === 'class' && attrsOk.indexOf(lkey) === -1) {
              value = value.split(' ').filter(isValidClass).join(' ').trim();
              valid = value.length;
            } else {
              valid = attrsOk.indexOf(lkey) !== -1 && (attributes.uris[lkey] !== true || testUrl(value));
            }
            if (valid) {
              out(' ');
              out(key);
              if (typeof value === 'string') {
                out('="');
                out(he.encode(value));
                out('"');
              }
            }

            function isValidClass(className) {
              return classesOk && classesOk.indexOf(className) !== -1;
            }
          }
        }

        function end(tag) {
          var low = lowercase(tag);
          var allowed = (o.allowedTags || []).indexOf(low) !== -1;
          if (allowed) {
            if (context.ignoring === false) {
              out('</');
              out(low);
              out('>');
            } else {
              unignore(low);
            }
          } else {
            unignore(low);
          }
        }

        function testUrl(text) {
          var start = text[0];
          if (start === '#' || start === '/') {
            return true;
          }
          var colon = text.indexOf(':');
          if (colon === -1) {
            return true;
          }
          var questionmark = text.indexOf('?');
          if (questionmark !== -1 && colon > questionmark) {
            return true;
          }
          var hash = text.indexOf('#');
          if (hash !== -1 && colon > hash) {
            return true;
          }
          return o.allowedSchemes.some(matches);

          function matches(scheme) {
            return text.indexOf(scheme + ':') === 0;
          }
        }

        function chars(text) {
          if (context.ignoring === false) {
            out(text);
          }
        }

        function ignore(tag) {
          if (context.ignoring === false) {
            context = {
              ignoring: tag,
              depth: 1
            };
          } else if (context.ignoring === tag) {
            context.depth++;
          }
        }

        function unignore(tag) {
          if (context.ignoring === tag) {
            if (--context.depth <= 0) {
              reset();
            }
          }
        }

        function reset() {
          context = {
            ignoring: false,
            depth: 0
          };
        }
      }

      module.exports = sanitizer;

    }, {
      "./attributes": 30,
      "./lowercase": 34,
      "he": 37
    }],
    37: [function (require, module, exports) {
      'use strict';

      var escapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      var unescapes = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
      };
      var rescaped = /(&amp;|&lt;|&gt;|&quot;|&#39;)/g;
      var runescaped = /[&<>"']/g;

      function escapeHtmlChar(match) {
        return escapes[match];
      }

      function unescapeHtmlChar(match) {
        return unescapes[match];
      }

      function escapeHtml(text) {
        return text == null ? '' : String(text).replace(runescaped, escapeHtmlChar);
      }

      function unescapeHtml(html) {
        return html == null ? '' : String(html).replace(rescaped, unescapeHtmlChar);
      }

      escapeHtml.options = unescapeHtml.options = {};

      module.exports = {
        encode: escapeHtml,
        escape: escapeHtml,
        decode: unescapeHtml,
        unescape: unescapeHtml,
        version: '1.0.0-browser'
      };

    }, {}],
    38: [function (require, module, exports) {
      'use strict';

      function toMap(list) {
        return list.reduce(asKey, {});
      }

      function asKey(accumulator, item) {
        accumulator[item] = true;
        return accumulator;
      }

      module.exports = toMap;

    }, {}],
    39: [function (require, module, exports) {
      'use strict';

      var fnToStr = Function.prototype.toString;

      var constructorRegex = /^\s*class\b/;
      var isES6ClassFn = function isES6ClassFunction(value) {
        try {
          var fnStr = fnToStr.call(value);
          return constructorRegex.test(fnStr);
        } catch (e) {
          return false; // not a function
        }
      };

      var tryFunctionObject = function tryFunctionToStr(value) {
        try {
          if (isES6ClassFn(value)) {
            return false;
          }
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      };
      var toStr = Object.prototype.toString;
      var fnClass = '[object Function]';
      var genClass = '[object GeneratorFunction]';
      var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

      module.exports = function isCallable(value) {
        if (!value) {
          return false;
        }
        if (typeof value !== 'function' && typeof value !== 'object') {
          return false;
        }
        if (typeof value === 'function' && !value.prototype) {
          return true;
        }
        if (hasToStringTag) {
          return tryFunctionObject(value);
        }
        if (isES6ClassFn(value)) {
          return false;
        }
        var strClass = toStr.call(value);
        return strClass === fnClass || strClass === genClass;
      };

    }, {}],
    40: [function (require, module, exports) {
      module.exports = isFunction

      var toString = Object.prototype.toString

      function isFunction(fn) {
        var string = toString.call(fn)
        return string === '[object Function]' ||
          (typeof fn === 'function' && string !== '[object RegExp]') ||
          (typeof window !== 'undefined' &&
            // IE8 and below
            (fn === window.setTimeout ||
              fn === window.alert ||
              fn === window.confirm ||
              fn === window.prompt))
      };

    }, {}],
    41: [function (require, module, exports) {
      'use strict';

      var sektor = require('sektor');
      var crossvent = require('crossvent');
      var rspaces = /\s+/g;
      var keymap = {
        13: 'enter',
        27: 'esc',
        32: 'space'
      };
      var handlers = {};

      crossvent.add(window, 'keydown', keydown);

      function clear(context) {
        if (context) {
          if (context in handlers) {
            handlers[context] = {};
          }
        } else {
          handlers = {};
        }
      }

      function switchboard(then, combo, options, fn) {
        if (fn === void 0) {
          fn = options;
          options = {};
        }

        var context = options.context || 'defaults';

        if (!fn) {
          return;
        }

        if (handlers[context] === void 0) {
          handlers[context] = {};
        }

        combo.toLowerCase().split(rspaces).forEach(item);

        function item(keys) {
          var c = keys.trim();
          if (c.length === 0) {
            return;
          }
          then(handlers[context], c, options, fn);
        }
      }

      function on(combo, options, fn) {
        switchboard(add, combo, options, fn);

        function add(area, key, options, fn) {
          var handler = {
            handle: fn,
            filter: options.filter
          };
          if (area[key]) {
            area[key].push(handler);
          } else {
            area[key] = [handler];
          }
        }
      }

      function off(combo, options, fn) {
        switchboard(rm, combo, options, fn);

        function rm(area, key, options, fn) {
          if (area[key]) {
            area[key] = area[key].filter(matching);
          }

          function matching(handler) {
            return handler.handle === fn && handler.filter === options.filter;
          }
        }
      }

      function getKeyCode(e) {
        return e.which || e.keyCode || e.charCode;
      }

      function keydown(e) {
        var code = getKeyCode(e);
        var key = keymap[code] || String.fromCharCode(code);
        if (key) {
          handle(key, e);
        }
      }

      function parseKeyCombo(key, e) {
        var combo = [key];
        if (e.shiftKey) {
          combo.unshift('shift');
        }
        if (e.altKey) {
          combo.unshift('alt');
        }
        if (e.ctrlKey ^ e.metaKey) {
          combo.unshift('cmd');
        }
        return combo.join('+').toLowerCase();
      }

      function handle(key, e) {
        var combo = parseKeyCombo(key, e);
        var context;
        for (context in handlers) {
          if (handlers[context][combo]) {
            handlers[context][combo].forEach(exec);
          }
        }

        function filtered(handler) {
          var filter = handler.filter;
          if (!filter) {
            return;
          }

          var el = e.target;
          var selector = typeof filter === 'string';
          if (selector) {
            return sektor.matchesSelector(el, filter) === false;
          }
          while (el.parentElement && el !== filter) {
            el = el.parentElement;
          }
          return el !== filter;
        }

        function exec(handler) {
          if (filtered(handler)) {
            return;
          }
          handler.handle(e);
        }
      }

      module.exports = {
        on: on,
        off: off,
        clear: clear,
        handlers: handlers
      };

    }, {
      "crossvent": 12,
      "sektor": 117
    }],
    42: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var stub = require('./stub');
        var tracking = require('./tracking');
        var ls = 'localStorage' in global && global.localStorage ? global.localStorage : stub;

        function accessor(key, value) {
          if (arguments.length === 1) {
            return get(key);
          }
          return set(key, value);
        }

        function get(key) {
          return JSON.parse(ls.getItem(key));
        }

        function set(key, value) {
          try {
            ls.setItem(key, JSON.stringify(value));
            return true;
          } catch (e) {
            return false;
          }
        }

        function remove(key) {
          return ls.removeItem(key);
        }

        function clear() {
          return ls.clear();
        }

        accessor.set = set;
        accessor.get = get;
        accessor.remove = remove;
        accessor.clear = clear;
        accessor.on = tracking.on;
        accessor.off = tracking.off;

        module.exports = accessor;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9sb2NhbC1zdG9yYWdlL2xvY2FsLXN0b3JhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBzdHViID0gcmVxdWlyZSgnLi9zdHViJyk7XG52YXIgdHJhY2tpbmcgPSByZXF1aXJlKCcuL3RyYWNraW5nJyk7XG52YXIgbHMgPSAnbG9jYWxTdG9yYWdlJyBpbiBnbG9iYWwgJiYgZ2xvYmFsLmxvY2FsU3RvcmFnZSA/IGdsb2JhbC5sb2NhbFN0b3JhZ2UgOiBzdHViO1xuXG5mdW5jdGlvbiBhY2Nlc3NvciAoa2V5LCB2YWx1ZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBnZXQoa2V5KTtcbiAgfVxuICByZXR1cm4gc2V0KGtleSwgdmFsdWUpO1xufVxuXG5mdW5jdGlvbiBnZXQgKGtleSkge1xuICByZXR1cm4gSlNPTi5wYXJzZShscy5nZXRJdGVtKGtleSkpO1xufVxuXG5mdW5jdGlvbiBzZXQgKGtleSwgdmFsdWUpIHtcbiAgdHJ5IHtcbiAgICBscy5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmUgKGtleSkge1xuICByZXR1cm4gbHMucmVtb3ZlSXRlbShrZXkpO1xufVxuXG5mdW5jdGlvbiBjbGVhciAoKSB7XG4gIHJldHVybiBscy5jbGVhcigpO1xufVxuXG5hY2Nlc3Nvci5zZXQgPSBzZXQ7XG5hY2Nlc3Nvci5nZXQgPSBnZXQ7XG5hY2Nlc3Nvci5yZW1vdmUgPSByZW1vdmU7XG5hY2Nlc3Nvci5jbGVhciA9IGNsZWFyO1xuYWNjZXNzb3Iub24gPSB0cmFja2luZy5vbjtcbmFjY2Vzc29yLm9mZiA9IHRyYWNraW5nLm9mZjtcblxubW9kdWxlLmV4cG9ydHMgPSBhY2Nlc3NvcjtcbiJdfQ==
    }, {
      "./stub": 43,
      "./tracking": 44
    }],
    43: [function (require, module, exports) {
      'use strict';

      var ms = {};

      function getItem(key) {
        return key in ms ? ms[key] : null;
      }

      function setItem(key, value) {
        ms[key] = value;
        return true;
      }

      function removeItem(key) {
        var found = key in ms;
        if (found) {
          return delete ms[key];
        }
        return false;
      }

      function clear() {
        ms = {};
        return true;
      }

      module.exports = {
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear
      };

    }, {}],
    44: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var listeners = {};
        var listening = false;

        function listen() {
          if (global.addEventListener) {
            global.addEventListener('storage', change, false);
          } else if (global.attachEvent) {
            global.attachEvent('onstorage', change);
          } else {
            global.onstorage = change;
          }
        }

        function change(e) {
          if (!e) {
            e = global.event;
          }
          var all = listeners[e.key];
          if (all) {
            all.forEach(fire);
          }

          function fire(listener) {
            listener(JSON.parse(e.newValue), JSON.parse(e.oldValue), e.url || e.uri);
          }
        }

        function on(key, fn) {
          if (listeners[key]) {
            listeners[key].push(fn);
          } else {
            listeners[key] = [fn];
          }
          if (listening === false) {
            listen();
          }
        }

        function off(key, fn) {
          var ns = listeners[key];
          if (ns.length > 1) {
            ns.splice(ns.indexOf(fn), 1);
          } else {
            listeners[key] = [];
          }
        }

        module.exports = {
          on: on,
          off: off
        };

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9sb2NhbC1zdG9yYWdlL3RyYWNraW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGxpc3RlbmVycyA9IHt9O1xudmFyIGxpc3RlbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBsaXN0ZW4gKCkge1xuICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIGNoYW5nZSwgZmFsc2UpO1xuICB9IGVsc2UgaWYgKGdsb2JhbC5hdHRhY2hFdmVudCkge1xuICAgIGdsb2JhbC5hdHRhY2hFdmVudCgnb25zdG9yYWdlJywgY2hhbmdlKTtcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwub25zdG9yYWdlID0gY2hhbmdlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoYW5nZSAoZSkge1xuICBpZiAoIWUpIHtcbiAgICBlID0gZ2xvYmFsLmV2ZW50O1xuICB9XG4gIHZhciBhbGwgPSBsaXN0ZW5lcnNbZS5rZXldO1xuICBpZiAoYWxsKSB7XG4gICAgYWxsLmZvckVhY2goZmlyZSk7XG4gIH1cblxuICBmdW5jdGlvbiBmaXJlIChsaXN0ZW5lcikge1xuICAgIGxpc3RlbmVyKEpTT04ucGFyc2UoZS5uZXdWYWx1ZSksIEpTT04ucGFyc2UoZS5vbGRWYWx1ZSksIGUudXJsIHx8IGUudXJpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbiAoa2V5LCBmbikge1xuICBpZiAobGlzdGVuZXJzW2tleV0pIHtcbiAgICBsaXN0ZW5lcnNba2V5XS5wdXNoKGZuKTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lcnNba2V5XSA9IFtmbl07XG4gIH1cbiAgaWYgKGxpc3RlbmluZyA9PT0gZmFsc2UpIHtcbiAgICBsaXN0ZW4oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvZmYgKGtleSwgZm4pIHtcbiAgdmFyIG5zID0gbGlzdGVuZXJzW2tleV07XG4gIGlmIChucy5sZW5ndGggPiAxKSB7XG4gICAgbnMuc3BsaWNlKG5zLmluZGV4T2YoZm4pLCAxKTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lcnNba2V5XSA9IFtdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvbjogb24sXG4gIG9mZjogb2ZmXG59O1xuIl19
    }, {}],
    45: [function (require, module, exports) {
      'use strict';


      module.exports = require('./lib/');

    }, {
      "./lib/": 55
    }],
    46: [function (require, module, exports) {
      // HTML5 entities map: { name -> utf16string }
      //
      'use strict';

      /*eslint quotes:0*/
      module.exports = require('entities/maps/entities.json');

    }, {
      "entities/maps/entities.json": 98
    }],
    47: [function (require, module, exports) {
      // List of valid html blocks names, accorting to commonmark spec
      // http://jgm.github.io/CommonMark/spec.html#html-blocks

      'use strict';


      module.exports = [
        'address',
        'article',
        'aside',
        'base',
        'basefont',
        'blockquote',
        'body',
        'caption',
        'center',
        'col',
        'colgroup',
        'dd',
        'details',
        'dialog',
        'dir',
        'div',
        'dl',
        'dt',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'frame',
        'frameset',
        'h1',
        'head',
        'header',
        'hr',
        'html',
        'iframe',
        'legend',
        'li',
        'link',
        'main',
        'menu',
        'menuitem',
        'meta',
        'nav',
        'noframes',
        'ol',
        'optgroup',
        'option',
        'p',
        'param',
        'pre',
        'section',
        'source',
        'title',
        'summary',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'title',
        'tr',
        'track',
        'ul'
      ];

    }, {}],
    48: [function (require, module, exports) {
      // Regexps to match html elements

      'use strict';

      var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

      var unquoted = '[^"\'=<>`\\x00-\\x20]+';
      var single_quoted = "'[^']*'";
      var double_quoted = '"[^"]*"';

      var attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

      var attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

      var open_tag = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';

      var close_tag = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
      var comment = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
      var processing = '<[?].*?[?]>';
      var declaration = '<![A-Z]+\\s+[^>]*>';
      var cdata = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

      var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
        '|' + processing + '|' + declaration + '|' + cdata + ')');
      var HTML_OPEN_CLOSE_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + ')');

      module.exports.HTML_TAG_RE = HTML_TAG_RE;
      module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;

    }, {}],
    49: [function (require, module, exports) {
      // List of valid url schemas, accorting to commonmark spec
      // http://jgm.github.io/CommonMark/spec.html#autolinks

      'use strict';


      module.exports = [
        'coap',
        'doi',
        'javascript',
        'aaa',
        'aaas',
        'about',
        'acap',
        'cap',
        'cid',
        'crid',
        'data',
        'dav',
        'dict',
        'dns',
        'file',
        'ftp',
        'geo',
        'go',
        'gopher',
        'h323',
        'http',
        'https',
        'iax',
        'icap',
        'im',
        'imap',
        'info',
        'ipp',
        'iris',
        'iris.beep',
        'iris.xpc',
        'iris.xpcs',
        'iris.lwz',
        'ldap',
        'mailto',
        'mid',
        'msrp',
        'msrps',
        'mtqp',
        'mupdate',
        'news',
        'nfs',
        'ni',
        'nih',
        'nntp',
        'opaquelocktoken',
        'pop',
        'pres',
        'rtsp',
        'service',
        'session',
        'shttp',
        'sieve',
        'sip',
        'sips',
        'sms',
        'snmp',
        'soap.beep',
        'soap.beeps',
        'tag',
        'tel',
        'telnet',
        'tftp',
        'thismessage',
        'tn3270',
        'tip',
        'tv',
        'urn',
        'vemmi',
        'ws',
        'wss',
        'xcon',
        'xcon-userid',
        'xmlrpc.beep',
        'xmlrpc.beeps',
        'xmpp',
        'z39.50r',
        'z39.50s',
        'adiumxtra',
        'afp',
        'afs',
        'aim',
        'apt',
        'attachment',
        'aw',
        'beshare',
        'bitcoin',
        'bolo',
        'callto',
        'chrome',
        'chrome-extension',
        'com-eventbrite-attendee',
        'content',
        'cvs',
        'dlna-playsingle',
        'dlna-playcontainer',
        'dtn',
        'dvb',
        'ed2k',
        'facetime',
        'feed',
        'finger',
        'fish',
        'gg',
        'git',
        'gizmoproject',
        'gtalk',
        'hcp',
        'icon',
        'ipn',
        'irc',
        'irc6',
        'ircs',
        'itms',
        'jar',
        'jms',
        'keyparc',
        'lastfm',
        'ldaps',
        'magnet',
        'maps',
        'market',
        'message',
        'mms',
        'ms-help',
        'msnim',
        'mumble',
        'mvn',
        'notes',
        'oid',
        'palm',
        'paparazzi',
        'platform',
        'proxy',
        'psyc',
        'query',
        'res',
        'resource',
        'rmi',
        'rsync',
        'rtmp',
        'secondlife',
        'sftp',
        'sgn',
        'skype',
        'smb',
        'soldat',
        'spotify',
        'ssh',
        'steam',
        'svn',
        'teamspeak',
        'things',
        'udp',
        'unreal',
        'ut2004',
        'ventrilo',
        'view-source',
        'webcal',
        'wtai',
        'wyciwyg',
        'xfire',
        'xri',
        'ymsgr'
      ];

    }, {}],
    50: [function (require, module, exports) {
      // Utilities
      //
      'use strict';


      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }

      function isString(obj) {
        return _class(obj) === '[object String]';
      }

      var _hasOwnProperty = Object.prototype.hasOwnProperty;

      function has(object, key) {
        return _hasOwnProperty.call(object, key);
      }

      // Merge objects
      //
      function assign(obj /*from1, from2, from3, ...*/ ) {
        var sources = Array.prototype.slice.call(arguments, 1);

        sources.forEach(function (source) {
          if (!source) {
            return;
          }

          if (typeof source !== 'object') {
            throw new TypeError(source + 'must be object');
          }

          Object.keys(source).forEach(function (key) {
            obj[key] = source[key];
          });
        });

        return obj;
      }

      // Remove element from array and put another array at those position.
      // Useful for some operations with tokens
      function arrayReplaceAt(src, pos, newElements) {
        return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
      }

      ////////////////////////////////////////////////////////////////////////////////

      function isValidEntityCode(c) {
        /*eslint no-bitwise:0*/
        // broken sequence
        if (c >= 0xD800 && c <= 0xDFFF) {
          return false;
        }
        // never used
        if (c >= 0xFDD0 && c <= 0xFDEF) {
          return false;
        }
        if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) {
          return false;
        }
        // control codes
        if (c >= 0x00 && c <= 0x08) {
          return false;
        }
        if (c === 0x0B) {
          return false;
        }
        if (c >= 0x0E && c <= 0x1F) {
          return false;
        }
        if (c >= 0x7F && c <= 0x9F) {
          return false;
        }
        // out of range
        if (c > 0x10FFFF) {
          return false;
        }
        return true;
      }

      function fromCodePoint(c) {
        /*eslint no-bitwise:0*/
        if (c > 0xffff) {
          c -= 0x10000;
          var surrogate1 = 0xd800 + (c >> 10),
            surrogate2 = 0xdc00 + (c & 0x3ff);

          return String.fromCharCode(surrogate1, surrogate2);
        }
        return String.fromCharCode(c);
      }


      var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
      var ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
      var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + '|' + ENTITY_RE.source, 'gi');

      var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

      var entities = require('./entities');

      function replaceEntityPattern(match, name) {
        var code = 0;

        if (has(entities, name)) {
          return entities[name];
        }

        if (name.charCodeAt(0) === 0x23 /* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
          code = name[1].toLowerCase() === 'x' ?
            parseInt(name.slice(2), 16) :
            parseInt(name.slice(1), 10);
          if (isValidEntityCode(code)) {
            return fromCodePoint(code);
          }
        }

        return match;
      }

      /*function replaceEntities(str) {
        if (str.indexOf('&') < 0) { return str; }

        return str.replace(ENTITY_RE, replaceEntityPattern);
      }*/

      function unescapeMd(str) {
        if (str.indexOf('\\') < 0) {
          return str;
        }
        return str.replace(UNESCAPE_MD_RE, '$1');
      }

      function unescapeAll(str) {
        if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) {
          return str;
        }

        return str.replace(UNESCAPE_ALL_RE, function (match, escaped, entity) {
          if (escaped) {
            return escaped;
          }
          return replaceEntityPattern(match, entity);
        });
      }

      ////////////////////////////////////////////////////////////////////////////////

      var HTML_ESCAPE_TEST_RE = /[&<>"]/;
      var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
      var HTML_REPLACEMENTS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      };

      function replaceUnsafeChar(ch) {
        return HTML_REPLACEMENTS[ch];
      }

      function escapeHtml(str) {
        if (HTML_ESCAPE_TEST_RE.test(str)) {
          return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
        }
        return str;
      }

      ////////////////////////////////////////////////////////////////////////////////

      var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;

      function escapeRE(str) {
        return str.replace(REGEXP_ESCAPE_RE, '\\$&');
      }

      ////////////////////////////////////////////////////////////////////////////////

      function isSpace(code) {
        switch (code) {
          case 0x09:
          case 0x20:
            return true;
        }
        return false;
      }

      // Zs (unicode class) || [\t\f\v\r\n]
      function isWhiteSpace(code) {
        if (code >= 0x2000 && code <= 0x200A) {
          return true;
        }
        switch (code) {
          case 0x09: // \t
          case 0x0A: // \n
          case 0x0B: // \v
          case 0x0C: // \f
          case 0x0D: // \r
          case 0x20:
          case 0xA0:
          case 0x1680:
          case 0x202F:
          case 0x205F:
          case 0x3000:
            return true;
        }
        return false;
      }

      ////////////////////////////////////////////////////////////////////////////////

      /*eslint-disable max-len*/
      var UNICODE_PUNCT_RE = require('uc.micro/categories/P/regex');

      // Currently without astral characters support.
      function isPunctChar(ch) {
        return UNICODE_PUNCT_RE.test(ch);
      }


      // Markdown ASCII punctuation characters.
      //
      // !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
      // http://spec.commonmark.org/0.15/#ascii-punctuation-character
      //
      // Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
      //
      function isMdAsciiPunct(ch) {
        switch (ch) {
          case 0x21 /* ! */ :
          case 0x22 /* " */ :
          case 0x23 /* # */ :
          case 0x24 /* $ */ :
          case 0x25 /* % */ :
          case 0x26 /* & */ :
          case 0x27 /* ' */ :
          case 0x28 /* ( */ :
          case 0x29 /* ) */ :
          case 0x2A /* * */ :
          case 0x2B /* + */ :
          case 0x2C /* , */ :
          case 0x2D /* - */ :
          case 0x2E /* . */ :
          case 0x2F /* / */ :
          case 0x3A /* : */ :
          case 0x3B /* ; */ :
          case 0x3C /* < */ :
          case 0x3D /* = */ :
          case 0x3E /* > */ :
          case 0x3F /* ? */ :
          case 0x40 /* @ */ :
          case 0x5B /* [ */ :
          case 0x5C /* \ */ :
          case 0x5D /* ] */ :
          case 0x5E /* ^ */ :
          case 0x5F /* _ */ :
          case 0x60 /* ` */ :
          case 0x7B /* { */ :
          case 0x7C /* | */ :
          case 0x7D /* } */ :
          case 0x7E /* ~ */ :
            return true;
          default:
            return false;
        }
      }

      // Hepler to unify [reference labels].
      //
      function normalizeReference(str) {
        // use .toUpperCase() instead of .toLowerCase()
        // here to avoid a conflict with Object.prototype
        // members (most notably, `__proto__`)
        return str.trim().replace(/\s+/g, ' ').toUpperCase();
      }

      ////////////////////////////////////////////////////////////////////////////////

      // Re-export libraries commonly used in both markdown-it and its plugins,
      // so plugins won't have to depend on them explicitly, which reduces their
      // bundled size (e.g. a browser build).
      //
      exports.lib = {};
      exports.lib.mdurl = require('mdurl');
      exports.lib.ucmicro = require('uc.micro');

      exports.assign = assign;
      exports.isString = isString;
      exports.has = has;
      exports.unescapeMd = unescapeMd;
      exports.unescapeAll = unescapeAll;
      exports.isValidEntityCode = isValidEntityCode;
      exports.fromCodePoint = fromCodePoint;
      // exports.replaceEntities     = replaceEntities;
      exports.escapeHtml = escapeHtml;
      exports.arrayReplaceAt = arrayReplaceAt;
      exports.isSpace = isSpace;
      exports.isWhiteSpace = isWhiteSpace;
      exports.isMdAsciiPunct = isMdAsciiPunct;
      exports.isPunctChar = isPunctChar;
      exports.escapeRE = escapeRE;
      exports.normalizeReference = normalizeReference;

    }, {
      "./entities": 46,
      "mdurl": 110,
      "uc.micro": 105,
      "uc.micro/categories/P/regex": 103
    }],
    51: [function (require, module, exports) {
      // Just a shortcut for bulk export
      'use strict';


      exports.parseLinkLabel = require('./parse_link_label');
      exports.parseLinkDestination = require('./parse_link_destination');
      exports.parseLinkTitle = require('./parse_link_title');

    }, {
      "./parse_link_destination": 52,
      "./parse_link_label": 53,
      "./parse_link_title": 54
    }],
    52: [function (require, module, exports) {
      // Parse link destination
      //
      'use strict';


      var unescapeAll = require('../common/utils').unescapeAll;


      module.exports = function parseLinkDestination(str, pos, max) {
        var code, level,
          lines = 0,
          start = pos,
          result = {
            ok: false,
            pos: 0,
            lines: 0,
            str: ''
          };

        if (str.charCodeAt(pos) === 0x3C /* < */ ) {
          pos++;
          while (pos < max) {
            code = str.charCodeAt(pos);
            if (code === 0x0A /* \n */ ) {
              return result;
            }
            if (code === 0x3E /* > */ ) {
              result.pos = pos + 1;
              result.str = unescapeAll(str.slice(start + 1, pos));
              result.ok = true;
              return result;
            }
            if (code === 0x5C /* \ */ && pos + 1 < max) {
              pos += 2;
              continue;
            }

            pos++;
          }

          // no closing '>'
          return result;
        }

        // this should be ... } else { ... branch

        level = 0;
        while (pos < max) {
          code = str.charCodeAt(pos);

          if (code === 0x20) {
            break;
          }

          // ascii control characters
          if (code < 0x20 || code === 0x7F) {
            break;
          }

          if (code === 0x5C /* \ */ && pos + 1 < max) {
            pos += 2;
            continue;
          }

          if (code === 0x28 /* ( */ ) {
            level++;
            if (level > 1) {
              break;
            }
          }

          if (code === 0x29 /* ) */ ) {
            level--;
            if (level < 0) {
              break;
            }
          }

          pos++;
        }

        if (start === pos) {
          return result;
        }

        result.str = unescapeAll(str.slice(start, pos));
        result.lines = lines;
        result.pos = pos;
        result.ok = true;
        return result;
      };

    }, {
      "../common/utils": 50
    }],
    53: [function (require, module, exports) {
      // Parse link label
      //
      // this function assumes that first character ("[") already matches;
      // returns the end of the label
      //
      'use strict';

      module.exports = function parseLinkLabel(state, start, disableNested) {
        var level, found, marker, prevPos,
          labelEnd = -1,
          max = state.posMax,
          oldPos = state.pos;

        state.pos = start + 1;
        level = 1;

        while (state.pos < max) {
          marker = state.src.charCodeAt(state.pos);
          if (marker === 0x5D /* ] */ ) {
            level--;
            if (level === 0) {
              found = true;
              break;
            }
          }

          prevPos = state.pos;
          state.md.inline.skipToken(state);
          if (marker === 0x5B /* [ */ ) {
            if (prevPos === state.pos - 1) {
              // increase level if we find text `[`, which is not a part of any token
              level++;
            } else if (disableNested) {
              state.pos = oldPos;
              return -1;
            }
          }
        }

        if (found) {
          labelEnd = state.pos;
        }

        // restore old state
        state.pos = oldPos;

        return labelEnd;
      };

    }, {}],
    54: [function (require, module, exports) {
      // Parse link title
      //
      'use strict';


      var unescapeAll = require('../common/utils').unescapeAll;


      module.exports = function parseLinkTitle(str, pos, max) {
        var code,
          marker,
          lines = 0,
          start = pos,
          result = {
            ok: false,
            pos: 0,
            lines: 0,
            str: ''
          };

        if (pos >= max) {
          return result;
        }

        marker = str.charCodeAt(pos);

        if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */ ) {
          return result;
        }

        pos++;

        // if opening marker is "(", switch it to closing marker ")"
        if (marker === 0x28) {
          marker = 0x29;
        }

        while (pos < max) {
          code = str.charCodeAt(pos);
          if (code === marker) {
            result.pos = pos + 1;
            result.lines = lines;
            result.str = unescapeAll(str.slice(start + 1, pos));
            result.ok = true;
            return result;
          } else if (code === 0x0A) {
            lines++;
          } else if (code === 0x5C /* \ */ && pos + 1 < max) {
            pos++;
            if (str.charCodeAt(pos) === 0x0A) {
              lines++;
            }
          }

          pos++;
        }

        return result;
      };

    }, {
      "../common/utils": 50
    }],
    55: [function (require, module, exports) {
      // Main perser class

      'use strict';


      var utils = require('./common/utils');
      var helpers = require('./helpers');
      var Renderer = require('./renderer');
      var ParserCore = require('./parser_core');
      var ParserBlock = require('./parser_block');
      var ParserInline = require('./parser_inline');
      var LinkifyIt = require('linkify-it');
      var mdurl = require('mdurl');
      var punycode = require('punycode');


      var config = {
        'default': require('./presets/default'),
        zero: require('./presets/zero'),
        commonmark: require('./presets/commonmark')
      };

      ////////////////////////////////////////////////////////////////////////////////
      //
      // This validator can prohibit more than really needed to prevent XSS. It's a
      // tradeoff to keep code simple and to be secure by default.
      //
      // If you need different setup - override validator method as you wish. Or
      // replace it with dummy function and use external sanitizer.
      //

      var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
      var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

      function validateLink(url) {
        // url should be normalized at this point, and existing entities are decoded
        var str = url.trim().toLowerCase();

        return BAD_PROTO_RE.test(str) ? (GOOD_DATA_RE.test(str) ? true : false) : true;
      }

      ////////////////////////////////////////////////////////////////////////////////


      var RECODE_HOSTNAME_FOR = ['http:', 'https:', 'mailto:'];

      function normalizeLink(url) {
        var parsed = mdurl.parse(url, true);

        if (parsed.hostname) {
          // Encode hostnames in urls like:
          // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
          //
          // We don't encode unknown schemas, because it's likely that we encode
          // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
          //
          if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
            try {
              parsed.hostname = punycode.toASCII(parsed.hostname);
            } catch (er) {
              /**/
            }
          }
        }

        return mdurl.encode(mdurl.format(parsed));
      }

      function normalizeLinkText(url) {
        var parsed = mdurl.parse(url, true);

        if (parsed.hostname) {
          // Encode hostnames in urls like:
          // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
          //
          // We don't encode unknown schemas, because it's likely that we encode
          // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
          //
          if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
            try {
              parsed.hostname = punycode.toUnicode(parsed.hostname);
            } catch (er) {
              /**/
            }
          }
        }

        return mdurl.decode(mdurl.format(parsed));
      }


      /**
       * class MarkdownIt
       *
       * Main parser/renderer class.
       *
       * ##### Usage
       *
       * ```javascript
       * // node.js, "classic" way:
       * var MarkdownIt = require('markdown-it'),
       *     md = new MarkdownIt();
       * var result = md.render('# markdown-it rulezz!');
       *
       * // node.js, the same, but with sugar:
       * var md = require('markdown-it')();
       * var result = md.render('# markdown-it rulezz!');
       *
       * // browser without AMD, added to "window" on script load
       * // Note, there are no dash.
       * var md = window.markdownit();
       * var result = md.render('# markdown-it rulezz!');
       * ```
       *
       * Single line rendering, without paragraph wrap:
       *
       * ```javascript
       * var md = require('markdown-it')();
       * var result = md.renderInline('__markdown-it__ rulezz!');
       * ```
       **/

      /**
       * new MarkdownIt([presetName, options])
       * - presetName (String): optional, `commonmark` / `zero`
       * - options (Object)
       *
       * Creates parser instanse with given config. Can be called without `new`.
       *
       * ##### presetName
       *
       * MarkdownIt provides named presets as a convenience to quickly
       * enable/disable active syntax rules and options for common use cases.
       *
       * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
       *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
       * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
       *   similar to GFM, used when no preset name given. Enables all available rules,
       *   but still without html, typographer & autolinker.
       * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
       *   all rules disabled. Useful to quickly setup your config via `.enable()`.
       *   For example, when you need only `bold` and `italic` markup and nothing else.
       *
       * ##### options:
       *
       * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
       *   That's not safe! You may need external sanitizer to protect output from XSS.
       *   It's better to extend features via plugins, instead of enabling HTML.
       * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
       *   (`<br />`). This is needed only for full CommonMark compatibility. In real
       *   world you will need HTML output.
       * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
       * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
       *   Can be useful for external highlighters.
       * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
       * - __typographer__  - `false`. Set `true` to enable [some language-neutral
       *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
       *   quotes beautification (smartquotes).
       * - __quotes__ - `“”‘’`, String or Array. Double + single quotes replacement
       *   pairs, when typographer enabled and smartquotes on. For example, you can
       *   use `'«»„“'` for Russian, `'„“‚‘'` for German, and
       *   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
       * - __highlight__ - `null`. Highlighter function for fenced code blocks.
       *   Highlighter `function (str, lang)` should return escaped HTML. It can also
       *   return empty string if the source was not changed and should be escaped
       *   externaly. If result starts with <pre... internal wrapper is skipped.
       *
       * ##### Example
       *
       * ```javascript
       * // commonmark mode
       * var md = require('markdown-it')('commonmark');
       *
       * // default mode
       * var md = require('markdown-it')();
       *
       * // enable everything
       * var md = require('markdown-it')({
       *   html: true,
       *   linkify: true,
       *   typographer: true
       * });
       * ```
       *
       * ##### Syntax highlighting
       *
       * ```js
       * var hljs = require('highlight.js') // https://highlightjs.org/
       *
       * var md = require('markdown-it')({
       *   highlight: function (str, lang) {
       *     if (lang && hljs.getLanguage(lang)) {
       *       try {
       *         return hljs.highlight(lang, str).value;
       *       } catch (__) {}
       *     }
       *
       *     return ''; // use external default escaping
       *   }
       * });
       * ```
       *
       * Or with full wrapper override (if you need assign class to <pre>):
       *
       * ```javascript
       * var hljs = require('highlight.js') // https://highlightjs.org/
       *
       * // Actual default values
       * var md = require('markdown-it')({
       *   highlight: function (str, lang) {
       *     if (lang && hljs.getLanguage(lang)) {
       *       try {
       *         return '<pre class="hljs"><code>' +
       *                hljs.highlight(lang, str).value +
       *                '</code></pre>';
       *       } catch (__) {}
       *     }
       *
       *     return '<pre class="hljs"><code>' + md.utils.esccapeHtml(str) + '</code></pre>';
       *   }
       * });
       * ```
       *
       **/
      function MarkdownIt(presetName, options) {
        if (!(this instanceof MarkdownIt)) {
          return new MarkdownIt(presetName, options);
        }

        if (!options) {
          if (!utils.isString(presetName)) {
            options = presetName || {};
            presetName = 'default';
          }
        }

        /**
         * MarkdownIt#inline -> ParserInline
         *
         * Instance of [[ParserInline]]. You may need it to add new rules when
         * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
         * [[MarkdownIt.enable]].
         **/
        this.inline = new ParserInline();

        /**
         * MarkdownIt#block -> ParserBlock
         *
         * Instance of [[ParserBlock]]. You may need it to add new rules when
         * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
         * [[MarkdownIt.enable]].
         **/
        this.block = new ParserBlock();

        /**
         * MarkdownIt#core -> Core
         *
         * Instance of [[Core]] chain executor. You may need it to add new rules when
         * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
         * [[MarkdownIt.enable]].
         **/
        this.core = new ParserCore();

        /**
         * MarkdownIt#renderer -> Renderer
         *
         * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
         * rules for new token types, generated by plugins.
         *
         * ##### Example
         *
         * ```javascript
         * var md = require('markdown-it')();
         *
         * function myToken(tokens, idx, options, env, self) {
         *   //...
         *   return result;
         * };
         *
         * md.renderer.rules['my_token'] = myToken
         * ```
         *
         * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
         **/
        this.renderer = new Renderer();

        /**
         * MarkdownIt#linkify -> LinkifyIt
         *
         * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
         * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
         * rule.
         **/
        this.linkify = new LinkifyIt();

        /**
         * MarkdownIt#validateLink(url) -> Boolean
         *
         * Link validation function. CommonMark allows too much in links. By default
         * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
         * except some embedded image types.
         *
         * You can change this behaviour:
         *
         * ```javascript
         * var md = require('markdown-it')();
         * // enable everything
         * md.validateLink = function () { return true; }
         * ```
         **/
        this.validateLink = validateLink;

        /**
         * MarkdownIt#normalizeLink(url) -> String
         *
         * Function used to encode link url to a machine-readable format,
         * which includes url-encoding, punycode, etc.
         **/
        this.normalizeLink = normalizeLink;

        /**
         * MarkdownIt#normalizeLinkText(url) -> String
         *
         * Function used to decode link url to a human-readable format`
         **/
        this.normalizeLinkText = normalizeLinkText;


        // Expose utils & helpers for easy acces from plugins

        /**
         * MarkdownIt#utils -> utils
         *
         * Assorted utility functions, useful to write plugins. See details
         * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
         **/
        this.utils = utils;

        /**
         * MarkdownIt#helpers -> helpers
         *
         * Link components parser functions, useful to write plugins. See details
         * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
         **/
        this.helpers = helpers;


        this.options = {};
        this.configure(presetName);

        if (options) {
          this.set(options);
        }
      }


      /** chainable
       * MarkdownIt.set(options)
       *
       * Set parser options (in the same format as in constructor). Probably, you
       * will never need it, but you can change options after constructor call.
       *
       * ##### Example
       *
       * ```javascript
       * var md = require('markdown-it')()
       *             .set({ html: true, breaks: true })
       *             .set({ typographer, true });
       * ```
       *
       * __Note:__ To achieve the best possible performance, don't modify a
       * `markdown-it` instance options on the fly. If you need multiple configurations
       * it's best to create multiple instances and initialize each with separate
       * config.
       **/
      MarkdownIt.prototype.set = function (options) {
        utils.assign(this.options, options);
        return this;
      };


      /** chainable, internal
       * MarkdownIt.configure(presets)
       *
       * Batch load of all options and compenent settings. This is internal method,
       * and you probably will not need it. But if you with - see available presets
       * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
       *
       * We strongly recommend to use presets instead of direct config loads. That
       * will give better compatibility with next versions.
       **/
      MarkdownIt.prototype.configure = function (presets) {
        var self = this,
          presetName;

        if (utils.isString(presets)) {
          presetName = presets;
          presets = config[presetName];
          if (!presets) {
            throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
          }
        }

        if (!presets) {
          throw new Error('Wrong `markdown-it` preset, can\'t be empty');
        }

        if (presets.options) {
          self.set(presets.options);
        }

        if (presets.components) {
          Object.keys(presets.components).forEach(function (name) {
            if (presets.components[name].rules) {
              self[name].ruler.enableOnly(presets.components[name].rules);
            }
            if (presets.components[name].rules2) {
              self[name].ruler2.enableOnly(presets.components[name].rules2);
            }
          });
        }
        return this;
      };


      /** chainable
       * MarkdownIt.enable(list, ignoreInvalid)
       * - list (String|Array): rule name or list of rule names to enable
       * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
       *
       * Enable list or rules. It will automatically find appropriate components,
       * containing rules with given names. If rule not found, and `ignoreInvalid`
       * not set - throws exception.
       *
       * ##### Example
       *
       * ```javascript
       * var md = require('markdown-it')()
       *             .enable(['sub', 'sup'])
       *             .disable('smartquotes');
       * ```
       **/
      MarkdownIt.prototype.enable = function (list, ignoreInvalid) {
        var result = [];

        if (!Array.isArray(list)) {
          list = [list];
        }

        ['core', 'block', 'inline'].forEach(function (chain) {
          result = result.concat(this[chain].ruler.enable(list, true));
        }, this);

        result = result.concat(this.inline.ruler2.enable(list, true));

        var missed = list.filter(function (name) {
          return result.indexOf(name) < 0;
        });

        if (missed.length && !ignoreInvalid) {
          throw new Error('MarkdownIt. Failed to enable unknown rule(s): ' + missed);
        }

        return this;
      };


      /** chainable
       * MarkdownIt.disable(list, ignoreInvalid)
       * - list (String|Array): rule name or list of rule names to disable.
       * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
       *
       * The same as [[MarkdownIt.enable]], but turn specified rules off.
       **/
      MarkdownIt.prototype.disable = function (list, ignoreInvalid) {
        var result = [];

        if (!Array.isArray(list)) {
          list = [list];
        }

        ['core', 'block', 'inline'].forEach(function (chain) {
          result = result.concat(this[chain].ruler.disable(list, true));
        }, this);

        result = result.concat(this.inline.ruler2.disable(list, true));

        var missed = list.filter(function (name) {
          return result.indexOf(name) < 0;
        });

        if (missed.length && !ignoreInvalid) {
          throw new Error('MarkdownIt. Failed to disable unknown rule(s): ' + missed);
        }
        return this;
      };


      /** chainable
       * MarkdownIt.use(plugin, params)
       *
       * Load specified plugin with given params into current parser instance.
       * It's just a sugar to call `plugin(md, params)` with curring.
       *
       * ##### Example
       *
       * ```javascript
       * var iterator = require('markdown-it-for-inline');
       * var md = require('markdown-it')()
       *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
       *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
       *             });
       * ```
       **/
      MarkdownIt.prototype.use = function (plugin /*, params, ... */ ) {
        var args = [this].concat(Array.prototype.slice.call(arguments, 1));
        plugin.apply(plugin, args);
        return this;
      };


      /** internal
       * MarkdownIt.parse(src, env) -> Array
       * - src (String): source string
       * - env (Object): environment sandbox
       *
       * Parse input string and returns list of block tokens (special token type
       * "inline" will contain list of inline tokens). You should not call this
       * method directly, until you write custom renderer (for example, to produce
       * AST).
       *
       * `env` is used to pass data between "distributed" rules and return additional
       * metadata like reference info, needed for the renderer. It also can be used to
       * inject data in specific cases. Usually, you will be ok to pass `{}`,
       * and then pass updated object to renderer.
       **/
      MarkdownIt.prototype.parse = function (src, env) {
        var state = new this.core.State(src, this, env);

        this.core.process(state);

        return state.tokens;
      };


      /**
       * MarkdownIt.render(src [, env]) -> String
       * - src (String): source string
       * - env (Object): environment sandbox
       *
       * Render markdown string into html. It does all magic for you :).
       *
       * `env` can be used to inject additional metadata (`{}` by default).
       * But you will not need it with high probability. See also comment
       * in [[MarkdownIt.parse]].
       **/
      MarkdownIt.prototype.render = function (src, env) {
        env = env || {};

        return this.renderer.render(this.parse(src, env), this.options, env);
      };


      /** internal
       * MarkdownIt.parseInline(src, env) -> Array
       * - src (String): source string
       * - env (Object): environment sandbox
       *
       * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
       * block tokens list with the single `inline` element, containing parsed inline
       * tokens in `children` property. Also updates `env` object.
       **/
      MarkdownIt.prototype.parseInline = function (src, env) {
        var state = new this.core.State(src, this, env);

        state.inlineMode = true;
        this.core.process(state);

        return state.tokens;
      };


      /**
       * MarkdownIt.renderInline(src [, env]) -> String
       * - src (String): source string
       * - env (Object): environment sandbox
       *
       * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
       * will NOT be wrapped into `<p>` tags.
       **/
      MarkdownIt.prototype.renderInline = function (src, env) {
        env = env || {};

        return this.renderer.render(this.parseInline(src, env), this.options, env);
      };


      module.exports = MarkdownIt;

    }, {
      "./common/utils": 50,
      "./helpers": 51,
      "./parser_block": 56,
      "./parser_core": 57,
      "./parser_inline": 58,
      "./presets/commonmark": 59,
      "./presets/default": 60,
      "./presets/zero": 61,
      "./renderer": 62,
      "linkify-it": 99,
      "mdurl": 110,
      "punycode": 116
    }],
    56: [function (require, module, exports) {
      /** internal
       * class ParserBlock
       *
       * Block-level tokenizer.
       **/
      'use strict';


      var Ruler = require('./ruler');


      var _rules = [
        // First 2 params - rule name & source. Secondary array - list of rules,
        // which can be terminated by this one.
        ['table', require('./rules_block/table'), ['paragraph', 'reference']],
        ['code', require('./rules_block/code')],
        ['fence', require('./rules_block/fence'), ['paragraph', 'reference', 'blockquote', 'list']],
        ['blockquote', require('./rules_block/blockquote'), ['paragraph', 'reference', 'list']],
        ['hr', require('./rules_block/hr'), ['paragraph', 'reference', 'blockquote', 'list']],
        ['list', require('./rules_block/list'), ['paragraph', 'reference', 'blockquote']],
        ['reference', require('./rules_block/reference')],
        ['heading', require('./rules_block/heading'), ['paragraph', 'reference', 'blockquote']],
        ['lheading', require('./rules_block/lheading')],
        ['html_block', require('./rules_block/html_block'), ['paragraph', 'reference', 'blockquote']],
        ['paragraph', require('./rules_block/paragraph')]
      ];


      /**
       * new ParserBlock()
       **/
      function ParserBlock() {
        /**
         * ParserBlock#ruler -> Ruler
         *
         * [[Ruler]] instance. Keep configuration of block rules.
         **/
        this.ruler = new Ruler();

        for (var i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1], {
            alt: (_rules[i][2] || []).slice()
          });
        }
      }


      // Generate tokens for input range
      //
      ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
        var ok, i,
          rules = this.ruler.getRules(''),
          len = rules.length,
          line = startLine,
          hasEmptyLines = false,
          maxNesting = state.md.options.maxNesting;

        while (line < endLine) {
          state.line = line = state.skipEmptyLines(line);
          if (line >= endLine) {
            break;
          }

          // Termination condition for nested calls.
          // Nested calls currently used for blockquotes & lists
          if (state.sCount[line] < state.blkIndent) {
            break;
          }

          // If nesting level exceeded - skip tail to the end. That's not ordinary
          // situation and we should not care about content.
          if (state.level >= maxNesting) {
            state.line = endLine;
            break;
          }

          // Try all possible rules.
          // On success, rule should:
          //
          // - update `state.line`
          // - update `state.tokens`
          // - return true

          for (i = 0; i < len; i++) {
            ok = rules[i](state, line, endLine, false);
            if (ok) {
              break;
            }
          }

          // set state.tight iff we had an empty line before current tag
          // i.e. latest empty line should not count
          state.tight = !hasEmptyLines;

          // paragraph might "eat" one newline after it in nested lists
          if (state.isEmpty(state.line - 1)) {
            hasEmptyLines = true;
          }

          line = state.line;

          if (line < endLine && state.isEmpty(line)) {
            hasEmptyLines = true;
            line++;

            // two empty lines should stop the parser in list mode
            if (line < endLine && state.parentType === 'list' && state.isEmpty(line)) {
              break;
            }
            state.line = line;
          }
        }
      };


      /**
       * ParserBlock.parse(str, md, env, outTokens)
       *
       * Process input string and push block tokens into `outTokens`
       **/
      ParserBlock.prototype.parse = function (src, md, env, outTokens) {
        var state;

        if (!src) {
          return [];
        }

        state = new this.State(src, md, env, outTokens);

        this.tokenize(state, state.line, state.lineMax);
      };


      ParserBlock.prototype.State = require('./rules_block/state_block');


      module.exports = ParserBlock;

    }, {
      "./ruler": 63,
      "./rules_block/blockquote": 64,
      "./rules_block/code": 65,
      "./rules_block/fence": 66,
      "./rules_block/heading": 67,
      "./rules_block/hr": 68,
      "./rules_block/html_block": 69,
      "./rules_block/lheading": 70,
      "./rules_block/list": 71,
      "./rules_block/paragraph": 72,
      "./rules_block/reference": 73,
      "./rules_block/state_block": 74,
      "./rules_block/table": 75
    }],
    57: [function (require, module, exports) {
      /** internal
       * class Core
       *
       * Top-level rules executor. Glues block/inline parsers and does intermediate
       * transformations.
       **/
      'use strict';


      var Ruler = require('./ruler');


      var _rules = [
        ['normalize', require('./rules_core/normalize')],
        ['block', require('./rules_core/block')],
        ['inline', require('./rules_core/inline')],
        ['linkify', require('./rules_core/linkify')],
        ['replacements', require('./rules_core/replacements')],
        ['smartquotes', require('./rules_core/smartquotes')]
      ];


      /**
       * new Core()
       **/
      function Core() {
        /**
         * Core#ruler -> Ruler
         *
         * [[Ruler]] instance. Keep configuration of core rules.
         **/
        this.ruler = new Ruler();

        for (var i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1]);
        }
      }


      /**
       * Core.process(state)
       *
       * Executes core chain rules.
       **/
      Core.prototype.process = function (state) {
        var i, l, rules;

        rules = this.ruler.getRules('');

        for (i = 0, l = rules.length; i < l; i++) {
          rules[i](state);
        }
      };

      Core.prototype.State = require('./rules_core/state_core');


      module.exports = Core;

    }, {
      "./ruler": 63,
      "./rules_core/block": 76,
      "./rules_core/inline": 77,
      "./rules_core/linkify": 78,
      "./rules_core/normalize": 79,
      "./rules_core/replacements": 80,
      "./rules_core/smartquotes": 81,
      "./rules_core/state_core": 82
    }],
    58: [function (require, module, exports) {
      /** internal
       * class ParserInline
       *
       * Tokenizes paragraph content.
       **/
      'use strict';


      var Ruler = require('./ruler');


      ////////////////////////////////////////////////////////////////////////////////
      // Parser rules

      var _rules = [
        ['text', require('./rules_inline/text')],
        ['newline', require('./rules_inline/newline')],
        ['escape', require('./rules_inline/escape')],
        ['backticks', require('./rules_inline/backticks')],
        ['strikethrough', require('./rules_inline/strikethrough').tokenize],
        ['emphasis', require('./rules_inline/emphasis').tokenize],
        ['link', require('./rules_inline/link')],
        ['image', require('./rules_inline/image')],
        ['autolink', require('./rules_inline/autolink')],
        ['html_inline', require('./rules_inline/html_inline')],
        ['entity', require('./rules_inline/entity')]
      ];

      var _rules2 = [
        ['balance_pairs', require('./rules_inline/balance_pairs')],
        ['strikethrough', require('./rules_inline/strikethrough').postProcess],
        ['emphasis', require('./rules_inline/emphasis').postProcess],
        ['text_collapse', require('./rules_inline/text_collapse')]
      ];


      /**
       * new ParserInline()
       **/
      function ParserInline() {
        var i;

        /**
         * ParserInline#ruler -> Ruler
         *
         * [[Ruler]] instance. Keep configuration of inline rules.
         **/
        this.ruler = new Ruler();

        for (i = 0; i < _rules.length; i++) {
          this.ruler.push(_rules[i][0], _rules[i][1]);
        }

        /**
         * ParserInline#ruler2 -> Ruler
         *
         * [[Ruler]] instance. Second ruler used for post-processing
         * (e.g. in emphasis-like rules).
         **/
        this.ruler2 = new Ruler();

        for (i = 0; i < _rules2.length; i++) {
          this.ruler2.push(_rules2[i][0], _rules2[i][1]);
        }
      }


      // Skip single token by running all rules in validation mode;
      // returns `true` if any rule reported success
      //
      ParserInline.prototype.skipToken = function (state) {
        var i, pos = state.pos,
          rules = this.ruler.getRules(''),
          len = rules.length,
          maxNesting = state.md.options.maxNesting,
          cache = state.cache;


        if (typeof cache[pos] !== 'undefined') {
          state.pos = cache[pos];
          return;
        }

        /*istanbul ignore else*/
        if (state.level < maxNesting) {
          for (i = 0; i < len; i++) {
            if (rules[i](state, true)) {
              cache[pos] = state.pos;
              return;
            }
          }
        }

        state.pos++;
        cache[pos] = state.pos;
      };


      // Generate tokens for input range
      //
      ParserInline.prototype.tokenize = function (state) {
        var ok, i,
          rules = this.ruler.getRules(''),
          len = rules.length,
          end = state.posMax,
          maxNesting = state.md.options.maxNesting;

        while (state.pos < end) {
          // Try all possible rules.
          // On success, rule should:
          //
          // - update `state.pos`
          // - update `state.tokens`
          // - return true

          if (state.level < maxNesting) {
            for (i = 0; i < len; i++) {
              ok = rules[i](state, false);
              if (ok) {
                break;
              }
            }
          }

          if (ok) {
            if (state.pos >= end) {
              break;
            }
            continue;
          }

          state.pending += state.src[state.pos++];
        }

        if (state.pending) {
          state.pushPending();
        }
      };


      /**
       * ParserInline.parse(str, md, env, outTokens)
       *
       * Process input string and push inline tokens into `outTokens`
       **/
      ParserInline.prototype.parse = function (str, md, env, outTokens) {
        var i, rules, len;
        var state = new this.State(str, md, env, outTokens);

        this.tokenize(state);

        rules = this.ruler2.getRules('');
        len = rules.length;

        for (i = 0; i < len; i++) {
          rules[i](state);
        }
      };


      ParserInline.prototype.State = require('./rules_inline/state_inline');


      module.exports = ParserInline;

    }, {
      "./ruler": 63,
      "./rules_inline/autolink": 83,
      "./rules_inline/backticks": 84,
      "./rules_inline/balance_pairs": 85,
      "./rules_inline/emphasis": 86,
      "./rules_inline/entity": 87,
      "./rules_inline/escape": 88,
      "./rules_inline/html_inline": 89,
      "./rules_inline/image": 90,
      "./rules_inline/link": 91,
      "./rules_inline/newline": 92,
      "./rules_inline/state_inline": 93,
      "./rules_inline/strikethrough": 94,
      "./rules_inline/text": 95,
      "./rules_inline/text_collapse": 96
    }],
    59: [function (require, module, exports) {
      // Commonmark default options

      'use strict';


      module.exports = {
        options: {
          html: true, // Enable HTML tags in source
          xhtmlOut: true, // Use '/' to close single tags (<br />)
          breaks: false, // Convert '\n' in paragraphs into <br>
          langPrefix: 'language-', // CSS language prefix for fenced blocks
          linkify: false, // autoconvert URL-like texts to links

          // Enable some language-neutral replacements + quotes beautification
          typographer: false,

          // Double + single quotes replacement pairs, when typographer enabled,
          // and smartquotes on. Could be either a String or an Array.
          //
          // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
          // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
          quotes: '\u201c\u201d\u2018\u2019',
          /* “”‘’ */

          // Highlighter function. Should return escaped HTML,
          // or '' if the source string is not changed and should be escaped externaly.
          // If result starts with <pre... internal wrapper is skipped.
          //
          // function (/*str, lang*/) { return ''; }
          //
          highlight: null,

          maxNesting: 20 // Internal protection, recursion limit
        },

        components: {

          core: {
            rules: [
              'normalize',
              'block',
              'inline'
            ]
          },

          block: {
            rules: [
              'blockquote',
              'code',
              'fence',
              'heading',
              'hr',
              'html_block',
              'lheading',
              'list',
              'reference',
              'paragraph'
            ]
          },

          inline: {
            rules: [
              'autolink',
              'backticks',
              'emphasis',
              'entity',
              'escape',
              'html_inline',
              'image',
              'link',
              'newline',
              'text'
            ],
            rules2: [
              'balance_pairs',
              'emphasis',
              'text_collapse'
            ]
          }
        }
      };

    }, {}],
    60: [function (require, module, exports) {
      // markdown-it default options

      'use strict';


      module.exports = {
        options: {
          html: false, // Enable HTML tags in source
          xhtmlOut: false, // Use '/' to close single tags (<br />)
          breaks: false, // Convert '\n' in paragraphs into <br>
          langPrefix: 'language-', // CSS language prefix for fenced blocks
          linkify: false, // autoconvert URL-like texts to links

          // Enable some language-neutral replacements + quotes beautification
          typographer: false,

          // Double + single quotes replacement pairs, when typographer enabled,
          // and smartquotes on. Could be either a String or an Array.
          //
          // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
          // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
          quotes: '\u201c\u201d\u2018\u2019',
          /* “”‘’ */

          // Highlighter function. Should return escaped HTML,
          // or '' if the source string is not changed and should be escaped externaly.
          // If result starts with <pre... internal wrapper is skipped.
          //
          // function (/*str, lang*/) { return ''; }
          //
          highlight: null,

          maxNesting: 20 // Internal protection, recursion limit
        },

        components: {

          core: {},
          block: {},
          inline: {}
        }
      };

    }, {}],
    61: [function (require, module, exports) {
      // "Zero" preset, with nothing enabled. Useful for manual configuring of simple
      // modes. For example, to parse bold/italic only.

      'use strict';


      module.exports = {
        options: {
          html: false, // Enable HTML tags in source
          xhtmlOut: false, // Use '/' to close single tags (<br />)
          breaks: false, // Convert '\n' in paragraphs into <br>
          langPrefix: 'language-', // CSS language prefix for fenced blocks
          linkify: false, // autoconvert URL-like texts to links

          // Enable some language-neutral replacements + quotes beautification
          typographer: false,

          // Double + single quotes replacement pairs, when typographer enabled,
          // and smartquotes on. Could be either a String or an Array.
          //
          // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
          // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
          quotes: '\u201c\u201d\u2018\u2019',
          /* “”‘’ */

          // Highlighter function. Should return escaped HTML,
          // or '' if the source string is not changed and should be escaped externaly.
          // If result starts with <pre... internal wrapper is skipped.
          //
          // function (/*str, lang*/) { return ''; }
          //
          highlight: null,

          maxNesting: 20 // Internal protection, recursion limit
        },

        components: {

          core: {
            rules: [
              'normalize',
              'block',
              'inline'
            ]
          },

          block: {
            rules: [
              'paragraph'
            ]
          },

          inline: {
            rules: [
              'text'
            ],
            rules2: [
              'balance_pairs',
              'text_collapse'
            ]
          }
        }
      };

    }, {}],
    62: [function (require, module, exports) {
      /**
       * class Renderer
       *
       * Generates HTML from parsed token stream. Each instance has independent
       * copy of rules. Those can be rewritten with ease. Also, you can add new
       * rules if you create plugin and adds new token types.
       **/
      'use strict';


      var assign = require('./common/utils').assign;
      var unescapeAll = require('./common/utils').unescapeAll;
      var escapeHtml = require('./common/utils').escapeHtml;


      ////////////////////////////////////////////////////////////////////////////////

      var default_rules = {};


      default_rules.code_inline = function (tokens, idx /*, options, env */ ) {
        return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
      };


      default_rules.code_block = function (tokens, idx /*, options, env */ ) {
        return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>\n';
      };


      default_rules.fence = function (tokens, idx, options, env, slf) {
        var token = tokens[idx],
          info = token.info ? unescapeAll(token.info).trim() : '',
          langName = '',
          highlighted;

        if (info) {
          langName = info.split(/\s+/g)[0];
          token.attrJoin('class', options.langPrefix + langName);
        }

        if (options.highlight) {
          highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
        } else {
          highlighted = escapeHtml(token.content);
        }

        if (highlighted.indexOf('<pre') === 0) {
          return highlighted + '\n';
        }

        return '<pre><code' + slf.renderAttrs(token) + '>' +
          highlighted +
          '</code></pre>\n';
      };


      default_rules.image = function (tokens, idx, options, env, slf) {
        var token = tokens[idx];

        // "alt" attr MUST be set, even if empty. Because it's mandatory and
        // should be placed on proper position for tests.
        //
        // Replace content with actual value

        token.attrs[token.attrIndex('alt')][1] =
          slf.renderInlineAsText(token.children, options, env);

        return slf.renderToken(tokens, idx, options);
      };


      default_rules.hardbreak = function (tokens, idx, options /*, env */ ) {
        return options.xhtmlOut ? '<br />\n' : '<br>\n';
      };
      default_rules.softbreak = function (tokens, idx, options /*, env */ ) {
        return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
      };


      default_rules.text = function (tokens, idx /*, options, env */ ) {
        return escapeHtml(tokens[idx].content);
      };


      default_rules.html_block = function (tokens, idx /*, options, env */ ) {
        return tokens[idx].content;
      };
      default_rules.html_inline = function (tokens, idx /*, options, env */ ) {
        return tokens[idx].content;
      };


      /**
       * new Renderer()
       *
       * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
       **/
      function Renderer() {

        /**
         * Renderer#rules -> Object
         *
         * Contains render rules for tokens. Can be updated and extended.
         *
         * ##### Example
         *
         * ```javascript
         * var md = require('markdown-it')();
         *
         * md.renderer.rules.strong_open  = function () { return '<b>'; };
         * md.renderer.rules.strong_close = function () { return '</b>'; };
         *
         * var result = md.renderInline(...);
         * ```
         *
         * Each rule is called as independed static function with fixed signature:
         *
         * ```javascript
         * function my_token_render(tokens, idx, options, env, renderer) {
         *   // ...
         *   return renderedHTML;
         * }
         * ```
         *
         * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
         * for more details and examples.
         **/
        this.rules = assign({}, default_rules);
      }


      /**
       * Renderer.renderAttrs(token) -> String
       *
       * Render token attributes to string.
       **/
      Renderer.prototype.renderAttrs = function renderAttrs(token) {
        var i, l, result;

        if (!token.attrs) {
          return '';
        }

        result = '';

        for (i = 0, l = token.attrs.length; i < l; i++) {
          result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
        }

        return result;
      };


      /**
       * Renderer.renderToken(tokens, idx, options) -> String
       * - tokens (Array): list of tokens
       * - idx (Numbed): token index to render
       * - options (Object): params of parser instance
       *
       * Default token renderer. Can be overriden by custom function
       * in [[Renderer#rules]].
       **/
      Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
        var nextToken,
          result = '',
          needLf = false,
          token = tokens[idx];

        // Tight list paragraphs
        if (token.hidden) {
          return '';
        }

        // Insert a newline between hidden paragraph and subsequent opening
        // block-level tag.
        //
        // For example, here we should insert a newline before blockquote:
        //  - a
        //    >
        //
        if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
          result += '\n';
        }

        // Add token name, e.g. `<img`
        result += (token.nesting === -1 ? '</' : '<') + token.tag;

        // Encode attributes, e.g. `<img src="foo"`
        result += this.renderAttrs(token);

        // Add a slash for self-closing tags, e.g. `<img src="foo" /`
        if (token.nesting === 0 && options.xhtmlOut) {
          result += ' /';
        }

        // Check if we need to add a newline after this tag
        if (token.block) {
          needLf = true;

          if (token.nesting === 1) {
            if (idx + 1 < tokens.length) {
              nextToken = tokens[idx + 1];

              if (nextToken.type === 'inline' || nextToken.hidden) {
                // Block-level tag containing an inline tag.
                //
                needLf = false;

              } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
                // Opening tag + closing tag of the same type. E.g. `<li></li>`.
                //
                needLf = false;
              }
            }
          }
        }

        result += needLf ? '>\n' : '>';

        return result;
      };


      /**
       * Renderer.renderInline(tokens, options, env) -> String
       * - tokens (Array): list on block tokens to renter
       * - options (Object): params of parser instance
       * - env (Object): additional data from parsed input (references, for example)
       *
       * The same as [[Renderer.render]], but for single token of `inline` type.
       **/
      Renderer.prototype.renderInline = function (tokens, options, env) {
        var type,
          result = '',
          rules = this.rules;

        for (var i = 0, len = tokens.length; i < len; i++) {
          type = tokens[i].type;

          if (typeof rules[type] !== 'undefined') {
            result += rules[type](tokens, i, options, env, this);
          } else {
            result += this.renderToken(tokens, i, options);
          }
        }

        return result;
      };


      /** internal
       * Renderer.renderInlineAsText(tokens, options, env) -> String
       * - tokens (Array): list on block tokens to renter
       * - options (Object): params of parser instance
       * - env (Object): additional data from parsed input (references, for example)
       *
       * Special kludge for image `alt` attributes to conform CommonMark spec.
       * Don't try to use it! Spec requires to show `alt` content with stripped markup,
       * instead of simple escaping.
       **/
      Renderer.prototype.renderInlineAsText = function (tokens, options, env) {
        var result = '',
          rules = this.rules;

        for (var i = 0, len = tokens.length; i < len; i++) {
          if (tokens[i].type === 'text') {
            result += rules.text(tokens, i, options, env, this);
          } else if (tokens[i].type === 'image') {
            result += this.renderInlineAsText(tokens[i].children, options, env);
          }
        }

        return result;
      };


      /**
       * Renderer.render(tokens, options, env) -> String
       * - tokens (Array): list on block tokens to renter
       * - options (Object): params of parser instance
       * - env (Object): additional data from parsed input (references, for example)
       *
       * Takes token stream and generates HTML. Probably, you will never need to call
       * this method directly.
       **/
      Renderer.prototype.render = function (tokens, options, env) {
        var i, len, type,
          result = '',
          rules = this.rules;

        for (i = 0, len = tokens.length; i < len; i++) {
          type = tokens[i].type;

          if (type === 'inline') {
            result += this.renderInline(tokens[i].children, options, env);
          } else if (typeof rules[type] !== 'undefined') {
            result += rules[tokens[i].type](tokens, i, options, env, this);
          } else {
            result += this.renderToken(tokens, i, options, env);
          }
        }

        return result;
      };

      module.exports = Renderer;

    }, {
      "./common/utils": 50
    }],
    63: [function (require, module, exports) {
      /**
       * class Ruler
       *
       * Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
       * [[MarkdownIt#inline]] to manage sequences of functions (rules):
       *
       * - keep rules in defined order
       * - assign the name to each rule
       * - enable/disable rules
       * - add/replace rules
       * - allow assign rules to additional named chains (in the same)
       * - cacheing lists of active rules
       *
       * You will not need use this class directly until write plugins. For simple
       * rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
       * [[MarkdownIt.use]].
       **/
      'use strict';


      /**
       * new Ruler()
       **/
      function Ruler() {
        // List of added rules. Each element is:
        //
        // {
        //   name: XXX,
        //   enabled: Boolean,
        //   fn: Function(),
        //   alt: [ name2, name3 ]
        // }
        //
        this.__rules__ = [];

        // Cached rule chains.
        //
        // First level - chain name, '' for default.
        // Second level - diginal anchor for fast filtering by charcodes.
        //
        this.__cache__ = null;
      }

      ////////////////////////////////////////////////////////////////////////////////
      // Helper methods, should not be used directly


      // Find rule index by name
      //
      Ruler.prototype.__find__ = function (name) {
        for (var i = 0; i < this.__rules__.length; i++) {
          if (this.__rules__[i].name === name) {
            return i;
          }
        }
        return -1;
      };


      // Build rules lookup cache
      //
      Ruler.prototype.__compile__ = function () {
        var self = this;
        var chains = [''];

        // collect unique names
        self.__rules__.forEach(function (rule) {
          if (!rule.enabled) {
            return;
          }

          rule.alt.forEach(function (altName) {
            if (chains.indexOf(altName) < 0) {
              chains.push(altName);
            }
          });
        });

        self.__cache__ = {};

        chains.forEach(function (chain) {
          self.__cache__[chain] = [];
          self.__rules__.forEach(function (rule) {
            if (!rule.enabled) {
              return;
            }

            if (chain && rule.alt.indexOf(chain) < 0) {
              return;
            }

            self.__cache__[chain].push(rule.fn);
          });
        });
      };


      /**
       * Ruler.at(name, fn [, options])
       * - name (String): rule name to replace.
       * - fn (Function): new rule function.
       * - options (Object): new rule options (not mandatory).
       *
       * Replace rule by name with new function & options. Throws error if name not
       * found.
       *
       * ##### Options:
       *
       * - __alt__ - array with names of "alternate" chains.
       *
       * ##### Example
       *
       * Replace existing typorgapher replacement rule with new one:
       *
       * ```javascript
       * var md = require('markdown-it')();
       *
       * md.core.ruler.at('replacements', function replace(state) {
       *   //...
       * });
       * ```
       **/
      Ruler.prototype.at = function (name, fn, options) {
        var index = this.__find__(name);
        var opt = options || {};

        if (index === -1) {
          throw new Error('Parser rule not found: ' + name);
        }

        this.__rules__[index].fn = fn;
        this.__rules__[index].alt = opt.alt || [];
        this.__cache__ = null;
      };


      /**
       * Ruler.before(beforeName, ruleName, fn [, options])
       * - beforeName (String): new rule will be added before this one.
       * - ruleName (String): name of added rule.
       * - fn (Function): rule function.
       * - options (Object): rule options (not mandatory).
       *
       * Add new rule to chain before one with given name. See also
       * [[Ruler.after]], [[Ruler.push]].
       *
       * ##### Options:
       *
       * - __alt__ - array with names of "alternate" chains.
       *
       * ##### Example
       *
       * ```javascript
       * var md = require('markdown-it')();
       *
       * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
       *   //...
       * });
       * ```
       **/
      Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
        var index = this.__find__(beforeName);
        var opt = options || {};

        if (index === -1) {
          throw new Error('Parser rule not found: ' + beforeName);
        }

        this.__rules__.splice(index, 0, {
          name: ruleName,
          enabled: true,
          fn: fn,
          alt: opt.alt || []
        });

        this.__cache__ = null;
      };


      /**
       * Ruler.after(afterName, ruleName, fn [, options])
       * - afterName (String): new rule will be added after this one.
       * - ruleName (String): name of added rule.
       * - fn (Function): rule function.
       * - options (Object): rule options (not mandatory).
       *
       * Add new rule to chain after one with given name. See also
       * [[Ruler.before]], [[Ruler.push]].
       *
       * ##### Options:
       *
       * - __alt__ - array with names of "alternate" chains.
       *
       * ##### Example
       *
       * ```javascript
       * var md = require('markdown-it')();
       *
       * md.inline.ruler.after('text', 'my_rule', function replace(state) {
       *   //...
       * });
       * ```
       **/
      Ruler.prototype.after = function (afterName, ruleName, fn, options) {
        var index = this.__find__(afterName);
        var opt = options || {};

        if (index === -1) {
          throw new Error('Parser rule not found: ' + afterName);
        }

        this.__rules__.splice(index + 1, 0, {
          name: ruleName,
          enabled: true,
          fn: fn,
          alt: opt.alt || []
        });

        this.__cache__ = null;
      };

      /**
       * Ruler.push(ruleName, fn [, options])
       * - ruleName (String): name of added rule.
       * - fn (Function): rule function.
       * - options (Object): rule options (not mandatory).
       *
       * Push new rule to the end of chain. See also
       * [[Ruler.before]], [[Ruler.after]].
       *
       * ##### Options:
       *
       * - __alt__ - array with names of "alternate" chains.
       *
       * ##### Example
       *
       * ```javascript
       * var md = require('markdown-it')();
       *
       * md.core.ruler.push('my_rule', function replace(state) {
       *   //...
       * });
       * ```
       **/
      Ruler.prototype.push = function (ruleName, fn, options) {
        var opt = options || {};

        this.__rules__.push({
          name: ruleName,
          enabled: true,
          fn: fn,
          alt: opt.alt || []
        });

        this.__cache__ = null;
      };


      /**
       * Ruler.enable(list [, ignoreInvalid]) -> Array
       * - list (String|Array): list of rule names to enable.
       * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
       *
       * Enable rules with given names. If any rule name not found - throw Error.
       * Errors can be disabled by second param.
       *
       * Returns list of found rule names (if no exception happened).
       *
       * See also [[Ruler.disable]], [[Ruler.enableOnly]].
       **/
      Ruler.prototype.enable = function (list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }

        var result = [];

        // Search by name and enable
        list.forEach(function (name) {
          var idx = this.__find__(name);

          if (idx < 0) {
            if (ignoreInvalid) {
              return;
            }
            throw new Error('Rules manager: invalid rule name ' + name);
          }
          this.__rules__[idx].enabled = true;
          result.push(name);
        }, this);

        this.__cache__ = null;
        return result;
      };


      /**
       * Ruler.enableOnly(list [, ignoreInvalid])
       * - list (String|Array): list of rule names to enable (whitelist).
       * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
       *
       * Enable rules with given names, and disable everything else. If any rule name
       * not found - throw Error. Errors can be disabled by second param.
       *
       * See also [[Ruler.disable]], [[Ruler.enable]].
       **/
      Ruler.prototype.enableOnly = function (list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }

        this.__rules__.forEach(function (rule) {
          rule.enabled = false;
        });

        this.enable(list, ignoreInvalid);
      };


      /**
       * Ruler.disable(list [, ignoreInvalid]) -> Array
       * - list (String|Array): list of rule names to disable.
       * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
       *
       * Disable rules with given names. If any rule name not found - throw Error.
       * Errors can be disabled by second param.
       *
       * Returns list of found rule names (if no exception happened).
       *
       * See also [[Ruler.enable]], [[Ruler.enableOnly]].
       **/
      Ruler.prototype.disable = function (list, ignoreInvalid) {
        if (!Array.isArray(list)) {
          list = [list];
        }

        var result = [];

        // Search by name and disable
        list.forEach(function (name) {
          var idx = this.__find__(name);

          if (idx < 0) {
            if (ignoreInvalid) {
              return;
            }
            throw new Error('Rules manager: invalid rule name ' + name);
          }
          this.__rules__[idx].enabled = false;
          result.push(name);
        }, this);

        this.__cache__ = null;
        return result;
      };


      /**
       * Ruler.getRules(chainName) -> Array
       *
       * Return array of active functions (rules) for given chain name. It analyzes
       * rules configuration, compiles caches if not exists and returns result.
       *
       * Default chain name is `''` (empty string). It can't be skipped. That's
       * done intentionally, to keep signature monomorphic for high speed.
       **/
      Ruler.prototype.getRules = function (chainName) {
        if (this.__cache__ === null) {
          this.__compile__();
        }

        // Chain can be empty, if rules disabled. But we still have to return Array.
        return this.__cache__[chainName] || [];
      };

      module.exports = Ruler;

    }, {}],
    64: [function (require, module, exports) {
      // Block quotes

      'use strict';

      var isSpace = require('../common/utils').isSpace;


      module.exports = function blockquote(state, startLine, endLine, silent) {
        var nextLine, lastLineEmpty, oldTShift, oldSCount, oldBMarks, oldIndent, oldParentType, lines, initial, offset, ch,
          terminatorRules, token,
          i, l, terminate,
          pos = state.bMarks[startLine] + state.tShift[startLine],
          max = state.eMarks[startLine];

        // check the block quote marker
        if (state.src.charCodeAt(pos++) !== 0x3E /* > */ ) {
          return false;
        }

        // we know that it's going to be a valid blockquote,
        // so no point trying to find the end of it in silent mode
        if (silent) {
          return true;
        }

        // skip one optional space (but not tab, check cmark impl) after '>'
        if (state.src.charCodeAt(pos) === 0x20) {
          pos++;
        }

        oldIndent = state.blkIndent;
        state.blkIndent = 0;

        // skip spaces after ">" and re-calculate offset
        initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

        oldBMarks = [state.bMarks[startLine]];
        state.bMarks[startLine] = pos;

        while (pos < max) {
          ch = state.src.charCodeAt(pos);

          if (isSpace(ch)) {
            if (ch === 0x09) {
              offset += 4 - offset % 4;
            } else {
              offset++;
            }
          } else {
            break;
          }

          pos++;
        }

        lastLineEmpty = pos >= max;

        oldSCount = [state.sCount[startLine]];
        state.sCount[startLine] = offset - initial;

        oldTShift = [state.tShift[startLine]];
        state.tShift[startLine] = pos - state.bMarks[startLine];

        terminatorRules = state.md.block.ruler.getRules('blockquote');

        // Search the end of the block
        //
        // Block ends with either:
        //  1. an empty line outside:
        //     ```
        //     > test
        //
        //     ```
        //  2. an empty line inside:
        //     ```
        //     >
        //     test
        //     ```
        //  3. another tag
        //     ```
        //     > test
        //      - - -
        //     ```
        for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
          if (state.sCount[nextLine] < oldIndent) {
            break;
          }

          pos = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];

          if (pos >= max) {
            // Case 1: line is not inside the blockquote, and this line is empty.
            break;
          }

          if (state.src.charCodeAt(pos++) === 0x3E /* > */ ) {
            // This line is inside the blockquote.

            // skip one optional space (but not tab, check cmark impl) after '>'
            if (state.src.charCodeAt(pos) === 0x20) {
              pos++;
            }

            // skip spaces after ">" and re-calculate offset
            initial = offset = state.sCount[nextLine] + pos - (state.bMarks[nextLine] + state.tShift[nextLine]);

            oldBMarks.push(state.bMarks[nextLine]);
            state.bMarks[nextLine] = pos;

            while (pos < max) {
              ch = state.src.charCodeAt(pos);

              if (isSpace(ch)) {
                if (ch === 0x09) {
                  offset += 4 - offset % 4;
                } else {
                  offset++;
                }
              } else {
                break;
              }

              pos++;
            }

            lastLineEmpty = pos >= max;

            oldSCount.push(state.sCount[nextLine]);
            state.sCount[nextLine] = offset - initial;

            oldTShift.push(state.tShift[nextLine]);
            state.tShift[nextLine] = pos - state.bMarks[nextLine];
            continue;
          }

          // Case 2: line is not inside the blockquote, and the last line was empty.
          if (lastLineEmpty) {
            break;
          }

          // Case 3: another tag found.
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }

          oldBMarks.push(state.bMarks[nextLine]);
          oldTShift.push(state.tShift[nextLine]);
          oldSCount.push(state.sCount[nextLine]);

          // A negative indentation means that this is a paragraph continuation
          //
          state.sCount[nextLine] = -1;
        }

        oldParentType = state.parentType;
        state.parentType = 'blockquote';

        token = state.push('blockquote_open', 'blockquote', 1);
        token.markup = '>';
        token.map = lines = [startLine, 0];

        state.md.block.tokenize(state, startLine, nextLine);

        token = state.push('blockquote_close', 'blockquote', -1);
        token.markup = '>';

        state.parentType = oldParentType;
        lines[1] = state.line;

        // Restore original tShift; this might not be necessary since the parser
        // has already been here, but just to make sure we can do that.
        for (i = 0; i < oldTShift.length; i++) {
          state.bMarks[i + startLine] = oldBMarks[i];
          state.tShift[i + startLine] = oldTShift[i];
          state.sCount[i + startLine] = oldSCount[i];
        }
        state.blkIndent = oldIndent;

        return true;
      };

    }, {
      "../common/utils": 50
    }],
    65: [function (require, module, exports) {
      // Code block (4 spaces padded)

      'use strict';


      module.exports = function code(state, startLine, endLine /*, silent*/ ) {
        var nextLine, last, token;

        if (state.sCount[startLine] - state.blkIndent < 4) {
          return false;
        }

        last = nextLine = startLine + 1;

        while (nextLine < endLine) {
          if (state.isEmpty(nextLine)) {
            nextLine++;
            continue;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            nextLine++;
            last = nextLine;
            continue;
          }
          break;
        }

        state.line = nextLine;

        token = state.push('code_block', 'code', 0);
        token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
        token.map = [startLine, state.line];

        return true;
      };

    }, {}],
    66: [function (require, module, exports) {
      // fences (``` lang, ~~~ lang)

      'use strict';


      module.exports = function fence(state, startLine, endLine, silent) {
        var marker, len, params, nextLine, mem, token, markup,
          haveEndMarker = false,
          pos = state.bMarks[startLine] + state.tShift[startLine],
          max = state.eMarks[startLine];

        if (pos + 3 > max) {
          return false;
        }

        marker = state.src.charCodeAt(pos);

        if (marker !== 0x7E /* ~ */ && marker !== 0x60 /* ` */ ) {
          return false;
        }

        // scan marker length
        mem = pos;
        pos = state.skipChars(pos, marker);

        len = pos - mem;

        if (len < 3) {
          return false;
        }

        markup = state.src.slice(mem, pos);
        params = state.src.slice(pos, max);

        if (params.indexOf('`') >= 0) {
          return false;
        }

        // Since start is found, we can report success here in validation mode
        if (silent) {
          return true;
        }

        // search end of block
        nextLine = startLine;

        for (;;) {
          nextLine++;
          if (nextLine >= endLine) {
            // unclosed block should be autoclosed by end of document.
            // also block seems to be autoclosed by end of parent
            break;
          }

          pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];

          if (pos < max && state.sCount[nextLine] < state.blkIndent) {
            // non-empty line with negative indent should stop the list:
            // - ```
            //  test
            break;
          }

          if (state.src.charCodeAt(pos) !== marker) {
            continue;
          }

          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            // closing fence should be indented less than 4 spaces
            continue;
          }

          pos = state.skipChars(pos, marker);

          // closing code fence must be at least as long as the opening one
          if (pos - mem < len) {
            continue;
          }

          // make sure tail has spaces only
          pos = state.skipSpaces(pos);

          if (pos < max) {
            continue;
          }

          haveEndMarker = true;
          // found!
          break;
        }

        // If a fence has heading spaces, they should be removed from its inner block
        len = state.sCount[startLine];

        state.line = nextLine + (haveEndMarker ? 1 : 0);

        token = state.push('fence', 'code', 0);
        token.info = params;
        token.content = state.getLines(startLine + 1, nextLine, len, true);
        token.markup = markup;
        token.map = [startLine, state.line];

        return true;
      };

    }, {}],
    67: [function (require, module, exports) {
      // heading (#, ##, ...)

      'use strict';

      var isSpace = require('../common/utils').isSpace;


      module.exports = function heading(state, startLine, endLine, silent) {
        var ch, level, tmp, token,
          pos = state.bMarks[startLine] + state.tShift[startLine],
          max = state.eMarks[startLine];

        ch = state.src.charCodeAt(pos);

        if (ch !== 0x23 /* # */ || pos >= max) {
          return false;
        }

        // count heading level
        level = 1;
        ch = state.src.charCodeAt(++pos);
        while (ch === 0x23 /* # */ && pos < max && level <= 6) {
          level++;
          ch = state.src.charCodeAt(++pos);
        }

        if (level > 6 || (pos < max && ch !== 0x20 /* space */ )) {
          return false;
        }

        if (silent) {
          return true;
        }

        // Let's cut tails like '    ###  ' from the end of string

        max = state.skipSpacesBack(max, pos);
        tmp = state.skipCharsBack(max, 0x23, pos); // #
        if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
          max = tmp;
        }

        state.line = startLine + 1;

        token = state.push('heading_open', 'h' + String(level), 1);
        token.markup = '########'.slice(0, level);
        token.map = [startLine, state.line];

        token = state.push('inline', '', 0);
        token.content = state.src.slice(pos, max).trim();
        token.map = [startLine, state.line];
        token.children = [];

        token = state.push('heading_close', 'h' + String(level), -1);
        token.markup = '########'.slice(0, level);

        return true;
      };

    }, {
      "../common/utils": 50
    }],
    68: [function (require, module, exports) {
      // Horizontal rule

      'use strict';

      var isSpace = require('../common/utils').isSpace;


      module.exports = function hr(state, startLine, endLine, silent) {
        var marker, cnt, ch, token,
          pos = state.bMarks[startLine] + state.tShift[startLine],
          max = state.eMarks[startLine];

        marker = state.src.charCodeAt(pos++);

        // Check hr marker
        if (marker !== 0x2A /* * */ &&
          marker !== 0x2D /* - */ &&
          marker !== 0x5F /* _ */ ) {
          return false;
        }

        // markers can be mixed with spaces, but there should be at least 3 of them

        cnt = 1;
        while (pos < max) {
          ch = state.src.charCodeAt(pos++);
          if (ch !== marker && !isSpace(ch)) {
            return false;
          }
          if (ch === marker) {
            cnt++;
          }
        }

        if (cnt < 3) {
          return false;
        }

        if (silent) {
          return true;
        }

        state.line = startLine + 1;

        token = state.push('hr', 'hr', 0);
        token.map = [startLine, state.line];
        token.markup = Array(cnt + 1).join(String.fromCharCode(marker));

        return true;
      };

    }, {
      "../common/utils": 50
    }],
    69: [function (require, module, exports) {
      // HTML block

      'use strict';


      var block_names = require('../common/html_blocks');
      var HTML_OPEN_CLOSE_TAG_RE = require('../common/html_re').HTML_OPEN_CLOSE_TAG_RE;

      // An array of opening and corresponding closing sequences for html tags,
      // last argument defines whether it can terminate a paragraph or not
      //
      var HTML_SEQUENCES = [
        [/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true],
        [/^<!--/, /-->/, true],
        [/^<\?/, /\?>/, true],
        [/^<![A-Z]/, />/, true],
        [/^<!\[CDATA\[/, /\]\]>/, true],
        [new RegExp('^</?(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true],
        [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'), /^$/, false]
      ];


      module.exports = function html_block(state, startLine, endLine, silent) {
        var i, nextLine, token, lineText,
          pos = state.bMarks[startLine] + state.tShift[startLine],
          max = state.eMarks[startLine];

        if (!state.md.options.html) {
          return false;
        }

        if (state.src.charCodeAt(pos) !== 0x3C /* < */ ) {
          return false;
        }

        lineText = state.src.slice(pos, max);

        for (i = 0; i < HTML_SEQUENCES.length; i++) {
          if (HTML_SEQUENCES[i][0].test(lineText)) {
            break;
          }
        }

        if (i === HTML_SEQUENCES.length) {
          return false;
        }

        if (silent) {
          // true if this sequence can be a terminator, false otherwise
          return HTML_SEQUENCES[i][2];
        }

        nextLine = startLine + 1;

        // If we are here - we detected HTML block.
        // Let's roll down till block end.
        if (!HTML_SEQUENCES[i][1].test(lineText)) {
          for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
              break;
            }

            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);

            if (HTML_SEQUENCES[i][1].test(lineText)) {
              if (lineText.length !== 0) {
                nextLine++;
              }
              break;
            }
          }
        }

        state.line = nextLine;

        token = state.push('html_block', '', 0);
        token.map = [startLine, nextLine];
        token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

        return true;
      };

    }, {
      "../common/html_blocks": 47,
      "../common/html_re": 48
    }],
    70: [function (require, module, exports) {
      // lheading (---, ===)

      'use strict';


      module.exports = function lheading(state, startLine, endLine /*, silent*/ ) {
        var marker, pos, max, token, level,
          next = startLine + 1;

        if (next >= endLine) {
          return false;
        }
        if (state.sCount[next] < state.blkIndent) {
          return false;
        }

        // Scan next line

        if (state.sCount[next] - state.blkIndent > 3) {
          return false;
        }

        pos = state.bMarks[next] + state.tShift[next];
        max = state.eMarks[next];

        if (pos >= max) {
          return false;
        }

        marker = state.src.charCodeAt(pos);

        if (marker !== 0x2D /* - */ && marker !== 0x3D /* = */ ) {
          return false;
        }

        pos = state.skipChars(pos, marker);

        pos = state.skipSpaces(pos);

        if (pos < max) {
          return false;
        }

        pos = state.bMarks[startLine] + state.tShift[startLine];

        state.line = next + 1;
        level = (marker === 0x3D /* = */ ? 1 : 2);

        token = state.push('heading_open', 'h' + String(level), 1);
        token.markup = String.fromCharCode(marker);
        token.map = [startLine, state.line];

        token = state.push('inline', '', 0);
        token.content = state.src.slice(pos, state.eMarks[startLine]).trim();
        token.map = [startLine, state.line - 1];
        token.children = [];

        token = state.push('heading_close', 'h' + String(level), -1);
        token.markup = String.fromCharCode(marker);

        return true;
      };

    }, {}],
    71: [function (require, module, exports) {
      // Lists

      'use strict';

      var isSpace = require('../common/utils').isSpace;


      // Search `[-+*][\n ]`, returns next pos arter marker on success
      // or -1 on fail.
      function skipBulletListMarker(state, startLine) {
        var marker, pos, max, ch;

        pos = state.bMarks[startLine] + state.tShift[startLine];
        max = state.eMarks[startLine];

        marker = state.src.charCodeAt(pos++);
        // Check bullet
        if (marker !== 0x2A /* * */ &&
          marker !== 0x2D /* - */ &&
          marker !== 0x2B /* + */ ) {
          return -1;
        }

        if (pos < max) {
          ch = state.src.charCodeAt(pos);

          if (!isSpace(ch)) {
            // " -test " - is not a list item
            return -1;
          }
        }

        return pos;
      }

      // Search `\d+[.)][\n ]`, returns next pos arter marker on success
      // or -1 on fail.
      function skipOrderedListMarker(state, startLine) {
        var ch,
          start = state.bMarks[startLine] + state.tShift[startLine],
          pos = start,
          max = state.eMarks[startLine];

        // List marker should have at least 2 chars (digit + dot)
        if (pos + 1 >= max) {
          return -1;
        }

        ch = state.src.charCodeAt(pos++);

        if (ch < 0x30 /* 0 */ || ch > 0x39 /* 9 */ ) {
          return -1;
        }

        for (;;) {
          // EOL -> fail
          if (pos >= max) {
            return -1;
          }

          ch = state.src.charCodeAt(pos++);

          if (ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */ ) {

            // List marker should have no more than 9 digits
            // (prevents integer overflow in browsers)
            if (pos - start >= 10) {
              return -1;
            }

            continue;
          }

          // found valid marker
          if (ch === 0x29 /* ) */ || ch === 0x2e /* . */ ) {
            break;
          }

          return -1;
        }


        if (pos < max) {
          ch = state.src.charCodeAt(pos);

          if (!isSpace(ch)) {
            // " 1.test " - is not a list item
            return -1;
          }
        }
        return pos;
      }

      function markTightParagraphs(state, idx) {
        var i, l,
          level = state.level + 2;

        for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
          if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
            state.tokens[i + 2].hidden = true;
            state.tokens[i].hidden = true;
            i += 2;
          }
        }
      }


      module.exports = function list(state, startLine, endLine, silent) {
        var nextLine,
          initial,
          offset,
          indent,
          oldTShift,
          oldIndent,
          oldLIndent,
          oldTight,
          oldParentType,
          start,
          posAfterMarker,
          ch,
          pos,
          max,
          indentAfterMarker,
          markerValue,
          markerCharCode,
          isOrdered,
          contentStart,
          listTokIdx,
          prevEmptyEnd,
          listLines,
          itemLines,
          tight = true,
          terminatorRules,
          token,
          i, l, terminate;

        // Detect list type and position after marker
        if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
          isOrdered = true;
        } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
          isOrdered = false;
        } else {
          return false;
        }

        // We should terminate list on style change. Remember first one to compare.
        markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

        // For validation mode we can terminate immediately
        if (silent) {
          return true;
        }

        // Start list
        listTokIdx = state.tokens.length;

        if (isOrdered) {
          start = state.bMarks[startLine] + state.tShift[startLine];
          markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

          token = state.push('ordered_list_open', 'ol', 1);
          if (markerValue !== 1) {
            token.attrs = [
              ['start', markerValue]
            ];
          }

        } else {
          token = state.push('bullet_list_open', 'ul', 1);
        }

        token.map = listLines = [startLine, 0];
        token.markup = String.fromCharCode(markerCharCode);

        //
        // Iterate list items
        //

        nextLine = startLine;
        prevEmptyEnd = false;
        terminatorRules = state.md.block.ruler.getRules('list');

        while (nextLine < endLine) {
          pos = posAfterMarker;
          max = state.eMarks[nextLine];

          initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);

          while (pos < max) {
            ch = state.src.charCodeAt(pos);

            if (isSpace(ch)) {
              if (ch === 0x09) {
                offset += 4 - offset % 4;
              } else {
                offset++;
              }
            } else {
              break;
            }

            pos++;
          }

          contentStart = pos;

          if (contentStart >= max) {
            // trimming space in "-    \n  3" case, indent is 1 here
            indentAfterMarker = 1;
          } else {
            indentAfterMarker = offset - initial;
          }

          // If we have more than 4 spaces, the indent is 1
          // (the rest is just indented code block)
          if (indentAfterMarker > 4) {
            indentAfterMarker = 1;
          }

          // "  -  test"
          //  ^^^^^ - calculating total length of this thing
          indent = initial + indentAfterMarker;

          // Run subparser & write tokens
          token = state.push('list_item_open', 'li', 1);
          token.markup = String.fromCharCode(markerCharCode);
          token.map = itemLines = [startLine, 0];

          oldIndent = state.blkIndent;
          oldTight = state.tight;
          oldTShift = state.tShift[startLine];
          oldLIndent = state.sCount[startLine];
          oldParentType = state.parentType;
          state.blkIndent = indent;
          state.tight = true;
          state.parentType = 'list';
          state.tShift[startLine] = contentStart - state.bMarks[startLine];
          state.sCount[startLine] = offset;

          state.md.block.tokenize(state, startLine, endLine, true);

          // If any of list item is tight, mark list as tight
          if (!state.tight || prevEmptyEnd) {
            tight = false;
          }
          // Item become loose if finish with empty line,
          // but we should filter last element, because it means list finish
          prevEmptyEnd = (state.line - startLine) > 1 && state.isEmpty(state.line - 1);

          state.blkIndent = oldIndent;
          state.tShift[startLine] = oldTShift;
          state.sCount[startLine] = oldLIndent;
          state.tight = oldTight;
          state.parentType = oldParentType;

          token = state.push('list_item_close', 'li', -1);
          token.markup = String.fromCharCode(markerCharCode);

          nextLine = startLine = state.line;
          itemLines[1] = nextLine;
          contentStart = state.bMarks[startLine];

          if (nextLine >= endLine) {
            break;
          }

          if (state.isEmpty(nextLine)) {
            break;
          }

          //
          // Try to check if list is terminated or continued.
          //
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }

          // fail if terminating block found
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }

          // fail if list has another type
          if (isOrdered) {
            posAfterMarker = skipOrderedListMarker(state, nextLine);
            if (posAfterMarker < 0) {
              break;
            }
          } else {
            posAfterMarker = skipBulletListMarker(state, nextLine);
            if (posAfterMarker < 0) {
              break;
            }
          }

          if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
            break;
          }
        }

        // Finilize list
        if (isOrdered) {
          token = state.push('ordered_list_close', 'ol', -1);
        } else {
          token = state.push('bullet_list_close', 'ul', -1);
        }
        token.markup = String.fromCharCode(markerCharCode);

        listLines[1] = nextLine;
        state.line = nextLine;

        // mark paragraphs tight if needed
        if (tight) {
          markTightParagraphs(state, listTokIdx);
        }

        return true;
      };

    }, {
      "../common/utils": 50
    }],
    72: [function (require, module, exports) {
      // Paragraph

      'use strict';


      module.exports = function paragraph(state, startLine /*, endLine*/ ) {
        var content, terminate, i, l, token,
          nextLine = startLine + 1,
          terminatorRules = state.md.block.ruler.getRules('paragraph'),
          endLine = state.lineMax;

        // jump line-by-line until empty one or EOF
        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          // this would be a code block normally, but after paragraph
          // it's considered a lazy continuation regardless of what's there
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }

          // quirk for blockquotes, this line should already be checked by that rule
          if (state.sCount[nextLine] < 0) {
            continue;
          }

          // Some tags can terminate paragraph without empty line.
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }

        content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

        state.line = nextLine;

        token = state.push('paragraph_open', 'p', 1);
        token.map = [startLine, state.line];

        token = state.push('inline', '', 0);
        token.content = content;
        token.map = [startLine, state.line];
        token.children = [];

        token = state.push('paragraph_close', 'p', -1);

        return true;
      };

    }, {}],
    73: [function (require, module, exports) {
      'use strict';


      var parseLinkDestination = require('../helpers/parse_link_destination');
      var parseLinkTitle = require('../helpers/parse_link_title');
      var normalizeReference = require('../common/utils').normalizeReference;
      var isSpace = require('../common/utils').isSpace;


      module.exports = function reference(state, startLine, _endLine, silent) {
        var ch,
          destEndPos,
          destEndLineNo,
          endLine,
          href,
          i,
          l,
          label,
          labelEnd,
          res,
          start,
          str,
          terminate,
          terminatorRules,
          title,
          lines = 0,
          pos = state.bMarks[startLine] + state.tShift[startLine],
          max = state.eMarks[startLine],
          nextLine = startLine + 1;

        if (state.src.charCodeAt(pos) !== 0x5B /* [ */ ) {
          return false;
        }

        // Simple check to quickly interrupt scan on [link](url) at the start of line.
        // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
        while (++pos < max) {
          if (state.src.charCodeAt(pos) === 0x5D /* ] */ &&
            state.src.charCodeAt(pos - 1) !== 0x5C /* \ */ ) {
            if (pos + 1 === max) {
              return false;
            }
            if (state.src.charCodeAt(pos + 1) !== 0x3A /* : */ ) {
              return false;
            }
            break;
          }
        }

        endLine = state.lineMax;

        // jump line-by-line until empty one or EOF
        terminatorRules = state.md.block.ruler.getRules('reference');

        for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
          // this would be a code block normally, but after paragraph
          // it's considered a lazy continuation regardless of what's there
          if (state.sCount[nextLine] - state.blkIndent > 3) {
            continue;
          }

          // quirk for blockquotes, this line should already be checked by that rule
          if (state.sCount[nextLine] < 0) {
            continue;
          }

          // Some tags can terminate paragraph without empty line.
          terminate = false;
          for (i = 0, l = terminatorRules.length; i < l; i++) {
            if (terminatorRules[i](state, nextLine, endLine, true)) {
              terminate = true;
              break;
            }
          }
          if (terminate) {
            break;
          }
        }

        str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
        max = str.length;

        for (pos = 1; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 0x5B /* [ */ ) {
            return false;
          } else if (ch === 0x5D /* ] */ ) {
            labelEnd = pos;
            break;
          } else if (ch === 0x0A /* \n */ ) {
            lines++;
          } else if (ch === 0x5C /* \ */ ) {
            pos++;
            if (pos < max && str.charCodeAt(pos) === 0x0A) {
              lines++;
            }
          }
        }

        if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A /* : */ ) {
          return false;
        }

        // [label]:   destination   'title'
        //         ^^^ skip optional whitespace here
        for (pos = labelEnd + 2; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 0x0A) {
            lines++;
          } else if (isSpace(ch)) {
            /*eslint no-empty:0*/
          } else {
            break;
          }
        }

        // [label]:   destination   'title'
        //            ^^^^^^^^^^^ parse this
        res = parseLinkDestination(str, pos, max);
        if (!res.ok) {
          return false;
        }

        href = state.md.normalizeLink(res.str);
        if (!state.md.validateLink(href)) {
          return false;
        }

        pos = res.pos;
        lines += res.lines;

        // save cursor state, we could require to rollback later
        destEndPos = pos;
        destEndLineNo = lines;

        // [label]:   destination   'title'
        //                       ^^^ skipping those spaces
        start = pos;
        for (; pos < max; pos++) {
          ch = str.charCodeAt(pos);
          if (ch === 0x0A) {
            lines++;
          } else if (isSpace(ch)) {
            /*eslint no-empty:0*/
          } else {
            break;
          }
        }

        // [label]:   destination   'title'
        //                          ^^^^^^^ parse this
        res = parseLinkTitle(str, pos, max);
        if (pos < max && start !== pos && res.ok) {
          title = res.str;
          pos = res.pos;
          lines += res.lines;
        } else {
          title = '';
          pos = destEndPos;
          lines = destEndLineNo;
        }

        // skip trailing spaces until the rest of the line
        while (pos < max) {
          ch = str.charCodeAt(pos);
          if (!isSpace(ch)) {
            break;
          }
          pos++;
        }

        if (pos < max && str.charCodeAt(pos) !== 0x0A) {
          if (title) {
            // garbage at the end of the line after title,
            // but it could still be a valid reference if we roll back
            title = '';
            pos = destEndPos;
            lines = destEndLineNo;
            while (pos < max) {
              ch = str.charCodeAt(pos);
              if (!isSpace(ch)) {
                break;
              }
              pos++;
            }
          }
        }

        if (pos < max && str.charCodeAt(pos) !== 0x0A) {
          // garbage at the end of the line
          return false;
        }

        label = normalizeReference(str.slice(1, labelEnd));
        if (!label) {
          // CommonMark 0.20 disallows empty labels
          return false;
        }

        // Reference can not terminate anything. This check is for safety only.
        /*istanbul ignore if*/
        if (silent) {
          return true;
        }

        if (typeof state.env.references === 'undefined') {
          state.env.references = {};
        }
        if (typeof state.env.references[label] === 'undefined') {
          state.env.references[label] = {
            title: title,
            href: href
          };
        }

        state.line = startLine + lines + 1;
        return true;
      };

    }, {
      "../common/utils": 50,
      "../helpers/parse_link_destination": 52,
      "../helpers/parse_link_title": 54
    }],
    74: [function (require, module, exports) {
      // Parser state class

      'use strict';

      var Token = require('../token');
      var isSpace = require('../common/utils').isSpace;


      function StateBlock(src, md, env, tokens) {
        var ch, s, start, pos, len, indent, offset, indent_found;

        this.src = src;

        // link to parser instance
        this.md = md;

        this.env = env;

        //
        // Internal state vartiables
        //

        this.tokens = tokens;

        this.bMarks = []; // line begin offsets for fast jumps
        this.eMarks = []; // line end offsets for fast jumps
        this.tShift = []; // offsets of the first non-space characters (tabs not expanded)
        this.sCount = []; // indents for each line (tabs expanded)

        // block parser variables
        this.blkIndent = 0; // required block content indent
        // (for example, if we are in list)
        this.line = 0; // line index in src
        this.lineMax = 0; // lines count
        this.tight = false; // loose/tight mode for lists
        this.parentType = 'root'; // if `list`, block parser stops on two newlines
        this.ddIndent = -1; // indent of the current dd block (-1 if there isn't any)

        this.level = 0;

        // renderer
        this.result = '';

        // Create caches
        // Generate markers.
        s = this.src;
        indent_found = false;

        for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
          ch = s.charCodeAt(pos);

          if (!indent_found) {
            if (isSpace(ch)) {
              indent++;

              if (ch === 0x09) {
                offset += 4 - offset % 4;
              } else {
                offset++;
              }
              continue;
            } else {
              indent_found = true;
            }
          }

          if (ch === 0x0A || pos === len - 1) {
            if (ch !== 0x0A) {
              pos++;
            }
            this.bMarks.push(start);
            this.eMarks.push(pos);
            this.tShift.push(indent);
            this.sCount.push(offset);

            indent_found = false;
            indent = 0;
            offset = 0;
            start = pos + 1;
          }
        }

        // Push fake entry to simplify cache bounds checks
        this.bMarks.push(s.length);
        this.eMarks.push(s.length);
        this.tShift.push(0);
        this.sCount.push(0);

        this.lineMax = this.bMarks.length - 1; // don't count last fake line
      }

      // Push new token to "stream".
      //
      StateBlock.prototype.push = function (type, tag, nesting) {
        var token = new Token(type, tag, nesting);
        token.block = true;

        if (nesting < 0) {
          this.level--;
        }
        token.level = this.level;
        if (nesting > 0) {
          this.level++;
        }

        this.tokens.push(token);
        return token;
      };

      StateBlock.prototype.isEmpty = function isEmpty(line) {
        return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
      };

      StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
        for (var max = this.lineMax; from < max; from++) {
          if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
            break;
          }
        }
        return from;
      };

      // Skip spaces from given position.
      StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
        var ch;

        for (var max = this.src.length; pos < max; pos++) {
          ch = this.src.charCodeAt(pos);
          if (!isSpace(ch)) {
            break;
          }
        }
        return pos;
      };

      // Skip spaces from given position in reverse.
      StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
        if (pos <= min) {
          return pos;
        }

        while (pos > min) {
          if (!isSpace(this.src.charCodeAt(--pos))) {
            return pos + 1;
          }
        }
        return pos;
      };

      // Skip char codes from given position
      StateBlock.prototype.skipChars = function skipChars(pos, code) {
        for (var max = this.src.length; pos < max; pos++) {
          if (this.src.charCodeAt(pos) !== code) {
            break;
          }
        }
        return pos;
      };

      // Skip char codes reverse from given position - 1
      StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
        if (pos <= min) {
          return pos;
        }

        while (pos > min) {
          if (code !== this.src.charCodeAt(--pos)) {
            return pos + 1;
          }
        }
        return pos;
      };

      // cut lines range from source.
      StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
        var i, lineIndent, ch, first, last, queue, lineStart,
          line = begin;

        if (begin >= end) {
          return '';
        }

        queue = new Array(end - begin);

        for (i = 0; line < end; line++, i++) {
          lineIndent = 0;
          lineStart = first = this.bMarks[line];

          if (line + 1 < end || keepLastLF) {
            // No need for bounds check because we have fake entry on tail.
            last = this.eMarks[line] + 1;
          } else {
            last = this.eMarks[line];
          }

          while (first < last && lineIndent < indent) {
            ch = this.src.charCodeAt(first);

            if (isSpace(ch)) {
              if (ch === 0x09) {
                lineIndent += 4 - lineIndent % 4;
              } else {
                lineIndent++;
              }
            } else if (first - lineStart < this.tShift[line]) {
              // patched tShift masked characters to look like spaces (blockquotes, list markers)
              lineIndent++;
            } else {
              break;
            }

            first++;
          }

          queue[i] = this.src.slice(first, last);
        }

        return queue.join('');
      };

      // re-export Token class to use in block rules
      StateBlock.prototype.Token = Token;


      module.exports = StateBlock;

    }, {
      "../common/utils": 50,
      "../token": 97
    }],
    75: [function (require, module, exports) {
      // GFM table, non-standard

      'use strict';


      function getLine(state, line) {
        var pos = state.bMarks[line] + state.blkIndent,
          max = state.eMarks[line];

        return state.src.substr(pos, max - pos);
      }

      function escapedSplit(str) {
        var result = [],
          pos = 0,
          max = str.length,
          ch,
          escapes = 0,
          lastPos = 0,
          backTicked = false,
          lastBackTick = 0;

        ch = str.charCodeAt(pos);

        while (pos < max) {
          if (ch === 0x60 /* ` */ && (escapes % 2 === 0)) {
            backTicked = !backTicked;
            lastBackTick = pos;
          } else if (ch === 0x7c /* | */ && (escapes % 2 === 0) && !backTicked) {
            result.push(str.substring(lastPos, pos));
            lastPos = pos + 1;
          } else if (ch === 0x5c /* \ */ ) {
            escapes++;
          } else {
            escapes = 0;
          }

          pos++;

          // If there was an un-closed backtick, go back to just after
          // the last backtick, but as if it was a normal character
          if (pos === max && backTicked) {
            backTicked = false;
            pos = lastBackTick + 1;
          }

          ch = str.charCodeAt(pos);
        }

        result.push(str.substring(lastPos));

        return result;
      }


      module.exports = function table(state, startLine, endLine, silent) {
        var ch, lineText, pos, i, nextLine, columns, columnCount, token,
          aligns, t, tableLines, tbodyLines;

        // should have at least three lines
        if (startLine + 2 > endLine) {
          return false;
        }

        nextLine = startLine + 1;

        if (state.sCount[nextLine] < state.blkIndent) {
          return false;
        }

        // first character of the second line should be '|' or '-'

        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        if (pos >= state.eMarks[nextLine]) {
          return false;
        }

        ch = state.src.charCodeAt(pos);
        if (ch !== 0x7C /* | */ && ch !== 0x2D /* - */ && ch !== 0x3A /* : */ ) {
          return false;
        }

        lineText = getLine(state, startLine + 1);
        if (!/^[-:| ]+$/.test(lineText)) {
          return false;
        }

        columns = lineText.split('|');
        aligns = [];
        for (i = 0; i < columns.length; i++) {
          t = columns[i].trim();
          if (!t) {
            // allow empty columns before and after table, but not in between columns;
            // e.g. allow ` |---| `, disallow ` ---||--- `
            if (i === 0 || i === columns.length - 1) {
              continue;
            } else {
              return false;
            }
          }

          if (!/^:?-+:?$/.test(t)) {
            return false;
          }
          if (t.charCodeAt(t.length - 1) === 0x3A /* : */ ) {
            aligns.push(t.charCodeAt(0) === 0x3A /* : */ ? 'center' : 'right');
          } else if (t.charCodeAt(0) === 0x3A /* : */ ) {
            aligns.push('left');
          } else {
            aligns.push('');
          }
        }

        lineText = getLine(state, startLine).trim();
        if (lineText.indexOf('|') === -1) {
          return false;
        }
        columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

        // header row will define an amount of columns in the entire table,
        // and align row shouldn't be smaller than that (the rest of the rows can)
        columnCount = columns.length;
        if (columnCount > aligns.length) {
          return false;
        }

        if (silent) {
          return true;
        }

        token = state.push('table_open', 'table', 1);
        token.map = tableLines = [startLine, 0];

        token = state.push('thead_open', 'thead', 1);
        token.map = [startLine, startLine + 1];

        token = state.push('tr_open', 'tr', 1);
        token.map = [startLine, startLine + 1];

        for (i = 0; i < columns.length; i++) {
          token = state.push('th_open', 'th', 1);
          token.map = [startLine, startLine + 1];
          if (aligns[i]) {
            token.attrs = [
              ['style', 'text-align:' + aligns[i]]
            ];
          }

          token = state.push('inline', '', 0);
          token.content = columns[i].trim();
          token.map = [startLine, startLine + 1];
          token.children = [];

          token = state.push('th_close', 'th', -1);
        }

        token = state.push('tr_close', 'tr', -1);
        token = state.push('thead_close', 'thead', -1);

        token = state.push('tbody_open', 'tbody', 1);
        token.map = tbodyLines = [startLine + 2, 0];

        for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }

          lineText = getLine(state, nextLine).trim();
          if (lineText.indexOf('|') === -1) {
            break;
          }
          columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

          token = state.push('tr_open', 'tr', 1);
          for (i = 0; i < columnCount; i++) {
            token = state.push('td_open', 'td', 1);
            if (aligns[i]) {
              token.attrs = [
                ['style', 'text-align:' + aligns[i]]
              ];
            }

            token = state.push('inline', '', 0);
            token.content = columns[i] ? columns[i].trim() : '';
            token.children = [];

            token = state.push('td_close', 'td', -1);
          }
          token = state.push('tr_close', 'tr', -1);
        }
        token = state.push('tbody_close', 'tbody', -1);
        token = state.push('table_close', 'table', -1);

        tableLines[1] = tbodyLines[1] = nextLine;
        state.line = nextLine;
        return true;
      };

    }, {}],
    76: [function (require, module, exports) {
      'use strict';


      module.exports = function block(state) {
        var token;

        if (state.inlineMode) {
          token = new state.Token('inline', '', 0);
          token.content = state.src;
          token.map = [0, 1];
          token.children = [];
          state.tokens.push(token);
        } else {
          state.md.block.parse(state.src, state.md, state.env, state.tokens);
        }
      };

    }, {}],
    77: [function (require, module, exports) {
      'use strict';

      module.exports = function inline(state) {
        var tokens = state.tokens,
          tok, i, l;

        // Parse inlines
        for (i = 0, l = tokens.length; i < l; i++) {
          tok = tokens[i];
          if (tok.type === 'inline') {
            state.md.inline.parse(tok.content, state.md, state.env, tok.children);
          }
        }
      };

    }, {}],
    78: [function (require, module, exports) {
      // Replace link-like texts with link nodes.
      //
      // Currently restricted by `md.validateLink()` to http/https/ftp
      //
      'use strict';


      var arrayReplaceAt = require('../common/utils').arrayReplaceAt;


      function isLinkOpen(str) {
        return /^<a[>\s]/i.test(str);
      }

      function isLinkClose(str) {
        return /^<\/a\s*>/i.test(str);
      }


      module.exports = function linkify(state) {
        var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
          level, htmlLinkLevel, url, fullUrl, urlText,
          blockTokens = state.tokens,
          links;

        if (!state.md.options.linkify) {
          return;
        }

        for (j = 0, l = blockTokens.length; j < l; j++) {
          if (blockTokens[j].type !== 'inline' ||
            !state.md.linkify.pretest(blockTokens[j].content)) {
            continue;
          }

          tokens = blockTokens[j].children;

          htmlLinkLevel = 0;

          // We scan from the end, to keep position when new tags added.
          // Use reversed logic in links start/end match
          for (i = tokens.length - 1; i >= 0; i--) {
            currentToken = tokens[i];

            // Skip content of markdown links
            if (currentToken.type === 'link_close') {
              i--;
              while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
                i--;
              }
              continue;
            }

            // Skip content of html tag links
            if (currentToken.type === 'html_inline') {
              if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
                htmlLinkLevel--;
              }
              if (isLinkClose(currentToken.content)) {
                htmlLinkLevel++;
              }
            }
            if (htmlLinkLevel > 0) {
              continue;
            }

            if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

              text = currentToken.content;
              links = state.md.linkify.match(text);

              // Now split string to nodes
              nodes = [];
              level = currentToken.level;
              lastPos = 0;

              for (ln = 0; ln < links.length; ln++) {

                url = links[ln].url;
                fullUrl = state.md.normalizeLink(url);
                if (!state.md.validateLink(fullUrl)) {
                  continue;
                }

                urlText = links[ln].text;

                // Linkifier might send raw hostnames like "example.com", where url
                // starts with domain name. So we prepend http:// in those cases,
                // and remove it afterwards.
                //
                if (!links[ln].schema) {
                  urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
                } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
                  urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
                } else {
                  urlText = state.md.normalizeLinkText(urlText);
                }

                pos = links[ln].index;

                if (pos > lastPos) {
                  token = new state.Token('text', '', 0);
                  token.content = text.slice(lastPos, pos);
                  token.level = level;
                  nodes.push(token);
                }

                token = new state.Token('link_open', 'a', 1);
                token.attrs = [
                  ['href', fullUrl]
                ];
                token.level = level++;
                token.markup = 'linkify';
                token.info = 'auto';
                nodes.push(token);

                token = new state.Token('text', '', 0);
                token.content = urlText;
                token.level = level;
                nodes.push(token);

                token = new state.Token('link_close', 'a', -1);
                token.level = --level;
                token.markup = 'linkify';
                token.info = 'auto';
                nodes.push(token);

                lastPos = links[ln].lastIndex;
              }
              if (lastPos < text.length) {
                token = new state.Token('text', '', 0);
                token.content = text.slice(lastPos);
                token.level = level;
                nodes.push(token);
              }

              // replace current node
              blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
            }
          }
        }
      };

    }, {
      "../common/utils": 50
    }],
    79: [function (require, module, exports) {
      // Normalize input string

      'use strict';


      var NEWLINES_RE = /\r[\n\u0085]|[\u2424\u2028\u0085]/g;
      var NULL_RE = /\u0000/g;


      module.exports = function inline(state) {
        var str;

        // Normalize newlines
        str = state.src.replace(NEWLINES_RE, '\n');

        // Replace NULL characters
        str = str.replace(NULL_RE, '\uFFFD');

        state.src = str;
      };

    }, {}],
    80: [function (require, module, exports) {
      // Simple typographyc replacements
      //
      // (c) (C) → ©
      // (tm) (TM) → ™
      // (r) (R) → ®
      // +- → ±
      // (p) (P) -> §
      // ... → … (also ?.... → ?.., !.... → !..)
      // ???????? → ???, !!!!! → !!!, `,,` → `,`
      // -- → &ndash;, --- → &mdash;
      //
      'use strict';

      // TODO:
      // - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
      // - miltiplication 2 x 4 -> 2 × 4

      var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

      // Workaround for phantomjs - need regex without /g flag,
      // or root check will fail every second time
      var SCOPED_ABBR_TEST_RE = /\((c|tm|r|p)\)/i;

      var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
      var SCOPED_ABBR = {
        'c': '©',
        'r': '®',
        'p': '§',
        'tm': '™'
      };

      function replaceFn(match, name) {
        return SCOPED_ABBR[name.toLowerCase()];
      }

      function replace_scoped(inlineTokens) {
        var i, token;

        for (i = inlineTokens.length - 1; i >= 0; i--) {
          token = inlineTokens[i];
          if (token.type === 'text') {
            token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
          }
        }
      }

      function replace_rare(inlineTokens) {
        var i, token;

        for (i = inlineTokens.length - 1; i >= 0; i--) {
          token = inlineTokens[i];
          if (token.type === 'text') {
            if (RARE_RE.test(token.content)) {
              token.content = token.content
                .replace(/\+-/g, '±')
                // .., ..., ....... -> …
                // but ?..... & !..... -> ?.. & !..
                .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
                .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
                // em-dash
                .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
                // en-dash
                .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
                .replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
            }
          }
        }
      }


      module.exports = function replace(state) {
        var blkIdx;

        if (!state.md.options.typographer) {
          return;
        }

        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

          if (state.tokens[blkIdx].type !== 'inline') {
            continue;
          }

          if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
            replace_scoped(state.tokens[blkIdx].children);
          }

          if (RARE_RE.test(state.tokens[blkIdx].content)) {
            replace_rare(state.tokens[blkIdx].children);
          }

        }
      };

    }, {}],
    81: [function (require, module, exports) {
      // Convert straight quotation marks to typographic ones
      //
      'use strict';


      var isWhiteSpace = require('../common/utils').isWhiteSpace;
      var isPunctChar = require('../common/utils').isPunctChar;
      var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;

      var QUOTE_TEST_RE = /['"]/;
      var QUOTE_RE = /['"]/g;
      var APOSTROPHE = '\u2019'; /* ’ */


      function replaceAt(str, index, ch) {
        return str.substr(0, index) + ch + str.substr(index + 1);
      }

      function process_inlines(tokens, state) {
        var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar,
          isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace,
          canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;

        stack = [];

        for (i = 0; i < tokens.length; i++) {
          token = tokens[i];

          thisLevel = tokens[i].level;

          for (j = stack.length - 1; j >= 0; j--) {
            if (stack[j].level <= thisLevel) {
              break;
            }
          }
          stack.length = j + 1;

          if (token.type !== 'text') {
            continue;
          }

          text = token.content;
          pos = 0;
          max = text.length;

          /*eslint no-labels:0,block-scoped-var:0*/
          OUTER:
            while (pos < max) {
              QUOTE_RE.lastIndex = pos;
              t = QUOTE_RE.exec(text);
              if (!t) {
                break;
              }

              canOpen = canClose = true;
              pos = t.index + 1;
              isSingle = (t[0] === "'");

              // Find previous character,
              // default to space if it's the beginning of the line
              //
              lastChar = 0x20;

              if (t.index - 1 >= 0) {
                lastChar = text.charCodeAt(t.index - 1);
              } else {
                for (j = i - 1; j >= 0; j--) {
                  if (tokens[j].type !== 'text') {
                    continue;
                  }

                  lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                  break;
                }
              }

              // Find next character,
              // default to space if it's the end of the line
              //
              nextChar = 0x20;

              if (pos < max) {
                nextChar = text.charCodeAt(pos);
              } else {
                for (j = i + 1; j < tokens.length; j++) {
                  if (tokens[j].type !== 'text') {
                    continue;
                  }

                  nextChar = tokens[j].content.charCodeAt(0);
                  break;
                }
              }

              isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
              isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

              isLastWhiteSpace = isWhiteSpace(lastChar);
              isNextWhiteSpace = isWhiteSpace(nextChar);

              if (isNextWhiteSpace) {
                canOpen = false;
              } else if (isNextPunctChar) {
                if (!(isLastWhiteSpace || isLastPunctChar)) {
                  canOpen = false;
                }
              }

              if (isLastWhiteSpace) {
                canClose = false;
              } else if (isLastPunctChar) {
                if (!(isNextWhiteSpace || isNextPunctChar)) {
                  canClose = false;
                }
              }

              if (nextChar === 0x22 /* " */ && t[0] === '"') {
                if (lastChar >= 0x30 /* 0 */ && lastChar <= 0x39 /* 9 */ ) {
                  // special case: 1"" - count first quote as an inch
                  canClose = canOpen = false;
                }
              }

              if (canOpen && canClose) {
                // treat this as the middle of the word
                canOpen = false;
                canClose = isNextPunctChar;
              }

              if (!canOpen && !canClose) {
                // middle of word
                if (isSingle) {
                  token.content = replaceAt(token.content, t.index, APOSTROPHE);
                }
                continue;
              }

              if (canClose) {
                // this could be a closing quote, rewind the stack to get a match
                for (j = stack.length - 1; j >= 0; j--) {
                  item = stack[j];
                  if (stack[j].level < thisLevel) {
                    break;
                  }
                  if (item.single === isSingle && stack[j].level === thisLevel) {
                    item = stack[j];

                    if (isSingle) {
                      openQuote = state.md.options.quotes[2];
                      closeQuote = state.md.options.quotes[3];
                    } else {
                      openQuote = state.md.options.quotes[0];
                      closeQuote = state.md.options.quotes[1];
                    }

                    // replace token.content *before* tokens[item.token].content,
                    // because, if they are pointing at the same token, replaceAt
                    // could mess up indices when quote length != 1
                    token.content = replaceAt(token.content, t.index, closeQuote);
                    tokens[item.token].content = replaceAt(
                      tokens[item.token].content, item.pos, openQuote);

                    pos += closeQuote.length - 1;
                    if (item.token === i) {
                      pos += openQuote.length - 1;
                    }

                    text = token.content;
                    max = text.length;

                    stack.length = j;
                    continue OUTER;
                  }
                }
              }

              if (canOpen) {
                stack.push({
                  token: i,
                  pos: t.index,
                  single: isSingle,
                  level: thisLevel
                });
              } else if (canClose && isSingle) {
                token.content = replaceAt(token.content, t.index, APOSTROPHE);
              }
            }
        }
      }


      module.exports = function smartquotes(state) {
        /*eslint max-depth:0*/
        var blkIdx;

        if (!state.md.options.typographer) {
          return;
        }

        for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

          if (state.tokens[blkIdx].type !== 'inline' ||
            !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
            continue;
          }

          process_inlines(state.tokens[blkIdx].children, state);
        }
      };

    }, {
      "../common/utils": 50
    }],
    82: [function (require, module, exports) {
      // Core state object
      //
      'use strict';

      var Token = require('../token');


      function StateCore(src, md, env) {
        this.src = src;
        this.env = env;
        this.tokens = [];
        this.inlineMode = false;
        this.md = md; // link to parser instance
      }

      // re-export Token class to use in core rules
      StateCore.prototype.Token = Token;


      module.exports = StateCore;

    }, {
      "../token": 97
    }],
    83: [function (require, module, exports) {
      // Process autolinks '<protocol:...>'

      'use strict';

      var url_schemas = require('../common/url_schemas');


      /*eslint max-len:0*/
      var EMAIL_RE = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
      var AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;


      module.exports = function autolink(state, silent) {
        var tail, linkMatch, emailMatch, url, fullUrl, token,
          pos = state.pos;

        if (state.src.charCodeAt(pos) !== 0x3C /* < */ ) {
          return false;
        }

        tail = state.src.slice(pos);

        if (tail.indexOf('>') < 0) {
          return false;
        }

        if (AUTOLINK_RE.test(tail)) {
          linkMatch = tail.match(AUTOLINK_RE);

          if (url_schemas.indexOf(linkMatch[1].toLowerCase()) < 0) {
            return false;
          }

          url = linkMatch[0].slice(1, -1);
          fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) {
            return false;
          }

          if (!silent) {
            token = state.push('link_open', 'a', 1);
            token.attrs = [
              ['href', fullUrl]
            ];
            token.markup = 'autolink';
            token.info = 'auto';

            token = state.push('text', '', 0);
            token.content = state.md.normalizeLinkText(url);

            token = state.push('link_close', 'a', -1);
            token.markup = 'autolink';
            token.info = 'auto';
          }

          state.pos += linkMatch[0].length;
          return true;
        }

        if (EMAIL_RE.test(tail)) {
          emailMatch = tail.match(EMAIL_RE);

          url = emailMatch[0].slice(1, -1);
          fullUrl = state.md.normalizeLink('mailto:' + url);
          if (!state.md.validateLink(fullUrl)) {
            return false;
          }

          if (!silent) {
            token = state.push('link_open', 'a', 1);
            token.attrs = [
              ['href', fullUrl]
            ];
            token.markup = 'autolink';
            token.info = 'auto';

            token = state.push('text', '', 0);
            token.content = state.md.normalizeLinkText(url);

            token = state.push('link_close', 'a', -1);
            token.markup = 'autolink';
            token.info = 'auto';
          }

          state.pos += emailMatch[0].length;
          return true;
        }

        return false;
      };

    }, {
      "../common/url_schemas": 49
    }],
    84: [function (require, module, exports) {
      // Parse backticks

      'use strict';

      module.exports = function backtick(state, silent) {
        var start, max, marker, matchStart, matchEnd, token,
          pos = state.pos,
          ch = state.src.charCodeAt(pos);

        if (ch !== 0x60 /* ` */ ) {
          return false;
        }

        start = pos;
        pos++;
        max = state.posMax;

        while (pos < max && state.src.charCodeAt(pos) === 0x60 /* ` */ ) {
          pos++;
        }

        marker = state.src.slice(start, pos);

        matchStart = matchEnd = pos;

        while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
          matchEnd = matchStart + 1;

          while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60 /* ` */ ) {
            matchEnd++;
          }

          if (matchEnd - matchStart === marker.length) {
            if (!silent) {
              token = state.push('code_inline', 'code', 0);
              token.markup = marker;
              token.content = state.src.slice(pos, matchStart)
                .replace(/[ \n]+/g, ' ')
                .trim();
            }
            state.pos = matchEnd;
            return true;
          }
        }

        if (!silent) {
          state.pending += marker;
        }
        state.pos += marker.length;
        return true;
      };

    }, {}],
    85: [function (require, module, exports) {
      // For each opening emphasis-like marker find a matching closing one
      //
      'use strict';


      module.exports = function link_pairs(state) {
        var i, j, lastDelim, currDelim,
          delimiters = state.delimiters,
          max = state.delimiters.length;

        for (i = 0; i < max; i++) {
          lastDelim = delimiters[i];

          if (!lastDelim.close) {
            continue;
          }

          j = i - lastDelim.jump - 1;

          while (j >= 0) {
            currDelim = delimiters[j];

            if (currDelim.open &&
              currDelim.marker === lastDelim.marker &&
              currDelim.end < 0 &&
              currDelim.level === lastDelim.level) {

              lastDelim.jump = i - j;
              lastDelim.open = false;
              currDelim.end = i;
              currDelim.jump = 0;
              break;
            }

            j -= currDelim.jump + 1;
          }
        }
      };

    }, {}],
    86: [function (require, module, exports) {
      // Process *this* and _that_
      //
      'use strict';


      // Insert each marker as a separate text token, and add it to delimiter list
      //
      module.exports.tokenize = function emphasis(state, silent) {
        var i, scanned, token,
          start = state.pos,
          marker = state.src.charCodeAt(start);

        if (silent) {
          return false;
        }

        if (marker !== 0x5F /* _ */ && marker !== 0x2A /* * */ ) {
          return false;
        }

        scanned = state.scanDelims(state.pos, marker === 0x2A);

        for (i = 0; i < scanned.length; i++) {
          token = state.push('text', '', 0);
          token.content = String.fromCharCode(marker);

          state.delimiters.push({
            // Char code of the starting marker (number).
            //
            marker: marker,

            // An amount of characters before this one that's equivalent to
            // current one. In plain English: if this delimiter does not open
            // an emphasis, neither do previous `jump` characters.
            //
            // Used to skip sequences like "*****" in one step, for 1st asterisk
            // value will be 0, for 2nd it's 1 and so on.
            //
            jump: i,

            // A position of the token this delimiter corresponds to.
            //
            token: state.tokens.length - 1,

            // Token level.
            //
            level: state.level,

            // If this delimiter is matched as a valid opener, `end` will be
            // equal to its position, otherwise it's `-1`.
            //
            end: -1,

            // Boolean flags that determine if this delimiter could open or close
            // an emphasis.
            //
            open: scanned.can_open,
            close: scanned.can_close
          });
        }

        state.pos += scanned.length;

        return true;
      };


      // Walk through delimiter list and replace text tokens with tags
      //
      module.exports.postProcess = function emphasis(state) {
        var i,
          startDelim,
          endDelim,
          token,
          ch,
          isStrong,
          delimiters = state.delimiters,
          max = state.delimiters.length;

        for (i = 0; i < max; i++) {
          startDelim = delimiters[i];

          if (startDelim.marker !== 0x5F /* _ */ && startDelim.marker !== 0x2A /* * */ ) {
            continue;
          }

          // Process only opening markers
          if (startDelim.end === -1) {
            continue;
          }

          endDelim = delimiters[startDelim.end];

          // If the next delimiter has the same marker and is adjacent to this one,
          // merge those into one strong delimiter.
          //
          // `<em><em>whatever</em></em>` -> `<strong>whatever</strong>`
          //
          isStrong = i + 1 < max &&
            delimiters[i + 1].end === startDelim.end - 1 &&
            delimiters[i + 1].token === startDelim.token + 1 &&
            delimiters[startDelim.end - 1].token === endDelim.token - 1 &&
            delimiters[i + 1].marker === startDelim.marker;

          ch = String.fromCharCode(startDelim.marker);

          token = state.tokens[startDelim.token];
          token.type = isStrong ? 'strong_open' : 'em_open';
          token.tag = isStrong ? 'strong' : 'em';
          token.nesting = 1;
          token.markup = isStrong ? ch + ch : ch;
          token.content = '';

          token = state.tokens[endDelim.token];
          token.type = isStrong ? 'strong_close' : 'em_close';
          token.tag = isStrong ? 'strong' : 'em';
          token.nesting = -1;
          token.markup = isStrong ? ch + ch : ch;
          token.content = '';

          if (isStrong) {
            state.tokens[delimiters[i + 1].token].content = '';
            state.tokens[delimiters[startDelim.end - 1].token].content = '';
            i++;
          }
        }
      };

    }, {}],
    87: [function (require, module, exports) {
      // Process html entity - &#123;, &#xAF;, &quot;, ...

      'use strict';

      var entities = require('../common/entities');
      var has = require('../common/utils').has;
      var isValidEntityCode = require('../common/utils').isValidEntityCode;
      var fromCodePoint = require('../common/utils').fromCodePoint;


      var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i;
      var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;


      module.exports = function entity(state, silent) {
        var ch, code, match, pos = state.pos,
          max = state.posMax;

        if (state.src.charCodeAt(pos) !== 0x26 /* & */ ) {
          return false;
        }

        if (pos + 1 < max) {
          ch = state.src.charCodeAt(pos + 1);

          if (ch === 0x23 /* # */ ) {
            match = state.src.slice(pos).match(DIGITAL_RE);
            if (match) {
              if (!silent) {
                code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
                state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
              }
              state.pos += match[0].length;
              return true;
            }
          } else {
            match = state.src.slice(pos).match(NAMED_RE);
            if (match) {
              if (has(entities, match[1])) {
                if (!silent) {
                  state.pending += entities[match[1]];
                }
                state.pos += match[0].length;
                return true;
              }
            }
          }
        }

        if (!silent) {
          state.pending += '&';
        }
        state.pos++;
        return true;
      };

    }, {
      "../common/entities": 46,
      "../common/utils": 50
    }],
    88: [function (require, module, exports) {
      // Proceess escaped chars and hardbreaks

      'use strict';

      var isSpace = require('../common/utils').isSpace;

      var ESCAPED = [];

      for (var i = 0; i < 256; i++) {
        ESCAPED.push(0);
      }

      '\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
      .split('').forEach(function (ch) {
        ESCAPED[ch.charCodeAt(0)] = 1;
      });


      module.exports = function escape(state, silent) {
        var ch, pos = state.pos,
          max = state.posMax;

        if (state.src.charCodeAt(pos) !== 0x5C /* \ */ ) {
          return false;
        }

        pos++;

        if (pos < max) {
          ch = state.src.charCodeAt(pos);

          if (ch < 256 && ESCAPED[ch] !== 0) {
            if (!silent) {
              state.pending += state.src[pos];
            }
            state.pos += 2;
            return true;
          }

          if (ch === 0x0A) {
            if (!silent) {
              state.push('hardbreak', 'br', 0);
            }

            pos++;
            // skip leading whitespaces from next line
            while (pos < max) {
              ch = state.src.charCodeAt(pos);
              if (!isSpace(ch)) {
                break;
              }
              pos++;
            }

            state.pos = pos;
            return true;
          }
        }

        if (!silent) {
          state.pending += '\\';
        }
        state.pos++;
        return true;
      };

    }, {
      "../common/utils": 50
    }],
    89: [function (require, module, exports) {
      // Process html tags

      'use strict';


      var HTML_TAG_RE = require('../common/html_re').HTML_TAG_RE;


      function isLetter(ch) {
        /*eslint no-bitwise:0*/
        var lc = ch | 0x20; // to lower case
        return (lc >= 0x61 /* a */ ) && (lc <= 0x7a /* z */ );
      }


      module.exports = function html_inline(state, silent) {
        var ch, match, max, token,
          pos = state.pos;

        if (!state.md.options.html) {
          return false;
        }

        // Check start
        max = state.posMax;
        if (state.src.charCodeAt(pos) !== 0x3C /* < */ ||
          pos + 2 >= max) {
          return false;
        }

        // Quick fail on second char
        ch = state.src.charCodeAt(pos + 1);
        if (ch !== 0x21 /* ! */ &&
          ch !== 0x3F /* ? */ &&
          ch !== 0x2F /* / */ &&
          !isLetter(ch)) {
          return false;
        }

        match = state.src.slice(pos).match(HTML_TAG_RE);
        if (!match) {
          return false;
        }

        if (!silent) {
          token = state.push('html_inline', '', 0);
          token.content = state.src.slice(pos, pos + match[0].length);
        }
        state.pos += match[0].length;
        return true;
      };

    }, {
      "../common/html_re": 48
    }],
    90: [function (require, module, exports) {
      // Process ![image](<src> "title")

      'use strict';

      var parseLinkLabel = require('../helpers/parse_link_label');
      var parseLinkDestination = require('../helpers/parse_link_destination');
      var parseLinkTitle = require('../helpers/parse_link_title');
      var normalizeReference = require('../common/utils').normalizeReference;
      var isSpace = require('../common/utils').isSpace;


      module.exports = function image(state, silent) {
        var attrs,
          code,
          content,
          label,
          labelEnd,
          labelStart,
          pos,
          ref,
          res,
          title,
          token,
          tokens,
          start,
          href = '',
          oldPos = state.pos,
          max = state.posMax;

        if (state.src.charCodeAt(state.pos) !== 0x21 /* ! */ ) {
          return false;
        }
        if (state.src.charCodeAt(state.pos + 1) !== 0x5B /* [ */ ) {
          return false;
        }

        labelStart = state.pos + 2;
        labelEnd = parseLinkLabel(state, state.pos + 1, false);

        // parser failed to find ']', so it's not a valid link
        if (labelEnd < 0) {
          return false;
        }

        pos = labelEnd + 1;
        if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */ ) {
          //
          // Inline link
          //

          // [link](  <href>  "title"  )
          //        ^^ skipping these spaces
          pos++;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 0x0A) {
              break;
            }
          }
          if (pos >= max) {
            return false;
          }

          // [link](  <href>  "title"  )
          //          ^^^^^^ parsing link destination
          start = pos;
          res = parseLinkDestination(state.src, pos, state.posMax);
          if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) {
              pos = res.pos;
            } else {
              href = '';
            }
          }

          // [link](  <href>  "title"  )
          //                ^^ skipping these spaces
          start = pos;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 0x0A) {
              break;
            }
          }

          // [link](  <href>  "title"  )
          //                  ^^^^^^^ parsing link title
          res = parseLinkTitle(state.src, pos, state.posMax);
          if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;

            // [link](  <href>  "title"  )
            //                         ^^ skipping these spaces
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);
              if (!isSpace(code) && code !== 0x0A) {
                break;
              }
            }
          } else {
            title = '';
          }

          if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */ ) {
            state.pos = oldPos;
            return false;
          }
          pos++;
        } else {
          //
          // Link reference
          //
          if (typeof state.env.references === 'undefined') {
            return false;
          }

          // [foo]  [bar]
          //      ^^ optional whitespace (can include newlines)
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 0x0A) {
              break;
            }
          }

          if (pos < max && state.src.charCodeAt(pos) === 0x5B /* [ */ ) {
            start = pos + 1;
            pos = parseLinkLabel(state, pos);
            if (pos >= 0) {
              label = state.src.slice(start, pos++);
            } else {
              pos = labelEnd + 1;
            }
          } else {
            pos = labelEnd + 1;
          }

          // covers label === '' and label === undefined
          // (collapsed reference link and shortcut reference link respectively)
          if (!label) {
            label = state.src.slice(labelStart, labelEnd);
          }

          ref = state.env.references[normalizeReference(label)];
          if (!ref) {
            state.pos = oldPos;
            return false;
          }
          href = ref.href;
          title = ref.title;
        }

        //
        // We found the end of the link, and know for a fact it's a valid link;
        // so all that's left to do is to call tokenizer.
        //
        if (!silent) {
          content = state.src.slice(labelStart, labelEnd);

          state.md.inline.parse(
            content,
            state.md,
            state.env,
            tokens = []
          );

          token = state.push('image', 'img', 0);
          token.attrs = attrs = [
            ['src', href],
            ['alt', '']
          ];
          token.children = tokens;
          token.content = content;

          if (title) {
            attrs.push(['title', title]);
          }
        }

        state.pos = pos;
        state.posMax = max;
        return true;
      };

    }, {
      "../common/utils": 50,
      "../helpers/parse_link_destination": 52,
      "../helpers/parse_link_label": 53,
      "../helpers/parse_link_title": 54
    }],
    91: [function (require, module, exports) {
      // Process [link](<to> "stuff")

      'use strict';

      var parseLinkLabel = require('../helpers/parse_link_label');
      var parseLinkDestination = require('../helpers/parse_link_destination');
      var parseLinkTitle = require('../helpers/parse_link_title');
      var normalizeReference = require('../common/utils').normalizeReference;
      var isSpace = require('../common/utils').isSpace;


      module.exports = function link(state, silent) {
        var attrs,
          code,
          label,
          labelEnd,
          labelStart,
          pos,
          res,
          ref,
          title,
          token,
          href = '',
          oldPos = state.pos,
          max = state.posMax,
          start = state.pos;

        if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */ ) {
          return false;
        }

        labelStart = state.pos + 1;
        labelEnd = parseLinkLabel(state, state.pos, true);

        // parser failed to find ']', so it's not a valid link
        if (labelEnd < 0) {
          return false;
        }

        pos = labelEnd + 1;
        if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */ ) {
          //
          // Inline link
          //

          // [link](  <href>  "title"  )
          //        ^^ skipping these spaces
          pos++;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 0x0A) {
              break;
            }
          }
          if (pos >= max) {
            return false;
          }

          // [link](  <href>  "title"  )
          //          ^^^^^^ parsing link destination
          start = pos;
          res = parseLinkDestination(state.src, pos, state.posMax);
          if (res.ok) {
            href = state.md.normalizeLink(res.str);
            if (state.md.validateLink(href)) {
              pos = res.pos;
            } else {
              href = '';
            }
          }

          // [link](  <href>  "title"  )
          //                ^^ skipping these spaces
          start = pos;
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 0x0A) {
              break;
            }
          }

          // [link](  <href>  "title"  )
          //                  ^^^^^^^ parsing link title
          res = parseLinkTitle(state.src, pos, state.posMax);
          if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;

            // [link](  <href>  "title"  )
            //                         ^^ skipping these spaces
            for (; pos < max; pos++) {
              code = state.src.charCodeAt(pos);
              if (!isSpace(code) && code !== 0x0A) {
                break;
              }
            }
          } else {
            title = '';
          }

          if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */ ) {
            state.pos = oldPos;
            return false;
          }
          pos++;
        } else {
          //
          // Link reference
          //
          if (typeof state.env.references === 'undefined') {
            return false;
          }

          // [foo]  [bar]
          //      ^^ optional whitespace (can include newlines)
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos);
            if (!isSpace(code) && code !== 0x0A) {
              break;
            }
          }

          if (pos < max && state.src.charCodeAt(pos) === 0x5B /* [ */ ) {
            start = pos + 1;
            pos = parseLinkLabel(state, pos);
            if (pos >= 0) {
              label = state.src.slice(start, pos++);
            } else {
              pos = labelEnd + 1;
            }
          } else {
            pos = labelEnd + 1;
          }

          // covers label === '' and label === undefined
          // (collapsed reference link and shortcut reference link respectively)
          if (!label) {
            label = state.src.slice(labelStart, labelEnd);
          }

          ref = state.env.references[normalizeReference(label)];
          if (!ref) {
            state.pos = oldPos;
            return false;
          }
          href = ref.href;
          title = ref.title;
        }

        //
        // We found the end of the link, and know for a fact it's a valid link;
        // so all that's left to do is to call tokenizer.
        //
        if (!silent) {
          state.pos = labelStart;
          state.posMax = labelEnd;

          token = state.push('link_open', 'a', 1);
          token.attrs = attrs = [
            ['href', href]
          ];
          if (title) {
            attrs.push(['title', title]);
          }

          state.md.inline.tokenize(state);

          token = state.push('link_close', 'a', -1);
        }

        state.pos = pos;
        state.posMax = max;
        return true;
      };

    }, {
      "../common/utils": 50,
      "../helpers/parse_link_destination": 52,
      "../helpers/parse_link_label": 53,
      "../helpers/parse_link_title": 54
    }],
    92: [function (require, module, exports) {
      // Proceess '\n'

      'use strict';

      module.exports = function newline(state, silent) {
        var pmax, max, pos = state.pos;

        if (state.src.charCodeAt(pos) !== 0x0A /* \n */ ) {
          return false;
        }

        pmax = state.pending.length - 1;
        max = state.posMax;

        // '  \n' -> hardbreak
        // Lookup in pending chars is bad practice! Don't copy to other rules!
        // Pending string is stored in concat mode, indexed lookups will cause
        // convertion to flat mode.
        if (!silent) {
          if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
            if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
              state.pending = state.pending.replace(/ +$/, '');
              state.push('hardbreak', 'br', 0);
            } else {
              state.pending = state.pending.slice(0, -1);
              state.push('softbreak', 'br', 0);
            }

          } else {
            state.push('softbreak', 'br', 0);
          }
        }

        pos++;

        // skip heading spaces for next line
        while (pos < max && state.src.charCodeAt(pos) === 0x20) {
          pos++;
        }

        state.pos = pos;
        return true;
      };

    }, {}],
    93: [function (require, module, exports) {
      // Inline parser state

      'use strict';


      var Token = require('../token');
      var isWhiteSpace = require('../common/utils').isWhiteSpace;
      var isPunctChar = require('../common/utils').isPunctChar;
      var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;


      function StateInline(src, md, env, outTokens) {
        this.src = src;
        this.env = env;
        this.md = md;
        this.tokens = outTokens;

        this.pos = 0;
        this.posMax = this.src.length;
        this.level = 0;
        this.pending = '';
        this.pendingLevel = 0;

        this.cache = {}; // Stores { start: end } pairs. Useful for backtrack
        // optimization of pairs parse (emphasis, strikes).

        this.delimiters = []; // Emphasis-like delimiters
      }


      // Flush pending text
      //
      StateInline.prototype.pushPending = function () {
        var token = new Token('text', '', 0);
        token.content = this.pending;
        token.level = this.pendingLevel;
        this.tokens.push(token);
        this.pending = '';
        return token;
      };


      // Push new token to "stream".
      // If pending text exists - flush it as text token
      //
      StateInline.prototype.push = function (type, tag, nesting) {
        if (this.pending) {
          this.pushPending();
        }

        var token = new Token(type, tag, nesting);

        if (nesting < 0) {
          this.level--;
        }
        token.level = this.level;
        if (nesting > 0) {
          this.level++;
        }

        this.pendingLevel = this.level;
        this.tokens.push(token);
        return token;
      };


      // Scan a sequence of emphasis-like markers, and determine whether
      // it can start an emphasis sequence or end an emphasis sequence.
      //
      //  - start - position to scan from (it should point at a valid marker);
      //  - canSplitWord - determine if these markers can be found inside a word
      //
      StateInline.prototype.scanDelims = function (start, canSplitWord) {
        var pos = start,
          lastChar, nextChar, count, can_open, can_close,
          isLastWhiteSpace, isLastPunctChar,
          isNextWhiteSpace, isNextPunctChar,
          left_flanking = true,
          right_flanking = true,
          max = this.posMax,
          marker = this.src.charCodeAt(start);

        // treat beginning of the line as a whitespace
        lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;

        while (pos < max && this.src.charCodeAt(pos) === marker) {
          pos++;
        }

        count = pos - start;

        // treat end of the line as a whitespace
        nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;

        isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
        isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

        isLastWhiteSpace = isWhiteSpace(lastChar);
        isNextWhiteSpace = isWhiteSpace(nextChar);

        if (isNextWhiteSpace) {
          left_flanking = false;
        } else if (isNextPunctChar) {
          if (!(isLastWhiteSpace || isLastPunctChar)) {
            left_flanking = false;
          }
        }

        if (isLastWhiteSpace) {
          right_flanking = false;
        } else if (isLastPunctChar) {
          if (!(isNextWhiteSpace || isNextPunctChar)) {
            right_flanking = false;
          }
        }

        if (!canSplitWord) {
          can_open = left_flanking && (!right_flanking || isLastPunctChar);
          can_close = right_flanking && (!left_flanking || isNextPunctChar);
        } else {
          can_open = left_flanking;
          can_close = right_flanking;
        }

        return {
          can_open: can_open,
          can_close: can_close,
          length: count
        };
      };


      // re-export Token class to use in block rules
      StateInline.prototype.Token = Token;


      module.exports = StateInline;

    }, {
      "../common/utils": 50,
      "../token": 97
    }],
    94: [function (require, module, exports) {
      // ~~strike through~~
      //
      'use strict';


      // Insert each marker as a separate text token, and add it to delimiter list
      //
      module.exports.tokenize = function strikethrough(state, silent) {
        var i, scanned, token, len, ch,
          start = state.pos,
          marker = state.src.charCodeAt(start);

        if (silent) {
          return false;
        }

        if (marker !== 0x7E /* ~ */ ) {
          return false;
        }

        scanned = state.scanDelims(state.pos, true);
        len = scanned.length;
        ch = String.fromCharCode(marker);

        if (len < 2) {
          return false;
        }

        if (len % 2) {
          token = state.push('text', '', 0);
          token.content = ch;
          len--;
        }

        for (i = 0; i < len; i += 2) {
          token = state.push('text', '', 0);
          token.content = ch + ch;

          state.delimiters.push({
            marker: marker,
            jump: i,
            token: state.tokens.length - 1,
            level: state.level,
            end: -1,
            open: scanned.can_open,
            close: scanned.can_close
          });
        }

        state.pos += scanned.length;

        return true;
      };


      // Walk through delimiter list and replace text tokens with tags
      //
      module.exports.postProcess = function strikethrough(state) {
        var i, j,
          startDelim,
          endDelim,
          token,
          loneMarkers = [],
          delimiters = state.delimiters,
          max = state.delimiters.length;

        for (i = 0; i < max; i++) {
          startDelim = delimiters[i];

          if (startDelim.marker !== 0x7E /* ~ */ ) {
            continue;
          }

          if (startDelim.end === -1) {
            continue;
          }

          endDelim = delimiters[startDelim.end];

          token = state.tokens[startDelim.token];
          token.type = 's_open';
          token.tag = 's';
          token.nesting = 1;
          token.markup = '~~';
          token.content = '';

          token = state.tokens[endDelim.token];
          token.type = 's_close';
          token.tag = 's';
          token.nesting = -1;
          token.markup = '~~';
          token.content = '';

          if (state.tokens[endDelim.token - 1].type === 'text' &&
            state.tokens[endDelim.token - 1].content === '~') {

            loneMarkers.push(endDelim.token - 1);
          }
        }

        // If a marker sequence has an odd number of characters, it's splitted
        // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
        // start of the sequence.
        //
        // So, we have to move all those markers after subsequent s_close tags.
        //
        while (loneMarkers.length) {
          i = loneMarkers.pop();
          j = i + 1;

          while (j < state.tokens.length && state.tokens[j].type === 's_close') {
            j++;
          }

          j--;

          if (i !== j) {
            token = state.tokens[j];
            state.tokens[j] = state.tokens[i];
            state.tokens[i] = token;
          }
        }
      };

    }, {}],
    95: [function (require, module, exports) {
      // Skip text characters for text token, place those to pending buffer
      // and increment current pos

      'use strict';


      // Rule to skip pure text
      // '{}$%@~+=:' reserved for extentions

      // !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~

      // !!!! Don't confuse with "Markdown ASCII Punctuation" chars
      // http://spec.commonmark.org/0.15/#ascii-punctuation-character
      function isTerminatorChar(ch) {
        switch (ch) {
          case 0x0A /* \n */ :
          case 0x21 /* ! */ :
          case 0x23 /* # */ :
          case 0x24 /* $ */ :
          case 0x25 /* % */ :
          case 0x26 /* & */ :
          case 0x2A /* * */ :
          case 0x2B /* + */ :
          case 0x2D /* - */ :
          case 0x3A /* : */ :
          case 0x3C /* < */ :
          case 0x3D /* = */ :
          case 0x3E /* > */ :
          case 0x40 /* @ */ :
          case 0x5B /* [ */ :
          case 0x5C /* \ */ :
          case 0x5D /* ] */ :
          case 0x5E /* ^ */ :
          case 0x5F /* _ */ :
          case 0x60 /* ` */ :
          case 0x7B /* { */ :
          case 0x7D /* } */ :
          case 0x7E /* ~ */ :
            return true;
          default:
            return false;
        }
      }

      module.exports = function text(state, silent) {
        var pos = state.pos;

        while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
          pos++;
        }

        if (pos === state.pos) {
          return false;
        }

        if (!silent) {
          state.pending += state.src.slice(state.pos, pos);
        }

        state.pos = pos;

        return true;
      };

      // Alternative implementation, for memory.
      //
      // It costs 10% of performance, but allows extend terminators list, if place it
      // to `ParcerInline` property. Probably, will switch to it sometime, such
      // flexibility required.

      /*
      var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

      module.exports = function text(state, silent) {
        var pos = state.pos,
            idx = state.src.slice(pos).search(TERMINATOR_RE);

        // first char is terminator -> empty text
        if (idx === 0) { return false; }

        // no terminator -> text till end of string
        if (idx < 0) {
          if (!silent) { state.pending += state.src.slice(pos); }
          state.pos = state.src.length;
          return true;
        }

        if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

        state.pos += idx;

        return true;
      };*/

    }, {}],
    96: [function (require, module, exports) {
      // Merge adjacent text nodes into one, and re-calculate all token levels
      //
      'use strict';


      module.exports = function text_collapse(state) {
        var curr, last,
          level = 0,
          tokens = state.tokens,
          max = state.tokens.length;

        for (curr = last = 0; curr < max; curr++) {
          // re-calculate levels
          level += tokens[curr].nesting;
          tokens[curr].level = level;

          if (tokens[curr].type === 'text' &&
            curr + 1 < max &&
            tokens[curr + 1].type === 'text') {

            // collapse two adjacent text nodes
            tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
          } else {
            if (curr !== last) {
              tokens[last] = tokens[curr];
            }

            last++;
          }
        }

        if (curr !== last) {
          tokens.length = last;
        }
      };

    }, {}],
    97: [function (require, module, exports) {
      // Token class

      'use strict';


      /**
       * class Token
       **/

      /**
       * new Token(type, tag, nesting)
       *
       * Create new token and fill passed properties.
       **/
      function Token(type, tag, nesting) {
        /**
         * Token#type -> String
         *
         * Type of the token (string, e.g. "paragraph_open")
         **/
        this.type = type;

        /**
         * Token#tag -> String
         *
         * html tag name, e.g. "p"
         **/
        this.tag = tag;

        /**
         * Token#attrs -> Array
         *
         * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
         **/
        this.attrs = null;

        /**
         * Token#map -> Array
         *
         * Source map info. Format: `[ line_begin, line_end ]`
         **/
        this.map = null;

        /**
         * Token#nesting -> Number
         *
         * Level change (number in {-1, 0, 1} set), where:
         *
         * -  `1` means the tag is opening
         * -  `0` means the tag is self-closing
         * - `-1` means the tag is closing
         **/
        this.nesting = nesting;

        /**
         * Token#level -> Number
         *
         * nesting level, the same as `state.level`
         **/
        this.level = 0;

        /**
         * Token#children -> Array
         *
         * An array of child nodes (inline and img tokens)
         **/
        this.children = null;

        /**
         * Token#content -> String
         *
         * In a case of self-closing tag (code, html, fence, etc.),
         * it has contents of this tag.
         **/
        this.content = '';

        /**
         * Token#markup -> String
         *
         * '*' or '_' for emphasis, fence string for fence, etc.
         **/
        this.markup = '';

        /**
         * Token#info -> String
         *
         * fence infostring
         **/
        this.info = '';

        /**
         * Token#meta -> Object
         *
         * A place for plugins to store an arbitrary data
         **/
        this.meta = null;

        /**
         * Token#block -> Boolean
         *
         * True for block-level tokens, false for inline tokens.
         * Used in renderer to calculate line breaks
         **/
        this.block = false;

        /**
         * Token#hidden -> Boolean
         *
         * If it's true, ignore this element when rendering. Used for tight lists
         * to hide paragraphs.
         **/
        this.hidden = false;
      }


      /**
       * Token.attrIndex(name) -> Number
       *
       * Search attribute index by name.
       **/
      Token.prototype.attrIndex = function attrIndex(name) {
        var attrs, i, len;

        if (!this.attrs) {
          return -1;
        }

        attrs = this.attrs;

        for (i = 0, len = attrs.length; i < len; i++) {
          if (attrs[i][0] === name) {
            return i;
          }
        }
        return -1;
      };


      /**
       * Token.attrPush(attrData)
       *
       * Add `[ name, value ]` attribute to list. Init attrs if necessary
       **/
      Token.prototype.attrPush = function attrPush(attrData) {
        if (this.attrs) {
          this.attrs.push(attrData);
        } else {
          this.attrs = [attrData];
        }
      };


      /**
       * Token.attrSet(name, value)
       *
       * Set `name` attribute to `value`. Override old value if exists.
       **/
      Token.prototype.attrSet = function attrSet(name, value) {
        var idx = this.attrIndex(name),
          attrData = [name, value];

        if (idx < 0) {
          this.attrPush(attrData);
        } else {
          this.attrs[idx] = attrData;
        }
      };


      /**
       * Token.attrJoin(name, value)
       *
       * Join value to existing attribute via space. Or create new attribute if not
       * exists. Useful to operate with token classes.
       **/
      Token.prototype.attrJoin = function attrJoin(name, value) {
        var idx = this.attrIndex(name);

        if (idx < 0) {
          this.attrPush([name, value]);
        } else {
          this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
        }
      };


      module.exports = Token;

    }, {}],
    98: [function (require, module, exports) {
      module.exports = {
        "Aacute": "\u00C1",
        "aacute": "\u00E1",
        "Abreve": "\u0102",
        "abreve": "\u0103",
        "ac": "\u223E",
        "acd": "\u223F",
        "acE": "\u223E\u0333",
        "Acirc": "\u00C2",
        "acirc": "\u00E2",
        "acute": "\u00B4",
        "Acy": "\u0410",
        "acy": "\u0430",
        "AElig": "\u00C6",
        "aelig": "\u00E6",
        "af": "\u2061",
        "Afr": "\uD835\uDD04",
        "afr": "\uD835\uDD1E",
        "Agrave": "\u00C0",
        "agrave": "\u00E0",
        "alefsym": "\u2135",
        "aleph": "\u2135",
        "Alpha": "\u0391",
        "alpha": "\u03B1",
        "Amacr": "\u0100",
        "amacr": "\u0101",
        "amalg": "\u2A3F",
        "amp": "&",
        "AMP": "&",
        "andand": "\u2A55",
        "And": "\u2A53",
        "and": "\u2227",
        "andd": "\u2A5C",
        "andslope": "\u2A58",
        "andv": "\u2A5A",
        "ang": "\u2220",
        "ange": "\u29A4",
        "angle": "\u2220",
        "angmsdaa": "\u29A8",
        "angmsdab": "\u29A9",
        "angmsdac": "\u29AA",
        "angmsdad": "\u29AB",
        "angmsdae": "\u29AC",
        "angmsdaf": "\u29AD",
        "angmsdag": "\u29AE",
        "angmsdah": "\u29AF",
        "angmsd": "\u2221",
        "angrt": "\u221F",
        "angrtvb": "\u22BE",
        "angrtvbd": "\u299D",
        "angsph": "\u2222",
        "angst": "\u00C5",
        "angzarr": "\u237C",
        "Aogon": "\u0104",
        "aogon": "\u0105",
        "Aopf": "\uD835\uDD38",
        "aopf": "\uD835\uDD52",
        "apacir": "\u2A6F",
        "ap": "\u2248",
        "apE": "\u2A70",
        "ape": "\u224A",
        "apid": "\u224B",
        "apos": "'",
        "ApplyFunction": "\u2061",
        "approx": "\u2248",
        "approxeq": "\u224A",
        "Aring": "\u00C5",
        "aring": "\u00E5",
        "Ascr": "\uD835\uDC9C",
        "ascr": "\uD835\uDCB6",
        "Assign": "\u2254",
        "ast": "*",
        "asymp": "\u2248",
        "asympeq": "\u224D",
        "Atilde": "\u00C3",
        "atilde": "\u00E3",
        "Auml": "\u00C4",
        "auml": "\u00E4",
        "awconint": "\u2233",
        "awint": "\u2A11",
        "backcong": "\u224C",
        "backepsilon": "\u03F6",
        "backprime": "\u2035",
        "backsim": "\u223D",
        "backsimeq": "\u22CD",
        "Backslash": "\u2216",
        "Barv": "\u2AE7",
        "barvee": "\u22BD",
        "barwed": "\u2305",
        "Barwed": "\u2306",
        "barwedge": "\u2305",
        "bbrk": "\u23B5",
        "bbrktbrk": "\u23B6",
        "bcong": "\u224C",
        "Bcy": "\u0411",
        "bcy": "\u0431",
        "bdquo": "\u201E",
        "becaus": "\u2235",
        "because": "\u2235",
        "Because": "\u2235",
        "bemptyv": "\u29B0",
        "bepsi": "\u03F6",
        "bernou": "\u212C",
        "Bernoullis": "\u212C",
        "Beta": "\u0392",
        "beta": "\u03B2",
        "beth": "\u2136",
        "between": "\u226C",
        "Bfr": "\uD835\uDD05",
        "bfr": "\uD835\uDD1F",
        "bigcap": "\u22C2",
        "bigcirc": "\u25EF",
        "bigcup": "\u22C3",
        "bigodot": "\u2A00",
        "bigoplus": "\u2A01",
        "bigotimes": "\u2A02",
        "bigsqcup": "\u2A06",
        "bigstar": "\u2605",
        "bigtriangledown": "\u25BD",
        "bigtriangleup": "\u25B3",
        "biguplus": "\u2A04",
        "bigvee": "\u22C1",
        "bigwedge": "\u22C0",
        "bkarow": "\u290D",
        "blacklozenge": "\u29EB",
        "blacksquare": "\u25AA",
        "blacktriangle": "\u25B4",
        "blacktriangledown": "\u25BE",
        "blacktriangleleft": "\u25C2",
        "blacktriangleright": "\u25B8",
        "blank": "\u2423",
        "blk12": "\u2592",
        "blk14": "\u2591",
        "blk34": "\u2593",
        "block": "\u2588",
        "bne": "=\u20E5",
        "bnequiv": "\u2261\u20E5",
        "bNot": "\u2AED",
        "bnot": "\u2310",
        "Bopf": "\uD835\uDD39",
        "bopf": "\uD835\uDD53",
        "bot": "\u22A5",
        "bottom": "\u22A5",
        "bowtie": "\u22C8",
        "boxbox": "\u29C9",
        "boxdl": "\u2510",
        "boxdL": "\u2555",
        "boxDl": "\u2556",
        "boxDL": "\u2557",
        "boxdr": "\u250C",
        "boxdR": "\u2552",
        "boxDr": "\u2553",
        "boxDR": "\u2554",
        "boxh": "\u2500",
        "boxH": "\u2550",
        "boxhd": "\u252C",
        "boxHd": "\u2564",
        "boxhD": "\u2565",
        "boxHD": "\u2566",
        "boxhu": "\u2534",
        "boxHu": "\u2567",
        "boxhU": "\u2568",
        "boxHU": "\u2569",
        "boxminus": "\u229F",
        "boxplus": "\u229E",
        "boxtimes": "\u22A0",
        "boxul": "\u2518",
        "boxuL": "\u255B",
        "boxUl": "\u255C",
        "boxUL": "\u255D",
        "boxur": "\u2514",
        "boxuR": "\u2558",
        "boxUr": "\u2559",
        "boxUR": "\u255A",
        "boxv": "\u2502",
        "boxV": "\u2551",
        "boxvh": "\u253C",
        "boxvH": "\u256A",
        "boxVh": "\u256B",
        "boxVH": "\u256C",
        "boxvl": "\u2524",
        "boxvL": "\u2561",
        "boxVl": "\u2562",
        "boxVL": "\u2563",
        "boxvr": "\u251C",
        "boxvR": "\u255E",
        "boxVr": "\u255F",
        "boxVR": "\u2560",
        "bprime": "\u2035",
        "breve": "\u02D8",
        "Breve": "\u02D8",
        "brvbar": "\u00A6",
        "bscr": "\uD835\uDCB7",
        "Bscr": "\u212C",
        "bsemi": "\u204F",
        "bsim": "\u223D",
        "bsime": "\u22CD",
        "bsolb": "\u29C5",
        "bsol": "\\",
        "bsolhsub": "\u27C8",
        "bull": "\u2022",
        "bullet": "\u2022",
        "bump": "\u224E",
        "bumpE": "\u2AAE",
        "bumpe": "\u224F",
        "Bumpeq": "\u224E",
        "bumpeq": "\u224F",
        "Cacute": "\u0106",
        "cacute": "\u0107",
        "capand": "\u2A44",
        "capbrcup": "\u2A49",
        "capcap": "\u2A4B",
        "cap": "\u2229",
        "Cap": "\u22D2",
        "capcup": "\u2A47",
        "capdot": "\u2A40",
        "CapitalDifferentialD": "\u2145",
        "caps": "\u2229\uFE00",
        "caret": "\u2041",
        "caron": "\u02C7",
        "Cayleys": "\u212D",
        "ccaps": "\u2A4D",
        "Ccaron": "\u010C",
        "ccaron": "\u010D",
        "Ccedil": "\u00C7",
        "ccedil": "\u00E7",
        "Ccirc": "\u0108",
        "ccirc": "\u0109",
        "Cconint": "\u2230",
        "ccups": "\u2A4C",
        "ccupssm": "\u2A50",
        "Cdot": "\u010A",
        "cdot": "\u010B",
        "cedil": "\u00B8",
        "Cedilla": "\u00B8",
        "cemptyv": "\u29B2",
        "cent": "\u00A2",
        "centerdot": "\u00B7",
        "CenterDot": "\u00B7",
        "cfr": "\uD835\uDD20",
        "Cfr": "\u212D",
        "CHcy": "\u0427",
        "chcy": "\u0447",
        "check": "\u2713",
        "checkmark": "\u2713",
        "Chi": "\u03A7",
        "chi": "\u03C7",
        "circ": "\u02C6",
        "circeq": "\u2257",
        "circlearrowleft": "\u21BA",
        "circlearrowright": "\u21BB",
        "circledast": "\u229B",
        "circledcirc": "\u229A",
        "circleddash": "\u229D",
        "CircleDot": "\u2299",
        "circledR": "\u00AE",
        "circledS": "\u24C8",
        "CircleMinus": "\u2296",
        "CirclePlus": "\u2295",
        "CircleTimes": "\u2297",
        "cir": "\u25CB",
        "cirE": "\u29C3",
        "cire": "\u2257",
        "cirfnint": "\u2A10",
        "cirmid": "\u2AEF",
        "cirscir": "\u29C2",
        "ClockwiseContourIntegral": "\u2232",
        "CloseCurlyDoubleQuote": "\u201D",
        "CloseCurlyQuote": "\u2019",
        "clubs": "\u2663",
        "clubsuit": "\u2663",
        "colon": ":",
        "Colon": "\u2237",
        "Colone": "\u2A74",
        "colone": "\u2254",
        "coloneq": "\u2254",
        "comma": ",",
        "commat": "@",
        "comp": "\u2201",
        "compfn": "\u2218",
        "complement": "\u2201",
        "complexes": "\u2102",
        "cong": "\u2245",
        "congdot": "\u2A6D",
        "Congruent": "\u2261",
        "conint": "\u222E",
        "Conint": "\u222F",
        "ContourIntegral": "\u222E",
        "copf": "\uD835\uDD54",
        "Copf": "\u2102",
        "coprod": "\u2210",
        "Coproduct": "\u2210",
        "copy": "\u00A9",
        "COPY": "\u00A9",
        "copysr": "\u2117",
        "CounterClockwiseContourIntegral": "\u2233",
        "crarr": "\u21B5",
        "cross": "\u2717",
        "Cross": "\u2A2F",
        "Cscr": "\uD835\uDC9E",
        "cscr": "\uD835\uDCB8",
        "csub": "\u2ACF",
        "csube": "\u2AD1",
        "csup": "\u2AD0",
        "csupe": "\u2AD2",
        "ctdot": "\u22EF",
        "cudarrl": "\u2938",
        "cudarrr": "\u2935",
        "cuepr": "\u22DE",
        "cuesc": "\u22DF",
        "cularr": "\u21B6",
        "cularrp": "\u293D",
        "cupbrcap": "\u2A48",
        "cupcap": "\u2A46",
        "CupCap": "\u224D",
        "cup": "\u222A",
        "Cup": "\u22D3",
        "cupcup": "\u2A4A",
        "cupdot": "\u228D",
        "cupor": "\u2A45",
        "cups": "\u222A\uFE00",
        "curarr": "\u21B7",
        "curarrm": "\u293C",
        "curlyeqprec": "\u22DE",
        "curlyeqsucc": "\u22DF",
        "curlyvee": "\u22CE",
        "curlywedge": "\u22CF",
        "curren": "\u00A4",
        "curvearrowleft": "\u21B6",
        "curvearrowright": "\u21B7",
        "cuvee": "\u22CE",
        "cuwed": "\u22CF",
        "cwconint": "\u2232",
        "cwint": "\u2231",
        "cylcty": "\u232D",
        "dagger": "\u2020",
        "Dagger": "\u2021",
        "daleth": "\u2138",
        "darr": "\u2193",
        "Darr": "\u21A1",
        "dArr": "\u21D3",
        "dash": "\u2010",
        "Dashv": "\u2AE4",
        "dashv": "\u22A3",
        "dbkarow": "\u290F",
        "dblac": "\u02DD",
        "Dcaron": "\u010E",
        "dcaron": "\u010F",
        "Dcy": "\u0414",
        "dcy": "\u0434",
        "ddagger": "\u2021",
        "ddarr": "\u21CA",
        "DD": "\u2145",
        "dd": "\u2146",
        "DDotrahd": "\u2911",
        "ddotseq": "\u2A77",
        "deg": "\u00B0",
        "Del": "\u2207",
        "Delta": "\u0394",
        "delta": "\u03B4",
        "demptyv": "\u29B1",
        "dfisht": "\u297F",
        "Dfr": "\uD835\uDD07",
        "dfr": "\uD835\uDD21",
        "dHar": "\u2965",
        "dharl": "\u21C3",
        "dharr": "\u21C2",
        "DiacriticalAcute": "\u00B4",
        "DiacriticalDot": "\u02D9",
        "DiacriticalDoubleAcute": "\u02DD",
        "DiacriticalGrave": "`",
        "DiacriticalTilde": "\u02DC",
        "diam": "\u22C4",
        "diamond": "\u22C4",
        "Diamond": "\u22C4",
        "diamondsuit": "\u2666",
        "diams": "\u2666",
        "die": "\u00A8",
        "DifferentialD": "\u2146",
        "digamma": "\u03DD",
        "disin": "\u22F2",
        "div": "\u00F7",
        "divide": "\u00F7",
        "divideontimes": "\u22C7",
        "divonx": "\u22C7",
        "DJcy": "\u0402",
        "djcy": "\u0452",
        "dlcorn": "\u231E",
        "dlcrop": "\u230D",
        "dollar": "$",
        "Dopf": "\uD835\uDD3B",
        "dopf": "\uD835\uDD55",
        "Dot": "\u00A8",
        "dot": "\u02D9",
        "DotDot": "\u20DC",
        "doteq": "\u2250",
        "doteqdot": "\u2251",
        "DotEqual": "\u2250",
        "dotminus": "\u2238",
        "dotplus": "\u2214",
        "dotsquare": "\u22A1",
        "doublebarwedge": "\u2306",
        "DoubleContourIntegral": "\u222F",
        "DoubleDot": "\u00A8",
        "DoubleDownArrow": "\u21D3",
        "DoubleLeftArrow": "\u21D0",
        "DoubleLeftRightArrow": "\u21D4",
        "DoubleLeftTee": "\u2AE4",
        "DoubleLongLeftArrow": "\u27F8",
        "DoubleLongLeftRightArrow": "\u27FA",
        "DoubleLongRightArrow": "\u27F9",
        "DoubleRightArrow": "\u21D2",
        "DoubleRightTee": "\u22A8",
        "DoubleUpArrow": "\u21D1",
        "DoubleUpDownArrow": "\u21D5",
        "DoubleVerticalBar": "\u2225",
        "DownArrowBar": "\u2913",
        "downarrow": "\u2193",
        "DownArrow": "\u2193",
        "Downarrow": "\u21D3",
        "DownArrowUpArrow": "\u21F5",
        "DownBreve": "\u0311",
        "downdownarrows": "\u21CA",
        "downharpoonleft": "\u21C3",
        "downharpoonright": "\u21C2",
        "DownLeftRightVector": "\u2950",
        "DownLeftTeeVector": "\u295E",
        "DownLeftVectorBar": "\u2956",
        "DownLeftVector": "\u21BD",
        "DownRightTeeVector": "\u295F",
        "DownRightVectorBar": "\u2957",
        "DownRightVector": "\u21C1",
        "DownTeeArrow": "\u21A7",
        "DownTee": "\u22A4",
        "drbkarow": "\u2910",
        "drcorn": "\u231F",
        "drcrop": "\u230C",
        "Dscr": "\uD835\uDC9F",
        "dscr": "\uD835\uDCB9",
        "DScy": "\u0405",
        "dscy": "\u0455",
        "dsol": "\u29F6",
        "Dstrok": "\u0110",
        "dstrok": "\u0111",
        "dtdot": "\u22F1",
        "dtri": "\u25BF",
        "dtrif": "\u25BE",
        "duarr": "\u21F5",
        "duhar": "\u296F",
        "dwangle": "\u29A6",
        "DZcy": "\u040F",
        "dzcy": "\u045F",
        "dzigrarr": "\u27FF",
        "Eacute": "\u00C9",
        "eacute": "\u00E9",
        "easter": "\u2A6E",
        "Ecaron": "\u011A",
        "ecaron": "\u011B",
        "Ecirc": "\u00CA",
        "ecirc": "\u00EA",
        "ecir": "\u2256",
        "ecolon": "\u2255",
        "Ecy": "\u042D",
        "ecy": "\u044D",
        "eDDot": "\u2A77",
        "Edot": "\u0116",
        "edot": "\u0117",
        "eDot": "\u2251",
        "ee": "\u2147",
        "efDot": "\u2252",
        "Efr": "\uD835\uDD08",
        "efr": "\uD835\uDD22",
        "eg": "\u2A9A",
        "Egrave": "\u00C8",
        "egrave": "\u00E8",
        "egs": "\u2A96",
        "egsdot": "\u2A98",
        "el": "\u2A99",
        "Element": "\u2208",
        "elinters": "\u23E7",
        "ell": "\u2113",
        "els": "\u2A95",
        "elsdot": "\u2A97",
        "Emacr": "\u0112",
        "emacr": "\u0113",
        "empty": "\u2205",
        "emptyset": "\u2205",
        "EmptySmallSquare": "\u25FB",
        "emptyv": "\u2205",
        "EmptyVerySmallSquare": "\u25AB",
        "emsp13": "\u2004",
        "emsp14": "\u2005",
        "emsp": "\u2003",
        "ENG": "\u014A",
        "eng": "\u014B",
        "ensp": "\u2002",
        "Eogon": "\u0118",
        "eogon": "\u0119",
        "Eopf": "\uD835\uDD3C",
        "eopf": "\uD835\uDD56",
        "epar": "\u22D5",
        "eparsl": "\u29E3",
        "eplus": "\u2A71",
        "epsi": "\u03B5",
        "Epsilon": "\u0395",
        "epsilon": "\u03B5",
        "epsiv": "\u03F5",
        "eqcirc": "\u2256",
        "eqcolon": "\u2255",
        "eqsim": "\u2242",
        "eqslantgtr": "\u2A96",
        "eqslantless": "\u2A95",
        "Equal": "\u2A75",
        "equals": "=",
        "EqualTilde": "\u2242",
        "equest": "\u225F",
        "Equilibrium": "\u21CC",
        "equiv": "\u2261",
        "equivDD": "\u2A78",
        "eqvparsl": "\u29E5",
        "erarr": "\u2971",
        "erDot": "\u2253",
        "escr": "\u212F",
        "Escr": "\u2130",
        "esdot": "\u2250",
        "Esim": "\u2A73",
        "esim": "\u2242",
        "Eta": "\u0397",
        "eta": "\u03B7",
        "ETH": "\u00D0",
        "eth": "\u00F0",
        "Euml": "\u00CB",
        "euml": "\u00EB",
        "euro": "\u20AC",
        "excl": "!",
        "exist": "\u2203",
        "Exists": "\u2203",
        "expectation": "\u2130",
        "exponentiale": "\u2147",
        "ExponentialE": "\u2147",
        "fallingdotseq": "\u2252",
        "Fcy": "\u0424",
        "fcy": "\u0444",
        "female": "\u2640",
        "ffilig": "\uFB03",
        "fflig": "\uFB00",
        "ffllig": "\uFB04",
        "Ffr": "\uD835\uDD09",
        "ffr": "\uD835\uDD23",
        "filig": "\uFB01",
        "FilledSmallSquare": "\u25FC",
        "FilledVerySmallSquare": "\u25AA",
        "fjlig": "fj",
        "flat": "\u266D",
        "fllig": "\uFB02",
        "fltns": "\u25B1",
        "fnof": "\u0192",
        "Fopf": "\uD835\uDD3D",
        "fopf": "\uD835\uDD57",
        "forall": "\u2200",
        "ForAll": "\u2200",
        "fork": "\u22D4",
        "forkv": "\u2AD9",
        "Fouriertrf": "\u2131",
        "fpartint": "\u2A0D",
        "frac12": "\u00BD",
        "frac13": "\u2153",
        "frac14": "\u00BC",
        "frac15": "\u2155",
        "frac16": "\u2159",
        "frac18": "\u215B",
        "frac23": "\u2154",
        "frac25": "\u2156",
        "frac34": "\u00BE",
        "frac35": "\u2157",
        "frac38": "\u215C",
        "frac45": "\u2158",
        "frac56": "\u215A",
        "frac58": "\u215D",
        "frac78": "\u215E",
        "frasl": "\u2044",
        "frown": "\u2322",
        "fscr": "\uD835\uDCBB",
        "Fscr": "\u2131",
        "gacute": "\u01F5",
        "Gamma": "\u0393",
        "gamma": "\u03B3",
        "Gammad": "\u03DC",
        "gammad": "\u03DD",
        "gap": "\u2A86",
        "Gbreve": "\u011E",
        "gbreve": "\u011F",
        "Gcedil": "\u0122",
        "Gcirc": "\u011C",
        "gcirc": "\u011D",
        "Gcy": "\u0413",
        "gcy": "\u0433",
        "Gdot": "\u0120",
        "gdot": "\u0121",
        "ge": "\u2265",
        "gE": "\u2267",
        "gEl": "\u2A8C",
        "gel": "\u22DB",
        "geq": "\u2265",
        "geqq": "\u2267",
        "geqslant": "\u2A7E",
        "gescc": "\u2AA9",
        "ges": "\u2A7E",
        "gesdot": "\u2A80",
        "gesdoto": "\u2A82",
        "gesdotol": "\u2A84",
        "gesl": "\u22DB\uFE00",
        "gesles": "\u2A94",
        "Gfr": "\uD835\uDD0A",
        "gfr": "\uD835\uDD24",
        "gg": "\u226B",
        "Gg": "\u22D9",
        "ggg": "\u22D9",
        "gimel": "\u2137",
        "GJcy": "\u0403",
        "gjcy": "\u0453",
        "gla": "\u2AA5",
        "gl": "\u2277",
        "glE": "\u2A92",
        "glj": "\u2AA4",
        "gnap": "\u2A8A",
        "gnapprox": "\u2A8A",
        "gne": "\u2A88",
        "gnE": "\u2269",
        "gneq": "\u2A88",
        "gneqq": "\u2269",
        "gnsim": "\u22E7",
        "Gopf": "\uD835\uDD3E",
        "gopf": "\uD835\uDD58",
        "grave": "`",
        "GreaterEqual": "\u2265",
        "GreaterEqualLess": "\u22DB",
        "GreaterFullEqual": "\u2267",
        "GreaterGreater": "\u2AA2",
        "GreaterLess": "\u2277",
        "GreaterSlantEqual": "\u2A7E",
        "GreaterTilde": "\u2273",
        "Gscr": "\uD835\uDCA2",
        "gscr": "\u210A",
        "gsim": "\u2273",
        "gsime": "\u2A8E",
        "gsiml": "\u2A90",
        "gtcc": "\u2AA7",
        "gtcir": "\u2A7A",
        "gt": ">",
        "GT": ">",
        "Gt": "\u226B",
        "gtdot": "\u22D7",
        "gtlPar": "\u2995",
        "gtquest": "\u2A7C",
        "gtrapprox": "\u2A86",
        "gtrarr": "\u2978",
        "gtrdot": "\u22D7",
        "gtreqless": "\u22DB",
        "gtreqqless": "\u2A8C",
        "gtrless": "\u2277",
        "gtrsim": "\u2273",
        "gvertneqq": "\u2269\uFE00",
        "gvnE": "\u2269\uFE00",
        "Hacek": "\u02C7",
        "hairsp": "\u200A",
        "half": "\u00BD",
        "hamilt": "\u210B",
        "HARDcy": "\u042A",
        "hardcy": "\u044A",
        "harrcir": "\u2948",
        "harr": "\u2194",
        "hArr": "\u21D4",
        "harrw": "\u21AD",
        "Hat": "^",
        "hbar": "\u210F",
        "Hcirc": "\u0124",
        "hcirc": "\u0125",
        "hearts": "\u2665",
        "heartsuit": "\u2665",
        "hellip": "\u2026",
        "hercon": "\u22B9",
        "hfr": "\uD835\uDD25",
        "Hfr": "\u210C",
        "HilbertSpace": "\u210B",
        "hksearow": "\u2925",
        "hkswarow": "\u2926",
        "hoarr": "\u21FF",
        "homtht": "\u223B",
        "hookleftarrow": "\u21A9",
        "hookrightarrow": "\u21AA",
        "hopf": "\uD835\uDD59",
        "Hopf": "\u210D",
        "horbar": "\u2015",
        "HorizontalLine": "\u2500",
        "hscr": "\uD835\uDCBD",
        "Hscr": "\u210B",
        "hslash": "\u210F",
        "Hstrok": "\u0126",
        "hstrok": "\u0127",
        "HumpDownHump": "\u224E",
        "HumpEqual": "\u224F",
        "hybull": "\u2043",
        "hyphen": "\u2010",
        "Iacute": "\u00CD",
        "iacute": "\u00ED",
        "ic": "\u2063",
        "Icirc": "\u00CE",
        "icirc": "\u00EE",
        "Icy": "\u0418",
        "icy": "\u0438",
        "Idot": "\u0130",
        "IEcy": "\u0415",
        "iecy": "\u0435",
        "iexcl": "\u00A1",
        "iff": "\u21D4",
        "ifr": "\uD835\uDD26",
        "Ifr": "\u2111",
        "Igrave": "\u00CC",
        "igrave": "\u00EC",
        "ii": "\u2148",
        "iiiint": "\u2A0C",
        "iiint": "\u222D",
        "iinfin": "\u29DC",
        "iiota": "\u2129",
        "IJlig": "\u0132",
        "ijlig": "\u0133",
        "Imacr": "\u012A",
        "imacr": "\u012B",
        "image": "\u2111",
        "ImaginaryI": "\u2148",
        "imagline": "\u2110",
        "imagpart": "\u2111",
        "imath": "\u0131",
        "Im": "\u2111",
        "imof": "\u22B7",
        "imped": "\u01B5",
        "Implies": "\u21D2",
        "incare": "\u2105",
        "in": "\u2208",
        "infin": "\u221E",
        "infintie": "\u29DD",
        "inodot": "\u0131",
        "intcal": "\u22BA",
        "int": "\u222B",
        "Int": "\u222C",
        "integers": "\u2124",
        "Integral": "\u222B",
        "intercal": "\u22BA",
        "Intersection": "\u22C2",
        "intlarhk": "\u2A17",
        "intprod": "\u2A3C",
        "InvisibleComma": "\u2063",
        "InvisibleTimes": "\u2062",
        "IOcy": "\u0401",
        "iocy": "\u0451",
        "Iogon": "\u012E",
        "iogon": "\u012F",
        "Iopf": "\uD835\uDD40",
        "iopf": "\uD835\uDD5A",
        "Iota": "\u0399",
        "iota": "\u03B9",
        "iprod": "\u2A3C",
        "iquest": "\u00BF",
        "iscr": "\uD835\uDCBE",
        "Iscr": "\u2110",
        "isin": "\u2208",
        "isindot": "\u22F5",
        "isinE": "\u22F9",
        "isins": "\u22F4",
        "isinsv": "\u22F3",
        "isinv": "\u2208",
        "it": "\u2062",
        "Itilde": "\u0128",
        "itilde": "\u0129",
        "Iukcy": "\u0406",
        "iukcy": "\u0456",
        "Iuml": "\u00CF",
        "iuml": "\u00EF",
        "Jcirc": "\u0134",
        "jcirc": "\u0135",
        "Jcy": "\u0419",
        "jcy": "\u0439",
        "Jfr": "\uD835\uDD0D",
        "jfr": "\uD835\uDD27",
        "jmath": "\u0237",
        "Jopf": "\uD835\uDD41",
        "jopf": "\uD835\uDD5B",
        "Jscr": "\uD835\uDCA5",
        "jscr": "\uD835\uDCBF",
        "Jsercy": "\u0408",
        "jsercy": "\u0458",
        "Jukcy": "\u0404",
        "jukcy": "\u0454",
        "Kappa": "\u039A",
        "kappa": "\u03BA",
        "kappav": "\u03F0",
        "Kcedil": "\u0136",
        "kcedil": "\u0137",
        "Kcy": "\u041A",
        "kcy": "\u043A",
        "Kfr": "\uD835\uDD0E",
        "kfr": "\uD835\uDD28",
        "kgreen": "\u0138",
        "KHcy": "\u0425",
        "khcy": "\u0445",
        "KJcy": "\u040C",
        "kjcy": "\u045C",
        "Kopf": "\uD835\uDD42",
        "kopf": "\uD835\uDD5C",
        "Kscr": "\uD835\uDCA6",
        "kscr": "\uD835\uDCC0",
        "lAarr": "\u21DA",
        "Lacute": "\u0139",
        "lacute": "\u013A",
        "laemptyv": "\u29B4",
        "lagran": "\u2112",
        "Lambda": "\u039B",
        "lambda": "\u03BB",
        "lang": "\u27E8",
        "Lang": "\u27EA",
        "langd": "\u2991",
        "langle": "\u27E8",
        "lap": "\u2A85",
        "Laplacetrf": "\u2112",
        "laquo": "\u00AB",
        "larrb": "\u21E4",
        "larrbfs": "\u291F",
        "larr": "\u2190",
        "Larr": "\u219E",
        "lArr": "\u21D0",
        "larrfs": "\u291D",
        "larrhk": "\u21A9",
        "larrlp": "\u21AB",
        "larrpl": "\u2939",
        "larrsim": "\u2973",
        "larrtl": "\u21A2",
        "latail": "\u2919",
        "lAtail": "\u291B",
        "lat": "\u2AAB",
        "late": "\u2AAD",
        "lates": "\u2AAD\uFE00",
        "lbarr": "\u290C",
        "lBarr": "\u290E",
        "lbbrk": "\u2772",
        "lbrace": "{",
        "lbrack": "[",
        "lbrke": "\u298B",
        "lbrksld": "\u298F",
        "lbrkslu": "\u298D",
        "Lcaron": "\u013D",
        "lcaron": "\u013E",
        "Lcedil": "\u013B",
        "lcedil": "\u013C",
        "lceil": "\u2308",
        "lcub": "{",
        "Lcy": "\u041B",
        "lcy": "\u043B",
        "ldca": "\u2936",
        "ldquo": "\u201C",
        "ldquor": "\u201E",
        "ldrdhar": "\u2967",
        "ldrushar": "\u294B",
        "ldsh": "\u21B2",
        "le": "\u2264",
        "lE": "\u2266",
        "LeftAngleBracket": "\u27E8",
        "LeftArrowBar": "\u21E4",
        "leftarrow": "\u2190",
        "LeftArrow": "\u2190",
        "Leftarrow": "\u21D0",
        "LeftArrowRightArrow": "\u21C6",
        "leftarrowtail": "\u21A2",
        "LeftCeiling": "\u2308",
        "LeftDoubleBracket": "\u27E6",
        "LeftDownTeeVector": "\u2961",
        "LeftDownVectorBar": "\u2959",
        "LeftDownVector": "\u21C3",
        "LeftFloor": "\u230A",
        "leftharpoondown": "\u21BD",
        "leftharpoonup": "\u21BC",
        "leftleftarrows": "\u21C7",
        "leftrightarrow": "\u2194",
        "LeftRightArrow": "\u2194",
        "Leftrightarrow": "\u21D4",
        "leftrightarrows": "\u21C6",
        "leftrightharpoons": "\u21CB",
        "leftrightsquigarrow": "\u21AD",
        "LeftRightVector": "\u294E",
        "LeftTeeArrow": "\u21A4",
        "LeftTee": "\u22A3",
        "LeftTeeVector": "\u295A",
        "leftthreetimes": "\u22CB",
        "LeftTriangleBar": "\u29CF",
        "LeftTriangle": "\u22B2",
        "LeftTriangleEqual": "\u22B4",
        "LeftUpDownVector": "\u2951",
        "LeftUpTeeVector": "\u2960",
        "LeftUpVectorBar": "\u2958",
        "LeftUpVector": "\u21BF",
        "LeftVectorBar": "\u2952",
        "LeftVector": "\u21BC",
        "lEg": "\u2A8B",
        "leg": "\u22DA",
        "leq": "\u2264",
        "leqq": "\u2266",
        "leqslant": "\u2A7D",
        "lescc": "\u2AA8",
        "les": "\u2A7D",
        "lesdot": "\u2A7F",
        "lesdoto": "\u2A81",
        "lesdotor": "\u2A83",
        "lesg": "\u22DA\uFE00",
        "lesges": "\u2A93",
        "lessapprox": "\u2A85",
        "lessdot": "\u22D6",
        "lesseqgtr": "\u22DA",
        "lesseqqgtr": "\u2A8B",
        "LessEqualGreater": "\u22DA",
        "LessFullEqual": "\u2266",
        "LessGreater": "\u2276",
        "lessgtr": "\u2276",
        "LessLess": "\u2AA1",
        "lesssim": "\u2272",
        "LessSlantEqual": "\u2A7D",
        "LessTilde": "\u2272",
        "lfisht": "\u297C",
        "lfloor": "\u230A",
        "Lfr": "\uD835\uDD0F",
        "lfr": "\uD835\uDD29",
        "lg": "\u2276",
        "lgE": "\u2A91",
        "lHar": "\u2962",
        "lhard": "\u21BD",
        "lharu": "\u21BC",
        "lharul": "\u296A",
        "lhblk": "\u2584",
        "LJcy": "\u0409",
        "ljcy": "\u0459",
        "llarr": "\u21C7",
        "ll": "\u226A",
        "Ll": "\u22D8",
        "llcorner": "\u231E",
        "Lleftarrow": "\u21DA",
        "llhard": "\u296B",
        "lltri": "\u25FA",
        "Lmidot": "\u013F",
        "lmidot": "\u0140",
        "lmoustache": "\u23B0",
        "lmoust": "\u23B0",
        "lnap": "\u2A89",
        "lnapprox": "\u2A89",
        "lne": "\u2A87",
        "lnE": "\u2268",
        "lneq": "\u2A87",
        "lneqq": "\u2268",
        "lnsim": "\u22E6",
        "loang": "\u27EC",
        "loarr": "\u21FD",
        "lobrk": "\u27E6",
        "longleftarrow": "\u27F5",
        "LongLeftArrow": "\u27F5",
        "Longleftarrow": "\u27F8",
        "longleftrightarrow": "\u27F7",
        "LongLeftRightArrow": "\u27F7",
        "Longleftrightarrow": "\u27FA",
        "longmapsto": "\u27FC",
        "longrightarrow": "\u27F6",
        "LongRightArrow": "\u27F6",
        "Longrightarrow": "\u27F9",
        "looparrowleft": "\u21AB",
        "looparrowright": "\u21AC",
        "lopar": "\u2985",
        "Lopf": "\uD835\uDD43",
        "lopf": "\uD835\uDD5D",
        "loplus": "\u2A2D",
        "lotimes": "\u2A34",
        "lowast": "\u2217",
        "lowbar": "_",
        "LowerLeftArrow": "\u2199",
        "LowerRightArrow": "\u2198",
        "loz": "\u25CA",
        "lozenge": "\u25CA",
        "lozf": "\u29EB",
        "lpar": "(",
        "lparlt": "\u2993",
        "lrarr": "\u21C6",
        "lrcorner": "\u231F",
        "lrhar": "\u21CB",
        "lrhard": "\u296D",
        "lrm": "\u200E",
        "lrtri": "\u22BF",
        "lsaquo": "\u2039",
        "lscr": "\uD835\uDCC1",
        "Lscr": "\u2112",
        "lsh": "\u21B0",
        "Lsh": "\u21B0",
        "lsim": "\u2272",
        "lsime": "\u2A8D",
        "lsimg": "\u2A8F",
        "lsqb": "[",
        "lsquo": "\u2018",
        "lsquor": "\u201A",
        "Lstrok": "\u0141",
        "lstrok": "\u0142",
        "ltcc": "\u2AA6",
        "ltcir": "\u2A79",
        "lt": "<",
        "LT": "<",
        "Lt": "\u226A",
        "ltdot": "\u22D6",
        "lthree": "\u22CB",
        "ltimes": "\u22C9",
        "ltlarr": "\u2976",
        "ltquest": "\u2A7B",
        "ltri": "\u25C3",
        "ltrie": "\u22B4",
        "ltrif": "\u25C2",
        "ltrPar": "\u2996",
        "lurdshar": "\u294A",
        "luruhar": "\u2966",
        "lvertneqq": "\u2268\uFE00",
        "lvnE": "\u2268\uFE00",
        "macr": "\u00AF",
        "male": "\u2642",
        "malt": "\u2720",
        "maltese": "\u2720",
        "Map": "\u2905",
        "map": "\u21A6",
        "mapsto": "\u21A6",
        "mapstodown": "\u21A7",
        "mapstoleft": "\u21A4",
        "mapstoup": "\u21A5",
        "marker": "\u25AE",
        "mcomma": "\u2A29",
        "Mcy": "\u041C",
        "mcy": "\u043C",
        "mdash": "\u2014",
        "mDDot": "\u223A",
        "measuredangle": "\u2221",
        "MediumSpace": "\u205F",
        "Mellintrf": "\u2133",
        "Mfr": "\uD835\uDD10",
        "mfr": "\uD835\uDD2A",
        "mho": "\u2127",
        "micro": "\u00B5",
        "midast": "*",
        "midcir": "\u2AF0",
        "mid": "\u2223",
        "middot": "\u00B7",
        "minusb": "\u229F",
        "minus": "\u2212",
        "minusd": "\u2238",
        "minusdu": "\u2A2A",
        "MinusPlus": "\u2213",
        "mlcp": "\u2ADB",
        "mldr": "\u2026",
        "mnplus": "\u2213",
        "models": "\u22A7",
        "Mopf": "\uD835\uDD44",
        "mopf": "\uD835\uDD5E",
        "mp": "\u2213",
        "mscr": "\uD835\uDCC2",
        "Mscr": "\u2133",
        "mstpos": "\u223E",
        "Mu": "\u039C",
        "mu": "\u03BC",
        "multimap": "\u22B8",
        "mumap": "\u22B8",
        "nabla": "\u2207",
        "Nacute": "\u0143",
        "nacute": "\u0144",
        "nang": "\u2220\u20D2",
        "nap": "\u2249",
        "napE": "\u2A70\u0338",
        "napid": "\u224B\u0338",
        "napos": "\u0149",
        "napprox": "\u2249",
        "natural": "\u266E",
        "naturals": "\u2115",
        "natur": "\u266E",
        "nbsp": "\u00A0",
        "nbump": "\u224E\u0338",
        "nbumpe": "\u224F\u0338",
        "ncap": "\u2A43",
        "Ncaron": "\u0147",
        "ncaron": "\u0148",
        "Ncedil": "\u0145",
        "ncedil": "\u0146",
        "ncong": "\u2247",
        "ncongdot": "\u2A6D\u0338",
        "ncup": "\u2A42",
        "Ncy": "\u041D",
        "ncy": "\u043D",
        "ndash": "\u2013",
        "nearhk": "\u2924",
        "nearr": "\u2197",
        "neArr": "\u21D7",
        "nearrow": "\u2197",
        "ne": "\u2260",
        "nedot": "\u2250\u0338",
        "NegativeMediumSpace": "\u200B",
        "NegativeThickSpace": "\u200B",
        "NegativeThinSpace": "\u200B",
        "NegativeVeryThinSpace": "\u200B",
        "nequiv": "\u2262",
        "nesear": "\u2928",
        "nesim": "\u2242\u0338",
        "NestedGreaterGreater": "\u226B",
        "NestedLessLess": "\u226A",
        "NewLine": "\n",
        "nexist": "\u2204",
        "nexists": "\u2204",
        "Nfr": "\uD835\uDD11",
        "nfr": "\uD835\uDD2B",
        "ngE": "\u2267\u0338",
        "nge": "\u2271",
        "ngeq": "\u2271",
        "ngeqq": "\u2267\u0338",
        "ngeqslant": "\u2A7E\u0338",
        "nges": "\u2A7E\u0338",
        "nGg": "\u22D9\u0338",
        "ngsim": "\u2275",
        "nGt": "\u226B\u20D2",
        "ngt": "\u226F",
        "ngtr": "\u226F",
        "nGtv": "\u226B\u0338",
        "nharr": "\u21AE",
        "nhArr": "\u21CE",
        "nhpar": "\u2AF2",
        "ni": "\u220B",
        "nis": "\u22FC",
        "nisd": "\u22FA",
        "niv": "\u220B",
        "NJcy": "\u040A",
        "njcy": "\u045A",
        "nlarr": "\u219A",
        "nlArr": "\u21CD",
        "nldr": "\u2025",
        "nlE": "\u2266\u0338",
        "nle": "\u2270",
        "nleftarrow": "\u219A",
        "nLeftarrow": "\u21CD",
        "nleftrightarrow": "\u21AE",
        "nLeftrightarrow": "\u21CE",
        "nleq": "\u2270",
        "nleqq": "\u2266\u0338",
        "nleqslant": "\u2A7D\u0338",
        "nles": "\u2A7D\u0338",
        "nless": "\u226E",
        "nLl": "\u22D8\u0338",
        "nlsim": "\u2274",
        "nLt": "\u226A\u20D2",
        "nlt": "\u226E",
        "nltri": "\u22EA",
        "nltrie": "\u22EC",
        "nLtv": "\u226A\u0338",
        "nmid": "\u2224",
        "NoBreak": "\u2060",
        "NonBreakingSpace": "\u00A0",
        "nopf": "\uD835\uDD5F",
        "Nopf": "\u2115",
        "Not": "\u2AEC",
        "not": "\u00AC",
        "NotCongruent": "\u2262",
        "NotCupCap": "\u226D",
        "NotDoubleVerticalBar": "\u2226",
        "NotElement": "\u2209",
        "NotEqual": "\u2260",
        "NotEqualTilde": "\u2242\u0338",
        "NotExists": "\u2204",
        "NotGreater": "\u226F",
        "NotGreaterEqual": "\u2271",
        "NotGreaterFullEqual": "\u2267\u0338",
        "NotGreaterGreater": "\u226B\u0338",
        "NotGreaterLess": "\u2279",
        "NotGreaterSlantEqual": "\u2A7E\u0338",
        "NotGreaterTilde": "\u2275",
        "NotHumpDownHump": "\u224E\u0338",
        "NotHumpEqual": "\u224F\u0338",
        "notin": "\u2209",
        "notindot": "\u22F5\u0338",
        "notinE": "\u22F9\u0338",
        "notinva": "\u2209",
        "notinvb": "\u22F7",
        "notinvc": "\u22F6",
        "NotLeftTriangleBar": "\u29CF\u0338",
        "NotLeftTriangle": "\u22EA",
        "NotLeftTriangleEqual": "\u22EC",
        "NotLess": "\u226E",
        "NotLessEqual": "\u2270",
        "NotLessGreater": "\u2278",
        "NotLessLess": "\u226A\u0338",
        "NotLessSlantEqual": "\u2A7D\u0338",
        "NotLessTilde": "\u2274",
        "NotNestedGreaterGreater": "\u2AA2\u0338",
        "NotNestedLessLess": "\u2AA1\u0338",
        "notni": "\u220C",
        "notniva": "\u220C",
        "notnivb": "\u22FE",
        "notnivc": "\u22FD",
        "NotPrecedes": "\u2280",
        "NotPrecedesEqual": "\u2AAF\u0338",
        "NotPrecedesSlantEqual": "\u22E0",
        "NotReverseElement": "\u220C",
        "NotRightTriangleBar": "\u29D0\u0338",
        "NotRightTriangle": "\u22EB",
        "NotRightTriangleEqual": "\u22ED",
        "NotSquareSubset": "\u228F\u0338",
        "NotSquareSubsetEqual": "\u22E2",
        "NotSquareSuperset": "\u2290\u0338",
        "NotSquareSupersetEqual": "\u22E3",
        "NotSubset": "\u2282\u20D2",
        "NotSubsetEqual": "\u2288",
        "NotSucceeds": "\u2281",
        "NotSucceedsEqual": "\u2AB0\u0338",
        "NotSucceedsSlantEqual": "\u22E1",
        "NotSucceedsTilde": "\u227F\u0338",
        "NotSuperset": "\u2283\u20D2",
        "NotSupersetEqual": "\u2289",
        "NotTilde": "\u2241",
        "NotTildeEqual": "\u2244",
        "NotTildeFullEqual": "\u2247",
        "NotTildeTilde": "\u2249",
        "NotVerticalBar": "\u2224",
        "nparallel": "\u2226",
        "npar": "\u2226",
        "nparsl": "\u2AFD\u20E5",
        "npart": "\u2202\u0338",
        "npolint": "\u2A14",
        "npr": "\u2280",
        "nprcue": "\u22E0",
        "nprec": "\u2280",
        "npreceq": "\u2AAF\u0338",
        "npre": "\u2AAF\u0338",
        "nrarrc": "\u2933\u0338",
        "nrarr": "\u219B",
        "nrArr": "\u21CF",
        "nrarrw": "\u219D\u0338",
        "nrightarrow": "\u219B",
        "nRightarrow": "\u21CF",
        "nrtri": "\u22EB",
        "nrtrie": "\u22ED",
        "nsc": "\u2281",
        "nsccue": "\u22E1",
        "nsce": "\u2AB0\u0338",
        "Nscr": "\uD835\uDCA9",
        "nscr": "\uD835\uDCC3",
        "nshortmid": "\u2224",
        "nshortparallel": "\u2226",
        "nsim": "\u2241",
        "nsime": "\u2244",
        "nsimeq": "\u2244",
        "nsmid": "\u2224",
        "nspar": "\u2226",
        "nsqsube": "\u22E2",
        "nsqsupe": "\u22E3",
        "nsub": "\u2284",
        "nsubE": "\u2AC5\u0338",
        "nsube": "\u2288",
        "nsubset": "\u2282\u20D2",
        "nsubseteq": "\u2288",
        "nsubseteqq": "\u2AC5\u0338",
        "nsucc": "\u2281",
        "nsucceq": "\u2AB0\u0338",
        "nsup": "\u2285",
        "nsupE": "\u2AC6\u0338",
        "nsupe": "\u2289",
        "nsupset": "\u2283\u20D2",
        "nsupseteq": "\u2289",
        "nsupseteqq": "\u2AC6\u0338",
        "ntgl": "\u2279",
        "Ntilde": "\u00D1",
        "ntilde": "\u00F1",
        "ntlg": "\u2278",
        "ntriangleleft": "\u22EA",
        "ntrianglelefteq": "\u22EC",
        "ntriangleright": "\u22EB",
        "ntrianglerighteq": "\u22ED",
        "Nu": "\u039D",
        "nu": "\u03BD",
        "num": "#",
        "numero": "\u2116",
        "numsp": "\u2007",
        "nvap": "\u224D\u20D2",
        "nvdash": "\u22AC",
        "nvDash": "\u22AD",
        "nVdash": "\u22AE",
        "nVDash": "\u22AF",
        "nvge": "\u2265\u20D2",
        "nvgt": ">\u20D2",
        "nvHarr": "\u2904",
        "nvinfin": "\u29DE",
        "nvlArr": "\u2902",
        "nvle": "\u2264\u20D2",
        "nvlt": "<\u20D2",
        "nvltrie": "\u22B4\u20D2",
        "nvrArr": "\u2903",
        "nvrtrie": "\u22B5\u20D2",
        "nvsim": "\u223C\u20D2",
        "nwarhk": "\u2923",
        "nwarr": "\u2196",
        "nwArr": "\u21D6",
        "nwarrow": "\u2196",
        "nwnear": "\u2927",
        "Oacute": "\u00D3",
        "oacute": "\u00F3",
        "oast": "\u229B",
        "Ocirc": "\u00D4",
        "ocirc": "\u00F4",
        "ocir": "\u229A",
        "Ocy": "\u041E",
        "ocy": "\u043E",
        "odash": "\u229D",
        "Odblac": "\u0150",
        "odblac": "\u0151",
        "odiv": "\u2A38",
        "odot": "\u2299",
        "odsold": "\u29BC",
        "OElig": "\u0152",
        "oelig": "\u0153",
        "ofcir": "\u29BF",
        "Ofr": "\uD835\uDD12",
        "ofr": "\uD835\uDD2C",
        "ogon": "\u02DB",
        "Ograve": "\u00D2",
        "ograve": "\u00F2",
        "ogt": "\u29C1",
        "ohbar": "\u29B5",
        "ohm": "\u03A9",
        "oint": "\u222E",
        "olarr": "\u21BA",
        "olcir": "\u29BE",
        "olcross": "\u29BB",
        "oline": "\u203E",
        "olt": "\u29C0",
        "Omacr": "\u014C",
        "omacr": "\u014D",
        "Omega": "\u03A9",
        "omega": "\u03C9",
        "Omicron": "\u039F",
        "omicron": "\u03BF",
        "omid": "\u29B6",
        "ominus": "\u2296",
        "Oopf": "\uD835\uDD46",
        "oopf": "\uD835\uDD60",
        "opar": "\u29B7",
        "OpenCurlyDoubleQuote": "\u201C",
        "OpenCurlyQuote": "\u2018",
        "operp": "\u29B9",
        "oplus": "\u2295",
        "orarr": "\u21BB",
        "Or": "\u2A54",
        "or": "\u2228",
        "ord": "\u2A5D",
        "order": "\u2134",
        "orderof": "\u2134",
        "ordf": "\u00AA",
        "ordm": "\u00BA",
        "origof": "\u22B6",
        "oror": "\u2A56",
        "orslope": "\u2A57",
        "orv": "\u2A5B",
        "oS": "\u24C8",
        "Oscr": "\uD835\uDCAA",
        "oscr": "\u2134",
        "Oslash": "\u00D8",
        "oslash": "\u00F8",
        "osol": "\u2298",
        "Otilde": "\u00D5",
        "otilde": "\u00F5",
        "otimesas": "\u2A36",
        "Otimes": "\u2A37",
        "otimes": "\u2297",
        "Ouml": "\u00D6",
        "ouml": "\u00F6",
        "ovbar": "\u233D",
        "OverBar": "\u203E",
        "OverBrace": "\u23DE",
        "OverBracket": "\u23B4",
        "OverParenthesis": "\u23DC",
        "para": "\u00B6",
        "parallel": "\u2225",
        "par": "\u2225",
        "parsim": "\u2AF3",
        "parsl": "\u2AFD",
        "part": "\u2202",
        "PartialD": "\u2202",
        "Pcy": "\u041F",
        "pcy": "\u043F",
        "percnt": "%",
        "period": ".",
        "permil": "\u2030",
        "perp": "\u22A5",
        "pertenk": "\u2031",
        "Pfr": "\uD835\uDD13",
        "pfr": "\uD835\uDD2D",
        "Phi": "\u03A6",
        "phi": "\u03C6",
        "phiv": "\u03D5",
        "phmmat": "\u2133",
        "phone": "\u260E",
        "Pi": "\u03A0",
        "pi": "\u03C0",
        "pitchfork": "\u22D4",
        "piv": "\u03D6",
        "planck": "\u210F",
        "planckh": "\u210E",
        "plankv": "\u210F",
        "plusacir": "\u2A23",
        "plusb": "\u229E",
        "pluscir": "\u2A22",
        "plus": "+",
        "plusdo": "\u2214",
        "plusdu": "\u2A25",
        "pluse": "\u2A72",
        "PlusMinus": "\u00B1",
        "plusmn": "\u00B1",
        "plussim": "\u2A26",
        "plustwo": "\u2A27",
        "pm": "\u00B1",
        "Poincareplane": "\u210C",
        "pointint": "\u2A15",
        "popf": "\uD835\uDD61",
        "Popf": "\u2119",
        "pound": "\u00A3",
        "prap": "\u2AB7",
        "Pr": "\u2ABB",
        "pr": "\u227A",
        "prcue": "\u227C",
        "precapprox": "\u2AB7",
        "prec": "\u227A",
        "preccurlyeq": "\u227C",
        "Precedes": "\u227A",
        "PrecedesEqual": "\u2AAF",
        "PrecedesSlantEqual": "\u227C",
        "PrecedesTilde": "\u227E",
        "preceq": "\u2AAF",
        "precnapprox": "\u2AB9",
        "precneqq": "\u2AB5",
        "precnsim": "\u22E8",
        "pre": "\u2AAF",
        "prE": "\u2AB3",
        "precsim": "\u227E",
        "prime": "\u2032",
        "Prime": "\u2033",
        "primes": "\u2119",
        "prnap": "\u2AB9",
        "prnE": "\u2AB5",
        "prnsim": "\u22E8",
        "prod": "\u220F",
        "Product": "\u220F",
        "profalar": "\u232E",
        "profline": "\u2312",
        "profsurf": "\u2313",
        "prop": "\u221D",
        "Proportional": "\u221D",
        "Proportion": "\u2237",
        "propto": "\u221D",
        "prsim": "\u227E",
        "prurel": "\u22B0",
        "Pscr": "\uD835\uDCAB",
        "pscr": "\uD835\uDCC5",
        "Psi": "\u03A8",
        "psi": "\u03C8",
        "puncsp": "\u2008",
        "Qfr": "\uD835\uDD14",
        "qfr": "\uD835\uDD2E",
        "qint": "\u2A0C",
        "qopf": "\uD835\uDD62",
        "Qopf": "\u211A",
        "qprime": "\u2057",
        "Qscr": "\uD835\uDCAC",
        "qscr": "\uD835\uDCC6",
        "quaternions": "\u210D",
        "quatint": "\u2A16",
        "quest": "?",
        "questeq": "\u225F",
        "quot": "\"",
        "QUOT": "\"",
        "rAarr": "\u21DB",
        "race": "\u223D\u0331",
        "Racute": "\u0154",
        "racute": "\u0155",
        "radic": "\u221A",
        "raemptyv": "\u29B3",
        "rang": "\u27E9",
        "Rang": "\u27EB",
        "rangd": "\u2992",
        "range": "\u29A5",
        "rangle": "\u27E9",
        "raquo": "\u00BB",
        "rarrap": "\u2975",
        "rarrb": "\u21E5",
        "rarrbfs": "\u2920",
        "rarrc": "\u2933",
        "rarr": "\u2192",
        "Rarr": "\u21A0",
        "rArr": "\u21D2",
        "rarrfs": "\u291E",
        "rarrhk": "\u21AA",
        "rarrlp": "\u21AC",
        "rarrpl": "\u2945",
        "rarrsim": "\u2974",
        "Rarrtl": "\u2916",
        "rarrtl": "\u21A3",
        "rarrw": "\u219D",
        "ratail": "\u291A",
        "rAtail": "\u291C",
        "ratio": "\u2236",
        "rationals": "\u211A",
        "rbarr": "\u290D",
        "rBarr": "\u290F",
        "RBarr": "\u2910",
        "rbbrk": "\u2773",
        "rbrace": "}",
        "rbrack": "]",
        "rbrke": "\u298C",
        "rbrksld": "\u298E",
        "rbrkslu": "\u2990",
        "Rcaron": "\u0158",
        "rcaron": "\u0159",
        "Rcedil": "\u0156",
        "rcedil": "\u0157",
        "rceil": "\u2309",
        "rcub": "}",
        "Rcy": "\u0420",
        "rcy": "\u0440",
        "rdca": "\u2937",
        "rdldhar": "\u2969",
        "rdquo": "\u201D",
        "rdquor": "\u201D",
        "rdsh": "\u21B3",
        "real": "\u211C",
        "realine": "\u211B",
        "realpart": "\u211C",
        "reals": "\u211D",
        "Re": "\u211C",
        "rect": "\u25AD",
        "reg": "\u00AE",
        "REG": "\u00AE",
        "ReverseElement": "\u220B",
        "ReverseEquilibrium": "\u21CB",
        "ReverseUpEquilibrium": "\u296F",
        "rfisht": "\u297D",
        "rfloor": "\u230B",
        "rfr": "\uD835\uDD2F",
        "Rfr": "\u211C",
        "rHar": "\u2964",
        "rhard": "\u21C1",
        "rharu": "\u21C0",
        "rharul": "\u296C",
        "Rho": "\u03A1",
        "rho": "\u03C1",
        "rhov": "\u03F1",
        "RightAngleBracket": "\u27E9",
        "RightArrowBar": "\u21E5",
        "rightarrow": "\u2192",
        "RightArrow": "\u2192",
        "Rightarrow": "\u21D2",
        "RightArrowLeftArrow": "\u21C4",
        "rightarrowtail": "\u21A3",
        "RightCeiling": "\u2309",
        "RightDoubleBracket": "\u27E7",
        "RightDownTeeVector": "\u295D",
        "RightDownVectorBar": "\u2955",
        "RightDownVector": "\u21C2",
        "RightFloor": "\u230B",
        "rightharpoondown": "\u21C1",
        "rightharpoonup": "\u21C0",
        "rightleftarrows": "\u21C4",
        "rightleftharpoons": "\u21CC",
        "rightrightarrows": "\u21C9",
        "rightsquigarrow": "\u219D",
        "RightTeeArrow": "\u21A6",
        "RightTee": "\u22A2",
        "RightTeeVector": "\u295B",
        "rightthreetimes": "\u22CC",
        "RightTriangleBar": "\u29D0",
        "RightTriangle": "\u22B3",
        "RightTriangleEqual": "\u22B5",
        "RightUpDownVector": "\u294F",
        "RightUpTeeVector": "\u295C",
        "RightUpVectorBar": "\u2954",
        "RightUpVector": "\u21BE",
        "RightVectorBar": "\u2953",
        "RightVector": "\u21C0",
        "ring": "\u02DA",
        "risingdotseq": "\u2253",
        "rlarr": "\u21C4",
        "rlhar": "\u21CC",
        "rlm": "\u200F",
        "rmoustache": "\u23B1",
        "rmoust": "\u23B1",
        "rnmid": "\u2AEE",
        "roang": "\u27ED",
        "roarr": "\u21FE",
        "robrk": "\u27E7",
        "ropar": "\u2986",
        "ropf": "\uD835\uDD63",
        "Ropf": "\u211D",
        "roplus": "\u2A2E",
        "rotimes": "\u2A35",
        "RoundImplies": "\u2970",
        "rpar": ")",
        "rpargt": "\u2994",
        "rppolint": "\u2A12",
        "rrarr": "\u21C9",
        "Rrightarrow": "\u21DB",
        "rsaquo": "\u203A",
        "rscr": "\uD835\uDCC7",
        "Rscr": "\u211B",
        "rsh": "\u21B1",
        "Rsh": "\u21B1",
        "rsqb": "]",
        "rsquo": "\u2019",
        "rsquor": "\u2019",
        "rthree": "\u22CC",
        "rtimes": "\u22CA",
        "rtri": "\u25B9",
        "rtrie": "\u22B5",
        "rtrif": "\u25B8",
        "rtriltri": "\u29CE",
        "RuleDelayed": "\u29F4",
        "ruluhar": "\u2968",
        "rx": "\u211E",
        "Sacute": "\u015A",
        "sacute": "\u015B",
        "sbquo": "\u201A",
        "scap": "\u2AB8",
        "Scaron": "\u0160",
        "scaron": "\u0161",
        "Sc": "\u2ABC",
        "sc": "\u227B",
        "sccue": "\u227D",
        "sce": "\u2AB0",
        "scE": "\u2AB4",
        "Scedil": "\u015E",
        "scedil": "\u015F",
        "Scirc": "\u015C",
        "scirc": "\u015D",
        "scnap": "\u2ABA",
        "scnE": "\u2AB6",
        "scnsim": "\u22E9",
        "scpolint": "\u2A13",
        "scsim": "\u227F",
        "Scy": "\u0421",
        "scy": "\u0441",
        "sdotb": "\u22A1",
        "sdot": "\u22C5",
        "sdote": "\u2A66",
        "searhk": "\u2925",
        "searr": "\u2198",
        "seArr": "\u21D8",
        "searrow": "\u2198",
        "sect": "\u00A7",
        "semi": ";",
        "seswar": "\u2929",
        "setminus": "\u2216",
        "setmn": "\u2216",
        "sext": "\u2736",
        "Sfr": "\uD835\uDD16",
        "sfr": "\uD835\uDD30",
        "sfrown": "\u2322",
        "sharp": "\u266F",
        "SHCHcy": "\u0429",
        "shchcy": "\u0449",
        "SHcy": "\u0428",
        "shcy": "\u0448",
        "ShortDownArrow": "\u2193",
        "ShortLeftArrow": "\u2190",
        "shortmid": "\u2223",
        "shortparallel": "\u2225",
        "ShortRightArrow": "\u2192",
        "ShortUpArrow": "\u2191",
        "shy": "\u00AD",
        "Sigma": "\u03A3",
        "sigma": "\u03C3",
        "sigmaf": "\u03C2",
        "sigmav": "\u03C2",
        "sim": "\u223C",
        "simdot": "\u2A6A",
        "sime": "\u2243",
        "simeq": "\u2243",
        "simg": "\u2A9E",
        "simgE": "\u2AA0",
        "siml": "\u2A9D",
        "simlE": "\u2A9F",
        "simne": "\u2246",
        "simplus": "\u2A24",
        "simrarr": "\u2972",
        "slarr": "\u2190",
        "SmallCircle": "\u2218",
        "smallsetminus": "\u2216",
        "smashp": "\u2A33",
        "smeparsl": "\u29E4",
        "smid": "\u2223",
        "smile": "\u2323",
        "smt": "\u2AAA",
        "smte": "\u2AAC",
        "smtes": "\u2AAC\uFE00",
        "SOFTcy": "\u042C",
        "softcy": "\u044C",
        "solbar": "\u233F",
        "solb": "\u29C4",
        "sol": "/",
        "Sopf": "\uD835\uDD4A",
        "sopf": "\uD835\uDD64",
        "spades": "\u2660",
        "spadesuit": "\u2660",
        "spar": "\u2225",
        "sqcap": "\u2293",
        "sqcaps": "\u2293\uFE00",
        "sqcup": "\u2294",
        "sqcups": "\u2294\uFE00",
        "Sqrt": "\u221A",
        "sqsub": "\u228F",
        "sqsube": "\u2291",
        "sqsubset": "\u228F",
        "sqsubseteq": "\u2291",
        "sqsup": "\u2290",
        "sqsupe": "\u2292",
        "sqsupset": "\u2290",
        "sqsupseteq": "\u2292",
        "square": "\u25A1",
        "Square": "\u25A1",
        "SquareIntersection": "\u2293",
        "SquareSubset": "\u228F",
        "SquareSubsetEqual": "\u2291",
        "SquareSuperset": "\u2290",
        "SquareSupersetEqual": "\u2292",
        "SquareUnion": "\u2294",
        "squarf": "\u25AA",
        "squ": "\u25A1",
        "squf": "\u25AA",
        "srarr": "\u2192",
        "Sscr": "\uD835\uDCAE",
        "sscr": "\uD835\uDCC8",
        "ssetmn": "\u2216",
        "ssmile": "\u2323",
        "sstarf": "\u22C6",
        "Star": "\u22C6",
        "star": "\u2606",
        "starf": "\u2605",
        "straightepsilon": "\u03F5",
        "straightphi": "\u03D5",
        "strns": "\u00AF",
        "sub": "\u2282",
        "Sub": "\u22D0",
        "subdot": "\u2ABD",
        "subE": "\u2AC5",
        "sube": "\u2286",
        "subedot": "\u2AC3",
        "submult": "\u2AC1",
        "subnE": "\u2ACB",
        "subne": "\u228A",
        "subplus": "\u2ABF",
        "subrarr": "\u2979",
        "subset": "\u2282",
        "Subset": "\u22D0",
        "subseteq": "\u2286",
        "subseteqq": "\u2AC5",
        "SubsetEqual": "\u2286",
        "subsetneq": "\u228A",
        "subsetneqq": "\u2ACB",
        "subsim": "\u2AC7",
        "subsub": "\u2AD5",
        "subsup": "\u2AD3",
        "succapprox": "\u2AB8",
        "succ": "\u227B",
        "succcurlyeq": "\u227D",
        "Succeeds": "\u227B",
        "SucceedsEqual": "\u2AB0",
        "SucceedsSlantEqual": "\u227D",
        "SucceedsTilde": "\u227F",
        "succeq": "\u2AB0",
        "succnapprox": "\u2ABA",
        "succneqq": "\u2AB6",
        "succnsim": "\u22E9",
        "succsim": "\u227F",
        "SuchThat": "\u220B",
        "sum": "\u2211",
        "Sum": "\u2211",
        "sung": "\u266A",
        "sup1": "\u00B9",
        "sup2": "\u00B2",
        "sup3": "\u00B3",
        "sup": "\u2283",
        "Sup": "\u22D1",
        "supdot": "\u2ABE",
        "supdsub": "\u2AD8",
        "supE": "\u2AC6",
        "supe": "\u2287",
        "supedot": "\u2AC4",
        "Superset": "\u2283",
        "SupersetEqual": "\u2287",
        "suphsol": "\u27C9",
        "suphsub": "\u2AD7",
        "suplarr": "\u297B",
        "supmult": "\u2AC2",
        "supnE": "\u2ACC",
        "supne": "\u228B",
        "supplus": "\u2AC0",
        "supset": "\u2283",
        "Supset": "\u22D1",
        "supseteq": "\u2287",
        "supseteqq": "\u2AC6",
        "supsetneq": "\u228B",
        "supsetneqq": "\u2ACC",
        "supsim": "\u2AC8",
        "supsub": "\u2AD4",
        "supsup": "\u2AD6",
        "swarhk": "\u2926",
        "swarr": "\u2199",
        "swArr": "\u21D9",
        "swarrow": "\u2199",
        "swnwar": "\u292A",
        "szlig": "\u00DF",
        "Tab": "\t",
        "target": "\u2316",
        "Tau": "\u03A4",
        "tau": "\u03C4",
        "tbrk": "\u23B4",
        "Tcaron": "\u0164",
        "tcaron": "\u0165",
        "Tcedil": "\u0162",
        "tcedil": "\u0163",
        "Tcy": "\u0422",
        "tcy": "\u0442",
        "tdot": "\u20DB",
        "telrec": "\u2315",
        "Tfr": "\uD835\uDD17",
        "tfr": "\uD835\uDD31",
        "there4": "\u2234",
        "therefore": "\u2234",
        "Therefore": "\u2234",
        "Theta": "\u0398",
        "theta": "\u03B8",
        "thetasym": "\u03D1",
        "thetav": "\u03D1",
        "thickapprox": "\u2248",
        "thicksim": "\u223C",
        "ThickSpace": "\u205F\u200A",
        "ThinSpace": "\u2009",
        "thinsp": "\u2009",
        "thkap": "\u2248",
        "thksim": "\u223C",
        "THORN": "\u00DE",
        "thorn": "\u00FE",
        "tilde": "\u02DC",
        "Tilde": "\u223C",
        "TildeEqual": "\u2243",
        "TildeFullEqual": "\u2245",
        "TildeTilde": "\u2248",
        "timesbar": "\u2A31",
        "timesb": "\u22A0",
        "times": "\u00D7",
        "timesd": "\u2A30",
        "tint": "\u222D",
        "toea": "\u2928",
        "topbot": "\u2336",
        "topcir": "\u2AF1",
        "top": "\u22A4",
        "Topf": "\uD835\uDD4B",
        "topf": "\uD835\uDD65",
        "topfork": "\u2ADA",
        "tosa": "\u2929",
        "tprime": "\u2034",
        "trade": "\u2122",
        "TRADE": "\u2122",
        "triangle": "\u25B5",
        "triangledown": "\u25BF",
        "triangleleft": "\u25C3",
        "trianglelefteq": "\u22B4",
        "triangleq": "\u225C",
        "triangleright": "\u25B9",
        "trianglerighteq": "\u22B5",
        "tridot": "\u25EC",
        "trie": "\u225C",
        "triminus": "\u2A3A",
        "TripleDot": "\u20DB",
        "triplus": "\u2A39",
        "trisb": "\u29CD",
        "tritime": "\u2A3B",
        "trpezium": "\u23E2",
        "Tscr": "\uD835\uDCAF",
        "tscr": "\uD835\uDCC9",
        "TScy": "\u0426",
        "tscy": "\u0446",
        "TSHcy": "\u040B",
        "tshcy": "\u045B",
        "Tstrok": "\u0166",
        "tstrok": "\u0167",
        "twixt": "\u226C",
        "twoheadleftarrow": "\u219E",
        "twoheadrightarrow": "\u21A0",
        "Uacute": "\u00DA",
        "uacute": "\u00FA",
        "uarr": "\u2191",
        "Uarr": "\u219F",
        "uArr": "\u21D1",
        "Uarrocir": "\u2949",
        "Ubrcy": "\u040E",
        "ubrcy": "\u045E",
        "Ubreve": "\u016C",
        "ubreve": "\u016D",
        "Ucirc": "\u00DB",
        "ucirc": "\u00FB",
        "Ucy": "\u0423",
        "ucy": "\u0443",
        "udarr": "\u21C5",
        "Udblac": "\u0170",
        "udblac": "\u0171",
        "udhar": "\u296E",
        "ufisht": "\u297E",
        "Ufr": "\uD835\uDD18",
        "ufr": "\uD835\uDD32",
        "Ugrave": "\u00D9",
        "ugrave": "\u00F9",
        "uHar": "\u2963",
        "uharl": "\u21BF",
        "uharr": "\u21BE",
        "uhblk": "\u2580",
        "ulcorn": "\u231C",
        "ulcorner": "\u231C",
        "ulcrop": "\u230F",
        "ultri": "\u25F8",
        "Umacr": "\u016A",
        "umacr": "\u016B",
        "uml": "\u00A8",
        "UnderBar": "_",
        "UnderBrace": "\u23DF",
        "UnderBracket": "\u23B5",
        "UnderParenthesis": "\u23DD",
        "Union": "\u22C3",
        "UnionPlus": "\u228E",
        "Uogon": "\u0172",
        "uogon": "\u0173",
        "Uopf": "\uD835\uDD4C",
        "uopf": "\uD835\uDD66",
        "UpArrowBar": "\u2912",
        "uparrow": "\u2191",
        "UpArrow": "\u2191",
        "Uparrow": "\u21D1",
        "UpArrowDownArrow": "\u21C5",
        "updownarrow": "\u2195",
        "UpDownArrow": "\u2195",
        "Updownarrow": "\u21D5",
        "UpEquilibrium": "\u296E",
        "upharpoonleft": "\u21BF",
        "upharpoonright": "\u21BE",
        "uplus": "\u228E",
        "UpperLeftArrow": "\u2196",
        "UpperRightArrow": "\u2197",
        "upsi": "\u03C5",
        "Upsi": "\u03D2",
        "upsih": "\u03D2",
        "Upsilon": "\u03A5",
        "upsilon": "\u03C5",
        "UpTeeArrow": "\u21A5",
        "UpTee": "\u22A5",
        "upuparrows": "\u21C8",
        "urcorn": "\u231D",
        "urcorner": "\u231D",
        "urcrop": "\u230E",
        "Uring": "\u016E",
        "uring": "\u016F",
        "urtri": "\u25F9",
        "Uscr": "\uD835\uDCB0",
        "uscr": "\uD835\uDCCA",
        "utdot": "\u22F0",
        "Utilde": "\u0168",
        "utilde": "\u0169",
        "utri": "\u25B5",
        "utrif": "\u25B4",
        "uuarr": "\u21C8",
        "Uuml": "\u00DC",
        "uuml": "\u00FC",
        "uwangle": "\u29A7",
        "vangrt": "\u299C",
        "varepsilon": "\u03F5",
        "varkappa": "\u03F0",
        "varnothing": "\u2205",
        "varphi": "\u03D5",
        "varpi": "\u03D6",
        "varpropto": "\u221D",
        "varr": "\u2195",
        "vArr": "\u21D5",
        "varrho": "\u03F1",
        "varsigma": "\u03C2",
        "varsubsetneq": "\u228A\uFE00",
        "varsubsetneqq": "\u2ACB\uFE00",
        "varsupsetneq": "\u228B\uFE00",
        "varsupsetneqq": "\u2ACC\uFE00",
        "vartheta": "\u03D1",
        "vartriangleleft": "\u22B2",
        "vartriangleright": "\u22B3",
        "vBar": "\u2AE8",
        "Vbar": "\u2AEB",
        "vBarv": "\u2AE9",
        "Vcy": "\u0412",
        "vcy": "\u0432",
        "vdash": "\u22A2",
        "vDash": "\u22A8",
        "Vdash": "\u22A9",
        "VDash": "\u22AB",
        "Vdashl": "\u2AE6",
        "veebar": "\u22BB",
        "vee": "\u2228",
        "Vee": "\u22C1",
        "veeeq": "\u225A",
        "vellip": "\u22EE",
        "verbar": "|",
        "Verbar": "\u2016",
        "vert": "|",
        "Vert": "\u2016",
        "VerticalBar": "\u2223",
        "VerticalLine": "|",
        "VerticalSeparator": "\u2758",
        "VerticalTilde": "\u2240",
        "VeryThinSpace": "\u200A",
        "Vfr": "\uD835\uDD19",
        "vfr": "\uD835\uDD33",
        "vltri": "\u22B2",
        "vnsub": "\u2282\u20D2",
        "vnsup": "\u2283\u20D2",
        "Vopf": "\uD835\uDD4D",
        "vopf": "\uD835\uDD67",
        "vprop": "\u221D",
        "vrtri": "\u22B3",
        "Vscr": "\uD835\uDCB1",
        "vscr": "\uD835\uDCCB",
        "vsubnE": "\u2ACB\uFE00",
        "vsubne": "\u228A\uFE00",
        "vsupnE": "\u2ACC\uFE00",
        "vsupne": "\u228B\uFE00",
        "Vvdash": "\u22AA",
        "vzigzag": "\u299A",
        "Wcirc": "\u0174",
        "wcirc": "\u0175",
        "wedbar": "\u2A5F",
        "wedge": "\u2227",
        "Wedge": "\u22C0",
        "wedgeq": "\u2259",
        "weierp": "\u2118",
        "Wfr": "\uD835\uDD1A",
        "wfr": "\uD835\uDD34",
        "Wopf": "\uD835\uDD4E",
        "wopf": "\uD835\uDD68",
        "wp": "\u2118",
        "wr": "\u2240",
        "wreath": "\u2240",
        "Wscr": "\uD835\uDCB2",
        "wscr": "\uD835\uDCCC",
        "xcap": "\u22C2",
        "xcirc": "\u25EF",
        "xcup": "\u22C3",
        "xdtri": "\u25BD",
        "Xfr": "\uD835\uDD1B",
        "xfr": "\uD835\uDD35",
        "xharr": "\u27F7",
        "xhArr": "\u27FA",
        "Xi": "\u039E",
        "xi": "\u03BE",
        "xlarr": "\u27F5",
        "xlArr": "\u27F8",
        "xmap": "\u27FC",
        "xnis": "\u22FB",
        "xodot": "\u2A00",
        "Xopf": "\uD835\uDD4F",
        "xopf": "\uD835\uDD69",
        "xoplus": "\u2A01",
        "xotime": "\u2A02",
        "xrarr": "\u27F6",
        "xrArr": "\u27F9",
        "Xscr": "\uD835\uDCB3",
        "xscr": "\uD835\uDCCD",
        "xsqcup": "\u2A06",
        "xuplus": "\u2A04",
        "xutri": "\u25B3",
        "xvee": "\u22C1",
        "xwedge": "\u22C0",
        "Yacute": "\u00DD",
        "yacute": "\u00FD",
        "YAcy": "\u042F",
        "yacy": "\u044F",
        "Ycirc": "\u0176",
        "ycirc": "\u0177",
        "Ycy": "\u042B",
        "ycy": "\u044B",
        "yen": "\u00A5",
        "Yfr": "\uD835\uDD1C",
        "yfr": "\uD835\uDD36",
        "YIcy": "\u0407",
        "yicy": "\u0457",
        "Yopf": "\uD835\uDD50",
        "yopf": "\uD835\uDD6A",
        "Yscr": "\uD835\uDCB4",
        "yscr": "\uD835\uDCCE",
        "YUcy": "\u042E",
        "yucy": "\u044E",
        "yuml": "\u00FF",
        "Yuml": "\u0178",
        "Zacute": "\u0179",
        "zacute": "\u017A",
        "Zcaron": "\u017D",
        "zcaron": "\u017E",
        "Zcy": "\u0417",
        "zcy": "\u0437",
        "Zdot": "\u017B",
        "zdot": "\u017C",
        "zeetrf": "\u2128",
        "ZeroWidthSpace": "\u200B",
        "Zeta": "\u0396",
        "zeta": "\u03B6",
        "zfr": "\uD835\uDD37",
        "Zfr": "\u2128",
        "ZHcy": "\u0416",
        "zhcy": "\u0436",
        "zigrarr": "\u21DD",
        "zopf": "\uD835\uDD6B",
        "Zopf": "\u2124",
        "Zscr": "\uD835\uDCB5",
        "zscr": "\uD835\uDCCF",
        "zwj": "\u200D",
        "zwnj": "\u200C"
      }
    }, {}],
    99: [function (require, module, exports) {
      'use strict';


      ////////////////////////////////////////////////////////////////////////////////
      // Helpers

      // Merge objects
      //
      function assign(obj /*from1, from2, from3, ...*/ ) {
        var sources = Array.prototype.slice.call(arguments, 1);

        sources.forEach(function (source) {
          if (!source) {
            return;
          }

          Object.keys(source).forEach(function (key) {
            obj[key] = source[key];
          });
        });

        return obj;
      }

      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }

      function isString(obj) {
        return _class(obj) === '[object String]';
      }

      function isObject(obj) {
        return _class(obj) === '[object Object]';
      }

      function isRegExp(obj) {
        return _class(obj) === '[object RegExp]';
      }

      function isFunction(obj) {
        return _class(obj) === '[object Function]';
      }


      function escapeRE(str) {
        return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
      }

      ////////////////////////////////////////////////////////////////////////////////


      var defaultOptions = {
        fuzzyLink: true,
        fuzzyEmail: true,
        fuzzyIP: false
      };


      function isOptionsObj(obj) {
        return Object.keys(obj || {}).reduce(function (acc, k) {
          return acc || defaultOptions.hasOwnProperty(k);
        }, false);
      }


      var defaultSchemas = {
        'http:': {
          validate: function (text, pos, self) {
            var tail = text.slice(pos);

            if (!self.re.http) {
              // compile lazily, because "host"-containing variables can change on tlds update.
              self.re.http = new RegExp(
                '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
              );
            }
            if (self.re.http.test(tail)) {
              return tail.match(self.re.http)[0].length;
            }
            return 0;
          }
        },
        'https:': 'http:',
        'ftp:': 'http:',
        '//': {
          validate: function (text, pos, self) {
            var tail = text.slice(pos);

            if (!self.re.no_http) {
              // compile lazily, because "host"-containing variables can change on tlds update.
              self.re.no_http = new RegExp(
                '^' +
                self.re.src_auth +
                // Don't allow single-level domains, because of false positives like '//test'
                // with code comments
                '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' +
                self.re.src_port +
                self.re.src_host_terminator +
                self.re.src_path,

                'i'
              );
            }

            if (self.re.no_http.test(tail)) {
              // should not be `://` & `///`, that protects from errors in protocol name
              if (pos >= 3 && text[pos - 3] === ':') {
                return 0;
              }
              if (pos >= 3 && text[pos - 3] === '/') {
                return 0;
              }
              return tail.match(self.re.no_http)[0].length;
            }
            return 0;
          }
        },
        'mailto:': {
          validate: function (text, pos, self) {
            var tail = text.slice(pos);

            if (!self.re.mailto) {
              self.re.mailto = new RegExp(
                '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
              );
            }
            if (self.re.mailto.test(tail)) {
              return tail.match(self.re.mailto)[0].length;
            }
            return 0;
          }
        }
      };

      /*eslint-disable max-len*/

      // RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
      var tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

      // DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
      var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');

      /*eslint-enable max-len*/

      ////////////////////////////////////////////////////////////////////////////////

      function resetScanCache(self) {
        self.__index__ = -1;
        self.__text_cache__ = '';
      }

      function createValidator(re) {
        return function (text, pos) {
          var tail = text.slice(pos);

          if (re.test(tail)) {
            return tail.match(re)[0].length;
          }
          return 0;
        };
      }

      function createNormalizer() {
        return function (match, self) {
          self.normalize(match);
        };
      }

      // Schemas compiler. Build regexps.
      //
      function compile(self) {

        // Load & clone RE patterns.
        var re = self.re = assign({}, require('./lib/re'));

        // Define dynamic patterns
        var tlds = self.__tlds__.slice();

        if (!self.__tlds_replaced__) {
          tlds.push(tlds_2ch_src_re);
        }
        tlds.push(re.src_xn);

        re.src_tlds = tlds.join('|');

        function untpl(tpl) {
          return tpl.replace('%TLDS%', re.src_tlds);
        }

        re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), 'i');
        re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), 'i');
        re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
        re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');

        //
        // Compile each schema
        //

        var aliases = [];

        self.__compiled__ = {}; // Reset compiled data

        function schemaError(name, val) {
          throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
        }

        Object.keys(self.__schemas__).forEach(function (name) {
          var val = self.__schemas__[name];

          // skip disabled methods
          if (val === null) {
            return;
          }

          var compiled = {
            validate: null,
            link: null
          };

          self.__compiled__[name] = compiled;

          if (isObject(val)) {
            if (isRegExp(val.validate)) {
              compiled.validate = createValidator(val.validate);
            } else if (isFunction(val.validate)) {
              compiled.validate = val.validate;
            } else {
              schemaError(name, val);
            }

            if (isFunction(val.normalize)) {
              compiled.normalize = val.normalize;
            } else if (!val.normalize) {
              compiled.normalize = createNormalizer();
            } else {
              schemaError(name, val);
            }

            return;
          }

          if (isString(val)) {
            aliases.push(name);
            return;
          }

          schemaError(name, val);
        });

        //
        // Compile postponed aliases
        //

        aliases.forEach(function (alias) {
          if (!self.__compiled__[self.__schemas__[alias]]) {
            // Silently fail on missed schemas to avoid errons on disable.
            // schemaError(alias, self.__schemas__[alias]);
            return;
          }

          self.__compiled__[alias].validate =
            self.__compiled__[self.__schemas__[alias]].validate;
          self.__compiled__[alias].normalize =
            self.__compiled__[self.__schemas__[alias]].normalize;
        });

        //
        // Fake record for guessed links
        //
        self.__compiled__[''] = {
          validate: null,
          normalize: createNormalizer()
        };

        //
        // Build schema condition
        //
        var slist = Object.keys(self.__compiled__)
          .filter(function (name) {
            // Filter disabled & fake schemas
            return name.length > 0 && self.__compiled__[name];
          })
          .map(escapeRE)
          .join('|');
        // (?!_) cause 1.5x slowdown
        self.re.schema_test = RegExp('(^|(?!_)(?:[><]|' + re.src_ZPCc + '))(' + slist + ')', 'i');
        self.re.schema_search = RegExp('(^|(?!_)(?:[><]|' + re.src_ZPCc + '))(' + slist + ')', 'ig');

        self.re.pretest = RegExp(
          '(' + self.re.schema_test.source + ')|' +
          '(' + self.re.host_fuzzy_test.source + ')|' +
          '@',
          'i');

        //
        // Cleanup
        //

        resetScanCache(self);
      }

      /**
       * class Match
       *
       * Match result. Single element of array, returned by [[LinkifyIt#match]]
       **/
      function Match(self, shift) {
        var start = self.__index__,
          end = self.__last_index__,
          text = self.__text_cache__.slice(start, end);

        /**
         * Match#schema -> String
         *
         * Prefix (protocol) for matched string.
         **/
        this.schema = self.__schema__.toLowerCase();
        /**
         * Match#index -> Number
         *
         * First position of matched string.
         **/
        this.index = start + shift;
        /**
         * Match#lastIndex -> Number
         *
         * Next position after matched string.
         **/
        this.lastIndex = end + shift;
        /**
         * Match#raw -> String
         *
         * Matched string.
         **/
        this.raw = text;
        /**
         * Match#text -> String
         *
         * Notmalized text of matched string.
         **/
        this.text = text;
        /**
         * Match#url -> String
         *
         * Normalized url of matched string.
         **/
        this.url = text;
      }

      function createMatch(self, shift) {
        var match = new Match(self, shift);

        self.__compiled__[match.schema].normalize(match, self);

        return match;
      }


      /**
       * class LinkifyIt
       **/

      /**
       * new LinkifyIt(schemas, options)
       * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
       * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
       *
       * Creates new linkifier instance with optional additional schemas.
       * Can be called without `new` keyword for convenience.
       *
       * By default understands:
       *
       * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
       * - "fuzzy" links and emails (example.com, foo@bar.com).
       *
       * `schemas` is an object, where each key/value describes protocol/rule:
       *
       * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
       *   for example). `linkify-it` makes shure that prefix is not preceeded with
       *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
       * - __value__ - rule to check tail after link prefix
       *   - _String_ - just alias to existing rule
       *   - _Object_
       *     - _validate_ - validator function (should return matched length on success),
       *       or `RegExp`.
       *     - _normalize_ - optional function to normalize text & url of matched result
       *       (for example, for @twitter mentions).
       *
       * `options`:
       *
       * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
       * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
       *   like version numbers. Default `false`.
       * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
       *
       **/
      function LinkifyIt(schemas, options) {
        if (!(this instanceof LinkifyIt)) {
          return new LinkifyIt(schemas, options);
        }

        if (!options) {
          if (isOptionsObj(schemas)) {
            options = schemas;
            schemas = {};
          }
        }

        this.__opts__ = assign({}, defaultOptions, options);

        // Cache last tested result. Used to skip repeating steps on next `match` call.
        this.__index__ = -1;
        this.__last_index__ = -1; // Next scan position
        this.__schema__ = '';
        this.__text_cache__ = '';

        this.__schemas__ = assign({}, defaultSchemas, schemas);
        this.__compiled__ = {};

        this.__tlds__ = tlds_default;
        this.__tlds_replaced__ = false;

        this.re = {};

        compile(this);
      }


      /** chainable
       * LinkifyIt#add(schema, definition)
       * - schema (String): rule name (fixed pattern prefix)
       * - definition (String|RegExp|Object): schema definition
       *
       * Add new rule definition. See constructor description for details.
       **/
      LinkifyIt.prototype.add = function add(schema, definition) {
        this.__schemas__[schema] = definition;
        compile(this);
        return this;
      };


      /** chainable
       * LinkifyIt#set(options)
       * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
       *
       * Set recognition options for links without schema.
       **/
      LinkifyIt.prototype.set = function set(options) {
        this.__opts__ = assign(this.__opts__, options);
        return this;
      };


      /**
       * LinkifyIt#test(text) -> Boolean
       *
       * Searches linkifiable pattern and returns `true` on success or `false` on fail.
       **/
      LinkifyIt.prototype.test = function test(text) {
        // Reset scan cache
        this.__text_cache__ = text;
        this.__index__ = -1;

        if (!text.length) {
          return false;
        }

        var m, ml, me, len, shift, next, re, tld_pos, at_pos;

        // try to scan for link with schema - that's the most simple rule
        if (this.re.schema_test.test(text)) {
          re = this.re.schema_search;
          re.lastIndex = 0;
          while ((m = re.exec(text)) !== null) {
            len = this.testSchemaAt(text, m[2], re.lastIndex);
            if (len) {
              this.__schema__ = m[2];
              this.__index__ = m.index + m[1].length;
              this.__last_index__ = m.index + m[0].length + len;
              break;
            }
          }
        }

        if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
          // guess schemaless links
          tld_pos = text.search(this.re.host_fuzzy_test);
          if (tld_pos >= 0) {
            // if tld is located after found link - no need to check fuzzy pattern
            if (this.__index__ < 0 || tld_pos < this.__index__) {
              if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {

                shift = ml.index + ml[1].length;

                if (this.__index__ < 0 || shift < this.__index__) {
                  this.__schema__ = '';
                  this.__index__ = shift;
                  this.__last_index__ = ml.index + ml[0].length;
                }
              }
            }
          }
        }

        if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
          // guess schemaless emails
          at_pos = text.indexOf('@');
          if (at_pos >= 0) {
            // We can't skip this check, because this cases are possible:
            // 192.168.1.1@gmail.com, my.in@example.com
            if ((me = text.match(this.re.email_fuzzy)) !== null) {

              shift = me.index + me[1].length;
              next = me.index + me[0].length;

              if (this.__index__ < 0 || shift < this.__index__ ||
                (shift === this.__index__ && next > this.__last_index__)) {
                this.__schema__ = 'mailto:';
                this.__index__ = shift;
                this.__last_index__ = next;
              }
            }
          }
        }

        return this.__index__ >= 0;
      };


      /**
       * LinkifyIt#pretest(text) -> Boolean
       *
       * Very quick check, that can give false positives. Returns true if link MAY BE
       * can exists. Can be used for speed optimization, when you need to check that
       * link NOT exists.
       **/
      LinkifyIt.prototype.pretest = function pretest(text) {
        return this.re.pretest.test(text);
      };


      /**
       * LinkifyIt#testSchemaAt(text, name, position) -> Number
       * - text (String): text to scan
       * - name (String): rule (schema) name
       * - position (Number): text offset to check from
       *
       * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
       * at given position. Returns length of found pattern (0 on fail).
       **/
      LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
        // If not supported schema check requested - terminate
        if (!this.__compiled__[schema.toLowerCase()]) {
          return 0;
        }
        return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
      };


      /**
       * LinkifyIt#match(text) -> Array|null
       *
       * Returns array of found link descriptions or `null` on fail. We strongly
       * recommend to use [[LinkifyIt#test]] first, for best speed.
       *
       * ##### Result match description
       *
       * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
       *   protocol-neutral  links.
       * - __index__ - offset of matched text
       * - __lastIndex__ - index of next char after mathch end
       * - __raw__ - matched text
       * - __text__ - normalized text
       * - __url__ - link, generated from matched text
       **/
      LinkifyIt.prototype.match = function match(text) {
        var shift = 0,
          result = [];

        // Try to take previous element from cache, if .test() called before
        if (this.__index__ >= 0 && this.__text_cache__ === text) {
          result.push(createMatch(this, shift));
          shift = this.__last_index__;
        }

        // Cut head if cache was used
        var tail = shift ? text.slice(shift) : text;

        // Scan string until end reached
        while (this.test(tail)) {
          result.push(createMatch(this, shift));

          tail = tail.slice(this.__last_index__);
          shift += this.__last_index__;
        }

        if (result.length) {
          return result;
        }

        return null;
      };


      /** chainable
       * LinkifyIt#tlds(list [, keepOld]) -> this
       * - list (Array): list of tlds
       * - keepOld (Boolean): merge with current list if `true` (`false` by default)
       *
       * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
       * to avoid false positives. By default this algorythm used:
       *
       * - hostname with any 2-letter root zones are ok.
       * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
       *   are ok.
       * - encoded (`xn--...`) root zones are ok.
       *
       * If list is replaced, then exact match for 2-chars root zones will be checked.
       **/
      LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
        list = Array.isArray(list) ? list : [list];

        if (!keepOld) {
          this.__tlds__ = list.slice();
          this.__tlds_replaced__ = true;
          compile(this);
          return this;
        }

        this.__tlds__ = this.__tlds__.concat(list)
          .sort()
          .filter(function (el, idx, arr) {
            return el !== arr[idx - 1];
          })
          .reverse();

        compile(this);
        return this;
      };

      /**
       * LinkifyIt#normalize(match)
       *
       * Default normalizer (if schema does not define it's own).
       **/
      LinkifyIt.prototype.normalize = function normalize(match) {

        // Do minimal possible changes by default. Need to collect feedback prior
        // to move forward https://github.com/markdown-it/linkify-it/issues/1

        if (!match.schema) {
          match.url = 'http://' + match.url;
        }

        if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
          match.url = 'mailto:' + match.url;
        }
      };


      module.exports = LinkifyIt;

    }, {
      "./lib/re": 100
    }],
    100: [function (require, module, exports) {
      'use strict';

      // Use direct extract instead of `regenerate` to reduse browserified size
      var src_Any = exports.src_Any = require('uc.micro/properties/Any/regex').source;
      var src_Cc = exports.src_Cc = require('uc.micro/categories/Cc/regex').source;
      var src_Z = exports.src_Z = require('uc.micro/categories/Z/regex').source;
      var src_P = exports.src_P = require('uc.micro/categories/P/regex').source;

      // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
      var src_ZPCc = exports.src_ZPCc = [src_Z, src_P, src_Cc].join('|');

      // \p{\Z\Cc} (white spaces + control)
      var src_ZCc = exports.src_ZCc = [src_Z, src_Cc].join('|');

      // All possible word characters (everything without punctuation, spaces & controls)
      // Defined via punctuation & spaces to save space
      // Should be something like \p{\L\N\S\M} (\w but without `_`)
      var src_pseudo_letter = '(?:(?!>|<|' + src_ZPCc + ')' + src_Any + ')';
      // The same as abothe but without [0-9]
      // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';

      ////////////////////////////////////////////////////////////////////////////////

      var src_ip4 = exports.src_ip4 =

        '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

      // Prohibit [@/] in user/pass to avoid wrong domain fetch.
      exports.src_auth = '(?:(?:(?!' + src_ZCc + '|[@/]).)+@)?';

      var src_port = exports.src_port =

        '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

      var src_host_terminator = exports.src_host_terminator =

        '(?=$|>|<|' + src_ZPCc + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + src_ZPCc + '))';

      var src_path = exports.src_path =

        '(?:' +
        '[/?#]' +
        '(?:' +
        '(?!' + src_ZCc + '|[()[\\]{}.,"\'?!\\-<>]).|' +
        '\\[(?:(?!' + src_ZCc + '|\\]).)*\\]|' +
        '\\((?:(?!' + src_ZCc + '|[)]).)*\\)|' +
        '\\{(?:(?!' + src_ZCc + '|[}]).)*\\}|' +
        '\\"(?:(?!' + src_ZCc + '|["]).)+\\"|' +
        "\\'(?:(?!" + src_ZCc + "|[']).)+\\'|" +
        "\\'(?=" + src_pseudo_letter + ').|' + // allow `I'm_king` if no pair found
        '\\.{2,3}[a-zA-Z0-9%/]|' + // github has ... in commit range links. Restrict to
        // - english
        // - percent-encoded
        // - parts of file path
        // until more examples found.
        '\\.(?!' + src_ZCc + '|[.]).|' +
        '\\-(?!--(?:[^-]|$))(?:-*)|' + // `---` => long dash, terminate
        '\\,(?!' + src_ZCc + ').|' + // allow `,,,` in paths
        '\\!(?!' + src_ZCc + '|[!]).|' +
        '\\?(?!' + src_ZCc + '|[?]).' +
        ')+' +
        '|\\/' +
        ')?';

      var src_email_name = exports.src_email_name =

        '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+';

      var src_xn = exports.src_xn =

        'xn--[a-z0-9\\-]{1,59}';

      // More to read about domain names
      // http://serverfault.com/questions/638260/

      var src_domain_root = exports.src_domain_root =

        // Allow letters & digits (http://test1)
        '(?:' +
        src_xn +
        '|' +
        src_pseudo_letter + '{1,63}' +
        ')';

      var src_domain = exports.src_domain =

        '(?:' +
        src_xn +
        '|' +
        '(?:' + src_pseudo_letter + ')' +
        '|' +
        // don't allow `--` in domain names, because:
        // - that can conflict with markdown &mdash; / &ndash;
        // - nobody use those anyway
        '(?:' + src_pseudo_letter + '(?:-(?!-)|' + src_pseudo_letter + '){0,61}' + src_pseudo_letter + ')' +
        ')';

      var src_host = exports.src_host =

        '(?:' +
        // Don't need IP check, because digits are already allowed in normal domain names
        //   src_ip4 +
        // '|' +
        '(?:(?:(?:' + src_domain + ')\\.)*' + src_domain_root + ')' +
        ')';

      var tpl_host_fuzzy = exports.tpl_host_fuzzy =

        '(?:' +
        src_ip4 +
        '|' +
        '(?:(?:(?:' + src_domain + ')\\.)+(?:%TLDS%))' +
        ')';

      var tpl_host_no_ip_fuzzy = exports.tpl_host_no_ip_fuzzy =

        '(?:(?:(?:' + src_domain + ')\\.)+(?:%TLDS%))';

      exports.src_host_strict =

        src_host + src_host_terminator;

      var tpl_host_fuzzy_strict = exports.tpl_host_fuzzy_strict =

        tpl_host_fuzzy + src_host_terminator;

      exports.src_host_port_strict =

        src_host + src_port + src_host_terminator;

      var tpl_host_port_fuzzy_strict = exports.tpl_host_port_fuzzy_strict =

        tpl_host_fuzzy + src_port + src_host_terminator;

      var tpl_host_port_no_ip_fuzzy_strict = exports.tpl_host_port_no_ip_fuzzy_strict =

        tpl_host_no_ip_fuzzy + src_port + src_host_terminator;


      ////////////////////////////////////////////////////////////////////////////////
      // Main rules

      // Rude test fuzzy links by host, for quick deny
      exports.tpl_host_fuzzy_test =

        'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + src_ZPCc + '|>|$))';

      exports.tpl_email_fuzzy =

        '(^|<|>|\\(|' + src_ZCc + ')(' + src_email_name + '@' + tpl_host_fuzzy_strict + ')';

      exports.tpl_link_fuzzy =
        // Fuzzy link can't be prepended with .:/\- and non punctuation.
        // but can start with > (markdown blockquote)
        '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + src_ZPCc + '))' +
        '((?![$+<=>^`|])' + tpl_host_port_fuzzy_strict + src_path + ')';

      exports.tpl_link_no_ip_fuzzy =
        // Fuzzy link can't be prepended with .:/\- and non punctuation.
        // but can start with > (markdown blockquote)
        '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + src_ZPCc + '))' +
        '((?![$+<=>^`|])' + tpl_host_port_no_ip_fuzzy_strict + src_path + ')';

    }, {
      "uc.micro/categories/Cc/regex": 101,
      "uc.micro/categories/P/regex": 103,
      "uc.micro/categories/Z/regex": 104,
      "uc.micro/properties/Any/regex": 106
    }],
    101: [function (require, module, exports) {
      module.exports = /[\0-\x1F\x7F-\x9F]/
    }, {}],
    102: [function (require, module, exports) {
      module.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/
    }, {}],
    103: [function (require, module, exports) {
      module.exports = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/
    }, {}],
    104: [function (require, module, exports) {
      module.exports = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/
    }, {}],
    105: [function (require, module, exports) {
      'use strict';

      exports.Any = require('./properties/Any/regex');
      exports.Cc = require('./categories/Cc/regex');
      exports.Cf = require('./categories/Cf/regex');
      exports.P = require('./categories/P/regex');
      exports.Z = require('./categories/Z/regex');

    }, {
      "./categories/Cc/regex": 101,
      "./categories/Cf/regex": 102,
      "./categories/P/regex": 103,
      "./categories/Z/regex": 104,
      "./properties/Any/regex": 106
    }],
    106: [function (require, module, exports) {
      module.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/
    }, {}],
    107: [function (require, module, exports) {

      'use strict';


      /* eslint-disable no-bitwise */

      var decodeCache = {};

      function getDecodeCache(exclude) {
        var i, ch, cache = decodeCache[exclude];
        if (cache) {
          return cache;
        }

        cache = decodeCache[exclude] = [];

        for (i = 0; i < 128; i++) {
          ch = String.fromCharCode(i);
          cache.push(ch);
        }

        for (i = 0; i < exclude.length; i++) {
          ch = exclude.charCodeAt(i);
          cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
        }

        return cache;
      }


      // Decode percent-encoded string.
      //
      function decode(string, exclude) {
        var cache;

        if (typeof exclude !== 'string') {
          exclude = decode.defaultChars;
        }

        cache = getDecodeCache(exclude);

        return string.replace(/(%[a-f0-9]{2})+/gi, function (seq) {
          var i, l, b1, b2, b3, b4, chr,
            result = '';

          for (i = 0, l = seq.length; i < l; i += 3) {
            b1 = parseInt(seq.slice(i + 1, i + 3), 16);

            if (b1 < 0x80) {
              result += cache[b1];
              continue;
            }

            if ((b1 & 0xE0) === 0xC0 && (i + 3 < l)) {
              // 110xxxxx 10xxxxxx
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);

              if ((b2 & 0xC0) === 0x80) {
                chr = ((b1 << 6) & 0x7C0) | (b2 & 0x3F);

                if (chr < 0x80) {
                  result += '\ufffd\ufffd';
                } else {
                  result += String.fromCharCode(chr);
                }

                i += 3;
                continue;
              }
            }

            if ((b1 & 0xF0) === 0xE0 && (i + 6 < l)) {
              // 1110xxxx 10xxxxxx 10xxxxxx
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              b3 = parseInt(seq.slice(i + 7, i + 9), 16);

              if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                chr = ((b1 << 12) & 0xF000) | ((b2 << 6) & 0xFC0) | (b3 & 0x3F);

                if (chr < 0x800 || (chr >= 0xD800 && chr <= 0xDFFF)) {
                  result += '\ufffd\ufffd\ufffd';
                } else {
                  result += String.fromCharCode(chr);
                }

                i += 6;
                continue;
              }
            }

            if ((b1 & 0xF8) === 0xF0 && (i + 9 < l)) {
              // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
              b2 = parseInt(seq.slice(i + 4, i + 6), 16);
              b3 = parseInt(seq.slice(i + 7, i + 9), 16);
              b4 = parseInt(seq.slice(i + 10, i + 12), 16);

              if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
                chr = ((b1 << 18) & 0x1C0000) | ((b2 << 12) & 0x3F000) | ((b3 << 6) & 0xFC0) | (b4 & 0x3F);

                if (chr < 0x10000 || chr > 0x10FFFF) {
                  result += '\ufffd\ufffd\ufffd\ufffd';
                } else {
                  chr -= 0x10000;
                  result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
                }

                i += 9;
                continue;
              }
            }

            result += '\ufffd';
          }

          return result;
        });
      }


      decode.defaultChars = ';/?:@&=+$,#';
      decode.componentChars = '';


      module.exports = decode;

    }, {}],
    108: [function (require, module, exports) {

      'use strict';


      var encodeCache = {};


      // Create a lookup array where anything but characters in `chars` string
      // and alphanumeric chars is percent-encoded.
      //
      function getEncodeCache(exclude) {
        var i, ch, cache = encodeCache[exclude];
        if (cache) {
          return cache;
        }

        cache = encodeCache[exclude] = [];

        for (i = 0; i < 128; i++) {
          ch = String.fromCharCode(i);

          if (/^[0-9a-z]$/i.test(ch)) {
            // always allow unencoded alphanumeric characters
            cache.push(ch);
          } else {
            cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
          }
        }

        for (i = 0; i < exclude.length; i++) {
          cache[exclude.charCodeAt(i)] = exclude[i];
        }

        return cache;
      }


      // Encode unsafe characters with percent-encoding, skipping already
      // encoded sequences.
      //
      //  - string       - string to encode
      //  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
      //  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
      //
      function encode(string, exclude, keepEscaped) {
        var i, l, code, nextCode, cache,
          result = '';

        if (typeof exclude !== 'string') {
          // encode(string, keepEscaped)
          keepEscaped = exclude;
          exclude = encode.defaultChars;
        }

        if (typeof keepEscaped === 'undefined') {
          keepEscaped = true;
        }

        cache = getEncodeCache(exclude);

        for (i = 0, l = string.length; i < l; i++) {
          code = string.charCodeAt(i);

          if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
            if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
              result += string.slice(i, i + 3);
              i += 2;
              continue;
            }
          }

          if (code < 128) {
            result += cache[code];
            continue;
          }

          if (code >= 0xD800 && code <= 0xDFFF) {
            if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
              nextCode = string.charCodeAt(i + 1);
              if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                result += encodeURIComponent(string[i] + string[i + 1]);
                i++;
                continue;
              }
            }
            result += '%EF%BF%BD';
            continue;
          }

          result += encodeURIComponent(string[i]);
        }

        return result;
      }

      encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
      encode.componentChars = "-_.!~*'()";


      module.exports = encode;

    }, {}],
    109: [function (require, module, exports) {

      'use strict';


      module.exports = function format(url) {
        var result = '';

        result += url.protocol || '';
        result += url.slashes ? '//' : '';
        result += url.auth ? url.auth + '@' : '';

        if (url.hostname && url.hostname.indexOf(':') !== -1) {
          // ipv6 address
          result += '[' + url.hostname + ']';
        } else {
          result += url.hostname || '';
        }

        result += url.port ? ':' + url.port : '';
        result += url.pathname || '';
        result += url.search || '';
        result += url.hash || '';

        return result;
      };

    }, {}],
    110: [function (require, module, exports) {
      'use strict';


      module.exports.encode = require('./encode');
      module.exports.decode = require('./decode');
      module.exports.format = require('./format');
      module.exports.parse = require('./parse');

    }, {
      "./decode": 107,
      "./encode": 108,
      "./format": 109,
      "./parse": 111
    }],
    111: [function (require, module, exports) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      'use strict';

      //
      // Changes from joyent/node:
      //
      // 1. No leading slash in paths,
      //    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
      //
      // 2. Backslashes are not replaced with slashes,
      //    so `http:\\example.org\` is treated like a relative path
      //
      // 3. Trailing colon is treated like a part of the path,
      //    i.e. in `http://example.org:foo` pathname is `:foo`
      //
      // 4. Nothing is URL-encoded in the resulting object,
      //    (in joyent/node some chars in auth and paths are encoded)
      //
      // 5. `url.parse()` does not have `parseQueryString` argument
      //
      // 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
      //    which can be constructed using other parts of the url.
      //


      function Url() {
        this.protocol = null;
        this.slashes = null;
        this.auth = null;
        this.port = null;
        this.hostname = null;
        this.hash = null;
        this.search = null;
        this.pathname = null;
      }

      // Reference: RFC 3986, RFC 1808, RFC 2396

      // define these here so at least they only have to be
      // compiled once on the first module load.
      var protocolPattern = /^([a-z0-9.+-]+:)/i,
        portPattern = /:[0-9]*$/,

        // Special case for a simple path URL
        simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

        // RFC 2396: characters reserved for delimiting URLs.
        // We actually just auto-escape these.
        delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

        // RFC 2396: characters not allowed for various reasons.
        unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

        // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
        autoEscape = ['\''].concat(unwise),
        // Characters that are never ever allowed in a hostname.
        // Note that any invalid chars are also handled, but these
        // are the ones that are *expected* to be seen, so we fast-path
        // them.
        nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
        hostEndingChars = ['/', '?', '#'],
        hostnameMaxLen = 255,
        hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
        hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
        // protocols that can allow "unsafe" and "unwise" chars.
        /* eslint-disable no-script-url */
        // protocols that never have a hostname.
        hostlessProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that always contain a // bit.
        slashedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'https:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        };
      /* eslint-enable no-script-url */

      function urlParse(url, slashesDenoteHost) {
        if (url && url instanceof Url) {
          return url;
        }

        var u = new Url();
        u.parse(url, slashesDenoteHost);
        return u;
      }

      Url.prototype.parse = function (url, slashesDenoteHost) {
        var i, l, lowerProto, hec, slashes,
          rest = url;

        // trim before proceeding.
        // This is to support parse stuff like "  http://foo.com  \n"
        rest = rest.trim();

        if (!slashesDenoteHost && url.split('#').length === 1) {
          // Try fast path regexp
          var simplePath = simplePathPattern.exec(rest);
          if (simplePath) {
            this.pathname = simplePath[1];
            if (simplePath[2]) {
              this.search = simplePath[2];
            }
            return this;
          }
        }

        var proto = protocolPattern.exec(rest);
        if (proto) {
          proto = proto[0];
          lowerProto = proto.toLowerCase();
          this.protocol = proto;
          rest = rest.substr(proto.length);
        }

        // figure out if it's got a host
        // user@server is *always* interpreted as a hostname, and url
        // resolution will treat //foo/bar as host=foo,path=bar because that's
        // how the browser resolves relative URLs.
        if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
          slashes = rest.substr(0, 2) === '//';
          if (slashes && !(proto && hostlessProtocol[proto])) {
            rest = rest.substr(2);
            this.slashes = true;
          }
        }

        if (!hostlessProtocol[proto] &&
          (slashes || (proto && !slashedProtocol[proto]))) {

          // there's a hostname.
          // the first instance of /, ?, ;, or # ends the host.
          //
          // If there is an @ in the hostname, then non-host chars *are* allowed
          // to the left of the last @ sign, unless some host-ending character
          // comes *before* the @-sign.
          // URLs are obnoxious.
          //
          // ex:
          // http://a@b@c/ => user:a@b host:c
          // http://a@b?@c => user:a host:c path:/?@c

          // v0.12 TODO(isaacs): This is not quite how Chrome does things.
          // Review our test case against browsers more comprehensively.

          // find the first instance of any hostEndingChars
          var hostEnd = -1;
          for (i = 0; i < hostEndingChars.length; i++) {
            hec = rest.indexOf(hostEndingChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }

          // at this point, either we have an explicit point where the
          // auth portion cannot go past, or the last @ char is the decider.
          var auth, atSign;
          if (hostEnd === -1) {
            // atSign can be anywhere.
            atSign = rest.lastIndexOf('@');
          } else {
            // atSign must be in auth portion.
            // http://a@b/c@d => host:b auth:a path:/c@d
            atSign = rest.lastIndexOf('@', hostEnd);
          }

          // Now we have a portion which is definitely the auth.
          // Pull that off.
          if (atSign !== -1) {
            auth = rest.slice(0, atSign);
            rest = rest.slice(atSign + 1);
            this.auth = auth;
          }

          // the host is the remaining to the left of the first non-host char
          hostEnd = -1;
          for (i = 0; i < nonHostChars.length; i++) {
            hec = rest.indexOf(nonHostChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }
          // if we still have not hit it, then the entire thing is a host.
          if (hostEnd === -1) {
            hostEnd = rest.length;
          }

          if (rest[hostEnd - 1] === ':') {
            hostEnd--;
          }
          var host = rest.slice(0, hostEnd);
          rest = rest.slice(hostEnd);

          // pull out port.
          this.parseHost(host);

          // we've indicated that there is a hostname,
          // so even if it's empty, it has to be present.
          this.hostname = this.hostname || '';

          // if hostname begins with [ and ends with ]
          // assume that it's an IPv6 address.
          var ipv6Hostname = this.hostname[0] === '[' &&
            this.hostname[this.hostname.length - 1] === ']';

          // validate a little.
          if (!ipv6Hostname) {
            var hostparts = this.hostname.split(/\./);
            for (i = 0, l = hostparts.length; i < l; i++) {
              var part = hostparts[i];
              if (!part) {
                continue;
              }
              if (!part.match(hostnamePartPattern)) {
                var newpart = '';
                for (var j = 0, k = part.length; j < k; j++) {
                  if (part.charCodeAt(j) > 127) {
                    // we replace non-ASCII char with a temporary placeholder
                    // we need this to make sure size of hostname is not
                    // broken by replacing non-ASCII by nothing
                    newpart += 'x';
                  } else {
                    newpart += part[j];
                  }
                }
                // we test again with ASCII char only
                if (!newpart.match(hostnamePartPattern)) {
                  var validParts = hostparts.slice(0, i);
                  var notHost = hostparts.slice(i + 1);
                  var bit = part.match(hostnamePartStart);
                  if (bit) {
                    validParts.push(bit[1]);
                    notHost.unshift(bit[2]);
                  }
                  if (notHost.length) {
                    rest = notHost.join('.') + rest;
                  }
                  this.hostname = validParts.join('.');
                  break;
                }
              }
            }
          }

          if (this.hostname.length > hostnameMaxLen) {
            this.hostname = '';
          }

          // strip [ and ] from the hostname
          // the host field still retains them, though
          if (ipv6Hostname) {
            this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          }
        }

        // chop off from the tail first.
        var hash = rest.indexOf('#');
        if (hash !== -1) {
          // got a fragment string.
          this.hash = rest.substr(hash);
          rest = rest.slice(0, hash);
        }
        var qm = rest.indexOf('?');
        if (qm !== -1) {
          this.search = rest.substr(qm);
          rest = rest.slice(0, qm);
        }
        if (rest) {
          this.pathname = rest;
        }
        if (slashedProtocol[lowerProto] &&
          this.hostname && !this.pathname) {
          this.pathname = '';
        }

        return this;
      };

      Url.prototype.parseHost = function (host) {
        var port = portPattern.exec(host);
        if (port) {
          port = port[0];
          if (port !== ':') {
            this.port = port.substr(1);
          }
          host = host.substr(0, host.length - port.length);
        }
        if (host) {
          this.hostname = host;
        }
      };

      module.exports = urlParse;

    }, {}],
    112: [function (require, module, exports) {
      'use strict';

      var MarkdownIt = require('markdown-it');
      var hljs = require('highlight.js');
      var sluggish = require('sluggish');
      var tokenizeLinks = require('./tokenizeLinks');
      var md = new MarkdownIt({
        html: true,
        xhtmlOut: true,
        linkify: true,
        typographer: true,
        langPrefix: 'md-lang-alias-',
        highlight: highlight.bind(null, false)
      });
      var ralias = / class="md-lang-alias-([^"]+)"/;
      var aliases = {
        js: 'javascript',
        md: 'markdown',
        html: 'xml', // next best thing
        jade: 'css' // next best thing
      };

      md.core.ruler.after('linkify', 'pos_counter', function posCounter(state) {
        var partial = state.src;
        var cursor = 0;
        state.tokens.forEach(function crawl(token, i) {
          token.cursorStart = cursor;
          if (token.markup) {
            moveCursor(token.markup);
          }
          if (token.type === 'link_open') {
            moveCursor('[');
          }
          if (token.type === 'link_close') {
            moveCursorAfterLinkClose();
          }
          if (token.type === 'image') {
            moveCursor('![');
          }
          if (token.children) {
            token.children.forEach(crawl);
          } else if (token.content) {
            token.src = token.content;
            moveCursor(token.src);
          }
          if (token.type === 'code_inline') { // closing mark
            moveCursor(token.markup);
          }
          if (token.type === 'heading_open') {
            moveCursor('');
          }
          if (token.map) {
            moveCursor('');
          }
          token.cursorEnd = cursor;
        });

        function moveCursor(needle) {
          var regex = needle instanceof RegExp;
          var re = regex ? needle : new RegExp('^\\s*' + escapeForRegExp(needle), 'ig');
          var match = re.exec(partial);
          if (!match) {
            return false;
          }
          var diff = re.lastIndex;
          cursor += diff;
          partial = partial.slice(diff);
          return true;
        }

        function moveCursorAfterLinkClose() {
          moveCursor(']');
          if (!moveCursor(/^\s*\[[^\]]+\]/g)) {
            moveCursor('(');
            moveCursorAfterParenthesis();
          }
        }

        function moveCursorAfterParenthesis() {
          var prev;
          var char;
          var i;
          var inQuotes = false;
          for (i = 0; i < partial.length; i++) {
            prev = partial[i - 1] || '';
            if (prev === '\\') {
              continue;
            }
            char = partial[i];
            if (!inQuotes && char === ')') {
              break;
            }
            if (char === '"' || char === '\'') {
              inQuotes = !inQuotes;
            }
          }
          cursor += i + 1;
          partial = partial.slice(i + 1);
        }
      });

      function repeat(text, times) {
        var result = '',
          n;
        while (n) {
          if (n % 2 === 1) {
            result += text;
          }
          if (n > 1) {
            text += text;
          }
          n >>= 1;
        }
        return result;
      }

      function escapeForRegExp(text) {
        return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      }

      var baseblock = md.renderer.rules.code_block;
      var baseinline = md.renderer.rules.code_inline;
      var basefence = md.renderer.rules.fence;
      var basetext = md.renderer.rules.text;
      var baserenderInline = md.renderer.renderInline;
      var languages = [];

      md.core.ruler.before('linkify', 'linkify-tokenizer', linkifyTokenizer, {});
      md.renderer.rules.heading_open = heading;
      md.renderer.rules.code_block = block;
      md.renderer.rules.code_inline = inline;
      md.renderer.rules.fence = fence;
      md.renderer.renderInline = renderInline;

      hljs.configure({
        tabReplace: 2,
        classPrefix: 'md-code-'
      });

      function highlight(encoded, code, detected) {
        var lower = String(detected).toLowerCase();
        var lang = aliases[detected] || detected;
        var escaped = encodeHtmlMarks(code, encoded);
        try {
          var result = hljs.highlight(lang, escaped);
          var unescaped = decodeHtmlMarks(result.value, true, encoded);
          return unescaped;
        } catch (e) {
          return decodeHtmlMarks(encodeHtmlMarks(code, encoded), true, encoded);
        }
      }

      function encode(tag) {
        return tag.replace('<', '&lt;').replace('>', '&gt;');
      }

      function encodeHtmlMarks(code, encoded) {
        var opentag = '<mark>';
        var closetag = '</mark>';
        if (encoded) {
          opentag = encode(opentag);
          closetag = encode(closetag);
        }
        var ropen = new RegExp(opentag, 'g');
        var rclose = new RegExp(closetag, 'g');
        var open = 'highlightmarkisveryliteral';
        var close = 'highlightmarkwasveryliteral';
        return code.replace(ropen, open).replace(rclose, close);
      }

      function decodeHtmlMarks(value, inCode) {
        var ropen = /highlightmarkisveryliteral/g;
        var rclose = /highlightmarkwasveryliteral/g;
        var classes = 'md-mark' + (inCode ? ' md-code-mark' : '');
        var open = '<mark class="' + classes + '">';
        var close = '</mark>';
        return value.replace(ropen, open).replace(rclose, close);
      }

      function heading(tokens, i, options, env, renderer) {
        var token = tokens[i];
        var open = '<' + token.tag;
        var close = '>';
        var contents = read();
        var slug = sluggish(contents);
        if (slug.length) {
          return open + ' id="' + slug + '"' + close;
        }
        return open + close;

        function read() {
          var index = i++;
          var next = tokens[index];
          var contents = '';
          while (next && next.type !== 'heading_close') {
            contents += next.content;
            next = tokens[index++ + 1];
          }
          return contents;
        }
      }

      function block(tokens, idx, options, env) {
        var base = baseblock.apply(this, arguments).substr(11); // starts with '<pre><code>'
        var untagged = base.substr(0, base.length - 14);
        var upmarked = upmark(tokens[idx], untagged, 0, env);
        var marked = highlight(true, upmarked);
        var classed = '<pre class="md-code-block"><code class="md-code">' + marked + '</code></pre>\n';
        return classed;
      }

      function inline(tokens, idx, options, env) {
        var base = baseinline.apply(this, arguments).substr(6); // starts with '<code>'
        var untagged = base.substr(0, base.length - 7); // ends with '</code>'
        var upmarked = upmark(tokens[idx], untagged, 1, env);
        var marked = highlight(true, upmarked);
        var classed = '<code class="md-code md-code-inline">' + marked + '</code>';
        return classed;
      }

      function renderInline(tokens, options, env) {
        var result = baserenderInline.apply(this, arguments);
        if (!tokens.length) {
          return result;
        }
        env.flush = true;
        result += upmark(tokens[tokens.length - 1], '', 0, env);
        env.flush = false;
        return result;
      }

      function upmark(token, content, offset, env) {
        return env.markers
          .filter(pastOrPresent)
          .reverse()
          .reduce(considerUpmarking, content);

        function considerUpmarking(content, marker) {
          var startOffset = env.flush ? 0 : marker[0] - token.cursorStart;
          var start = Math.max(0, startOffset - offset);
          var markerCode = consumeMarker(marker, env);
          return (
            content.slice(0, start) +
            markerCode +
            content.slice(start)
          );
        }

        function pastOrPresent(marker) {
          return marker[0] <= token.cursorEnd;
        }
      }

      function consumeMarker(marker, env) {
        var code = randomCode() + randomCode() + randomCode();
        env.markers.splice(env.markers.indexOf(marker), 1);
        env.markerCodes.push([code, marker[1]]);
        return code;
      }

      function randomCode() {
        return Math.random().toString(18).substr(2).replace(/\d+/g, '');
      }

      function fence(tokens, idx, options, env) {
        var base = basefence.apply(this, arguments).substr(5); // starts with '<pre>'
        var lang = base.substr(0, 6) !== '<code>'; // when the fence has a language class
        var untaggedStart = lang ? base.indexOf('>') + 1 : 6;
        var untagged = base.substr(untaggedStart);
        var upmarked = upmark(tokens[idx], untagged, 0, env);
        var codeTag = lang ? base.substr(0, untaggedStart) : '<code class="md-code">';
        var classed = '<pre class="md-code-block">' + codeTag + upmarked;
        var aliased = classed.replace(ralias, aliasing);
        return aliased;
      }

      function aliasing(all, language) {
        var name = aliases[language] || language || 'unknown';
        var lang = 'md-lang-' + name;
        if (languages.indexOf(lang) === -1) {
          languages.push(lang);
        }
        return ' class="md-code ' + lang + '"';
      }

      function textParser(tokens, idx, options, env) {
        var token = tokens[idx];
        token.content = upmark(token, token.content, 0, env);
        var base = basetext.apply(this, arguments);
        var tokenized = tokenize(base, env.tokenizers);
        return tokenized;
      }

      function linkifyTokenizer(state) {
        tokenizeLinks(state, state.env);
      }

      function tokenize(text, tokenizers) {
        return tokenizers.reduce(use, text);

        function use(result, tok) {
          return result.replace(tok.token, tok.transform);
        }
      }

      function decodeMarkers(html, env) {
        return env.markerCodes.reduce(reducer, html);

        function reducer(html, mcp) {
          return html.replace(mcp[0], mcp[1]);
        }
      }

      function markdown(input, options) {
        var tok = options.tokenizers || [];
        var lin = options.linkifiers || [];
        var valid = input === null || input === void 0 ? '' : String(input);
        var env = {
          tokenizers: tok,
          linkifiers: lin,
          markers: options.markers ? options.markers.sort(asc) : [],
          markerCodes: []
        };
        md.renderer.rules.text = textParser;
        var leftMark = upmark({
          cursorStart: 0,
          cursorEnd: 0
        }, '', 0, env);
        var htmlMd = md.render(valid, env);
        env.flush = true;
        var rightMark = upmark({
          cursorStart: 0,
          cursorEnd: Infinity
        }, '', 0, env);
        var html = leftMark + htmlMd + rightMark;
        return decodeMarkers(decodeHtmlMarks(encodeHtmlMarks(html)), env);
      }

      function asc(a, b) {
        return a[0] - b[0];
      }

      markdown.parser = md;
      markdown.languages = languages;
      module.exports = markdown;

    }, {
      "./tokenizeLinks": 114,
      "highlight.js": 20,
      "markdown-it": 45,
      "sluggish": 127
    }],
    113: [function (require, module, exports) {
      'use strict';

      var insane = require('insane');
      var assign = require('assignment');
      var markdown = require('./markdown');
      var hightokens = require('highlight.js-tokens').map(codeclass);

      function codeclass(token) {
        return 'md-code-' + token;
      }

      function sanitize(html, o) {
        var headings = {
          h1: 'id',
          h2: 'id',
          h3: 'id',
          h4: 'id',
          h5: 'id',
          h6: 'id'
        };
        var options = assign({
          allowedClasses: {},
          allowedAttributes: headings
        }, o);
        var ac = options.allowedClasses;

        add('mark', ['md-mark', 'md-code-mark']);
        add('pre', ['md-code-block']);
        add('code', markdown.languages);
        add('span', hightokens);

        return insane(html, options);

        function add(type, more) {
          ac[type] = (ac[type] || []).concat(more);
        }
      }

      function megamark(md, options) {
        var o = options || {};
        var html = markdown(md, o);
        var sane = sanitize(html, o.sanitizer);
        return sane;
      }

      markdown.languages.push('md-code', 'md-code-inline'); // only sanitizing purposes
      megamark.parser = markdown.parser;
      module.exports = megamark;

    }, {
      "./markdown": 112,
      "assignment": 2,
      "highlight.js-tokens": 29,
      "insane": 33
    }],
    114: [function (require, module, exports) {
      'use strict';

      function arrayReplaceAt(a, i, middle) {
        var left = a.slice(0, i);
        var right = a.slice(i + 1);
        return left.concat(middle, right);
      }

      function isLinkOpen(str) {
        return /^<a[>\s]/i.test(str);
      }

      function isLinkClose(str) {
        return /^<\/a\s*>/i.test(str);
      }

      // the majority of the code below was taken from markdown-it's linkify method
      // https://github.com/markdown-it/markdown-it/blob/7075e8881f4f717e2f2932ea156bb8aff649c89d/lib/rules_core/linkify.js

      function tokenizeLinks(state, context) {
        var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
          level, htmlLinkLevel, url, fullUrl, urlText,
          blockTokens = state.tokens,
          links;

        if (!state.md.options.linkify) {
          return;
        }

        for (j = 0, l = blockTokens.length; j < l; j++) {
          if (blockTokens[j].type !== 'inline' ||
            !state.md.linkify.pretest(blockTokens[j].content)) {
            continue;
          }

          tokens = blockTokens[j].children;

          htmlLinkLevel = 0;

          // We scan from the end, to keep position when new tags added.
          // Use reversed logic in links start/end match
          for (i = tokens.length - 1; i >= 0; i--) {
            currentToken = tokens[i];

            // Skip content of markdown links
            if (currentToken.type === 'link_close') {
              i--;
              while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
                i--;
              }
              continue;
            }

            // Skip content of html tag links
            if (currentToken.type === 'html_inline') {
              if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
                htmlLinkLevel--;
              }
              if (isLinkClose(currentToken.content)) {
                htmlLinkLevel++;
              }
            }
            if (htmlLinkLevel > 0) {
              continue;
            }

            if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

              text = currentToken.content;
              links = state.md.linkify.match(text);

              // Now split string to nodes
              nodes = [];
              level = currentToken.level;
              lastPos = 0;

              for (ln = 0; ln < links.length; ln++) {

                url = links[ln].url;
                fullUrl = state.md.normalizeLink(url);
                if (!state.md.validateLink(fullUrl)) {
                  continue;
                }

                urlText = links[ln].text;

                // Linkifier might send raw hostnames like "example.com", where url
                // starts with domain name. So we prepend http:// in those cases,
                // and remove it afterwards.
                //
                if (!links[ln].schema) {
                  urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
                } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
                  urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
                } else {
                  urlText = state.md.normalizeLinkText(urlText);
                }

                pos = links[ln].index;

                if (pos > lastPos) {
                  token = new state.Token('text', '', 0);
                  token.content = text.slice(lastPos, pos);
                  token.level = level;
                  nodes.push(token);
                }

                //// <this code is part of megamark>
                html = null;
                context.linkifiers.some(runUserLinkifier);

                if (typeof html === 'string') {
                  nodes.push({
                    type: 'html_block',
                    content: html,
                    level: level
                  });
                } else {
                  //// </this code is part of megamark>

                  token = new state.Token('link_open', 'a', 1);
                  token.attrs = [
                    ['href', fullUrl]
                  ];
                  token.level = level++;
                  token.markup = 'linkify';
                  token.info = 'auto';
                  nodes.push(token);

                  token = new state.Token('text', '', 0);
                  token.content = urlText;
                  token.level = level;
                  nodes.push(token);

                  token = new state.Token('link_close', 'a', -1);
                  token.level = --level;
                  token.markup = 'linkify';
                  token.info = 'auto';
                  nodes.push(token);

                  //// <this code is part of megamark>
                }
                //// </this code is part of megamark>

                lastPos = links[ln].lastIndex;
              }

              if (lastPos < text.length) {
                token = new state.Token('text', '', 0);
                token.content = text.slice(lastPos);
                token.level = level;
                nodes.push(token);
              }

              // replace current node
              blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
            }
          }
        }

        //// <this code is part of megamark>
        var html;

        function runUserLinkifier(linkifier) {
          html = linkifier(links[ln].url, links[ln].text);
          return typeof html === 'string';
        }
        //// </this code is part of megamark>
      }

      module.exports = tokenizeLinks;

    }, {}],
    115: [function (require, module, exports) {
      var trim = require('trim'),
        forEach = require('for-each'),
        isArray = function (arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        }

      module.exports = function (headers) {
        if (!headers)
          return {}

        var result = {}

        forEach(
          trim(headers).split('\n'),
          function (row) {
            var index = row.indexOf(':'),
              key = trim(row.slice(0, index)).toLowerCase(),
              value = trim(row.slice(index + 1))

            if (typeof (result[key]) === 'undefined') {
              result[key] = value
            } else if (isArray(result[key])) {
              result[key].push(value)
            } else {
              result[key] = [result[key], value]
            }
          }
        )

        return result
      }
    }, {
      "for-each": 17,
      "trim": 130
    }],
    116: [function (require, module, exports) {
      (function (global) {
        /*! http://mths.be/punycode v1.2.4 by @mathias */
        ;
        (function (root) {

          /** Detect free variables */
          var freeExports = typeof exports == 'object' && exports;
          var freeModule = typeof module == 'object' && module &&
            module.exports == freeExports && module;
          var freeGlobal = typeof global == 'object' && global;
          if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
            root = freeGlobal;
          }

          /**
           * The `punycode` object.
           * @name punycode
           * @type Object
           */
          var punycode,

            /** Highest positive signed 32-bit float value */
            maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

            /** Bootstring parameters */
            base = 36,
            tMin = 1,
            tMax = 26,
            skew = 38,
            damp = 700,
            initialBias = 72,
            initialN = 128, // 0x80
            delimiter = '-', // '\x2D'

            /** Regular expressions */
            regexPunycode = /^xn--/,
            regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
            regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

            /** Error messages */
            errors = {
              'overflow': 'Overflow: input needs wider integers to process',
              'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
              'invalid-input': 'Invalid input'
            },

            /** Convenience shortcuts */
            baseMinusTMin = base - tMin,
            floor = Math.floor,
            stringFromCharCode = String.fromCharCode,

            /** Temporary variable */
            key;

          /*--------------------------------------------------------------------------*/

          /**
           * A generic error utility function.
           * @private
           * @param {String} type The error type.
           * @returns {Error} Throws a `RangeError` with the applicable error message.
           */
          function error(type) {
            throw RangeError(errors[type]);
          }

          /**
           * A generic `Array#map` utility function.
           * @private
           * @param {Array} array The array to iterate over.
           * @param {Function} callback The function that gets called for every array
           * item.
           * @returns {Array} A new array of values returned by the callback function.
           */
          function map(array, fn) {
            var length = array.length;
            while (length--) {
              array[length] = fn(array[length]);
            }
            return array;
          }

          /**
           * A simple `Array#map`-like wrapper to work with domain name strings.
           * @private
           * @param {String} domain The domain name.
           * @param {Function} callback The function that gets called for every
           * character.
           * @returns {Array} A new string of characters returned by the callback
           * function.
           */
          function mapDomain(string, fn) {
            return map(string.split(regexSeparators), fn).join('.');
          }

          /**
           * Creates an array containing the numeric code points of each Unicode
           * character in the string. While JavaScript uses UCS-2 internally,
           * this function will convert a pair of surrogate halves (each of which
           * UCS-2 exposes as separate characters) into a single code point,
           * matching UTF-16.
           * @see `punycode.ucs2.encode`
           * @see <http://mathiasbynens.be/notes/javascript-encoding>
           * @memberOf punycode.ucs2
           * @name decode
           * @param {String} string The Unicode input string (UCS-2).
           * @returns {Array} The new array of code points.
           */
          function ucs2decode(string) {
            var output = [],
              counter = 0,
              length = string.length,
              value,
              extra;
            while (counter < length) {
              value = string.charCodeAt(counter++);
              if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                // high surrogate, and there is a next character
                extra = string.charCodeAt(counter++);
                if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                  output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                } else {
                  // unmatched surrogate; only append this code unit, in case the next
                  // code unit is the high surrogate of a surrogate pair
                  output.push(value);
                  counter--;
                }
              } else {
                output.push(value);
              }
            }
            return output;
          }

          /**
           * Creates a string based on an array of numeric code points.
           * @see `punycode.ucs2.decode`
           * @memberOf punycode.ucs2
           * @name encode
           * @param {Array} codePoints The array of numeric code points.
           * @returns {String} The new Unicode string (UCS-2).
           */
          function ucs2encode(array) {
            return map(array, function (value) {
              var output = '';
              if (value > 0xFFFF) {
                value -= 0x10000;
                output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                value = 0xDC00 | value & 0x3FF;
              }
              output += stringFromCharCode(value);
              return output;
            }).join('');
          }

          /**
           * Converts a basic code point into a digit/integer.
           * @see `digitToBasic()`
           * @private
           * @param {Number} codePoint The basic numeric code point value.
           * @returns {Number} The numeric value of a basic code point (for use in
           * representing integers) in the range `0` to `base - 1`, or `base` if
           * the code point does not represent a value.
           */
          function basicToDigit(codePoint) {
            if (codePoint - 48 < 10) {
              return codePoint - 22;
            }
            if (codePoint - 65 < 26) {
              return codePoint - 65;
            }
            if (codePoint - 97 < 26) {
              return codePoint - 97;
            }
            return base;
          }

          /**
           * Converts a digit/integer into a basic code point.
           * @see `basicToDigit()`
           * @private
           * @param {Number} digit The numeric value of a basic code point.
           * @returns {Number} The basic code point whose value (when used for
           * representing integers) is `digit`, which needs to be in the range
           * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
           * used; else, the lowercase form is used. The behavior is undefined
           * if `flag` is non-zero and `digit` has no uppercase form.
           */
          function digitToBasic(digit, flag) {
            //  0..25 map to ASCII a..z or A..Z
            // 26..35 map to ASCII 0..9
            return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
          }

          /**
           * Bias adaptation function as per section 3.4 of RFC 3492.
           * http://tools.ietf.org/html/rfc3492#section-3.4
           * @private
           */
          function adapt(delta, numPoints, firstTime) {
            var k = 0;
            delta = firstTime ? floor(delta / damp) : delta >> 1;
            delta += floor(delta / numPoints);
            for ( /* no initialization */ ; delta > baseMinusTMin * tMax >> 1; k += base) {
              delta = floor(delta / baseMinusTMin);
            }
            return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
          }

          /**
           * Converts a Punycode string of ASCII-only symbols to a string of Unicode
           * symbols.
           * @memberOf punycode
           * @param {String} input The Punycode string of ASCII-only symbols.
           * @returns {String} The resulting string of Unicode symbols.
           */
          function decode(input) {
            // Don't use UCS-2
            var output = [],
              inputLength = input.length,
              out,
              i = 0,
              n = initialN,
              bias = initialBias,
              basic,
              j,
              index,
              oldi,
              w,
              k,
              digit,
              t,
              /** Cached calculation results */
              baseMinusT;

            // Handle the basic code points: let `basic` be the number of input code
            // points before the last delimiter, or `0` if there is none, then copy
            // the first basic code points to the output.

            basic = input.lastIndexOf(delimiter);
            if (basic < 0) {
              basic = 0;
            }

            for (j = 0; j < basic; ++j) {
              // if it's not a basic code point
              if (input.charCodeAt(j) >= 0x80) {
                error('not-basic');
              }
              output.push(input.charCodeAt(j));
            }

            // Main decoding loop: start just after the last delimiter if any basic code
            // points were copied; start at the beginning otherwise.

            for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */ ) {

              // `index` is the index of the next character to be consumed.
              // Decode a generalized variable-length integer into `delta`,
              // which gets added to `i`. The overflow checking is easier
              // if we increase `i` as we go, then subtract off its starting
              // value at the end to obtain `delta`.
              for (oldi = i, w = 1, k = base; /* no condition */ ; k += base) {

                if (index >= inputLength) {
                  error('invalid-input');
                }

                digit = basicToDigit(input.charCodeAt(index++));

                if (digit >= base || digit > floor((maxInt - i) / w)) {
                  error('overflow');
                }

                i += digit * w;
                t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

                if (digit < t) {
                  break;
                }

                baseMinusT = base - t;
                if (w > floor(maxInt / baseMinusT)) {
                  error('overflow');
                }

                w *= baseMinusT;

              }

              out = output.length + 1;
              bias = adapt(i - oldi, out, oldi == 0);

              // `i` was supposed to wrap around from `out` to `0`,
              // incrementing `n` each time, so we'll fix that now:
              if (floor(i / out) > maxInt - n) {
                error('overflow');
              }

              n += floor(i / out);
              i %= out;

              // Insert `n` at position `i` of the output
              output.splice(i++, 0, n);

            }

            return ucs2encode(output);
          }

          /**
           * Converts a string of Unicode symbols to a Punycode string of ASCII-only
           * symbols.
           * @memberOf punycode
           * @param {String} input The string of Unicode symbols.
           * @returns {String} The resulting Punycode string of ASCII-only symbols.
           */
          function encode(input) {
            var n,
              delta,
              handledCPCount,
              basicLength,
              bias,
              j,
              m,
              q,
              k,
              t,
              currentValue,
              output = [],
              /** `inputLength` will hold the number of code points in `input`. */
              inputLength,
              /** Cached calculation results */
              handledCPCountPlusOne,
              baseMinusT,
              qMinusT;

            // Convert the input in UCS-2 to Unicode
            input = ucs2decode(input);

            // Cache the length
            inputLength = input.length;

            // Initialize the state
            n = initialN;
            delta = 0;
            bias = initialBias;

            // Handle the basic code points
            for (j = 0; j < inputLength; ++j) {
              currentValue = input[j];
              if (currentValue < 0x80) {
                output.push(stringFromCharCode(currentValue));
              }
            }

            handledCPCount = basicLength = output.length;

            // `handledCPCount` is the number of code points that have been handled;
            // `basicLength` is the number of basic code points.

            // Finish the basic string - if it is not empty - with a delimiter
            if (basicLength) {
              output.push(delimiter);
            }

            // Main encoding loop:
            while (handledCPCount < inputLength) {

              // All non-basic code points < n have been handled already. Find the next
              // larger one:
              for (m = maxInt, j = 0; j < inputLength; ++j) {
                currentValue = input[j];
                if (currentValue >= n && currentValue < m) {
                  m = currentValue;
                }
              }

              // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
              // but guard against overflow
              handledCPCountPlusOne = handledCPCount + 1;
              if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                error('overflow');
              }

              delta += (m - n) * handledCPCountPlusOne;
              n = m;

              for (j = 0; j < inputLength; ++j) {
                currentValue = input[j];

                if (currentValue < n && ++delta > maxInt) {
                  error('overflow');
                }

                if (currentValue == n) {
                  // Represent delta as a generalized variable-length integer
                  for (q = delta, k = base; /* no condition */ ; k += base) {
                    t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                    if (q < t) {
                      break;
                    }
                    qMinusT = q - t;
                    baseMinusT = base - t;
                    output.push(
                      stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                    );
                    q = floor(qMinusT / baseMinusT);
                  }

                  output.push(stringFromCharCode(digitToBasic(q, 0)));
                  bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                  delta = 0;
                  ++handledCPCount;
                }
              }

              ++delta;
              ++n;

            }
            return output.join('');
          }

          /**
           * Converts a Punycode string representing a domain name to Unicode. Only the
           * Punycoded parts of the domain name will be converted, i.e. it doesn't
           * matter if you call it on a string that has already been converted to
           * Unicode.
           * @memberOf punycode
           * @param {String} domain The Punycode domain name to convert to Unicode.
           * @returns {String} The Unicode representation of the given Punycode
           * string.
           */
          function toUnicode(domain) {
            return mapDomain(domain, function (string) {
              return regexPunycode.test(string) ?
                decode(string.slice(4).toLowerCase()) :
                string;
            });
          }

          /**
           * Converts a Unicode string representing a domain name to Punycode. Only the
           * non-ASCII parts of the domain name will be converted, i.e. it doesn't
           * matter if you call it with a domain that's already in ASCII.
           * @memberOf punycode
           * @param {String} domain The domain name to convert, as a Unicode string.
           * @returns {String} The Punycode representation of the given domain name.
           */
          function toASCII(domain) {
            return mapDomain(domain, function (string) {
              return regexNonASCII.test(string) ?
                'xn--' + encode(string) :
                string;
            });
          }

          /*--------------------------------------------------------------------------*/

          /** Define the public API */
          punycode = {
            /**
             * A string representing the current Punycode.js version number.
             * @memberOf punycode
             * @type String
             */
            'version': '1.2.4',
            /**
             * An object of methods to convert from JavaScript's internal character
             * representation (UCS-2) to Unicode code points, and back.
             * @see <http://mathiasbynens.be/notes/javascript-encoding>
             * @memberOf punycode
             * @type Object
             */
            'ucs2': {
              'decode': ucs2decode,
              'encode': ucs2encode
            },
            'decode': decode,
            'encode': encode,
            'toASCII': toASCII,
            'toUnicode': toUnicode
          };

          /** Expose `punycode` */
          // Some AMD build optimizers, like r.js, check for specific condition patterns
          // like the following:
          if (
            typeof define == 'function' &&
            typeof define.amd == 'object' &&
            define.amd
          ) {
            define('punycode', function () {
              return punycode;
            });
          } else if (freeExports && !freeExports.nodeType) {
            if (freeModule) { // in Node.js or RingoJS v0.8.0+
              freeModule.exports = punycode;
            } else { // in Narwhal or RingoJS v0.7.0-
              for (key in punycode) {
                punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
              }
            }
          } else { // in Rhino or a web browser
            root.punycode = punycode;
          }

        }(this));

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9wdW55Y29kZS9wdW55Y29kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8qISBodHRwOi8vbXRocy5iZS9wdW55Y29kZSB2MS4yLjQgYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgKi9cblx0dmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cztcblx0dmFyIGZyZWVNb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJlxuXHRcdG1vZHVsZS5leHBvcnRzID09IGZyZWVFeHBvcnRzICYmIG1vZHVsZTtcblx0dmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcblx0aWYgKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsKSB7XG5cdFx0cm9vdCA9IGZyZWVHbG9iYWw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwdW55Y29kZWAgb2JqZWN0LlxuXHQgKiBAbmFtZSBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdHZhciBwdW55Y29kZSxcblxuXHQvKiogSGlnaGVzdCBwb3NpdGl2ZSBzaWduZWQgMzItYml0IGZsb2F0IHZhbHVlICovXG5cdG1heEludCA9IDIxNDc0ODM2NDcsIC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuXHQvKiogQm9vdHN0cmluZyBwYXJhbWV0ZXJzICovXG5cdGJhc2UgPSAzNixcblx0dE1pbiA9IDEsXG5cdHRNYXggPSAyNixcblx0c2tldyA9IDM4LFxuXHRkYW1wID0gNzAwLFxuXHRpbml0aWFsQmlhcyA9IDcyLFxuXHRpbml0aWFsTiA9IDEyOCwgLy8gMHg4MFxuXHRkZWxpbWl0ZXIgPSAnLScsIC8vICdcXHgyRCdcblxuXHQvKiogUmVndWxhciBleHByZXNzaW9ucyAqL1xuXHRyZWdleFB1bnljb2RlID0gL154bi0tLyxcblx0cmVnZXhOb25BU0NJSSA9IC9bXiAtfl0vLCAvLyB1bnByaW50YWJsZSBBU0NJSSBjaGFycyArIG5vbi1BU0NJSSBjaGFyc1xuXHRyZWdleFNlcGFyYXRvcnMgPSAvXFx4MkV8XFx1MzAwMnxcXHVGRjBFfFxcdUZGNjEvZywgLy8gUkZDIDM0OTAgc2VwYXJhdG9yc1xuXG5cdC8qKiBFcnJvciBtZXNzYWdlcyAqL1xuXHRlcnJvcnMgPSB7XG5cdFx0J292ZXJmbG93JzogJ092ZXJmbG93OiBpbnB1dCBuZWVkcyB3aWRlciBpbnRlZ2VycyB0byBwcm9jZXNzJyxcblx0XHQnbm90LWJhc2ljJzogJ0lsbGVnYWwgaW5wdXQgPj0gMHg4MCAobm90IGEgYmFzaWMgY29kZSBwb2ludCknLFxuXHRcdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG5cdH0sXG5cblx0LyoqIENvbnZlbmllbmNlIHNob3J0Y3V0cyAqL1xuXHRiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW4sXG5cdGZsb29yID0gTWF0aC5mbG9vcixcblx0c3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZSxcblxuXHQvKiogVGVtcG9yYXJ5IHZhcmlhYmxlICovXG5cdGtleTtcblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGVycm9yIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBlcnJvciB0eXBlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRocm93cyBhIGBSYW5nZUVycm9yYCB3aXRoIHRoZSBhcHBsaWNhYmxlIGVycm9yIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBlcnJvcih0eXBlKSB7XG5cdFx0dGhyb3cgUmFuZ2VFcnJvcihlcnJvcnNbdHlwZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBgQXJyYXkjbWFwYCB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnkgYXJyYXlcblx0ICogaXRlbS5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBvZiB2YWx1ZXMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwKGFycmF5LCBmbikge1xuXHRcdHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFx0d2hpbGUgKGxlbmd0aC0tKSB7XG5cdFx0XHRhcnJheVtsZW5ndGhdID0gZm4oYXJyYXlbbGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnJheTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNpbXBsZSBgQXJyYXkjbWFwYC1saWtlIHdyYXBwZXIgdG8gd29yayB3aXRoIGRvbWFpbiBuYW1lIHN0cmluZ3MuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnlcblx0ICogY2hhcmFjdGVyLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IHN0cmluZyBvZiBjaGFyYWN0ZXJzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFja1xuXHQgKiBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcERvbWFpbihzdHJpbmcsIGZuKSB7XG5cdFx0cmV0dXJuIG1hcChzdHJpbmcuc3BsaXQocmVnZXhTZXBhcmF0b3JzKSwgZm4pLmpvaW4oJy4nKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIG51bWVyaWMgY29kZSBwb2ludHMgb2YgZWFjaCBVbmljb2RlXG5cdCAqIGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nLiBXaGlsZSBKYXZhU2NyaXB0IHVzZXMgVUNTLTIgaW50ZXJuYWxseSxcblx0ICogdGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgYSBwYWlyIG9mIHN1cnJvZ2F0ZSBoYWx2ZXMgKGVhY2ggb2Ygd2hpY2hcblx0ICogVUNTLTIgZXhwb3NlcyBhcyBzZXBhcmF0ZSBjaGFyYWN0ZXJzKSBpbnRvIGEgc2luZ2xlIGNvZGUgcG9pbnQsXG5cdCAqIG1hdGNoaW5nIFVURi0xNi5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5lbmNvZGVgXG5cdCAqIEBzZWUgPGh0dHA6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGRlY29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBuZXcgYXJyYXkgb2YgY29kZSBwb2ludHMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgY291bnRlciA9IDAsXG5cdFx0ICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG5cdFx0ICAgIHZhbHVlLFxuXHRcdCAgICBleHRyYTtcblx0XHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0dmFsdWUgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0XHQvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcblx0XHRcdFx0ZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0XHRpZiAoKGV4dHJhICYgMHhGQzAwKSA9PSAweERDMDApIHsgLy8gbG93IHN1cnJvZ2F0ZVxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gdW5tYXRjaGVkIHN1cnJvZ2F0ZTsgb25seSBhcHBlbmQgdGhpcyBjb2RlIHVuaXQsIGluIGNhc2UgdGhlIG5leHRcblx0XHRcdFx0XHQvLyBjb2RlIHVuaXQgaXMgdGhlIGhpZ2ggc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXJcblx0XHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdFx0Y291bnRlci0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHN0cmluZyBiYXNlZCBvbiBhbiBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZW5jb2RlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBuZXcgVW5pY29kZSBzdHJpbmcgKFVDUy0yKS5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpIHtcblx0XHRyZXR1cm4gbWFwKGFycmF5LCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdFx0aWYgKHZhbHVlID4gMHhGRkZGKSB7XG5cdFx0XHRcdHZhbHVlIC09IDB4MTAwMDA7XG5cdFx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO1xuXHRcdFx0XHR2YWx1ZSA9IDB4REMwMCB8IHZhbHVlICYgMHgzRkY7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlKTtcblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBiYXNpYyBjb2RlIHBvaW50IGludG8gYSBkaWdpdC9pbnRlZ2VyLlxuXHQgKiBAc2VlIGBkaWdpdFRvQmFzaWMoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvZGVQb2ludCBUaGUgYmFzaWMgbnVtZXJpYyBjb2RlIHBvaW50IHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQgKGZvciB1c2UgaW5cblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuXHQgKiB0aGUgY29kZSBwb2ludCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2ljVG9EaWdpdChjb2RlUG9pbnQpIHtcblx0XHRpZiAoY29kZVBvaW50IC0gNDggPCAxMCkge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDIyO1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gNjUgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDY1O1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gOTcgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDk3O1xuXHRcdH1cblx0XHRyZXR1cm4gYmFzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGRpZ2l0L2ludGVnZXIgaW50byBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gZGlnaXQgVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGlzIGBkaWdpdGAsIHdoaWNoIG5lZWRzIHRvIGJlIGluIHRoZSByYW5nZVxuXHQgKiBgMGAgdG8gYGJhc2UgLSAxYC4gSWYgYGZsYWdgIGlzIG5vbi16ZXJvLCB0aGUgdXBwZXJjYXNlIGZvcm0gaXNcblx0ICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcblx0ICogaWYgYGZsYWdgIGlzIG5vbi16ZXJvIGFuZCBgZGlnaXRgIGhhcyBubyB1cHBlcmNhc2UgZm9ybS5cblx0ICovXG5cdGZ1bmN0aW9uIGRpZ2l0VG9CYXNpYyhkaWdpdCwgZmxhZykge1xuXHRcdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdFx0Ly8gMjYuLjM1IG1hcCB0byBBU0NJSSAwLi45XG5cdFx0cmV0dXJuIGRpZ2l0ICsgMjIgKyA3NSAqIChkaWdpdCA8IDI2KSAtICgoZmxhZyAhPSAwKSA8PCA1KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuXHQgKiBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNDkyI3NlY3Rpb24tMy40XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGFwdChkZWx0YSwgbnVtUG9pbnRzLCBmaXJzdFRpbWUpIHtcblx0XHR2YXIgayA9IDA7XG5cdFx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0XHRkZWx0YSArPSBmbG9vcihkZWx0YSAvIG51bVBvaW50cyk7XG5cdFx0Zm9yICgvKiBubyBpbml0aWFsaXphdGlvbiAqLzsgZGVsdGEgPiBiYXNlTWludXNUTWluICogdE1heCA+PiAxOyBrICs9IGJhc2UpIHtcblx0XHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZsb29yKGsgKyAoYmFzZU1pbnVzVE1pbiArIDEpICogZGVsdGEgLyAoZGVsdGEgKyBza2V3KSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcblx0ICogc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdFx0Ly8gRG9uJ3QgdXNlIFVDUy0yXG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aCxcblx0XHQgICAgb3V0LFxuXHRcdCAgICBpID0gMCxcblx0XHQgICAgbiA9IGluaXRpYWxOLFxuXHRcdCAgICBiaWFzID0gaW5pdGlhbEJpYXMsXG5cdFx0ICAgIGJhc2ljLFxuXHRcdCAgICBqLFxuXHRcdCAgICBpbmRleCxcblx0XHQgICAgb2xkaSxcblx0XHQgICAgdyxcblx0XHQgICAgayxcblx0XHQgICAgZGlnaXQsXG5cdFx0ICAgIHQsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBiYXNlTWludXNUO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50czogbGV0IGBiYXNpY2AgYmUgdGhlIG51bWJlciBvZiBpbnB1dCBjb2RlXG5cdFx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0XHQvLyB0aGUgZmlyc3QgYmFzaWMgY29kZSBwb2ludHMgdG8gdGhlIG91dHB1dC5cblxuXHRcdGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0XHRpZiAoYmFzaWMgPCAwKSB7XG5cdFx0XHRiYXNpYyA9IDA7XG5cdFx0fVxuXG5cdFx0Zm9yIChqID0gMDsgaiA8IGJhc2ljOyArK2opIHtcblx0XHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdFx0aWYgKGlucHV0LmNoYXJDb2RlQXQoaikgPj0gMHg4MCkge1xuXHRcdFx0XHRlcnJvcignbm90LWJhc2ljJyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQucHVzaChpbnB1dC5jaGFyQ29kZUF0KGopKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdFx0Ly8gcG9pbnRzIHdlcmUgY29waWVkOyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG90aGVyd2lzZS5cblxuXHRcdGZvciAoaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHRcdC8vIGBpbmRleGAgaXMgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBjb25zdW1lZC5cblx0XHRcdC8vIERlY29kZSBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyIGludG8gYGRlbHRhYCxcblx0XHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0XHQvLyBpZiB3ZSBpbmNyZWFzZSBgaWAgYXMgd2UgZ28sIHRoZW4gc3VidHJhY3Qgb2ZmIGl0cyBzdGFydGluZ1xuXHRcdFx0Ly8gdmFsdWUgYXQgdGhlIGVuZCB0byBvYnRhaW4gYGRlbHRhYC5cblx0XHRcdGZvciAob2xkaSA9IGksIHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0XHRpZiAoaW5kZXggPj0gaW5wdXRMZW5ndGgpIHtcblx0XHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlnaXQgPSBiYXNpY1RvRGlnaXQoaW5wdXQuY2hhckNvZGVBdChpbmRleCsrKSk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0ID49IGJhc2UgfHwgZGlnaXQgPiBmbG9vcigobWF4SW50IC0gaSkgLyB3KSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSArPSBkaWdpdCAqIHc7XG5cdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0aWYgKHcgPiBmbG9vcihtYXhJbnQgLyBiYXNlTWludXNUKSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyAqPSBiYXNlTWludXNUO1xuXG5cdFx0XHR9XG5cblx0XHRcdG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdFx0YmlhcyA9IGFkYXB0KGkgLSBvbGRpLCBvdXQsIG9sZGkgPT0gMCk7XG5cblx0XHRcdC8vIGBpYCB3YXMgc3VwcG9zZWQgdG8gd3JhcCBhcm91bmQgZnJvbSBgb3V0YCB0byBgMGAsXG5cdFx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdFx0aWYgKGZsb29yKGkgLyBvdXQpID4gbWF4SW50IC0gbikge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0biArPSBmbG9vcihpIC8gb3V0KTtcblx0XHRcdGkgJT0gb3V0O1xuXG5cdFx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0XG5cdFx0XHRvdXRwdXQuc3BsaWNlKGkrKywgMCwgbik7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdWNzMmVuY29kZShvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyB0byBhIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5XG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuXHRcdHZhciBuLFxuXHRcdCAgICBkZWx0YSxcblx0XHQgICAgaGFuZGxlZENQQ291bnQsXG5cdFx0ICAgIGJhc2ljTGVuZ3RoLFxuXHRcdCAgICBiaWFzLFxuXHRcdCAgICBqLFxuXHRcdCAgICBtLFxuXHRcdCAgICBxLFxuXHRcdCAgICBrLFxuXHRcdCAgICB0LFxuXHRcdCAgICBjdXJyZW50VmFsdWUsXG5cdFx0ICAgIG91dHB1dCA9IFtdLFxuXHRcdCAgICAvKiogYGlucHV0TGVuZ3RoYCB3aWxsIGhvbGQgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyBpbiBgaW5wdXRgLiAqL1xuXHRcdCAgICBpbnB1dExlbmd0aCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50UGx1c09uZSxcblx0XHQgICAgYmFzZU1pbnVzVCxcblx0XHQgICAgcU1pbnVzVDtcblxuXHRcdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIFVuaWNvZGVcblx0XHRpbnB1dCA9IHVjczJkZWNvZGUoaW5wdXQpO1xuXG5cdFx0Ly8gQ2FjaGUgdGhlIGxlbmd0aFxuXHRcdGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGVcblx0XHRuID0gaW5pdGlhbE47XG5cdFx0ZGVsdGEgPSAwO1xuXHRcdGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHNcblx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoY3VycmVudFZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlZENQQ291bnQgPSBiYXNpY0xlbmd0aCA9IG91dHB1dC5sZW5ndGg7XG5cblx0XHQvLyBgaGFuZGxlZENQQ291bnRgIGlzIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZDtcblx0XHQvLyBgYmFzaWNMZW5ndGhgIGlzIHRoZSBudW1iZXIgb2YgYmFzaWMgY29kZSBwb2ludHMuXG5cblx0XHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyAtIGlmIGl0IGlzIG5vdCBlbXB0eSAtIHdpdGggYSBkZWxpbWl0ZXJcblx0XHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRcdG91dHB1dC5wdXNoKGRlbGltaXRlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHRcdHdoaWxlIChoYW5kbGVkQ1BDb3VudCA8IGlucHV0TGVuZ3RoKSB7XG5cblx0XHRcdC8vIEFsbCBub24tYmFzaWMgY29kZSBwb2ludHMgPCBuIGhhdmUgYmVlbiBoYW5kbGVkIGFscmVhZHkuIEZpbmQgdGhlIG5leHRcblx0XHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0XHRmb3IgKG0gPSBtYXhJbnQsIGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+PSBuICYmIGN1cnJlbnRWYWx1ZSA8IG0pIHtcblx0XHRcdFx0XHRtID0gY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluY3JlYXNlIGBkZWx0YWAgZW5vdWdoIHRvIGFkdmFuY2UgdGhlIGRlY29kZXIncyA8bixpPiBzdGF0ZSB0byA8bSwwPixcblx0XHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93XG5cdFx0XHRoYW5kbGVkQ1BDb3VudFBsdXNPbmUgPSBoYW5kbGVkQ1BDb3VudCArIDE7XG5cdFx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRcdG4gPSBtO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID09IG4pIHtcblx0XHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlclxuXHRcdFx0XHRcdGZvciAocSA9IGRlbHRhLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblx0XHRcdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXHRcdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goXG5cdFx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRxID0gZmxvb3IocU1pbnVzVCAvIGJhc2VNaW51c1QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWMocSwgMCkpKTtcblx0XHRcdFx0XHRiaWFzID0gYWRhcHQoZGVsdGEsIGhhbmRsZWRDUENvdW50UGx1c09uZSwgaGFuZGxlZENQQ291bnQgPT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRcdGRlbHRhID0gMDtcblx0XHRcdFx0XHQrK2hhbmRsZWRDUENvdW50O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCsrZGVsdGE7XG5cdFx0XHQrK247XG5cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSB0byBVbmljb2RlLiBPbmx5IHRoZVxuXHQgKiBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLCBpLmUuIGl0IGRvZXNuJ3Rcblx0ICogbWF0dGVyIGlmIHlvdSBjYWxsIGl0IG9uIGEgc3RyaW5nIHRoYXQgaGFzIGFscmVhZHkgYmVlbiBjb252ZXJ0ZWQgdG9cblx0ICogVW5pY29kZS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIFB1bnljb2RlIGRvbWFpbiBuYW1lIHRvIGNvbnZlcnQgdG8gVW5pY29kZS5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFVuaWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIFB1bnljb2RlXG5cdCAqIHN0cmluZy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvVW5pY29kZShkb21haW4pIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGRvbWFpbiwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhQdW55Y29kZS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyBkZWNvZGUoc3RyaW5nLnNsaWNlKDQpLnRvTG93ZXJDYXNlKCkpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVW5pY29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgdG8gUHVueWNvZGUuIE9ubHkgdGhlXG5cdCAqIG5vbi1BU0NJSSBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgd2lsbCBiZSBjb252ZXJ0ZWQsIGkuZS4gaXQgZG9lc24ndFxuXHQgKiBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpbiBBU0NJSS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lIHRvIGNvbnZlcnQsIGFzIGEgVW5pY29kZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FTQ0lJKGRvbWFpbikge1xuXHRcdHJldHVybiBtYXBEb21haW4oZG9tYWluLCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleE5vbkFTQ0lJLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/ICd4bi0tJyArIGVuY29kZShzdHJpbmcpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqIERlZmluZSB0aGUgcHVibGljIEFQSSAqL1xuXHRwdW55Y29kZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgUHVueWNvZGUuanMgdmVyc2lvbiBudW1iZXIuXG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgU3RyaW5nXG5cdFx0ICovXG5cdFx0J3ZlcnNpb24nOiAnMS4yLjQnLFxuXHRcdC8qKlxuXHRcdCAqIEFuIG9iamVjdCBvZiBtZXRob2RzIHRvIGNvbnZlcnQgZnJvbSBKYXZhU2NyaXB0J3MgaW50ZXJuYWwgY2hhcmFjdGVyXG5cdFx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0XHQgKiBAc2VlIDxodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIE9iamVjdFxuXHRcdCAqL1xuXHRcdCd1Y3MyJzoge1xuXHRcdFx0J2RlY29kZSc6IHVjczJkZWNvZGUsXG5cdFx0XHQnZW5jb2RlJzogdWNzMmVuY29kZVxuXHRcdH0sXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0XHQndG9Vbmljb2RlJzogdG9Vbmljb2RlXG5cdH07XG5cblx0LyoqIEV4cG9zZSBgcHVueWNvZGVgICovXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKCdwdW55Y29kZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHB1bnljb2RlO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmICFmcmVlRXhwb3J0cy5ub2RlVHlwZSkge1xuXHRcdGlmIChmcmVlTW9kdWxlKSB7IC8vIGluIE5vZGUuanMgb3IgUmluZ29KUyB2MC44LjArXG5cdFx0XHRmcmVlTW9kdWxlLmV4cG9ydHMgPSBwdW55Y29kZTtcblx0XHR9IGVsc2UgeyAvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuXHRcdFx0Zm9yIChrZXkgaW4gcHVueWNvZGUpIHtcblx0XHRcdFx0cHVueWNvZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IHB1bnljb2RlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHsgLy8gaW4gUmhpbm8gb3IgYSB3ZWIgYnJvd3NlclxuXHRcdHJvb3QucHVueWNvZGUgPSBwdW55Y29kZTtcblx0fVxuXG59KHRoaXMpKTtcbiJdfQ==
    }, {}],
    117: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var expando = 'sektor-' + Date.now();
        var rsiblings = /[+~]/;
        var document = global.document;
        var del = (document && document.documentElement) || {};
        var match = (
          del.matches ||
          del.webkitMatchesSelector ||
          del.mozMatchesSelector ||
          del.oMatchesSelector ||
          del.msMatchesSelector ||
          never
        );

        module.exports = sektor;

        sektor.matches = matches;
        sektor.matchesSelector = matchesSelector;

        function qsa(selector, context) {
          var existed, id, prefix, prefixed, adapter, hack = context !== document;
          if (hack) { // id hack for context-rooted queries
            existed = context.getAttribute('id');
            id = existed || expando;
            prefix = '#' + id + ' ';
            prefixed = prefix + selector.replace(/,/g, ',' + prefix);
            adapter = rsiblings.test(selector) && context.parentNode;
            if (!existed) {
              context.setAttribute('id', id);
            }
          }
          try {
            return (adapter || context).querySelectorAll(prefixed || selector);
          } catch (e) {
            return [];
          } finally {
            if (existed === null) {
              context.removeAttribute('id');
            }
          }
        }

        function sektor(selector, ctx, collection, seed) {
          var element;
          var context = ctx || document;
          var results = collection || [];
          var i = 0;
          if (typeof selector !== 'string') {
            return results;
          }
          if (context.nodeType !== 1 && context.nodeType !== 9) {
            return []; // bail if context is not an element or document
          }
          if (seed) {
            while ((element = seed[i++])) {
              if (matchesSelector(element, selector)) {
                results.push(element);
              }
            }
          } else {
            results.push.apply(results, qsa(selector, context));
          }
          return results;
        }

        function matches(selector, elements) {
          return sektor(selector, null, null, elements);
        }

        function matchesSelector(element, selector) {
          return match.call(element, selector);
        }

        function never() {
          return false;
        }

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9zZWt0b3Ivc3JjL3Nla3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBleHBhbmRvID0gJ3Nla3Rvci0nICsgRGF0ZS5ub3coKTtcbnZhciByc2libGluZ3MgPSAvWyt+XS87XG52YXIgZG9jdW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgZGVsID0gKGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgfHwge307XG52YXIgbWF0Y2ggPSAoXG4gIGRlbC5tYXRjaGVzIHx8XG4gIGRlbC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcbiAgZGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICBkZWwub01hdGNoZXNTZWxlY3RvciB8fFxuICBkZWwubXNNYXRjaGVzU2VsZWN0b3IgfHxcbiAgbmV2ZXJcbik7XG5cbm1vZHVsZS5leHBvcnRzID0gc2VrdG9yO1xuXG5zZWt0b3IubWF0Y2hlcyA9IG1hdGNoZXM7XG5zZWt0b3IubWF0Y2hlc1NlbGVjdG9yID0gbWF0Y2hlc1NlbGVjdG9yO1xuXG5mdW5jdGlvbiBxc2EgKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gIHZhciBleGlzdGVkLCBpZCwgcHJlZml4LCBwcmVmaXhlZCwgYWRhcHRlciwgaGFjayA9IGNvbnRleHQgIT09IGRvY3VtZW50O1xuICBpZiAoaGFjaykgeyAvLyBpZCBoYWNrIGZvciBjb250ZXh0LXJvb3RlZCBxdWVyaWVzXG4gICAgZXhpc3RlZCA9IGNvbnRleHQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIGlkID0gZXhpc3RlZCB8fCBleHBhbmRvO1xuICAgIHByZWZpeCA9ICcjJyArIGlkICsgJyAnO1xuICAgIHByZWZpeGVkID0gcHJlZml4ICsgc2VsZWN0b3IucmVwbGFjZSgvLC9nLCAnLCcgKyBwcmVmaXgpO1xuICAgIGFkYXB0ZXIgPSByc2libGluZ3MudGVzdChzZWxlY3RvcikgJiYgY29udGV4dC5wYXJlbnROb2RlO1xuICAgIGlmICghZXhpc3RlZCkgeyBjb250ZXh0LnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7IH1cbiAgfVxuICB0cnkge1xuICAgIHJldHVybiAoYWRhcHRlciB8fCBjb250ZXh0KS5xdWVyeVNlbGVjdG9yQWxsKHByZWZpeGVkIHx8IHNlbGVjdG9yKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBbXTtcbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAoZXhpc3RlZCA9PT0gbnVsbCkgeyBjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTsgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNla3RvciAoc2VsZWN0b3IsIGN0eCwgY29sbGVjdGlvbiwgc2VlZCkge1xuICB2YXIgZWxlbWVudDtcbiAgdmFyIGNvbnRleHQgPSBjdHggfHwgZG9jdW1lbnQ7XG4gIHZhciByZXN1bHRzID0gY29sbGVjdGlvbiB8fCBbXTtcbiAgdmFyIGkgPSAwO1xuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG4gIGlmIChjb250ZXh0Lm5vZGVUeXBlICE9PSAxICYmIGNvbnRleHQubm9kZVR5cGUgIT09IDkpIHtcbiAgICByZXR1cm4gW107IC8vIGJhaWwgaWYgY29udGV4dCBpcyBub3QgYW4gZWxlbWVudCBvciBkb2N1bWVudFxuICB9XG4gIGlmIChzZWVkKSB7XG4gICAgd2hpbGUgKChlbGVtZW50ID0gc2VlZFtpKytdKSkge1xuICAgICAgaWYgKG1hdGNoZXNTZWxlY3RvcihlbGVtZW50LCBzZWxlY3RvcikpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXN1bHRzLnB1c2guYXBwbHkocmVzdWx0cywgcXNhKHNlbGVjdG9yLCBjb250ZXh0KSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMgKHNlbGVjdG9yLCBlbGVtZW50cykge1xuICByZXR1cm4gc2VrdG9yKHNlbGVjdG9yLCBudWxsLCBudWxsLCBlbGVtZW50cyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNTZWxlY3RvciAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIG1hdGNoLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBuZXZlciAoKSB7IHJldHVybiBmYWxzZTsgfVxuIl19
    }, {}],
    118: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var getSelection;
        var doc = global.document;
        var getSelectionRaw = require('./getSelectionRaw');
        var getSelectionNullOp = require('./getSelectionNullOp');
        var getSelectionSynthetic = require('./getSelectionSynthetic');
        var isHost = require('./isHost');
        if (isHost.method(global, 'getSelection')) {
          getSelection = getSelectionRaw;
        } else if (typeof doc.selection === 'object' && doc.selection) {
          getSelection = getSelectionSynthetic;
        } else {
          getSelection = getSelectionNullOp;
        }

        module.exports = getSelection;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9zZWxlY2Npb24vc3JjL2dldFNlbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRTZWxlY3Rpb247XG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIGdldFNlbGVjdGlvblJhdyA9IHJlcXVpcmUoJy4vZ2V0U2VsZWN0aW9uUmF3Jyk7XG52YXIgZ2V0U2VsZWN0aW9uTnVsbE9wID0gcmVxdWlyZSgnLi9nZXRTZWxlY3Rpb25OdWxsT3AnKTtcbnZhciBnZXRTZWxlY3Rpb25TeW50aGV0aWMgPSByZXF1aXJlKCcuL2dldFNlbGVjdGlvblN5bnRoZXRpYycpO1xudmFyIGlzSG9zdCA9IHJlcXVpcmUoJy4vaXNIb3N0Jyk7XG5pZiAoaXNIb3N0Lm1ldGhvZChnbG9iYWwsICdnZXRTZWxlY3Rpb24nKSkge1xuICBnZXRTZWxlY3Rpb24gPSBnZXRTZWxlY3Rpb25SYXc7XG59IGVsc2UgaWYgKHR5cGVvZiBkb2Muc2VsZWN0aW9uID09PSAnb2JqZWN0JyAmJiBkb2Muc2VsZWN0aW9uKSB7XG4gIGdldFNlbGVjdGlvbiA9IGdldFNlbGVjdGlvblN5bnRoZXRpYztcbn0gZWxzZSB7XG4gIGdldFNlbGVjdGlvbiA9IGdldFNlbGVjdGlvbk51bGxPcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTZWxlY3Rpb247XG4iXX0=
    }, {
      "./getSelectionNullOp": 119,
      "./getSelectionRaw": 120,
      "./getSelectionSynthetic": 121,
      "./isHost": 122
    }],
    119: [function (require, module, exports) {
      'use strict';

      function noop() {}

      function getSelectionNullOp() {
        return {
          removeAllRanges: noop,
          addRange: noop
        };
      }

      module.exports = getSelectionNullOp;

    }, {}],
    120: [function (require, module, exports) {
      (function (global) {
        'use strict';

        function getSelectionRaw() {
          return global.getSelection();
        }

        module.exports = getSelectionRaw;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9zZWxlY2Npb24vc3JjL2dldFNlbGVjdGlvblJhdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBnZXRTZWxlY3Rpb25SYXcgKCkge1xuICByZXR1cm4gZ2xvYmFsLmdldFNlbGVjdGlvbigpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFNlbGVjdGlvblJhdztcbiJdfQ==
    }, {}],
    121: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var rangeToTextRange = require('./rangeToTextRange');
        var doc = global.document;
        var body = doc.body;
        var GetSelectionProto = GetSelection.prototype;

        function GetSelection(selection) {
          var self = this;
          var range = selection.createRange();

          this._selection = selection;
          this._ranges = [];

          if (selection.type === 'Control') {
            updateControlSelection(self);
          } else if (isTextRange(range)) {
            updateFromTextRange(self, range);
          } else {
            updateEmptySelection(self);
          }
        }

        GetSelectionProto.removeAllRanges = function () {
          var textRange;
          try {
            this._selection.empty();
            if (this._selection.type !== 'None') {
              textRange = body.createTextRange();
              textRange.select();
              this._selection.empty();
            }
          } catch (e) {}
          updateEmptySelection(this);
        };

        GetSelectionProto.addRange = function (range) {
          if (this._selection.type === 'Control') {
            addRangeToControlSelection(this, range);
          } else {
            rangeToTextRange(range).select();
            this._ranges[0] = range;
            this.rangeCount = 1;
            this.isCollapsed = this._ranges[0].collapsed;
            updateAnchorAndFocusFromRange(this, range, false);
          }
        };

        GetSelectionProto.setRanges = function (ranges) {
          this.removeAllRanges();
          var rangeCount = ranges.length;
          if (rangeCount > 1) {
            createControlSelection(this, ranges);
          } else if (rangeCount) {
            this.addRange(ranges[0]);
          }
        };

        GetSelectionProto.getRangeAt = function (index) {
          if (index < 0 || index >= this.rangeCount) {
            throw new Error('getRangeAt(): index out of bounds');
          } else {
            return this._ranges[index].cloneRange();
          }
        };

        GetSelectionProto.removeRange = function (range) {
          if (this._selection.type !== 'Control') {
            removeRangeManually(this, range);
            return;
          }
          var controlRange = this._selection.createRange();
          var rangeElement = getSingleElementFromRange(range);
          var newControlRange = body.createControlRange();
          var el;
          var removed = false;
          for (var i = 0, len = controlRange.length; i < len; ++i) {
            el = controlRange.item(i);
            if (el !== rangeElement || removed) {
              newControlRange.add(controlRange.item(i));
            } else {
              removed = true;
            }
          }
          newControlRange.select();
          updateControlSelection(this);
        };

        GetSelectionProto.eachRange = function (fn, returnValue) {
          var i = 0;
          var len = this._ranges.length;
          for (i = 0; i < len; ++i) {
            if (fn(this.getRangeAt(i))) {
              return returnValue;
            }
          }
        };

        GetSelectionProto.getAllRanges = function () {
          var ranges = [];
          this.eachRange(function (range) {
            ranges.push(range);
          });
          return ranges;
        };

        GetSelectionProto.setSingleRange = function (range) {
          this.removeAllRanges();
          this.addRange(range);
        };

        function createControlSelection(sel, ranges) {
          var controlRange = body.createControlRange();
          for (var i = 0, el, len = ranges.length; i < len; ++i) {
            el = getSingleElementFromRange(ranges[i]);
            try {
              controlRange.add(el);
            } catch (e) {
              throw new Error('setRanges(): Element could not be added to control selection');
            }
          }
          controlRange.select();
          updateControlSelection(sel);
        }

        function removeRangeManually(sel, range) {
          var ranges = sel.getAllRanges();
          sel.removeAllRanges();
          for (var i = 0, len = ranges.length; i < len; ++i) {
            if (!isSameRange(range, ranges[i])) {
              sel.addRange(ranges[i]);
            }
          }
          if (!sel.rangeCount) {
            updateEmptySelection(sel);
          }
        }

        function updateAnchorAndFocusFromRange(sel, range) {
          var anchorPrefix = 'start';
          var focusPrefix = 'end';
          sel.anchorNode = range[anchorPrefix + 'Container'];
          sel.anchorOffset = range[anchorPrefix + 'Offset'];
          sel.focusNode = range[focusPrefix + 'Container'];
          sel.focusOffset = range[focusPrefix + 'Offset'];
        }

        function updateEmptySelection(sel) {
          sel.anchorNode = sel.focusNode = null;
          sel.anchorOffset = sel.focusOffset = 0;
          sel.rangeCount = 0;
          sel.isCollapsed = true;
          sel._ranges.length = 0;
        }

        function rangeContainsSingleElement(rangeNodes) {
          if (!rangeNodes.length || rangeNodes[0].nodeType !== 1) {
            return false;
          }
          for (var i = 1, len = rangeNodes.length; i < len; ++i) {
            if (!isAncestorOf(rangeNodes[0], rangeNodes[i])) {
              return false;
            }
          }
          return true;
        }

        function getSingleElementFromRange(range) {
          var nodes = range.getNodes();
          if (!rangeContainsSingleElement(nodes)) {
            throw new Error('getSingleElementFromRange(): range did not consist of a single element');
          }
          return nodes[0];
        }

        function isTextRange(range) {
          return range && range.text !== void 0;
        }

        function updateFromTextRange(sel, range) {
          sel._ranges = [range];
          updateAnchorAndFocusFromRange(sel, range, false);
          sel.rangeCount = 1;
          sel.isCollapsed = range.collapsed;
        }

        function updateControlSelection(sel) {
          sel._ranges.length = 0;
          if (sel._selection.type === 'None') {
            updateEmptySelection(sel);
          } else {
            var controlRange = sel._selection.createRange();
            if (isTextRange(controlRange)) {
              updateFromTextRange(sel, controlRange);
            } else {
              sel.rangeCount = controlRange.length;
              var range;
              for (var i = 0; i < sel.rangeCount; ++i) {
                range = doc.createRange();
                range.selectNode(controlRange.item(i));
                sel._ranges.push(range);
              }
              sel.isCollapsed = sel.rangeCount === 1 && sel._ranges[0].collapsed;
              updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            }
          }
        }

        function addRangeToControlSelection(sel, range) {
          var controlRange = sel._selection.createRange();
          var rangeElement = getSingleElementFromRange(range);
          var newControlRange = body.createControlRange();
          for (var i = 0, len = controlRange.length; i < len; ++i) {
            newControlRange.add(controlRange.item(i));
          }
          try {
            newControlRange.add(rangeElement);
          } catch (e) {
            throw new Error('addRange(): Element could not be added to control selection');
          }
          newControlRange.select();
          updateControlSelection(sel);
        }

        function isSameRange(left, right) {
          return (
            left.startContainer === right.startContainer &&
            left.startOffset === right.startOffset &&
            left.endContainer === right.endContainer &&
            left.endOffset === right.endOffset
          );
        }

        function isAncestorOf(ancestor, descendant) {
          var node = descendant;
          while (node.parentNode) {
            if (node.parentNode === ancestor) {
              return true;
            }
            node = node.parentNode;
          }
          return false;
        }

        function getSelection() {
          return new GetSelection(global.document.selection);
        }

        module.exports = getSelection;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9zZWxlY2Npb24vc3JjL2dldFNlbGVjdGlvblN5bnRoZXRpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmFuZ2VUb1RleHRSYW5nZSA9IHJlcXVpcmUoJy4vcmFuZ2VUb1RleHRSYW5nZScpO1xudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciBib2R5ID0gZG9jLmJvZHk7XG52YXIgR2V0U2VsZWN0aW9uUHJvdG8gPSBHZXRTZWxlY3Rpb24ucHJvdG90eXBlO1xuXG5mdW5jdGlvbiBHZXRTZWxlY3Rpb24gKHNlbGVjdGlvbikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciByYW5nZSA9IHNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuXG4gIHRoaXMuX3NlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbiAgdGhpcy5fcmFuZ2VzID0gW107XG5cbiAgaWYgKHNlbGVjdGlvbi50eXBlID09PSAnQ29udHJvbCcpIHtcbiAgICB1cGRhdGVDb250cm9sU2VsZWN0aW9uKHNlbGYpO1xuICB9IGVsc2UgaWYgKGlzVGV4dFJhbmdlKHJhbmdlKSkge1xuICAgIHVwZGF0ZUZyb21UZXh0UmFuZ2Uoc2VsZiwgcmFuZ2UpO1xuICB9IGVsc2Uge1xuICAgIHVwZGF0ZUVtcHR5U2VsZWN0aW9uKHNlbGYpO1xuICB9XG59XG5cbkdldFNlbGVjdGlvblByb3RvLnJlbW92ZUFsbFJhbmdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRleHRSYW5nZTtcbiAgdHJ5IHtcbiAgICB0aGlzLl9zZWxlY3Rpb24uZW1wdHkoKTtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLnR5cGUgIT09ICdOb25lJykge1xuICAgICAgdGV4dFJhbmdlID0gYm9keS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgIHRleHRSYW5nZS5zZWxlY3QoKTtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbi5lbXB0eSgpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICB9XG4gIHVwZGF0ZUVtcHR5U2VsZWN0aW9uKHRoaXMpO1xufTtcblxuR2V0U2VsZWN0aW9uUHJvdG8uYWRkUmFuZ2UgPSBmdW5jdGlvbiAocmFuZ2UpIHtcbiAgaWYgKHRoaXMuX3NlbGVjdGlvbi50eXBlID09PSAnQ29udHJvbCcpIHtcbiAgICBhZGRSYW5nZVRvQ29udHJvbFNlbGVjdGlvbih0aGlzLCByYW5nZSk7XG4gIH0gZWxzZSB7XG4gICAgcmFuZ2VUb1RleHRSYW5nZShyYW5nZSkuc2VsZWN0KCk7XG4gICAgdGhpcy5fcmFuZ2VzWzBdID0gcmFuZ2U7XG4gICAgdGhpcy5yYW5nZUNvdW50ID0gMTtcbiAgICB0aGlzLmlzQ29sbGFwc2VkID0gdGhpcy5fcmFuZ2VzWzBdLmNvbGxhcHNlZDtcbiAgICB1cGRhdGVBbmNob3JBbmRGb2N1c0Zyb21SYW5nZSh0aGlzLCByYW5nZSwgZmFsc2UpO1xuICB9XG59O1xuXG5HZXRTZWxlY3Rpb25Qcm90by5zZXRSYW5nZXMgPSBmdW5jdGlvbiAocmFuZ2VzKSB7XG4gIHRoaXMucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gIHZhciByYW5nZUNvdW50ID0gcmFuZ2VzLmxlbmd0aDtcbiAgaWYgKHJhbmdlQ291bnQgPiAxKSB7XG4gICAgY3JlYXRlQ29udHJvbFNlbGVjdGlvbih0aGlzLCByYW5nZXMpO1xuICB9IGVsc2UgaWYgKHJhbmdlQ291bnQpIHtcbiAgICB0aGlzLmFkZFJhbmdlKHJhbmdlc1swXSk7XG4gIH1cbn07XG5cbkdldFNlbGVjdGlvblByb3RvLmdldFJhbmdlQXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnJhbmdlQ291bnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFJhbmdlQXQoKTogaW5kZXggb3V0IG9mIGJvdW5kcycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLl9yYW5nZXNbaW5kZXhdLmNsb25lUmFuZ2UoKTtcbiAgfVxufTtcblxuR2V0U2VsZWN0aW9uUHJvdG8ucmVtb3ZlUmFuZ2UgPSBmdW5jdGlvbiAocmFuZ2UpIHtcbiAgaWYgKHRoaXMuX3NlbGVjdGlvbi50eXBlICE9PSAnQ29udHJvbCcpIHtcbiAgICByZW1vdmVSYW5nZU1hbnVhbGx5KHRoaXMsIHJhbmdlKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGNvbnRyb2xSYW5nZSA9IHRoaXMuX3NlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICB2YXIgcmFuZ2VFbGVtZW50ID0gZ2V0U2luZ2xlRWxlbWVudEZyb21SYW5nZShyYW5nZSk7XG4gIHZhciBuZXdDb250cm9sUmFuZ2UgPSBib2R5LmNyZWF0ZUNvbnRyb2xSYW5nZSgpO1xuICB2YXIgZWw7XG4gIHZhciByZW1vdmVkID0gZmFsc2U7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb250cm9sUmFuZ2UubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBlbCA9IGNvbnRyb2xSYW5nZS5pdGVtKGkpO1xuICAgIGlmIChlbCAhPT0gcmFuZ2VFbGVtZW50IHx8IHJlbW92ZWQpIHtcbiAgICAgIG5ld0NvbnRyb2xSYW5nZS5hZGQoY29udHJvbFJhbmdlLml0ZW0oaSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgbmV3Q29udHJvbFJhbmdlLnNlbGVjdCgpO1xuICB1cGRhdGVDb250cm9sU2VsZWN0aW9uKHRoaXMpO1xufTtcblxuR2V0U2VsZWN0aW9uUHJvdG8uZWFjaFJhbmdlID0gZnVuY3Rpb24gKGZuLCByZXR1cm5WYWx1ZSkge1xuICB2YXIgaSA9IDA7XG4gIHZhciBsZW4gPSB0aGlzLl9yYW5nZXMubGVuZ3RoO1xuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoZm4odGhpcy5nZXRSYW5nZUF0KGkpKSkge1xuICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH1cbiAgfVxufTtcblxuR2V0U2VsZWN0aW9uUHJvdG8uZ2V0QWxsUmFuZ2VzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcmFuZ2VzID0gW107XG4gIHRoaXMuZWFjaFJhbmdlKGZ1bmN0aW9uIChyYW5nZSkge1xuICAgIHJhbmdlcy5wdXNoKHJhbmdlKTtcbiAgfSk7XG4gIHJldHVybiByYW5nZXM7XG59O1xuXG5HZXRTZWxlY3Rpb25Qcm90by5zZXRTaW5nbGVSYW5nZSA9IGZ1bmN0aW9uIChyYW5nZSkge1xuICB0aGlzLnJlbW92ZUFsbFJhbmdlcygpO1xuICB0aGlzLmFkZFJhbmdlKHJhbmdlKTtcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRyb2xTZWxlY3Rpb24gKHNlbCwgcmFuZ2VzKSB7XG4gIHZhciBjb250cm9sUmFuZ2UgPSBib2R5LmNyZWF0ZUNvbnRyb2xSYW5nZSgpO1xuICBmb3IgKHZhciBpID0gMCwgZWwsIGxlbiA9IHJhbmdlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGVsID0gZ2V0U2luZ2xlRWxlbWVudEZyb21SYW5nZShyYW5nZXNbaV0pO1xuICAgIHRyeSB7XG4gICAgICBjb250cm9sUmFuZ2UuYWRkKGVsKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFJhbmdlcygpOiBFbGVtZW50IGNvdWxkIG5vdCBiZSBhZGRlZCB0byBjb250cm9sIHNlbGVjdGlvbicpO1xuICAgIH1cbiAgfVxuICBjb250cm9sUmFuZ2Uuc2VsZWN0KCk7XG4gIHVwZGF0ZUNvbnRyb2xTZWxlY3Rpb24oc2VsKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUmFuZ2VNYW51YWxseSAoc2VsLCByYW5nZSkge1xuICB2YXIgcmFuZ2VzID0gc2VsLmdldEFsbFJhbmdlcygpO1xuICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByYW5nZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoIWlzU2FtZVJhbmdlKHJhbmdlLCByYW5nZXNbaV0pKSB7XG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2VzW2ldKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFzZWwucmFuZ2VDb3VudCkge1xuICAgIHVwZGF0ZUVtcHR5U2VsZWN0aW9uKHNlbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQW5jaG9yQW5kRm9jdXNGcm9tUmFuZ2UgKHNlbCwgcmFuZ2UpIHtcbiAgdmFyIGFuY2hvclByZWZpeCA9ICdzdGFydCc7XG4gIHZhciBmb2N1c1ByZWZpeCA9ICdlbmQnO1xuICBzZWwuYW5jaG9yTm9kZSA9IHJhbmdlW2FuY2hvclByZWZpeCArICdDb250YWluZXInXTtcbiAgc2VsLmFuY2hvck9mZnNldCA9IHJhbmdlW2FuY2hvclByZWZpeCArICdPZmZzZXQnXTtcbiAgc2VsLmZvY3VzTm9kZSA9IHJhbmdlW2ZvY3VzUHJlZml4ICsgJ0NvbnRhaW5lciddO1xuICBzZWwuZm9jdXNPZmZzZXQgPSByYW5nZVtmb2N1c1ByZWZpeCArICdPZmZzZXQnXTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRW1wdHlTZWxlY3Rpb24gKHNlbCkge1xuICBzZWwuYW5jaG9yTm9kZSA9IHNlbC5mb2N1c05vZGUgPSBudWxsO1xuICBzZWwuYW5jaG9yT2Zmc2V0ID0gc2VsLmZvY3VzT2Zmc2V0ID0gMDtcbiAgc2VsLnJhbmdlQ291bnQgPSAwO1xuICBzZWwuaXNDb2xsYXBzZWQgPSB0cnVlO1xuICBzZWwuX3Jhbmdlcy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiByYW5nZUNvbnRhaW5zU2luZ2xlRWxlbWVudCAocmFuZ2VOb2Rlcykge1xuICBpZiAoIXJhbmdlTm9kZXMubGVuZ3RoIHx8IHJhbmdlTm9kZXNbMF0ubm9kZVR5cGUgIT09IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IHJhbmdlTm9kZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoIWlzQW5jZXN0b3JPZihyYW5nZU5vZGVzWzBdLCByYW5nZU5vZGVzW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0U2luZ2xlRWxlbWVudEZyb21SYW5nZSAocmFuZ2UpIHtcbiAgdmFyIG5vZGVzID0gcmFuZ2UuZ2V0Tm9kZXMoKTtcbiAgaWYgKCFyYW5nZUNvbnRhaW5zU2luZ2xlRWxlbWVudChub2RlcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNpbmdsZUVsZW1lbnRGcm9tUmFuZ2UoKTogcmFuZ2UgZGlkIG5vdCBjb25zaXN0IG9mIGEgc2luZ2xlIGVsZW1lbnQnKTtcbiAgfVxuICByZXR1cm4gbm9kZXNbMF07XG59XG5cbmZ1bmN0aW9uIGlzVGV4dFJhbmdlIChyYW5nZSkge1xuICByZXR1cm4gcmFuZ2UgJiYgcmFuZ2UudGV4dCAhPT0gdm9pZCAwO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVGcm9tVGV4dFJhbmdlIChzZWwsIHJhbmdlKSB7XG4gIHNlbC5fcmFuZ2VzID0gW3JhbmdlXTtcbiAgdXBkYXRlQW5jaG9yQW5kRm9jdXNGcm9tUmFuZ2Uoc2VsLCByYW5nZSwgZmFsc2UpO1xuICBzZWwucmFuZ2VDb3VudCA9IDE7XG4gIHNlbC5pc0NvbGxhcHNlZCA9IHJhbmdlLmNvbGxhcHNlZDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29udHJvbFNlbGVjdGlvbiAoc2VsKSB7XG4gIHNlbC5fcmFuZ2VzLmxlbmd0aCA9IDA7XG4gIGlmIChzZWwuX3NlbGVjdGlvbi50eXBlID09PSAnTm9uZScpIHtcbiAgICB1cGRhdGVFbXB0eVNlbGVjdGlvbihzZWwpO1xuICB9IGVsc2Uge1xuICAgIHZhciBjb250cm9sUmFuZ2UgPSBzZWwuX3NlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgIGlmIChpc1RleHRSYW5nZShjb250cm9sUmFuZ2UpKSB7XG4gICAgICB1cGRhdGVGcm9tVGV4dFJhbmdlKHNlbCwgY29udHJvbFJhbmdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsLnJhbmdlQ291bnQgPSBjb250cm9sUmFuZ2UubGVuZ3RoO1xuICAgICAgdmFyIHJhbmdlO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWwucmFuZ2VDb3VudDsgKytpKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoY29udHJvbFJhbmdlLml0ZW0oaSkpO1xuICAgICAgICBzZWwuX3Jhbmdlcy5wdXNoKHJhbmdlKTtcbiAgICAgIH1cbiAgICAgIHNlbC5pc0NvbGxhcHNlZCA9IHNlbC5yYW5nZUNvdW50ID09PSAxICYmIHNlbC5fcmFuZ2VzWzBdLmNvbGxhcHNlZDtcbiAgICAgIHVwZGF0ZUFuY2hvckFuZEZvY3VzRnJvbVJhbmdlKHNlbCwgc2VsLl9yYW5nZXNbc2VsLnJhbmdlQ291bnQgLSAxXSwgZmFsc2UpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRSYW5nZVRvQ29udHJvbFNlbGVjdGlvbiAoc2VsLCByYW5nZSkge1xuICB2YXIgY29udHJvbFJhbmdlID0gc2VsLl9zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgdmFyIHJhbmdlRWxlbWVudCA9IGdldFNpbmdsZUVsZW1lbnRGcm9tUmFuZ2UocmFuZ2UpO1xuICB2YXIgbmV3Q29udHJvbFJhbmdlID0gYm9keS5jcmVhdGVDb250cm9sUmFuZ2UoKTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvbnRyb2xSYW5nZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIG5ld0NvbnRyb2xSYW5nZS5hZGQoY29udHJvbFJhbmdlLml0ZW0oaSkpO1xuICB9XG4gIHRyeSB7XG4gICAgbmV3Q29udHJvbFJhbmdlLmFkZChyYW5nZUVsZW1lbnQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRSYW5nZSgpOiBFbGVtZW50IGNvdWxkIG5vdCBiZSBhZGRlZCB0byBjb250cm9sIHNlbGVjdGlvbicpO1xuICB9XG4gIG5ld0NvbnRyb2xSYW5nZS5zZWxlY3QoKTtcbiAgdXBkYXRlQ29udHJvbFNlbGVjdGlvbihzZWwpO1xufVxuXG5mdW5jdGlvbiBpc1NhbWVSYW5nZSAobGVmdCwgcmlnaHQpIHtcbiAgcmV0dXJuIChcbiAgICBsZWZ0LnN0YXJ0Q29udGFpbmVyID09PSByaWdodC5zdGFydENvbnRhaW5lciAmJlxuICAgIGxlZnQuc3RhcnRPZmZzZXQgPT09IHJpZ2h0LnN0YXJ0T2Zmc2V0ICYmXG4gICAgbGVmdC5lbmRDb250YWluZXIgPT09IHJpZ2h0LmVuZENvbnRhaW5lciAmJlxuICAgIGxlZnQuZW5kT2Zmc2V0ID09PSByaWdodC5lbmRPZmZzZXRcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNBbmNlc3Rvck9mIChhbmNlc3RvciwgZGVzY2VuZGFudCkge1xuICB2YXIgbm9kZSA9IGRlc2NlbmRhbnQ7XG4gIHdoaWxlIChub2RlLnBhcmVudE5vZGUpIHtcbiAgICBpZiAobm9kZS5wYXJlbnROb2RlID09PSBhbmNlc3Rvcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRTZWxlY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IEdldFNlbGVjdGlvbihnbG9iYWwuZG9jdW1lbnQuc2VsZWN0aW9uKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRTZWxlY3Rpb247XG4iXX0=
    }, {
      "./rangeToTextRange": 123
    }],
    122: [function (require, module, exports) {
      'use strict';

      function isHostMethod(host, prop) {
        var type = typeof host[prop];
        return type === 'function' || !!(type === 'object' && host[prop]) || type === 'unknown';
      }

      function isHostProperty(host, prop) {
        return typeof host[prop] !== 'undefined';
      }

      function many(fn) {
        return function areHosted(host, props) {
          var i = props.length;
          while (i--) {
            if (!fn(host, props[i])) {
              return false;
            }
          }
          return true;
        };
      }

      module.exports = {
        method: isHostMethod,
        methods: many(isHostMethod),
        property: isHostProperty,
        properties: many(isHostProperty)
      };

    }, {}],
    123: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var doc = global.document;
        var body = doc.body;

        function rangeToTextRange(p) {
          if (p.collapsed) {
            return createBoundaryTextRange({
              node: p.startContainer,
              offset: p.startOffset
            }, true);
          }
          var startRange = createBoundaryTextRange({
            node: p.startContainer,
            offset: p.startOffset
          }, true);
          var endRange = createBoundaryTextRange({
            node: p.endContainer,
            offset: p.endOffset
          }, false);
          var textRange = body.createTextRange();
          textRange.setEndPoint('StartToStart', startRange);
          textRange.setEndPoint('EndToEnd', endRange);
          return textRange;
        }

        function isCharacterDataNode(node) {
          var t = node.nodeType;
          return t === 3 || t === 4 || t === 8;
        }

        function createBoundaryTextRange(p, starting) {
          var bound;
          var parent;
          var offset = p.offset;
          var workingNode;
          var childNodes;
          var range = body.createTextRange();
          var data = isCharacterDataNode(p.node);

          if (data) {
            bound = p.node;
            parent = bound.parentNode;
          } else {
            childNodes = p.node.childNodes;
            bound = offset < childNodes.length ? childNodes[offset] : null;
            parent = p.node;
          }

          workingNode = doc.createElement('span');
          workingNode.innerHTML = '&#feff;';

          if (bound) {
            parent.insertBefore(workingNode, bound);
          } else {
            parent.appendChild(workingNode);
          }

          range.moveToElementText(workingNode);
          range.collapse(!starting);
          parent.removeChild(workingNode);

          if (data) {
            range[starting ? 'moveStart' : 'moveEnd']('character', offset);
          }
          return range;
        }

        module.exports = rangeToTextRange;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9zZWxlY2Npb24vc3JjL3JhbmdlVG9UZXh0UmFuZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgYm9keSA9IGRvYy5ib2R5O1xuXG5mdW5jdGlvbiByYW5nZVRvVGV4dFJhbmdlIChwKSB7XG4gIGlmIChwLmNvbGxhcHNlZCkge1xuICAgIHJldHVybiBjcmVhdGVCb3VuZGFyeVRleHRSYW5nZSh7IG5vZGU6IHAuc3RhcnRDb250YWluZXIsIG9mZnNldDogcC5zdGFydE9mZnNldCB9LCB0cnVlKTtcbiAgfVxuICB2YXIgc3RhcnRSYW5nZSA9IGNyZWF0ZUJvdW5kYXJ5VGV4dFJhbmdlKHsgbm9kZTogcC5zdGFydENvbnRhaW5lciwgb2Zmc2V0OiBwLnN0YXJ0T2Zmc2V0IH0sIHRydWUpO1xuICB2YXIgZW5kUmFuZ2UgPSBjcmVhdGVCb3VuZGFyeVRleHRSYW5nZSh7IG5vZGU6IHAuZW5kQ29udGFpbmVyLCBvZmZzZXQ6IHAuZW5kT2Zmc2V0IH0sIGZhbHNlKTtcbiAgdmFyIHRleHRSYW5nZSA9IGJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gIHRleHRSYW5nZS5zZXRFbmRQb2ludCgnU3RhcnRUb1N0YXJ0Jywgc3RhcnRSYW5nZSk7XG4gIHRleHRSYW5nZS5zZXRFbmRQb2ludCgnRW5kVG9FbmQnLCBlbmRSYW5nZSk7XG4gIHJldHVybiB0ZXh0UmFuZ2U7XG59XG5cbmZ1bmN0aW9uIGlzQ2hhcmFjdGVyRGF0YU5vZGUgKG5vZGUpIHtcbiAgdmFyIHQgPSBub2RlLm5vZGVUeXBlO1xuICByZXR1cm4gdCA9PT0gMyB8fCB0ID09PSA0IHx8IHQgPT09IDggO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVCb3VuZGFyeVRleHRSYW5nZSAocCwgc3RhcnRpbmcpIHtcbiAgdmFyIGJvdW5kO1xuICB2YXIgcGFyZW50O1xuICB2YXIgb2Zmc2V0ID0gcC5vZmZzZXQ7XG4gIHZhciB3b3JraW5nTm9kZTtcbiAgdmFyIGNoaWxkTm9kZXM7XG4gIHZhciByYW5nZSA9IGJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XG4gIHZhciBkYXRhID0gaXNDaGFyYWN0ZXJEYXRhTm9kZShwLm5vZGUpO1xuXG4gIGlmIChkYXRhKSB7XG4gICAgYm91bmQgPSBwLm5vZGU7XG4gICAgcGFyZW50ID0gYm91bmQucGFyZW50Tm9kZTtcbiAgfSBlbHNlIHtcbiAgICBjaGlsZE5vZGVzID0gcC5ub2RlLmNoaWxkTm9kZXM7XG4gICAgYm91bmQgPSBvZmZzZXQgPCBjaGlsZE5vZGVzLmxlbmd0aCA/IGNoaWxkTm9kZXNbb2Zmc2V0XSA6IG51bGw7XG4gICAgcGFyZW50ID0gcC5ub2RlO1xuICB9XG5cbiAgd29ya2luZ05vZGUgPSBkb2MuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICB3b3JraW5nTm9kZS5pbm5lckhUTUwgPSAnJiNmZWZmOyc7XG5cbiAgaWYgKGJvdW5kKSB7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZSh3b3JraW5nTm9kZSwgYm91bmQpO1xuICB9IGVsc2Uge1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh3b3JraW5nTm9kZSk7XG4gIH1cblxuICByYW5nZS5tb3ZlVG9FbGVtZW50VGV4dCh3b3JraW5nTm9kZSk7XG4gIHJhbmdlLmNvbGxhcHNlKCFzdGFydGluZyk7XG4gIHBhcmVudC5yZW1vdmVDaGlsZCh3b3JraW5nTm9kZSk7XG5cbiAgaWYgKGRhdGEpIHtcbiAgICByYW5nZVtzdGFydGluZyA/ICdtb3ZlU3RhcnQnIDogJ21vdmVFbmQnXSgnY2hhcmFjdGVyJywgb2Zmc2V0KTtcbiAgfVxuICByZXR1cm4gcmFuZ2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmFuZ2VUb1RleHRSYW5nZTtcbiJdfQ==
    }, {}],
    124: [function (require, module, exports) {
      'use strict';

      var getSelection = require('./getSelection');
      var setSelection = require('./setSelection');

      module.exports = {
        get: getSelection,
        set: setSelection
      };

    }, {
      "./getSelection": 118,
      "./setSelection": 125
    }],
    125: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var getSelection = require('./getSelection');
        var rangeToTextRange = require('./rangeToTextRange');
        var doc = global.document;

        function setSelection(p) {
          if (doc.createRange) {
            modernSelection();
          } else {
            oldSelection();
          }

          function modernSelection() {
            var sel = getSelection();
            var range = doc.createRange();
            if (!p.startContainer) {
              return;
            }
            if (p.endContainer) {
              range.setEnd(p.endContainer, p.endOffset);
            } else {
              range.setEnd(p.startContainer, p.startOffset);
            }
            range.setStart(p.startContainer, p.startOffset);
            sel.removeAllRanges();
            sel.addRange(range);
          }

          function oldSelection() {
            rangeToTextRange(p).select();
          }
        }

        module.exports = setSelection;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9zZWxlY2Npb24vc3JjL3NldFNlbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBnZXRTZWxlY3Rpb24gPSByZXF1aXJlKCcuL2dldFNlbGVjdGlvbicpO1xudmFyIHJhbmdlVG9UZXh0UmFuZ2UgPSByZXF1aXJlKCcuL3JhbmdlVG9UZXh0UmFuZ2UnKTtcbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIHNldFNlbGVjdGlvbiAocCkge1xuICBpZiAoZG9jLmNyZWF0ZVJhbmdlKSB7XG4gICAgbW9kZXJuU2VsZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgb2xkU2VsZWN0aW9uKCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb2Rlcm5TZWxlY3Rpb24gKCkge1xuICAgIHZhciBzZWwgPSBnZXRTZWxlY3Rpb24oKTtcbiAgICB2YXIgcmFuZ2UgPSBkb2MuY3JlYXRlUmFuZ2UoKTtcbiAgICBpZiAoIXAuc3RhcnRDb250YWluZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHAuZW5kQ29udGFpbmVyKSB7XG4gICAgICByYW5nZS5zZXRFbmQocC5lbmRDb250YWluZXIsIHAuZW5kT2Zmc2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFuZ2Uuc2V0RW5kKHAuc3RhcnRDb250YWluZXIsIHAuc3RhcnRPZmZzZXQpO1xuICAgIH1cbiAgICByYW5nZS5zZXRTdGFydChwLnN0YXJ0Q29udGFpbmVyLCBwLnN0YXJ0T2Zmc2V0KTtcbiAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9sZFNlbGVjdGlvbiAoKSB7XG4gICAgcmFuZ2VUb1RleHRSYW5nZShwKS5zZWxlY3QoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFNlbGVjdGlvbjtcbiJdfQ==
    }, {
      "./getSelection": 118,
      "./rangeToTextRange": 123
    }],
    126: [function (require, module, exports) {
      'use strict';

      var get = easyGet;
      var set = easySet;

      if (document.selection && document.selection.createRange) {
        get = hardGet;
        set = hardSet;
      }

      function easyGet(el) {
        return {
          start: el.selectionStart,
          end: el.selectionEnd
        };
      }

      function hardGet(el) {
        var active = document.activeElement;
        if (active !== el) {
          el.focus();
        }

        var range = document.selection.createRange();
        var bookmark = range.getBookmark();
        var original = el.value;
        var marker = getUniqueMarker(original);
        var parent = range.parentElement();
        if (parent === null || !inputs(parent)) {
          return result(0, 0);
        }
        range.text = marker + range.text + marker;

        var contents = el.value;

        el.value = original;
        range.moveToBookmark(bookmark);
        range.select();

        return result(contents.indexOf(marker), contents.lastIndexOf(marker) - marker.length);

        function result(start, end) {
          if (active !== el) { // don't disrupt pre-existing state
            if (active) {
              active.focus();
            } else {
              el.blur();
            }
          }
          return {
            start: start,
            end: end
          };
        }
      }

      function getUniqueMarker(contents) {
        var marker;
        do {
          marker = '@@marker.' + Math.random() * new Date();
        } while (contents.indexOf(marker) !== -1);
        return marker;
      }

      function inputs(el) {
        return ((el.tagName === 'INPUT' && el.type === 'text') || el.tagName === 'TEXTAREA');
      }

      function easySet(el, p) {
        el.selectionStart = parse(el, p.start);
        el.selectionEnd = parse(el, p.end);
      }

      function hardSet(el, p) {
        var range = el.createTextRange();

        if (p.start === 'end' && p.end === 'end') {
          range.collapse(false);
          range.select();
        } else {
          range.collapse(true);
          range.moveEnd('character', parse(el, p.end));
          range.moveStart('character', parse(el, p.start));
          range.select();
        }
      }

      function parse(el, value) {
        return value === 'end' ? el.value.length : value || 0;
      }

      function sell(el, p) {
        if (arguments.length === 2) {
          set(el, p);
        }
        return get(el);
      }

      module.exports = sell;

    }, {}],
    127: [function (require, module, exports) {
      'use strict';

      var spaces = /\s+/g;
      var dashes = /[-_]+/g;
      var dashesLeadTrail = /^-|-$/g;
      var invalid = /[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g;
      var accentCodePoints = /[\xC0-\xFF]/g;
      var accents = [
        [/[\xC0-\xC5]/g, 'A'],
        [/[\xC6]/g, 'AE'],
        [/[\xC7]/g, 'C'],
        [/[\xC8-\xCB]/g, 'E'],
        [/[\xCC-\xCF]/g, 'I'],
        [/[\xD0]/g, 'D'],
        [/[\xD1]/g, 'N'],
        [/[\xD2-\xD6\xD8]/g, 'O'],
        [/[\xD9-\xDC]/g, 'U'],
        [/[\xDD]/g, 'Y'],
        [/[\xDE]/g, 'P'],
        [/[\xE0-\xE5]/g, 'a'],
        [/[\xE6]/g, 'ae'],
        [/[\xE7]/g, 'c'],
        [/[\xE8-\xEB]/g, 'e'],
        [/[\xEC-\xEF]/g, 'i'],
        [/[\xF1]/g, 'n'],
        [/[\xF2-\xF6\xF8]/g, 'o'],
        [/[\xF9-\xFC]/g, 'u'],
        [/[\xFE]/g, 'p'],
        [/[\xFD\xFF]/g, 'y']
      ];
      var replacements = [
        [
          /&/g, ' and '
        ],
        [
          /\./g, ''
        ]
      ];

      function slugify(text) {
        var partial = translate(text, replacements);
        if (partial.search(accentCodePoints) === -1) {
          return partial;
        }
        return translate(partial, accents);
      }

      function translate(text, translations) {
        return translations.reduce(function (text, pair) {
          return text.replace(pair[0], pair[1]);
        }, text);
      }

      function parse(input) {
        return input === null || input === void 0 ? '' : input.toString();
      }

      function slug(text) {
        return slugify(parse(text))
          .replace(invalid, '-') // remove invalid chars
          .replace(spaces, '-') // collapse whitespace and replace by '-'
          .replace(dashes, '-') // collapse dashes
          .replace(dashesLeadTrail, '') // remove leading or trailing dashes
          .trim()
          .toLowerCase();
      }

      module.exports = slug;

    }, {}],
    128: [function (require, module, exports) {
      /*! http://mths.be/repeat v0.2.0 by @mathias */
      if (!String.prototype.repeat) {
        (function () {
          'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
          var defineProperty = (function () {
            // IE 8 only supports `Object.defineProperty` on DOM elements
            try {
              var object = {};
              var $defineProperty = Object.defineProperty;
              var result = $defineProperty(object, object, object) && $defineProperty;
            } catch (error) {}
            return result;
          }());
          var repeat = function (count) {
            if (this == null) {
              throw TypeError();
            }
            var string = String(this);
            // `ToInteger`
            var n = count ? Number(count) : 0;
            if (n != n) { // better `isNaN`
              n = 0;
            }
            // Account for out-of-bounds indices
            if (n < 0 || n == Infinity) {
              throw RangeError();
            }
            var result = '';
            while (n) {
              if (n % 2 == 1) {
                result += string;
              }
              if (n > 1) {
                string += string;
              }
              n >>= 1;
            }
            return result;
          };
          if (defineProperty) {
            defineProperty(String.prototype, 'repeat', {
              'value': repeat,
              'configurable': true,
              'writable': true
            });
          } else {
            String.prototype.repeat = repeat;
          }
        }());
      }

    }, {}],
    129: [function (require, module, exports) {
      var si = typeof setImmediate === 'function',
        tick;
      if (si) {
        tick = function (fn) {
          setImmediate(fn);
        };
      } else {
        tick = function (fn) {
          setTimeout(fn, 0);
        };
      }

      module.exports = tick;
    }, {}],
    130: [function (require, module, exports) {

      exports = module.exports = trim;

      function trim(str) {
        return str.replace(/^\s*|\s*$/g, '');
      }

      exports.left = function (str) {
        return str.replace(/^\s*/, '');
      };

      exports.right = function (str) {
        return str.replace(/\s*$/, '');
      };

    }, {}],
    131: [function (require, module, exports) {
      "use strict";
      var window = require("global/window")
      var isFunction = require("is-function")
      var parseHeaders = require("parse-headers")
      var xtend = require("xtend")

      module.exports = createXHR
      createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
      createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

      forEachArray(["get", "put", "post", "patch", "head", "delete"], function (method) {
        createXHR[method === "delete" ? "del" : method] = function (uri, options, callback) {
          options = initParams(uri, options, callback)
          options.method = method.toUpperCase()
          return _createXHR(options)
        }
      })

      function forEachArray(array, iterator) {
        for (var i = 0; i < array.length; i++) {
          iterator(array[i])
        }
      }

      function isEmpty(obj) {
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) return false
        }
        return true
      }

      function initParams(uri, options, callback) {
        var params = uri

        if (isFunction(options)) {
          callback = options
          if (typeof uri === "string") {
            params = {
              uri: uri
            }
          }
        } else {
          params = xtend(options, {
            uri: uri
          })
        }

        params.callback = callback
        return params
      }

      function createXHR(uri, options, callback) {
        options = initParams(uri, options, callback)
        return _createXHR(options)
      }

      function _createXHR(options) {
        var callback = options.callback
        if (typeof callback === "undefined") {
          throw new Error("callback argument missing")
        }

        function readystatechange() {
          if (xhr.readyState === 4) {
            loadFunc()
          }
        }

        function getBody() {
          // Chrome with requestType=blob throws errors arround when even testing access to responseText
          var body = undefined

          if (xhr.response) {
            body = xhr.response
          } else {
            body = xhr.responseText || getXml(xhr)
          }

          if (isJson) {
            try {
              body = JSON.parse(body)
            } catch (e) {}
          }

          return body
        }

        var failureResponse = {
          body: undefined,
          headers: {},
          statusCode: 0,
          method: method,
          url: uri,
          rawRequest: xhr
        }

        function errorFunc(evt) {
          clearTimeout(timeoutTimer)
          if (!(evt instanceof Error)) {
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error"))
          }
          evt.statusCode = 0
          callback(evt, failureResponse)
          callback = noop
        }

        // will load the data & process the response in a special response object
        function loadFunc() {
          if (aborted) return
          var status
          clearTimeout(timeoutTimer)
          if (options.useXDR && xhr.status === undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
          } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
          }
          var response = failureResponse
          var err = null

          if (status !== 0) {
            response = {
              body: getBody(),
              statusCode: status,
              method: method,
              headers: {},
              url: uri,
              rawRequest: xhr
            }
            if (xhr.getAllResponseHeaders) { //remember xhr can in fact be XDR for CORS in IE
              response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
          } else {
            err = new Error("Internal XMLHttpRequest Error")
          }
          callback(err, response, response.body)
          callback = noop

        }

        var xhr = options.xhr || null

        if (!xhr) {
          if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
          } else {
            xhr = new createXHR.XMLHttpRequest()
          }
        }

        var key
        var aborted
        var uri = xhr.url = options.uri || options.url
        var method = xhr.method = options.method || "GET"
        var body = options.body || options.data || null
        var headers = xhr.headers = options.headers || {}
        var sync = !!options.sync
        var isJson = false
        var timeoutTimer

        if ("json" in options) {
          isJson = true
          headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
          if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json)
          }
        }

        xhr.onreadystatechange = readystatechange
        xhr.onload = loadFunc
        xhr.onerror = errorFunc
        // IE9 must have onprogress be set to a unique function.
        xhr.onprogress = function () {
          // IE must die
        }
        xhr.ontimeout = errorFunc
        xhr.open(method, uri, !sync, options.username, options.password)
        //has to be after open
        if (!sync) {
          xhr.withCredentials = !!options.withCredentials
        }
        // Cannot set timeout with sync request
        // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
        // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
        if (!sync && options.timeout > 0) {
          timeoutTimer = setTimeout(function () {
            aborted = true //IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
          }, options.timeout)
        }

        if (xhr.setRequestHeader) {
          for (key in headers) {
            if (headers.hasOwnProperty(key)) {
              xhr.setRequestHeader(key, headers[key])
            }
          }
        } else if (options.headers && !isEmpty(options.headers)) {
          throw new Error("Headers cannot be set on an XDomainRequest object")
        }

        if ("responseType" in options) {
          xhr.responseType = options.responseType
        }

        if ("beforeSend" in options &&
          typeof options.beforeSend === "function"
        ) {
          options.beforeSend(xhr)
        }

        xhr.send(body)

        return xhr


      }

      function getXml(xhr) {
        if (xhr.responseType === "document") {
          return xhr.responseXML
        }
        var firefoxBugTakenEffect = xhr.status === 204 && xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
          return xhr.responseXML
        }

        return null
      }

      function noop() {}

    }, {
      "global/window": 18,
      "is-function": 40,
      "parse-headers": 115,
      "xtend": 132
    }],
    132: [function (require, module, exports) {
      module.exports = extend

      var hasOwnProperty = Object.prototype.hasOwnProperty;

      function extend() {
        var target = {}

        for (var i = 0; i < arguments.length; i++) {
          var source = arguments[i]

          for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
              target[key] = source[key]
            }
          }
        }

        return target
      }

    }, {}],
    133: [function (require, module, exports) {
      'use strict';

      var crossvent = require('crossvent');
      var InputState = require('./InputState');

      function InputHistory(surface, mode) {
        var state = this;

        state.inputMode = mode;
        state.surface = surface;
        state.reset();

        listen(surface.textarea);
        listen(surface.editable);

        function listen(el) {
          var pasteHandler = selfie(handlePaste);
          crossvent.add(el, 'keypress', preventCtrlYZ);
          crossvent.add(el, 'keydown', selfie(handleCtrlYZ));
          crossvent.add(el, 'keydown', selfie(handleModeChange));
          crossvent.add(el, 'mousedown', setMoving);
          el.onpaste = pasteHandler;
          el.ondrop = pasteHandler;
        }

        function setMoving() {
          state.setMode('moving');
        }

        function selfie(fn) {
          return function handler(e) {
            return fn.call(null, state, e);
          };
        }
      }

      InputHistory.prototype.setInputMode = function (mode) {
        var state = this;
        state.inputMode = mode;
        state.reset();
      };

      InputHistory.prototype.reset = function () {
        var state = this;
        state.inputState = null;
        state.lastState = null;
        state.history = [];
        state.historyPointer = 0;
        state.historyMode = 'none';
        state.refreshing = null;
        state.refreshState(true);
        state.saveState();
        return state;
      };

      InputHistory.prototype.setCommandMode = function () {
        var state = this;
        state.historyMode = 'command';
        state.saveState();
        state.refreshing = setTimeout(function () {
          state.refreshState();
        }, 0);
      };

      InputHistory.prototype.canUndo = function () {
        return this.historyPointer > 1;
      };

      InputHistory.prototype.canRedo = function () {
        return this.history[this.historyPointer + 1];
      };

      InputHistory.prototype.undo = function () {
        var state = this;
        if (state.canUndo()) {
          if (state.lastState) {
            state.lastState.restore();
            state.lastState = null;
          } else {
            state.history[state.historyPointer] = new InputState(state.surface, state.inputMode);
            state.history[--state.historyPointer].restore();
          }
        }
        state.historyMode = 'none';
        state.surface.focus(state.inputMode);
        state.refreshState();
      };

      InputHistory.prototype.redo = function () {
        var state = this;
        if (state.canRedo()) {
          state.history[++state.historyPointer].restore();
        }

        state.historyMode = 'none';
        state.surface.focus(state.inputMode);
        state.refreshState();
      };

      InputHistory.prototype.setMode = function (value) {
        var state = this;
        if (state.historyMode !== value) {
          state.historyMode = value;
          state.saveState();
        }
        state.refreshing = setTimeout(function () {
          state.refreshState();
        }, 1);
      };

      InputHistory.prototype.refreshState = function (initialState) {
        var state = this;
        state.inputState = new InputState(state.surface, state.inputMode, initialState);
        state.refreshing = null;
      };

      InputHistory.prototype.saveState = function () {
        var state = this;
        var current = state.inputState || new InputState(state.surface, state.inputMode);

        if (state.historyMode === 'moving') {
          if (!state.lastState) {
            state.lastState = current;
          }
          return;
        }
        if (state.lastState) {
          if (state.history[state.historyPointer - 1].text !== state.lastState.text) {
            state.history[state.historyPointer++] = state.lastState;
          }
          state.lastState = null;
        }
        state.history[state.historyPointer++] = current;
        state.history[state.historyPointer + 1] = null;
      };

      function handleCtrlYZ(state, e) {
        var handled = false;
        var keyCode = e.charCode || e.keyCode;
        var keyCodeChar = String.fromCharCode(keyCode);

        if (e.ctrlKey || e.metaKey) {
          switch (keyCodeChar.toLowerCase()) {
            case 'y':
              state.redo();
              handled = true;
              break;

            case 'z':
              if (e.shiftKey) {
                state.redo();
              } else {
                state.undo();
              }
              handled = true;
              break;
          }
        }

        if (handled && e.preventDefault) {
          e.preventDefault();
        }
      }

      function handleModeChange(state, e) {
        if (e.ctrlKey || e.metaKey) {
          return;
        }

        var keyCode = e.keyCode;

        if ((keyCode >= 33 && keyCode <= 40) || (keyCode >= 63232 && keyCode <= 63235)) {
          state.setMode('moving');
        } else if (keyCode === 8 || keyCode === 46 || keyCode === 127) {
          state.setMode('deleting');
        } else if (keyCode === 13) {
          state.setMode('newlines');
        } else if (keyCode === 27) {
          state.setMode('escape');
        } else if ((keyCode < 16 || keyCode > 20) && keyCode !== 91) {
          state.setMode('typing');
        }
      }

      function handlePaste(state) {
        if (state.inputState && state.inputState.text !== state.surface.read(state.inputMode) && state.refreshing === null) {
          state.historyMode = 'paste';
          state.saveState();
          state.refreshState();
        }
      }

      function preventCtrlYZ(e) {
        var keyCode = e.charCode || e.keyCode;
        var yz = keyCode === 89 || keyCode === 90;
        var ctrl = e.ctrlKey || e.metaKey;
        if (ctrl && yz) {
          e.preventDefault();
        }
      }

      module.exports = InputHistory;

    }, {
      "./InputState": 134,
      "crossvent": 12
    }],
    134: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var doc = global.document;
        var isVisibleElement = require('./isVisibleElement');
        var fixEOL = require('./fixEOL');
        var MarkdownChunks = require('./markdown/MarkdownChunks');
        var HtmlChunks = require('./html/HtmlChunks');
        var chunks = {
          markdown: MarkdownChunks,
          html: HtmlChunks,
          wysiwyg: HtmlChunks
        };

        function InputState(surface, mode, initialState) {
          this.mode = mode;
          this.surface = surface;
          this.initialState = initialState || false;
          this.init();
        }

        InputState.prototype.init = function () {
          var self = this;
          var el = self.surface.current(self.mode);
          if (!isVisibleElement(el)) {
            return;
          }
          if (!this.initialState && doc.activeElement && doc.activeElement !== el) {
            return;
          }
          self.surface.readSelection(self);
          self.scrollTop = el.scrollTop;
          if (!self.text) {
            self.text = self.surface.read(self.mode);
          }
        };

        InputState.prototype.select = function () {
          var self = this;
          var el = self.surface.current(self.mode);
          if (!isVisibleElement(el)) {
            return;
          }
          self.surface.writeSelection(self);
        };

        InputState.prototype.restore = function () {
          var self = this;
          var el = self.surface.current(self.mode);
          if (typeof self.text === 'string' && self.text !== self.surface.read(self.mode)) {
            self.surface.write(self.mode, self.text);
          }
          self.select();
          el.scrollTop = self.scrollTop;
        };

        InputState.prototype.getChunks = function () {
          var self = this;
          var chunk = new chunks[self.mode]();
          chunk.before = fixEOL(self.text.substring(0, self.start));
          chunk.startTag = '';
          chunk.selection = fixEOL(self.text.substring(self.start, self.end));
          chunk.endTag = '';
          chunk.after = fixEOL(self.text.substring(self.end));
          chunk.scrollTop = self.scrollTop;
          self.cachedChunks = chunk;
          return chunk;
        };

        InputState.prototype.setChunks = function (chunk) {
          var self = this;
          chunk.before = chunk.before + chunk.startTag;
          chunk.after = chunk.endTag + chunk.after;
          self.start = chunk.before.length;
          self.end = chunk.before.length + chunk.selection.length;
          self.text = chunk.before + chunk.selection + chunk.after;
          self.scrollTop = chunk.scrollTop;
        };

        module.exports = InputState;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9JbnB1dFN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgaXNWaXNpYmxlRWxlbWVudCA9IHJlcXVpcmUoJy4vaXNWaXNpYmxlRWxlbWVudCcpO1xudmFyIGZpeEVPTCA9IHJlcXVpcmUoJy4vZml4RU9MJyk7XG52YXIgTWFya2Rvd25DaHVua3MgPSByZXF1aXJlKCcuL21hcmtkb3duL01hcmtkb3duQ2h1bmtzJyk7XG52YXIgSHRtbENodW5rcyA9IHJlcXVpcmUoJy4vaHRtbC9IdG1sQ2h1bmtzJyk7XG52YXIgY2h1bmtzID0ge1xuICBtYXJrZG93bjogTWFya2Rvd25DaHVua3MsXG4gIGh0bWw6IEh0bWxDaHVua3MsXG4gIHd5c2l3eWc6IEh0bWxDaHVua3Ncbn07XG5cbmZ1bmN0aW9uIElucHV0U3RhdGUgKHN1cmZhY2UsIG1vZGUsIGluaXRpYWxTdGF0ZSkge1xuICB0aGlzLm1vZGUgPSBtb2RlO1xuICB0aGlzLnN1cmZhY2UgPSBzdXJmYWNlO1xuICB0aGlzLmluaXRpYWxTdGF0ZSA9IGluaXRpYWxTdGF0ZSB8fCBmYWxzZTtcbiAgdGhpcy5pbml0KCk7XG59XG5cbklucHV0U3RhdGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGVsID0gc2VsZi5zdXJmYWNlLmN1cnJlbnQoc2VsZi5tb2RlKTtcbiAgaWYgKCFpc1Zpc2libGVFbGVtZW50KGVsKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIXRoaXMuaW5pdGlhbFN0YXRlICYmIGRvYy5hY3RpdmVFbGVtZW50ICYmIGRvYy5hY3RpdmVFbGVtZW50ICE9PSBlbCkge1xuICAgIHJldHVybjtcbiAgfVxuICBzZWxmLnN1cmZhY2UucmVhZFNlbGVjdGlvbihzZWxmKTtcbiAgc2VsZi5zY3JvbGxUb3AgPSBlbC5zY3JvbGxUb3A7XG4gIGlmICghc2VsZi50ZXh0KSB7XG4gICAgc2VsZi50ZXh0ID0gc2VsZi5zdXJmYWNlLnJlYWQoc2VsZi5tb2RlKTtcbiAgfVxufTtcblxuSW5wdXRTdGF0ZS5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBlbCA9IHNlbGYuc3VyZmFjZS5jdXJyZW50KHNlbGYubW9kZSk7XG4gIGlmICghaXNWaXNpYmxlRWxlbWVudChlbCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgc2VsZi5zdXJmYWNlLndyaXRlU2VsZWN0aW9uKHNlbGYpO1xufTtcblxuSW5wdXRTdGF0ZS5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgZWwgPSBzZWxmLnN1cmZhY2UuY3VycmVudChzZWxmLm1vZGUpO1xuICBpZiAodHlwZW9mIHNlbGYudGV4dCA9PT0gJ3N0cmluZycgJiYgc2VsZi50ZXh0ICE9PSBzZWxmLnN1cmZhY2UucmVhZChzZWxmLm1vZGUpKSB7XG4gICAgc2VsZi5zdXJmYWNlLndyaXRlKHNlbGYubW9kZSwgc2VsZi50ZXh0KTtcbiAgfVxuICBzZWxmLnNlbGVjdCgpO1xuICBlbC5zY3JvbGxUb3AgPSBzZWxmLnNjcm9sbFRvcDtcbn07XG5cbklucHV0U3RhdGUucHJvdG90eXBlLmdldENodW5rcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgY2h1bmsgPSBuZXcgY2h1bmtzW3NlbGYubW9kZV0oKTtcbiAgY2h1bmsuYmVmb3JlID0gZml4RU9MKHNlbGYudGV4dC5zdWJzdHJpbmcoMCwgc2VsZi5zdGFydCkpO1xuICBjaHVuay5zdGFydFRhZyA9ICcnO1xuICBjaHVuay5zZWxlY3Rpb24gPSBmaXhFT0woc2VsZi50ZXh0LnN1YnN0cmluZyhzZWxmLnN0YXJ0LCBzZWxmLmVuZCkpO1xuICBjaHVuay5lbmRUYWcgPSAnJztcbiAgY2h1bmsuYWZ0ZXIgPSBmaXhFT0woc2VsZi50ZXh0LnN1YnN0cmluZyhzZWxmLmVuZCkpO1xuICBjaHVuay5zY3JvbGxUb3AgPSBzZWxmLnNjcm9sbFRvcDtcbiAgc2VsZi5jYWNoZWRDaHVua3MgPSBjaHVuaztcbiAgcmV0dXJuIGNodW5rO1xufTtcblxuSW5wdXRTdGF0ZS5wcm90b3R5cGUuc2V0Q2h1bmtzID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlICsgY2h1bmsuc3RhcnRUYWc7XG4gIGNodW5rLmFmdGVyID0gY2h1bmsuZW5kVGFnICsgY2h1bmsuYWZ0ZXI7XG4gIHNlbGYuc3RhcnQgPSBjaHVuay5iZWZvcmUubGVuZ3RoO1xuICBzZWxmLmVuZCA9IGNodW5rLmJlZm9yZS5sZW5ndGggKyBjaHVuay5zZWxlY3Rpb24ubGVuZ3RoO1xuICBzZWxmLnRleHQgPSBjaHVuay5iZWZvcmUgKyBjaHVuay5zZWxlY3Rpb24gKyBjaHVuay5hZnRlcjtcbiAgc2VsZi5zY3JvbGxUb3AgPSBjaHVuay5zY3JvbGxUb3A7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0U3RhdGU7XG4iXX0=
    }, {
      "./fixEOL": 141,
      "./html/HtmlChunks": 145,
      "./isVisibleElement": 154,
      "./markdown/MarkdownChunks": 156
    }],
    135: [function (require, module, exports) {
      'use strict';

      var crossvent = require('crossvent');
      var commands = {
        markdown: {
          boldOrItalic: require('./markdown/boldOrItalic'),
          linkOrImageOrAttachment: require('./markdown/linkOrImageOrAttachment'),
          blockquote: require('./markdown/blockquote'),
          codeblock: require('./markdown/codeblock'),
          heading: require('./markdown/heading'),
          list: require('./markdown/list'),
          hr: require('./markdown/hr')
        },
        html: {
          boldOrItalic: require('./html/boldOrItalic'),
          linkOrImageOrAttachment: require('./html/linkOrImageOrAttachment'),
          blockquote: require('./html/blockquote'),
          codeblock: require('./html/codeblock'),
          heading: require('./html/heading'),
          list: require('./html/list'),
          hr: require('./html/hr')
        }
      };

      commands.wysiwyg = commands.html;

      function bindCommands(surface, options, editor) {
        bind('bold', 'cmd+b', bold);
        bind('italic', 'cmd+i', italic);
        bind('quote', 'cmd+j', router('blockquote'));
        bind('code', 'cmd+e', code);
        bind('ol', 'cmd+o', ol);
        bind('ul', 'cmd+u', ul);
        bind('heading', 'cmd+d', router('heading'));
        editor.showLinkDialog = fabricator(bind('link', 'cmd+k', linkOrImageOrAttachment('link')));
        editor.showImageDialog = fabricator(bind('image', 'cmd+g', linkOrImageOrAttachment('image')));
        editor.linkOrImageOrAttachment = linkOrImageOrAttachment;

        if (options.attachments) {
          editor.showAttachmentDialog = fabricator(bind('attachment', 'cmd+shift+k', linkOrImageOrAttachment('attachment')));
        }
        if (options.hr) {
          bind('hr', 'cmd+n', router('hr'));
        }

        function fabricator(el) {
          return function open() {
            crossvent.fabricate(el, 'click');
          };
        }

        function bold(mode, chunks) {
          commands[mode].boldOrItalic(chunks, 'bold');
        }

        function italic(mode, chunks) {
          commands[mode].boldOrItalic(chunks, 'italic');
        }

        function code(mode, chunks) {
          commands[mode].codeblock(chunks, {
            fencing: options.fencing
          });
        }

        function ul(mode, chunks) {
          commands[mode].list(chunks, false);
        }

        function ol(mode, chunks) {
          commands[mode].list(chunks, true);
        }

        function linkOrImageOrAttachment(type, autoUpload) {
          return function linkOrImageOrAttachmentInvoke(mode, chunks) {
            commands[mode].linkOrImageOrAttachment.call(this, chunks, {
              editor: editor,
              mode: mode,
              type: type,
              surface: surface,
              prompts: options.prompts,
              upload: options[type + 's'],
              classes: options.classes,
              mergeHtmlAndAttachment: options.mergeHtmlAndAttachment || mergeHtmlAndAttachment,
              autoUpload: autoUpload
            });
          };
        }

        function bind(id, combo, fn) {
          return editor.addCommandButton(id, combo, suppress(fn));
        }

        function mergeHtmlAndAttachment(chunks, link) {
          var linkText = chunks.selection || link.title;
          return {
            before: chunks.before,
            selection: '<a href="' + link.href + '">' + linkText + '</a>',
            after: chunks.after,
          };
        }

        function router(method) {
          return function routed(mode, chunks) {
            commands[mode][method].call(this, chunks);
          };
        }

        function stop(e) {
          e.preventDefault();
          e.stopPropagation();
        }

        function suppress(fn) {
          return function suppressor(e, mode, chunks) {
            stop(e);
            fn.call(this, mode, chunks);
          };
        }
      }

      module.exports = bindCommands;

    }, {
      "./html/blockquote": 146,
      "./html/boldOrItalic": 147,
      "./html/codeblock": 148,
      "./html/heading": 149,
      "./html/hr": 150,
      "./html/linkOrImageOrAttachment": 151,
      "./html/list": 152,
      "./markdown/blockquote": 157,
      "./markdown/boldOrItalic": 158,
      "./markdown/codeblock": 159,
      "./markdown/heading": 160,
      "./markdown/hr": 161,
      "./markdown/linkOrImageOrAttachment": 162,
      "./markdown/list": 163,
      "crossvent": 12
    }],
    136: [function (require, module, exports) {
      'use strict';

      function cast(collection) {
        var result = [];
        var i;
        var len = collection.length;
        for (i = 0; i < len; i++) {
          result.push(collection[i]);
        }
        return result;
      }

      module.exports = cast;

    }, {}],
    137: [function (require, module, exports) {
      'use strict';

      var rinput = /^\s*(.*?)(?:\s+"(.+)")?\s*$/;
      var rfull = /^(?:https?|ftp):\/\//;

      function parseLinkInput(input) {
        return parser.apply(null, input.match(rinput));

        function parser(all, link, title) {
          var href = link.replace(/\?.*$/, queryUnencodedReplacer);
          href = decodeURIComponent(href);
          href = encodeURI(href).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
          href = href.replace(/\?.*$/, queryEncodedReplacer);

          return {
            href: formatHref(href),
            title: formatTitle(title)
          };
        }
      }

      function queryUnencodedReplacer(query) {
        return query.replace(/\+/g, ' ');
      }

      function queryEncodedReplacer(query) {
        return query.replace(/\+/g, '%2b');
      }

      function formatTitle(title) {
        if (!title) {
          return null;
        }

        return title
          .replace(/^\s+|\s+$/g, '')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      function formatHref(url) {
        var href = url.replace(/^\s+|\s+$/g, '');
        if (href.length && href[0] !== '/' && !rfull.test(href)) {
          return 'http://' + href;
        }
        return href;
      }

      module.exports = parseLinkInput;

    }, {}],
    138: [function (require, module, exports) {
      'use strict';

      function trim(remove) {
        var self = this;

        if (remove) {
          beforeReplacer = afterReplacer = '';
        }
        self.selection = self.selection.replace(/^(\s*)/, beforeReplacer).replace(/(\s*)$/, afterReplacer);

        function beforeReplacer(text) {
          self.before += text;
          return '';
        }

        function afterReplacer(text) {
          self.after = text + self.after;
          return '';
        }
      }

      module.exports = trim;

    }, {}],
    139: [function (require, module, exports) {
      'use strict';

      var rtrim = /^\s+|\s+$/g;
      var rspaces = /\s+/g;

      function addClass(el, cls) {
        var current = el.className;
        if (current.indexOf(cls) === -1) {
          el.className = (current + ' ' + cls).replace(rtrim, '');
        }
      }

      function rmClass(el, cls) {
        el.className = el.className.replace(cls, '').replace(rtrim, '').replace(rspaces, ' ');
      }

      module.exports = {
        add: addClass,
        rm: rmClass
      };

    }, {}],
    140: [function (require, module, exports) {
      'use strict';

      function extendRegExp(regex, pre, post) {
        var pattern = regex.toString();
        var flags;

        pattern = pattern.replace(/\/([gim]*)$/, captureFlags);
        pattern = pattern.replace(/(^\/|\/$)/g, '');
        pattern = pre + pattern + post;
        return new RegExp(pattern, flags);

        function captureFlags(all, f) {
          flags = f;
          return '';
        }
      }

      module.exports = extendRegExp;

    }, {}],
    141: [function (require, module, exports) {
      'use strict';

      function fixEOL(text) {
        return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      }

      module.exports = fixEOL;

    }, {}],
    142: [function (require, module, exports) {
      'use strict';

      var InputState = require('./InputState');

      function getCommandHandler(surface, history, fn) {
        return function handleCommand(e) {
          surface.focus(history.inputMode);
          history.setCommandMode();

          var state = new InputState(surface, history.inputMode);
          var chunks = state.getChunks();
          var asyncHandler = {
            async: async,
            immediate: true
          };

          fn.call(asyncHandler, e, history.inputMode, chunks);

          if (asyncHandler.immediate) {
            done();
          }

          function async () {
            asyncHandler.immediate = false;
            return done;
          }

          function done() {
            surface.focus(history.inputMode);
            state.setChunks(chunks);
            state.restore();
          }
        };
      }

      module.exports = getCommandHandler;

    }, {
      "./InputState": 134
    }],
    143: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var doc = global.document;
        var seleccion = require('seleccion');
        var fixEOL = require('./fixEOL');
        var many = require('./many');
        var cast = require('./cast');
        var getSelection = seleccion.get;
        var setSelection = seleccion.set;
        var ropen = /^(<[^>]+(?: [^>]*)?>)/;
        var rclose = /(<\/[^>]+>)$/;

        function surface(textarea, editable, droparea) {
          return {
            textarea: textarea,
            editable: editable,
            droparea: droparea,
            focus: setFocus,
            read: read,
            write: write,
            current: current,
            writeSelection: writeSelection,
            readSelection: readSelection
          };

          function setFocus(mode) {
            current(mode).focus();
          }

          function current(mode) {
            return mode === 'wysiwyg' ? editable : textarea;
          }

          function read(mode) {
            if (mode === 'wysiwyg') {
              return editable.innerHTML;
            }
            return textarea.value;
          }

          function write(mode, value) {
            if (mode === 'wysiwyg') {
              editable.innerHTML = value;
            } else {
              textarea.value = value;
            }
          }

          function writeSelection(state) {
            if (state.mode === 'wysiwyg') {
              writeSelectionEditable(state);
            } else {
              writeSelectionTextarea(state);
            }
          }

          function readSelection(state) {
            if (state.mode === 'wysiwyg') {
              readSelectionEditable(state);
            } else {
              readSelectionTextarea(state);
            }
          }

          function writeSelectionTextarea(state) {
            var range;
            if (textarea.selectionStart !== void 0) {
              textarea.focus();
              textarea.selectionStart = state.start;
              textarea.selectionEnd = state.end;
              textarea.scrollTop = state.scrollTop;
            } else if (doc.selection) {
              if (doc.activeElement && doc.activeElement !== textarea) {
                return;
              }
              textarea.focus();
              range = textarea.createTextRange();
              range.moveStart('character', -textarea.value.length);
              range.moveEnd('character', -textarea.value.length);
              range.moveEnd('character', state.end);
              range.moveStart('character', state.start);
              range.select();
            }
          }

          function readSelectionTextarea(state) {
            if (textarea.selectionStart !== void 0) {
              state.start = textarea.selectionStart;
              state.end = textarea.selectionEnd;
            } else if (doc.selection) {
              ancientlyReadSelectionTextarea(state);
            }
          }

          function ancientlyReadSelectionTextarea(state) {
            if (doc.activeElement && doc.activeElement !== textarea) {
              return;
            }

            state.text = fixEOL(textarea.value);

            var range = doc.selection.createRange();
            var fixedRange = fixEOL(range.text);
            var marker = '\x07';
            var markedRange = marker + fixedRange + marker;

            range.text = markedRange;

            var inputText = fixEOL(textarea.value);

            range.moveStart('character', -markedRange.length);
            range.text = fixedRange;
            state.start = inputText.indexOf(marker);
            state.end = inputText.lastIndexOf(marker) - marker.length;

            var diff = state.text.length - fixEOL(textarea.value).length;
            if (diff) {
              range.moveStart('character', -fixedRange.length);
              fixedRange += many('\n', diff);
              state.end += diff;
              range.text = fixedRange;
            }
            state.select();
          }

          function writeSelectionEditable(state) {
            var chunks = state.cachedChunks || state.getChunks();
            var start = chunks.before.length;
            var end = start + chunks.selection.length;
            var p = {};

            walk(editable.firstChild, peek);
            editable.focus();
            setSelection(p);

            function peek(context, el) {
              var cursor = context.text.length;
              var content = readNode(el).length;
              var sum = cursor + content;
              if (!p.startContainer && sum >= start) {
                p.startContainer = el;
                p.startOffset = bounded(start - cursor);
              }
              if (!p.endContainer && sum >= end) {
                p.endContainer = el;
                p.endOffset = bounded(end - cursor);
              }

              function bounded(offset) {
                return Math.max(0, Math.min(content, offset));
              }
            }
          }

          function readSelectionEditable(state) {
            var sel = getSelection();
            var distance = walk(editable.firstChild, peek);
            var start = distance.start || 0;
            var end = distance.end || 0;

            state.text = distance.text;

            if (end > start) {
              state.start = start;
              state.end = end;
            } else {
              state.start = end;
              state.end = start;
            }

            function peek(context, el) {
              if (el === sel.anchorNode) {
                context.start = context.text.length + sel.anchorOffset;
              }
              if (el === sel.focusNode) {
                context.end = context.text.length + sel.focusOffset;
              }
            }
          }

          function walk(el, peek, ctx, siblings) {
            var context = ctx || {
              text: ''
            };

            if (!el) {
              return context;
            }

            var elNode = el.nodeType === 1;
            var textNode = el.nodeType === 3;

            peek(context, el);

            if (textNode) {
              context.text += readNode(el);
            }
            if (elNode) {
              if (el.outerHTML.match(ropen)) {
                context.text += RegExp.$1;
              }
              cast(el.childNodes).forEach(walkChildren);
              if (el.outerHTML.match(rclose)) {
                context.text += RegExp.$1;
              }
            }
            if (siblings !== false && el.nextSibling) {
              return walk(el.nextSibling, peek, context);
            }
            return context;

            function walkChildren(child) {
              walk(child, peek, context, false);
            }
          }

          function readNode(el) {
            return el.nodeType === 3 ? fixEOL(el.textContent || el.innerText || '') : '';
          }
        }

        module.exports = surface;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9nZXRTdXJmYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIHNlbGVjY2lvbiA9IHJlcXVpcmUoJ3NlbGVjY2lvbicpO1xudmFyIGZpeEVPTCA9IHJlcXVpcmUoJy4vZml4RU9MJyk7XG52YXIgbWFueSA9IHJlcXVpcmUoJy4vbWFueScpO1xudmFyIGNhc3QgPSByZXF1aXJlKCcuL2Nhc3QnKTtcbnZhciBnZXRTZWxlY3Rpb24gPSBzZWxlY2Npb24uZ2V0O1xudmFyIHNldFNlbGVjdGlvbiA9IHNlbGVjY2lvbi5zZXQ7XG52YXIgcm9wZW4gPSAvXig8W14+XSsoPzogW14+XSopPz4pLztcbnZhciByY2xvc2UgPSAvKDxcXC9bXj5dKz4pJC87XG5cbmZ1bmN0aW9uIHN1cmZhY2UgKHRleHRhcmVhLCBlZGl0YWJsZSwgZHJvcGFyZWEpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZXh0YXJlYTogdGV4dGFyZWEsXG4gICAgZWRpdGFibGU6IGVkaXRhYmxlLFxuICAgIGRyb3BhcmVhOiBkcm9wYXJlYSxcbiAgICBmb2N1czogc2V0Rm9jdXMsXG4gICAgcmVhZDogcmVhZCxcbiAgICB3cml0ZTogd3JpdGUsXG4gICAgY3VycmVudDogY3VycmVudCxcbiAgICB3cml0ZVNlbGVjdGlvbjogd3JpdGVTZWxlY3Rpb24sXG4gICAgcmVhZFNlbGVjdGlvbjogcmVhZFNlbGVjdGlvblxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldEZvY3VzIChtb2RlKSB7XG4gICAgY3VycmVudChtb2RlKS5mb2N1cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3VycmVudCAobW9kZSkge1xuICAgIHJldHVybiBtb2RlID09PSAnd3lzaXd5ZycgPyBlZGl0YWJsZSA6IHRleHRhcmVhO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAobW9kZSkge1xuICAgIGlmIChtb2RlID09PSAnd3lzaXd5ZycpIHtcbiAgICAgIHJldHVybiBlZGl0YWJsZS5pbm5lckhUTUw7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0YXJlYS52YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlIChtb2RlLCB2YWx1ZSkge1xuICAgIGlmIChtb2RlID09PSAnd3lzaXd5ZycpIHtcbiAgICAgIGVkaXRhYmxlLmlubmVySFRNTCA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0YXJlYS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlU2VsZWN0aW9uIChzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS5tb2RlID09PSAnd3lzaXd5ZycpIHtcbiAgICAgIHdyaXRlU2VsZWN0aW9uRWRpdGFibGUoc3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3cml0ZVNlbGVjdGlvblRleHRhcmVhKHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkU2VsZWN0aW9uIChzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS5tb2RlID09PSAnd3lzaXd5ZycpIHtcbiAgICAgIHJlYWRTZWxlY3Rpb25FZGl0YWJsZShzdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWRTZWxlY3Rpb25UZXh0YXJlYShzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGVTZWxlY3Rpb25UZXh0YXJlYSAoc3RhdGUpIHtcbiAgICB2YXIgcmFuZ2U7XG4gICAgaWYgKHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0ICE9PSB2b2lkIDApIHtcbiAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydCA9IHN0YXRlLnN0YXJ0O1xuICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uRW5kID0gc3RhdGUuZW5kO1xuICAgICAgdGV4dGFyZWEuc2Nyb2xsVG9wID0gc3RhdGUuc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jLnNlbGVjdGlvbikge1xuICAgICAgaWYgKGRvYy5hY3RpdmVFbGVtZW50ICYmIGRvYy5hY3RpdmVFbGVtZW50ICE9PSB0ZXh0YXJlYSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0ZXh0YXJlYS5mb2N1cygpO1xuICAgICAgcmFuZ2UgPSB0ZXh0YXJlYS5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLXRleHRhcmVhLnZhbHVlLmxlbmd0aCk7XG4gICAgICByYW5nZS5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAtdGV4dGFyZWEudmFsdWUubGVuZ3RoKTtcbiAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIHN0YXRlLmVuZCk7XG4gICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIHN0YXRlLnN0YXJ0KTtcbiAgICAgIHJhbmdlLnNlbGVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRTZWxlY3Rpb25UZXh0YXJlYSAoc3RhdGUpIHtcbiAgICBpZiAodGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQgIT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUuc3RhcnQgPSB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydDtcbiAgICAgIHN0YXRlLmVuZCA9IHRleHRhcmVhLnNlbGVjdGlvbkVuZDtcbiAgICB9IGVsc2UgaWYgKGRvYy5zZWxlY3Rpb24pIHtcbiAgICAgIGFuY2llbnRseVJlYWRTZWxlY3Rpb25UZXh0YXJlYShzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYW5jaWVudGx5UmVhZFNlbGVjdGlvblRleHRhcmVhIChzdGF0ZSkge1xuICAgIGlmIChkb2MuYWN0aXZlRWxlbWVudCAmJiBkb2MuYWN0aXZlRWxlbWVudCAhPT0gdGV4dGFyZWEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdGF0ZS50ZXh0ID0gZml4RU9MKHRleHRhcmVhLnZhbHVlKTtcblxuICAgIHZhciByYW5nZSA9IGRvYy5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcbiAgICB2YXIgZml4ZWRSYW5nZSA9IGZpeEVPTChyYW5nZS50ZXh0KTtcbiAgICB2YXIgbWFya2VyID0gJ1xceDA3JztcbiAgICB2YXIgbWFya2VkUmFuZ2UgPSBtYXJrZXIgKyBmaXhlZFJhbmdlICsgbWFya2VyO1xuXG4gICAgcmFuZ2UudGV4dCA9IG1hcmtlZFJhbmdlO1xuXG4gICAgdmFyIGlucHV0VGV4dCA9IGZpeEVPTCh0ZXh0YXJlYS52YWx1ZSk7XG5cbiAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1tYXJrZWRSYW5nZS5sZW5ndGgpO1xuICAgIHJhbmdlLnRleHQgPSBmaXhlZFJhbmdlO1xuICAgIHN0YXRlLnN0YXJ0ID0gaW5wdXRUZXh0LmluZGV4T2YobWFya2VyKTtcbiAgICBzdGF0ZS5lbmQgPSBpbnB1dFRleHQubGFzdEluZGV4T2YobWFya2VyKSAtIG1hcmtlci5sZW5ndGg7XG5cbiAgICB2YXIgZGlmZiA9IHN0YXRlLnRleHQubGVuZ3RoIC0gZml4RU9MKHRleHRhcmVhLnZhbHVlKS5sZW5ndGg7XG4gICAgaWYgKGRpZmYpIHtcbiAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLWZpeGVkUmFuZ2UubGVuZ3RoKTtcbiAgICAgIGZpeGVkUmFuZ2UgKz0gbWFueSgnXFxuJywgZGlmZik7XG4gICAgICBzdGF0ZS5lbmQgKz0gZGlmZjtcbiAgICAgIHJhbmdlLnRleHQgPSBmaXhlZFJhbmdlO1xuICAgIH1cbiAgICBzdGF0ZS5zZWxlY3QoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlU2VsZWN0aW9uRWRpdGFibGUgKHN0YXRlKSB7XG4gICAgdmFyIGNodW5rcyA9IHN0YXRlLmNhY2hlZENodW5rcyB8fCBzdGF0ZS5nZXRDaHVua3MoKTtcbiAgICB2YXIgc3RhcnQgPSBjaHVua3MuYmVmb3JlLmxlbmd0aDtcbiAgICB2YXIgZW5kID0gc3RhcnQgKyBjaHVua3Muc2VsZWN0aW9uLmxlbmd0aDtcbiAgICB2YXIgcCA9IHt9O1xuXG4gICAgd2FsayhlZGl0YWJsZS5maXJzdENoaWxkLCBwZWVrKTtcbiAgICBlZGl0YWJsZS5mb2N1cygpO1xuICAgIHNldFNlbGVjdGlvbihwKTtcblxuICAgIGZ1bmN0aW9uIHBlZWsgKGNvbnRleHQsIGVsKSB7XG4gICAgICB2YXIgY3Vyc29yID0gY29udGV4dC50ZXh0Lmxlbmd0aDtcbiAgICAgIHZhciBjb250ZW50ID0gcmVhZE5vZGUoZWwpLmxlbmd0aDtcbiAgICAgIHZhciBzdW0gPSBjdXJzb3IgKyBjb250ZW50O1xuICAgICAgaWYgKCFwLnN0YXJ0Q29udGFpbmVyICYmIHN1bSA+PSBzdGFydCkge1xuICAgICAgICBwLnN0YXJ0Q29udGFpbmVyID0gZWw7XG4gICAgICAgIHAuc3RhcnRPZmZzZXQgPSBib3VuZGVkKHN0YXJ0IC0gY3Vyc29yKTtcbiAgICAgIH1cbiAgICAgIGlmICghcC5lbmRDb250YWluZXIgJiYgc3VtID49IGVuZCkge1xuICAgICAgICBwLmVuZENvbnRhaW5lciA9IGVsO1xuICAgICAgICBwLmVuZE9mZnNldCA9IGJvdW5kZWQoZW5kIC0gY3Vyc29yKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYm91bmRlZCAob2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbihjb250ZW50LCBvZmZzZXQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkU2VsZWN0aW9uRWRpdGFibGUgKHN0YXRlKSB7XG4gICAgdmFyIHNlbCA9IGdldFNlbGVjdGlvbigpO1xuICAgIHZhciBkaXN0YW5jZSA9IHdhbGsoZWRpdGFibGUuZmlyc3RDaGlsZCwgcGVlayk7XG4gICAgdmFyIHN0YXJ0ID0gZGlzdGFuY2Uuc3RhcnQgfHwgMDtcbiAgICB2YXIgZW5kID0gZGlzdGFuY2UuZW5kIHx8IDA7XG5cbiAgICBzdGF0ZS50ZXh0ID0gZGlzdGFuY2UudGV4dDtcblxuICAgIGlmIChlbmQgPiBzdGFydCkge1xuICAgICAgc3RhdGUuc3RhcnQgPSBzdGFydDtcbiAgICAgIHN0YXRlLmVuZCA9IGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuc3RhcnQgPSBlbmQ7XG4gICAgICBzdGF0ZS5lbmQgPSBzdGFydDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWVrIChjb250ZXh0LCBlbCkge1xuICAgICAgaWYgKGVsID09PSBzZWwuYW5jaG9yTm9kZSkge1xuICAgICAgICBjb250ZXh0LnN0YXJ0ID0gY29udGV4dC50ZXh0Lmxlbmd0aCArIHNlbC5hbmNob3JPZmZzZXQ7XG4gICAgICB9XG4gICAgICBpZiAoZWwgPT09IHNlbC5mb2N1c05vZGUpIHtcbiAgICAgICAgY29udGV4dC5lbmQgPSBjb250ZXh0LnRleHQubGVuZ3RoICsgc2VsLmZvY3VzT2Zmc2V0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdhbGsgKGVsLCBwZWVrLCBjdHgsIHNpYmxpbmdzKSB7XG4gICAgdmFyIGNvbnRleHQgPSBjdHggfHwgeyB0ZXh0OiAnJyB9O1xuXG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgdmFyIGVsTm9kZSA9IGVsLm5vZGVUeXBlID09PSAxO1xuICAgIHZhciB0ZXh0Tm9kZSA9IGVsLm5vZGVUeXBlID09PSAzO1xuXG4gICAgcGVlayhjb250ZXh0LCBlbCk7XG5cbiAgICBpZiAodGV4dE5vZGUpIHtcbiAgICAgIGNvbnRleHQudGV4dCArPSByZWFkTm9kZShlbCk7XG4gICAgfVxuICAgIGlmIChlbE5vZGUpIHtcbiAgICAgIGlmIChlbC5vdXRlckhUTUwubWF0Y2gocm9wZW4pKSB7IGNvbnRleHQudGV4dCArPSBSZWdFeHAuJDE7IH1cbiAgICAgIGNhc3QoZWwuY2hpbGROb2RlcykuZm9yRWFjaCh3YWxrQ2hpbGRyZW4pO1xuICAgICAgaWYgKGVsLm91dGVySFRNTC5tYXRjaChyY2xvc2UpKSB7IGNvbnRleHQudGV4dCArPSBSZWdFeHAuJDE7IH1cbiAgICB9XG4gICAgaWYgKHNpYmxpbmdzICE9PSBmYWxzZSAmJiBlbC5uZXh0U2libGluZykge1xuICAgICAgcmV0dXJuIHdhbGsoZWwubmV4dFNpYmxpbmcsIHBlZWssIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dDtcblxuICAgIGZ1bmN0aW9uIHdhbGtDaGlsZHJlbiAoY2hpbGQpIHtcbiAgICAgIHdhbGsoY2hpbGQsIHBlZWssIGNvbnRleHQsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkTm9kZSAoZWwpIHtcbiAgICByZXR1cm4gZWwubm9kZVR5cGUgPT09IDMgPyBmaXhFT0woZWwudGV4dENvbnRlbnQgfHwgZWwuaW5uZXJUZXh0IHx8ICcnKSA6ICcnO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3VyZmFjZTtcbiJdfQ==
    }, {
      "./cast": 136,
      "./fixEOL": 141,
      "./many": 155,
      "seleccion": 124
    }],
    144: [function (require, module, exports) {
      'use strict';

      function getText(el) {
        return el.innerText || el.textContent;
      }

      module.exports = getText;

    }, {}],
    145: [function (require, module, exports) {
      'use strict';

      var trimChunks = require('../chunks/trim');

      function HtmlChunks() {}

      HtmlChunks.prototype.trim = trimChunks;

      HtmlChunks.prototype.findTags = function () {};

      HtmlChunks.prototype.skip = function () {};

      module.exports = HtmlChunks;

    }, {
      "../chunks/trim": 138
    }],
    146: [function (require, module, exports) {
      'use strict';

      var strings = require('../strings');
      var wrapping = require('./wrapping');

      function blockquote(chunks) {
        wrapping('blockquote', strings.placeholders.quote, chunks);
      }

      module.exports = blockquote;

    }, {
      "../strings": 173,
      "./wrapping": 153
    }],
    147: [function (require, module, exports) {
      'use strict';

      var strings = require('../strings');
      var wrapping = require('./wrapping');

      function boldOrItalic(chunks, type) {
        wrapping(type === 'bold' ? 'strong' : 'em', strings.placeholders[type], chunks);
      }

      module.exports = boldOrItalic;

    }, {
      "../strings": 173,
      "./wrapping": 153
    }],
    148: [function (require, module, exports) {
      'use strict';

      var strings = require('../strings');
      var wrapping = require('./wrapping');

      function codeblock(chunks) {
        wrapping('pre><code', strings.placeholders.code, chunks);
      }

      module.exports = codeblock;

    }, {
      "../strings": 173,
      "./wrapping": 153
    }],
    149: [function (require, module, exports) {
      'use strict';

      var strings = require('../strings');
      var rleading = /<h([1-6])( [^>]*)?>$/;
      var rtrailing = /^<\/h([1-6])>/;

      function heading(chunks) {
        chunks.trim();

        var trail = rtrailing.exec(chunks.after);
        var lead = rleading.exec(chunks.before);
        if (lead && trail && lead[1] === trail[1]) {
          swap();
        } else {
          add();
        }

        function swap() {
          var level = parseInt(lead[1], 10);
          var next = level <= 1 ? 4 : level - 1;
          chunks.before = chunks.before.replace(rleading, '<h' + next + '>');
          chunks.after = chunks.after.replace(rtrailing, '</h' + next + '>');
        }

        function add() {
          if (!chunks.selection) {
            chunks.selection = strings.placeholders.heading;
          }
          chunks.before += '<h1>';
          chunks.after = '</h1>' + chunks.after;
        }
      }

      module.exports = heading;

    }, {
      "../strings": 173
    }],
    150: [function (require, module, exports) {
      'use strict';

      function hr(chunks) {
        chunks.before += '\n<hr>\n';
        chunks.selection = '';
      }

      module.exports = hr;

    }, {}],
    151: [function (require, module, exports) {
      'use strict';

      var crossvent = require('crossvent');
      var once = require('../once');
      var strings = require('../strings');
      var parseLinkInput = require('../chunks/parseLinkInput');
      var rleading = /<a( [^>]*)?>$/;
      var rtrailing = /^<\/a>/;
      var rimage = /<img( [^>]*)?\/>$/;

      function linkOrImageOrAttachment(chunks, options) {
        var type = options.type;
        var image = type === 'image';
        var resume;

        if (type !== 'attachment') {
          chunks.trim();
        }

        if (removal()) {
          return;
        }

        resume = this.async();

        options.prompts.close();
        (options.prompts[type] || options.prompts.link)(options, once(resolved));

        function removal() {
          if (image) {
            if (rimage.test(chunks.selection)) {
              chunks.selection = '';
              return true;
            }
          } else if (rtrailing.exec(chunks.after) && rleading.exec(chunks.before)) {
            chunks.before = chunks.before.replace(rleading, '');
            chunks.after = chunks.after.replace(rtrailing, '');
            return true;
          }
        }

        function resolved(result) {
          var parts;
          var links = result.definitions.map(parseLinkInput).filter(long);
          if (links.length === 0) {
            resume();
            return;
          }
          var link = links[0];

          if (type === 'attachment') {
            parts = options.mergeHtmlAndAttachment(chunks, link);
            chunks.before = parts.before;
            chunks.selection = parts.selection;
            chunks.after = parts.after;
            resume();
            crossvent.fabricate(options.surface.textarea, 'woofmark-mode-change');
            return;
          }

          if (image) {
            imageWrap(link, links.slice(1));
          } else {
            linkWrap(link, links.slice(1));
          }

          if (!chunks.selection) {
            chunks.selection = strings.placeholders[type];
          }
          resume();

          function long(link) {
            return link.href.length > 0;
          }

          function getTitle(link) {
            return link.title ? ' title="' + link.title + '"' : '';
          }

          function imageWrap(link, rest) {
            var after = chunks.after;
            chunks.before += tagopen(link);
            chunks.after = tagclose(link);
            if (rest.length) {
              chunks.after += rest.map(toAnotherImage).join('');
            }
            chunks.after += after;

            function tagopen(link) {
              return '<img src="' + link.href + '" alt="';
            }

            function tagclose(link) {
              return '"' + getTitle(link) + ' />';
            }

            function toAnotherImage(link) {
              return ' ' + tagopen(link) + tagclose(link);
            }
          }

          function linkWrap(link, rest) {
            var after = chunks.after;
            var names = options.classes.input.links;
            var classes = names ? ' class="' + names + '"' : '';
            chunks.before += tagopen(link);
            chunks.after = tagclose();
            if (rest.length) {
              chunks.after += rest.map(toAnotherLink).join('');
            }
            chunks.after += after;

            function tagopen(link) {
              return '<a href="' + link.href + '"' + getTitle(link) + classes + '>';
            }

            function tagclose() {
              return '</a>';
            }

            function toAnotherLink(link) {
              return ' ' + tagopen(link) + tagclose();
            }
          }
        }
      }

      module.exports = linkOrImageOrAttachment;

    }, {
      "../chunks/parseLinkInput": 137,
      "../once": 166,
      "../strings": 173,
      "crossvent": 12
    }],
    152: [function (require, module, exports) {
      'use strict';

      var strings = require('../strings');
      var rleftsingle = /<(ul|ol)( [^>]*)?>\s*<li( [^>]*)?>$/;
      var rrightsingle = /^<\/li>\s*<\/(ul|ol)>/;
      var rleftitem = /<li( [^>]*)?>$/;
      var rrightitem = /^<\/li( [^>]*)?>/;
      var ropen = /^<(ul|ol)( [^>]*)?>$/;

      function list(chunks, ordered) {
        var tag = ordered ? 'ol' : 'ul';
        var olist = '<' + tag + '>';
        var clist = '</' + tag + '>';

        chunks.trim();

        if (rleftsingle.test(chunks.before) && rrightsingle.test(chunks.after)) {
          if (tag === RegExp.$1) {
            chunks.before = chunks.before.replace(rleftsingle, '');
            chunks.after = chunks.after.replace(rrightsingle, '');
            return;
          }
        }

        var ulStart = chunks.before.lastIndexOf('<ul');
        var olStart = chunks.before.lastIndexOf('<ol');
        var closeTag = chunks.after.indexOf('</ul>');
        if (closeTag === -1) {
          closeTag = chunks.after.indexOf('</ol>');
        }
        if (closeTag === -1) {
          add();
          return;
        }
        var openStart = ulStart > olStart ? ulStart : olStart;
        if (openStart === -1) {
          add();
          return;
        }
        var openEnd = chunks.before.indexOf('>', openStart);
        if (openEnd === -1) {
          add();
          return;
        }

        var openTag = chunks.before.substr(openStart, openEnd - openStart + 1);
        if (ropen.test(openTag)) {
          if (tag !== RegExp.$1) {
            chunks.before = chunks.before.substr(0, openStart) + '<' + tag + chunks.before.substr(openStart + 3);
            chunks.after = chunks.after.substr(0, closeTag) + '</' + tag + chunks.after.substr(closeTag + 4);
          } else {
            if (rleftitem.test(chunks.before) && rrightitem.test(chunks.after)) {
              chunks.before = chunks.before.replace(rleftitem, '');
              chunks.after = chunks.after.replace(rrightitem, '');
            } else {
              add(true);
            }
          }
        }

        function add(list) {
          var open = list ? '' : olist;
          var close = list ? '' : clist;

          chunks.before += open + '<li>';
          chunks.after = '</li>' + close + chunks.after;

          if (!chunks.selection) {
            chunks.selection = strings.placeholders.listitem;
          }
        }
      }

      module.exports = list;

    }, {
      "../strings": 173
    }],
    153: [function (require, module, exports) {
      'use strict';

      function wrapping(tag, placeholder, chunks) {
        var open = '<' + tag;
        var close = '</' + tag.replace(/</g, '</');
        var rleading = new RegExp(open + '( [^>]*)?>$', 'i');
        var rtrailing = new RegExp('^' + close + '>', 'i');
        var ropen = new RegExp(open + '( [^>]*)?>', 'ig');
        var rclose = new RegExp(close + '( [^>]*)?>', 'ig');

        chunks.trim();

        var trail = rtrailing.exec(chunks.after);
        var lead = rleading.exec(chunks.before);
        if (lead && trail) {
          chunks.before = chunks.before.replace(rleading, '');
          chunks.after = chunks.after.replace(rtrailing, '');
        } else {
          if (!chunks.selection) {
            chunks.selection = placeholder;
          }
          var opened = ropen.test(chunks.selection);
          if (opened) {
            chunks.selection = chunks.selection.replace(ropen, '');
            if (!surrounded(chunks, tag)) {
              chunks.before += open + '>';
            }
          }
          var closed = rclose.test(chunks.selection);
          if (closed) {
            chunks.selection = chunks.selection.replace(rclose, '');
            if (!surrounded(chunks, tag)) {
              chunks.after = close + '>' + chunks.after;
            }
          }
          if (opened || closed) {
            pushover();
            return;
          }
          if (surrounded(chunks, tag)) {
            if (rleading.test(chunks.before)) {
              chunks.before = chunks.before.replace(rleading, '');
            } else {
              chunks.before += close + '>';
            }
            if (rtrailing.test(chunks.after)) {
              chunks.after = chunks.after.replace(rtrailing, '');
            } else {
              chunks.after = open + '>' + chunks.after;
            }
          } else if (!closebounded(chunks, tag)) {
            chunks.after = close + '>' + chunks.after;
            chunks.before += open + '>';
          }
          pushover();
        }

        function pushover() {
          chunks.selection.replace(/<(\/)?([^> ]+)( [^>]*)?>/ig, pushoverOtherTags);
        }

        function pushoverOtherTags(all, closing, tag, a, i) {
          var attrs = a || '';
          var open = !closing;
          var rclosed = new RegExp('<\/' + tag.replace(/</g, '</') + '>', 'i');
          var ropened = new RegExp('<' + tag + '( [^>]*)?>', 'i');
          if (open && !rclosed.test(chunks.selection.substr(i))) {
            chunks.selection += '</' + tag + '>';
            chunks.after = chunks.after.replace(/^(<\/[^>]+>)/, '$1<' + tag + attrs + '>');
          }

          if (closing && !ropened.test(chunks.selection.substr(0, i))) {
            chunks.selection = '<' + tag + attrs + '>' + chunks.selection;
            chunks.before = chunks.before.replace(/(<[^>]+(?: [^>]*)?>)$/, '</' + tag + '>$1');
          }
        }
      }

      function closebounded(chunks, tag) {
        var rcloseleft = new RegExp('</' + tag.replace(/</g, '</') + '>$', 'i');
        var ropenright = new RegExp('^<' + tag + '(?: [^>]*)?>', 'i');
        var bounded = rcloseleft.test(chunks.before) && ropenright.test(chunks.after);
        if (bounded) {
          chunks.before = chunks.before.replace(rcloseleft, '');
          chunks.after = chunks.after.replace(ropenright, '');
        }
        return bounded;
      }

      function surrounded(chunks, tag) {
        var ropen = new RegExp('<' + tag + '(?: [^>]*)?>', 'ig');
        var rclose = new RegExp('<\/' + tag.replace(/</g, '</') + '>', 'ig');
        var opensBefore = count(chunks.before, ropen);
        var opensAfter = count(chunks.after, ropen);
        var closesBefore = count(chunks.before, rclose);
        var closesAfter = count(chunks.after, rclose);
        var open = opensBefore - closesBefore > 0;
        var close = closesAfter - opensAfter > 0;
        return open && close;

        function count(text, regex) {
          var match = text.match(regex);
          if (match) {
            return match.length;
          }
          return 0;
        }
      }

      module.exports = wrapping;

    }, {}],
    154: [function (require, module, exports) {
      (function (global) {
        'use strict';

        function isVisibleElement(elem) {
          if (global.getComputedStyle) {
            return global.getComputedStyle(elem, null).getPropertyValue('display') !== 'none';
          } else if (elem.currentStyle) {
            return elem.currentStyle.display !== 'none';
          }
        }

        module.exports = isVisibleElement;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc1Zpc2libGVFbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaXNWaXNpYmxlRWxlbWVudCAoZWxlbSkge1xuICBpZiAoZ2xvYmFsLmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICByZXR1cm4gZ2xvYmFsLmdldENvbXB1dGVkU3R5bGUoZWxlbSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnZGlzcGxheScpICE9PSAnbm9uZSc7XG4gIH0gZWxzZSBpZiAoZWxlbS5jdXJyZW50U3R5bGUpIHtcbiAgICByZXR1cm4gZWxlbS5jdXJyZW50U3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNWaXNpYmxlRWxlbWVudDtcbiJdfQ==
    }, {}],
    155: [function (require, module, exports) {
      'use strict';

      function many(text, times) {
        return new Array(times + 1).join(text);
      }

      module.exports = many;

    }, {}],
    156: [function (require, module, exports) {
      'use strict';

      var many = require('../many');
      var extendRegExp = require('../extendRegExp');
      var trimChunks = require('../chunks/trim');

      function MarkdownChunks() {}

      MarkdownChunks.prototype.trim = trimChunks;

      MarkdownChunks.prototype.findTags = function (startRegex, endRegex) {
        var self = this;
        var regex;

        if (startRegex) {
          regex = extendRegExp(startRegex, '', '$');
          this.before = this.before.replace(regex, startReplacer);
          regex = extendRegExp(startRegex, '^', '');
          this.selection = this.selection.replace(regex, startReplacer);
        }

        if (endRegex) {
          regex = extendRegExp(endRegex, '', '$');
          this.selection = this.selection.replace(regex, endReplacer);
          regex = extendRegExp(endRegex, '^', '');
          this.after = this.after.replace(regex, endReplacer);
        }

        function startReplacer(match) {
          self.startTag = self.startTag + match;
          return '';
        }

        function endReplacer(match) {
          self.endTag = match + self.endTag;
          return '';
        }
      };

      MarkdownChunks.prototype.skip = function (options) {
        var o = options || {};
        var beforeCount = 'before' in o ? o.before : 1;
        var afterCount = 'after' in o ? o.after : 1;

        this.selection = this.selection.replace(/(^\n*)/, '');
        this.startTag = this.startTag + RegExp.$1;
        this.selection = this.selection.replace(/(\n*$)/, '');
        this.endTag = this.endTag + RegExp.$1;
        this.startTag = this.startTag.replace(/(^\n*)/, '');
        this.before = this.before + RegExp.$1;
        this.endTag = this.endTag.replace(/(\n*$)/, '');
        this.after = this.after + RegExp.$1;

        if (this.before) {
          this.before = replace(this.before, ++beforeCount, '$');
        }

        if (this.after) {
          this.after = replace(this.after, ++afterCount, '');
        }

        function replace(text, count, suffix) {
          var regex = o.any ? '\\n*' : many('\\n?', count);
          var replacement = many('\n', count);
          return text.replace(new RegExp(regex + suffix), replacement);
        }
      };

      module.exports = MarkdownChunks;

    }, {
      "../chunks/trim": 138,
      "../extendRegExp": 140,
      "../many": 155
    }],
    157: [function (require, module, exports) {
      'use strict';

      var strings = require('../strings');
      var wrapping = require('./wrapping');
      var settings = require('./settings');
      var rtrailblankline = /(>[ \t]*)$/;
      var rleadblankline = /^(>[ \t]*)/;
      var rnewlinefencing = /^(\n*)([^\r]+?)(\n*)$/;
      var rendtag = /^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/;
      var rleadbracket = /^\n((>|\s)*)\n/;
      var rtrailbracket = /\n((>|\s)*)\n$/;

      function blockquote(chunks) {
        var match = '';
        var leftOver = '';
        var line;

        chunks.selection = chunks.selection.replace(rnewlinefencing, newlinereplacer);
        chunks.before = chunks.before.replace(rtrailblankline, trailblanklinereplacer);
        chunks.selection = chunks.selection.replace(/^(\s|>)+$/, '');
        chunks.selection = chunks.selection || strings.placeholders.quote;

        if (chunks.before) {
          beforeProcessing();
        }

        chunks.startTag = match;
        chunks.before = leftOver;

        if (chunks.after) {
          chunks.after = chunks.after.replace(/^\n?/, '\n');
        }

        chunks.after = chunks.after.replace(rendtag, endtagreplacer);

        if (/^(?![ ]{0,3}>)/m.test(chunks.selection)) {
          wrapping.wrap(chunks, settings.lineLength - 2);
          chunks.selection = chunks.selection.replace(/^/gm, '> ');
          replaceBlanksInTags(true);
          chunks.skip();
        } else {
          chunks.selection = chunks.selection.replace(/^[ ]{0,3}> ?/gm, '');
          wrapping.unwrap(chunks);
          replaceBlanksInTags(false);

          if (!/^(\n|^)[ ]{0,3}>/.test(chunks.selection) && chunks.startTag) {
            chunks.startTag = chunks.startTag.replace(/\n{0,2}$/, '\n\n');
          }

          if (!/(\n|^)[ ]{0,3}>.*$/.test(chunks.selection) && chunks.endTag) {
            chunks.endTag = chunks.endTag.replace(/^\n{0,2}/, '\n\n');
          }
        }

        if (!/\n/.test(chunks.selection)) {
          chunks.selection = chunks.selection.replace(rleadblankline, leadblanklinereplacer);
        }

        function newlinereplacer(all, before, text, after) {
          chunks.before += before;
          chunks.after = after + chunks.after;
          return text;
        }

        function trailblanklinereplacer(all, blank) {
          chunks.selection = blank + chunks.selection;
          return '';
        }

        function leadblanklinereplacer(all, blanks) {
          chunks.startTag += blanks;
          return '';
        }

        function beforeProcessing() {
          var lines = chunks.before.replace(/\n$/, '').split('\n');
          var chained = false;
          var good;

          for (var i = 0; i < lines.length; i++) {
            good = false;
            line = lines[i];
            chained = chained && line.length > 0;
            if (/^>/.test(line)) {
              good = true;
              if (!chained && line.length > 1) {
                chained = true;
              }
            } else if (/^[ \t]*$/.test(line)) {
              good = true;
            } else {
              good = chained;
            }
            if (good) {
              match += line + '\n';
            } else {
              leftOver += match + line;
              match = '\n';
            }
          }

          if (!/(^|\n)>/.test(match)) {
            leftOver += match;
            match = '';
          }
        }

        function endtagreplacer(all) {
          chunks.endTag = all;
          return '';
        }

        function replaceBlanksInTags(bracket) {
          var replacement = bracket ? '> ' : '';

          if (chunks.startTag) {
            chunks.startTag = chunks.startTag.replace(rtrailbracket, replacer);
          }
          if (chunks.endTag) {
            chunks.endTag = chunks.endTag.replace(rleadbracket, replacer);
          }

          function replacer(all, markdown) {
            return '\n' + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + '\n';
          }
        }
      }

      module.exports = blockquote;

    }, {
      "../strings": 173,
      "./settings": 164,
      "./wrapping": 165
    }],
    158: [function (require, module, exports) {
      'use strict';

      var rleading = /^(\**)/;
      var rtrailing = /(\**$)/;
      var rtrailingspace = /(\s?)$/;
      var strings = require('../strings');

      function boldOrItalic(chunks, type) {
        var rnewlines = /\n{2,}/g;
        var starCount = type === 'bold' ? 2 : 1;

        chunks.trim();
        chunks.selection = chunks.selection.replace(rnewlines, '\n');

        var markup;
        var leadStars = rtrailing.exec(chunks.before)[0];
        var trailStars = rleading.exec(chunks.after)[0];
        var stars = '\\*{' + starCount + '}';
        var fence = Math.min(leadStars.length, trailStars.length);
        if (fence >= starCount && (fence !== 2 || starCount !== 1)) {
          chunks.before = chunks.before.replace(new RegExp(stars + '$', ''), '');
          chunks.after = chunks.after.replace(new RegExp('^' + stars, ''), '');
        } else if (!chunks.selection && trailStars) {
          chunks.after = chunks.after.replace(rleading, '');
          chunks.before = chunks.before.replace(rtrailingspace, '') + trailStars + RegExp.$1;
        } else {
          if (!chunks.selection && !trailStars) {
            chunks.selection = strings.placeholders[type];
          }

          markup = starCount === 1 ? '*' : '**';
          chunks.before = chunks.before + markup;
          chunks.after = markup + chunks.after;
        }
      }

      module.exports = boldOrItalic;

    }, {
      "../strings": 173
    }],
    159: [function (require, module, exports) {
      'use strict';

      var strings = require('../strings');
      var rtextbefore = /\S[ ]*$/;
      var rtextafter = /^[ ]*\S/;
      var rnewline = /\n/;
      var rbacktick = /`/;
      var rfencebefore = /```[a-z]*\n?$/;
      var rfencebeforeinside = /^```[a-z]*\n/;
      var rfenceafter = /^\n?```/;
      var rfenceafterinside = /\n```$/;

      function codeblock(chunks, options) {
        var newlined = rnewline.test(chunks.selection);
        var trailing = rtextafter.test(chunks.after);
        var leading = rtextbefore.test(chunks.before);
        var outfenced = rfencebefore.test(chunks.before) && rfenceafter.test(chunks.after);
        if (outfenced || newlined || !(leading || trailing)) {
          block(outfenced);
        } else {
          inline();
        }

        function inline() {
          chunks.trim();
          chunks.findTags(rbacktick, rbacktick);

          if (!chunks.startTag && !chunks.endTag) {
            chunks.startTag = chunks.endTag = '`';
            if (!chunks.selection) {
              chunks.selection = strings.placeholders.code;
            }
          } else if (chunks.endTag && !chunks.startTag) {
            chunks.before += chunks.endTag;
            chunks.endTag = '';
          } else {
            chunks.startTag = chunks.endTag = '';
          }
        }

        function block(outfenced) {
          if (outfenced) {
            chunks.before = chunks.before.replace(rfencebefore, '');
            chunks.after = chunks.after.replace(rfenceafter, '');
            return;
          }

          chunks.before = chunks.before.replace(/[ ]{4}|```[a-z]*\n$/, mergeSelection);
          chunks.skip({
            before: /(\n|^)(\t|[ ]{4,}|```[a-z]*\n).*\n$/.test(chunks.before) ? 0 : 1,
            after: /^\n(\t|[ ]{4,}|\n```)/.test(chunks.after) ? 0 : 1
          });

          if (!chunks.selection) {
            if (options.fencing) {
              chunks.startTag = '```\n';
              chunks.endTag = '\n```';
            } else {
              chunks.startTag = '    ';
            }
            chunks.selection = strings.placeholders.code;
          } else {
            if (rfencebeforeinside.test(chunks.selection) && rfenceafterinside.test(chunks.selection)) {
              chunks.selection = chunks.selection.replace(/(^```[a-z]*\n)|(```$)/g, '');
            } else if (/^[ ]{0,3}\S/m.test(chunks.selection)) {
              if (options.fencing) {
                chunks.before += '```\n';
                chunks.after = '\n```' + chunks.after;
              } else if (newlined) {
                chunks.selection = chunks.selection.replace(/^/gm, '    ');
              } else {
                chunks.before += '    ';
              }
            } else {
              chunks.selection = chunks.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t|```[a-z]*)/gm, '');
            }
          }

          function mergeSelection(all) {
            chunks.selection = all + chunks.selection;
            return '';
          }
        }
      }

      module.exports = codeblock;

    }, {
      "../strings": 173
    }],
    160: [function (require, module, exports) {
      'use strict';

      var many = require('../many');
      var strings = require('../strings');

      function heading(chunks) {
        var level = 0;

        chunks.selection = chunks.selection
          .replace(/\s+/g, ' ')
          .replace(/(^\s+|\s+$)/g, '');

        if (!chunks.selection) {
          chunks.startTag = '# ';
          chunks.selection = strings.placeholders.heading;
          chunks.endTag = '';
          chunks.skip({
            before: 1,
            after: 1
          });
          return;
        }

        chunks.findTags(/#+[ ]*/, /[ ]*#+/);

        if (/#+/.test(chunks.startTag)) {
          level = RegExp.lastMatch.length;
        }

        chunks.startTag = chunks.endTag = '';
        chunks.findTags(null, /\s?(-+|=+)/);

        if (/=+/.test(chunks.endTag)) {
          level = 1;
        }

        if (/-+/.test(chunks.endTag)) {
          level = 2;
        }

        chunks.startTag = chunks.endTag = '';
        chunks.skip({
          before: 1,
          after: 1
        });

        var levelToCreate = level < 2 ? 4 : level - 1;
        if (levelToCreate > 0) {
          chunks.startTag = many('#', levelToCreate) + ' ';
        }
      }

      module.exports = heading;

    }, {
      "../many": 155,
      "../strings": 173
    }],
    161: [function (require, module, exports) {
      'use strict';

      function hr(chunks) {
        chunks.startTag = '----------\n';
        chunks.selection = '';
        chunks.skip({
          left: 2,
          right: 1,
          any: true
        });
      }

      module.exports = hr;

    }, {}],
    162: [function (require, module, exports) {
      'use strict';

      var once = require('../once');
      var strings = require('../strings');
      var parseLinkInput = require('../chunks/parseLinkInput');
      var rdefinitions = /^[ ]{0,3}\[((?:attachment-)?\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm;
      var rattachment = /^attachment-(\d+)$/i;

      function extractDefinitions(text, definitions) {
        rdefinitions.lastIndex = 0;
        return text.replace(rdefinitions, replacer);

        function replacer(all, id, link, newlines, title) {
          definitions[id] = all.replace(/\s*$/, '');
          if (newlines) {
            definitions[id] = all.replace(/["(](.+?)[")]$/, '');
            return newlines + title;
          }
          return '';
        }
      }

      function pushDefinition(options) {
        var chunks = options.chunks;
        var definition = options.definition;
        var attachment = options.attachment;
        var regex = /(\[)((?:\[[^\]]*\]|[^\[\]])*)(\][ ]?(?:\n[ ]*)?\[)((?:attachment-)?\d+)(\])/g;
        var anchor = 0;
        var definitions = {};
        var footnotes = [];

        chunks.before = extractDefinitions(chunks.before, definitions);
        chunks.selection = extractDefinitions(chunks.selection, definitions);
        chunks.after = extractDefinitions(chunks.after, definitions);
        chunks.before = chunks.before.replace(regex, getLink);

        if (definition) {
          if (!attachment) {
            pushAnchor(definition);
          }
        } else {
          chunks.selection = chunks.selection.replace(regex, getLink);
        }

        var result = anchor;

        chunks.after = chunks.after.replace(regex, getLink);

        if (chunks.after) {
          chunks.after = chunks.after.replace(/\n*$/, '');
        }
        if (!chunks.after) {
          chunks.selection = chunks.selection.replace(/\n*$/, '');
        }

        anchor = 0;
        Object.keys(definitions).forEach(pushAttachments);

        if (attachment) {
          pushAnchor(definition);
        }
        chunks.after += '\n\n' + footnotes.join('\n');

        return result;

        function pushAttachments(definition) {
          if (rattachment.test(definition)) {
            pushAnchor(definitions[definition]);
          }
        }

        function pushAnchor(definition) {
          anchor++;
          definition = definition.replace(/^[ ]{0,3}\[(attachment-)?(\d+)\]:/, '  [$1' + anchor + ']:');
          footnotes.push(definition);
        }

        function getLink(all, before, inner, afterInner, definition, end) {
          inner = inner.replace(regex, getLink);
          if (definitions[definition]) {
            pushAnchor(definitions[definition]);
            return before + inner + afterInner + anchor + end;
          }
          return all;
        }
      }

      function linkOrImageOrAttachment(chunks, options) {
        var type = options.type;
        var image = type === 'image';
        var resume;

        chunks.trim();
        chunks.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\[.*?\])?/);

        if (chunks.endTag.length > 1 && chunks.startTag.length > 0) {
          chunks.startTag = chunks.startTag.replace(/!?\[/, '');
          chunks.endTag = '';
          pushDefinition({
            chunks: chunks
          });
          return;
        }

        chunks.selection = chunks.startTag + chunks.selection + chunks.endTag;
        chunks.startTag = chunks.endTag = '';

        if (/\n\n/.test(chunks.selection)) {
          pushDefinition({
            chunks: chunks
          });
          return;
        }
        resume = this.async();

        options.prompts.close();
        (options.prompts[type] || options.prompts.link)(options, once(resolved));

        function resolved(result) {
          var links = result
            .definitions
            .map(parseLinkInput)
            .filter(long);

          links.forEach(renderLink);
          resume();

          function renderLink(link, i) {
            chunks.selection = (' ' + chunks.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, '$1\\').substr(1);

            var key = result.attachment ? '  [attachment-9999]: ' : ' [9999]: ';
            var definition = key + link.href + (link.title ? ' "' + link.title + '"' : '');
            var anchor = pushDefinition({
              chunks: chunks,
              definition: definition,
              attachment: result.attachment
            });

            if (!result.attachment) {
              add();
            }

            function add() {
              chunks.startTag = image ? '![' : '[';
              chunks.endTag = '][' + anchor + ']';

              if (!chunks.selection) {
                chunks.selection = strings.placeholders[type];
              }

              if (i < links.length - 1) { // has multiple links, not the last one
                chunks.before += chunks.startTag + chunks.selection + chunks.endTag + '\n';
              }
            }
          }

          function long(link) {
            return link.href.length > 0;
          }
        }
      }

      module.exports = linkOrImageOrAttachment;

    }, {
      "../chunks/parseLinkInput": 137,
      "../once": 166,
      "../strings": 173
    }],
    163: [function (require, module, exports) {
      'use strict';

      var many = require('../many');
      var strings = require('../strings');
      var wrapping = require('./wrapping');
      var settings = require('./settings');
      var rprevious = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
      var rnext = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;
      var rbullettype = /^\s*([*+-])/;
      var rskipper = /[^\n]\n\n[^\n]/;

      function pad(text) {
        return ' ' + text + ' ';
      }

      function list(chunks, ordered) {
        var bullet = '-';
        var num = 1;
        var digital;
        var beforeSkip = 1;
        var afterSkip = 1;

        chunks.findTags(/(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/, null);

        if (chunks.before && !/\n$/.test(chunks.before) && !/^\n/.test(chunks.startTag)) {
          chunks.before += chunks.startTag;
          chunks.startTag = '';
        }

        if (chunks.startTag) {
          digital = /\d+[.]/.test(chunks.startTag);
          chunks.startTag = '';
          chunks.selection = chunks.selection.replace(/\n[ ]{4}/g, '\n');
          wrapping.unwrap(chunks);
          chunks.skip();

          if (digital) {
            chunks.after = chunks.after.replace(rnext, getPrefixedItem);
          }
          if (ordered === digital) {
            return;
          }
        }

        chunks.before = chunks.before.replace(rprevious, beforeReplacer);

        if (!chunks.selection) {
          chunks.selection = strings.placeholders.listitem;
        }

        var prefix = nextBullet();
        var spaces = many(' ', prefix.length);

        chunks.after = chunks.after.replace(rnext, afterReplacer);
        chunks.trim(true);
        chunks.skip({
          before: beforeSkip,
          after: afterSkip,
          any: true
        });
        chunks.startTag = prefix;
        wrapping.wrap(chunks, settings.lineLength - prefix.length);
        chunks.selection = chunks.selection.replace(/\n/g, '\n' + spaces);

        function beforeReplacer(text) {
          if (rbullettype.test(text)) {
            bullet = RegExp.$1;
          }
          beforeSkip = rskipper.test(text) ? 1 : 0;
          return getPrefixedItem(text);
        }

        function afterReplacer(text) {
          afterSkip = rskipper.test(text) ? 1 : 0;
          return getPrefixedItem(text);
        }

        function nextBullet() {
          if (ordered) {
            return pad((num++) + '.');
          }
          return pad(bullet);
        }

        function getPrefixedItem(text) {
          var rmarkers = /^[ ]{0,3}([*+-]|\d+[.])\s/gm;
          return text.replace(rmarkers, nextBullet);
        }
      }

      module.exports = list;

    }, {
      "../many": 155,
      "../strings": 173,
      "./settings": 164,
      "./wrapping": 165
    }],
    164: [function (require, module, exports) {
      'use strict';

      module.exports = {
        lineLength: 72
      };

    }, {}],
    165: [function (require, module, exports) {
      'use strict';

      var prefixes = '(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)';
      var rleadingprefixes = new RegExp('^' + prefixes, '');
      var rtext = new RegExp('([^\\n])\\n(?!(\\n|' + prefixes + '))', 'g');
      var rtrailingspaces = /\s+$/;

      function wrap(chunks, len) {
        var regex = new RegExp('(.{1,' + len + '})( +|$\\n?)', 'gm');

        unwrap(chunks);
        chunks.selection = chunks.selection
          .replace(regex, replacer)
          .replace(rtrailingspaces, '');

        function replacer(line, marked) {
          return rleadingprefixes.test(line) ? line : marked + '\n';
        }
      }

      function unwrap(chunks) {
        rtext.lastIndex = 0;
        chunks.selection = chunks.selection.replace(rtext, '$1 $2');
      }

      module.exports = {
        wrap: wrap,
        unwrap: unwrap
      };

    }, {}],
    166: [function (require, module, exports) {
      'use strict';

      function once(fn) {
        var disposed;
        return function disposable() {
          if (disposed) {
            return;
          }
          disposed = true;
          return fn.apply(this, arguments);
        };
      }

      module.exports = once;

    }, {}],
    167: [function (require, module, exports) {
      'use strict';

      var doc = document;

      function homebrewQSA(className) {
        var results = [];
        var all = doc.getElementsByTagName('*');
        var i;
        for (i in all) {
          if (wrap(all[i].className).indexOf(wrap(className)) !== -1) {
            results.push(all[i]);
          }
        }
        return results;
      }

      function wrap(text) {
        return ' ' + text + ' ';
      }

      function closePrompts() {
        if (doc.body.querySelectorAll) {
          remove(doc.body.querySelectorAll('.wk-prompt'));
        } else {
          remove(homebrewQSA('wk-prompt'));
        }
      }

      function remove(prompts) {
        var len = prompts.length;
        var i;
        for (i = 0; i < len; i++) {
          prompts[i].parentElement.removeChild(prompts[i]);
        }
      }

      module.exports = closePrompts;

    }, {}],
    168: [function (require, module, exports) {
      'use strict';

      var crossvent = require('crossvent');
      var bureaucracy = require('bureaucracy');
      var render = require('./render');
      var classes = require('../classes');
      var strings = require('../strings');
      var uploads = require('../uploads');
      var ENTER_KEY = 13;
      var ESCAPE_KEY = 27;
      var dragClass = 'wk-dragging';
      var dragClassSpecific = 'wk-prompt-upload-dragging';
      var root = document.documentElement;

      function classify(group, classes) {
        Object.keys(group).forEach(customize);

        function customize(key) {
          if (classes[key]) {
            group[key].className += ' ' + classes[key];
          }
        }
      }

      function prompt(options, done) {
        var text = strings.prompts[options.type];
        var dom = render({
          id: 'wk-prompt-' + options.type,
          title: text.title,
          description: text.description,
          placeholder: text.placeholder
        });
        var domup;

        crossvent.add(dom.cancel, 'click', remove);
        crossvent.add(dom.close, 'click', remove);
        crossvent.add(dom.ok, 'click', ok);
        crossvent.add(dom.input, 'keypress', enter);
        crossvent.add(dom.dialog, 'keydown', esc);
        classify(dom, options.classes.prompts);

        var upload = options.upload;
        if (typeof upload === 'string') {
          upload = {
            url: upload
          };
        }

        var bureaucrat = null;
        if (upload) {
          bureaucrat = arrangeUploads();
          if (options.autoUpload) {
            bureaucrat.submit(options.autoUpload);
          }
        }

        setTimeout(focusDialog, 0);

        function focusDialog() {
          dom.input.focus();
        }

        function enter(e) {
          var key = e.which || e.keyCode;
          if (key === ENTER_KEY) {
            ok();
            e.preventDefault();
          }
        }

        function esc(e) {
          var key = e.which || e.keyCode;
          if (key === ESCAPE_KEY) {
            remove();
            e.preventDefault();
          }
        }

        function ok() {
          remove();
          done({
            definitions: [dom.input.value]
          });
        }

        function remove() {
          if (upload) {
            bindUploadEvents(true);
          }
          if (dom.dialog.parentElement) {
            dom.dialog.parentElement.removeChild(dom.dialog);
          }
          options.surface.focus(options.mode);
        }

        function bindUploadEvents(remove) {
          var op = remove ? 'remove' : 'add';
          crossvent[op](root, 'dragenter', dragging);
          crossvent[op](root, 'dragend', dragstop);
          crossvent[op](root, 'mouseout', dragstop);
        }

        function dragging() {
          classes.add(domup.area, dragClass);
          classes.add(domup.area, dragClassSpecific);
        }

        function dragstop() {
          classes.rm(domup.area, dragClass);
          classes.rm(domup.area, dragClassSpecific);
          uploads.stop(options.surface.droparea);
        }

        function arrangeUploads() {
          domup = render.uploads(dom, strings.prompts.types + (upload.restriction || options.type + 's'));
          bindUploadEvents();
          crossvent.add(domup.area, 'dragover', handleDragOver, false);
          crossvent.add(domup.area, 'drop', handleFileSelect, false);
          classify(domup, options.classes.prompts);

          var bureaucrat = bureaucracy.setup(domup.fileinput, {
            method: upload.method,
            formData: upload.formData,
            fieldKey: upload.fieldKey,
            xhrOptions: upload.xhrOptions,
            endpoint: upload.url,
            validate: upload.validate || 'image'
          });

          bureaucrat.on('started', function () {
            classes.rm(domup.failed, 'wk-prompt-error-show');
            classes.rm(domup.warning, 'wk-prompt-error-show');
          });
          bureaucrat.on('valid', function () {
            classes.add(domup.area, 'wk-prompt-uploading');
          });
          bureaucrat.on('invalid', function () {
            classes.add(domup.warning, 'wk-prompt-error-show');
          });
          bureaucrat.on('error', function () {
            classes.add(domup.failed, 'wk-prompt-error-show');
          });
          bureaucrat.on('success', receivedImages);
          bureaucrat.on('ended', function () {
            classes.rm(domup.area, 'wk-prompt-uploading');
          });

          return bureaucrat;

          function receivedImages(results) {
            var body = results[0];
            dom.input.value = body.href + ' "' + body.title + '"';
            remove();
            done({
              definitions: results.map(toDefinition),
              attachment: options.type === 'attachment'
            });

            function toDefinition(result) {
              return result.href + ' "' + result.title + '"';
            }
          }
        }

        function handleDragOver(e) {
          stop(e);
          e.dataTransfer.dropEffect = 'copy';
        }

        function handleFileSelect(e) {
          dragstop();
          stop(e);
          bureaucrat.submit(e.dataTransfer.files);
        }

        function stop(e) {
          e.stopPropagation();
          e.preventDefault();
        }
      }

      module.exports = prompt;

    }, {
      "../classes": 139,
      "../strings": 173,
      "../uploads": 174,
      "./render": 169,
      "bureaucracy": 7,
      "crossvent": 12
    }],
    169: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var crossvent = require('crossvent');
        var getText = require('../getText');
        var setText = require('../setText');
        var classes = require('../classes');
        var strings = require('../strings');
        var ac = 'appendChild';
        var doc = global.document;

        function e(type, cls, text) {
          var el = doc.createElement(type);
          el.className = cls;
          if (text) {
            setText(el, text);
          }
          return el;
        }

        function render(options) {
          var dom = {
            dialog: e('article', 'wk-prompt ' + options.id),
            close: e('a', 'wk-prompt-close'),
            header: e('header', 'wk-prompt-header'),
            h1: e('h1', 'wk-prompt-title', options.title),
            section: e('section', 'wk-prompt-body'),
            desc: e('p', 'wk-prompt-description', options.description),
            inputContainer: e('div', 'wk-prompt-input-container'),
            input: e('input', 'wk-prompt-input'),
            cancel: e('button', 'wk-prompt-cancel', 'Cancel'),
            ok: e('button', 'wk-prompt-ok', 'Ok'),
            footer: e('footer', 'wk-prompt-buttons')
          };
          dom.ok.type = 'button';
          dom.header[ac](dom.h1);
          dom.section[ac](dom.desc);
          dom.section[ac](dom.inputContainer);
          dom.inputContainer[ac](dom.input);
          dom.input.placeholder = options.placeholder;
          dom.cancel.type = 'button';
          dom.footer[ac](dom.cancel);
          dom.footer[ac](dom.ok);
          dom.dialog[ac](dom.close);
          dom.dialog[ac](dom.header);
          dom.dialog[ac](dom.section);
          dom.dialog[ac](dom.footer);
          doc.body[ac](dom.dialog);
          return dom;
        }

        function uploads(dom, warning) {
          var fup = 'wk-prompt-fileupload';
          var domup = {
            area: e('section', 'wk-prompt-upload-area'),
            warning: e('p', 'wk-prompt-error wk-warning', warning),
            failed: e('p', 'wk-prompt-error wk-failed', strings.prompts.uploadfailed),
            upload: e('label', 'wk-prompt-upload'),
            uploading: e('span', 'wk-prompt-progress', strings.prompts.uploading),
            drop: e('span', 'wk-prompt-drop', strings.prompts.drop),
            dropicon: e('p', 'wk-drop-icon wk-prompt-drop-icon'),
            browse: e('span', 'wk-prompt-browse', strings.prompts.browse),
            dragdrop: e('p', 'wk-prompt-dragdrop', strings.prompts.drophint),
            fileinput: e('input', fup)
          };
          domup.area[ac](domup.drop);
          domup.area[ac](domup.uploading);
          domup.area[ac](domup.dropicon);
          domup.upload[ac](domup.browse);
          domup.upload[ac](domup.fileinput);
          domup.fileinput.id = fup;
          domup.fileinput.type = 'file';
          domup.fileinput.multiple = 'multiple';
          dom.dialog.className += ' wk-prompt-uploads';
          dom.inputContainer.className += ' wk-prompt-input-container-uploads';
          dom.input.className += ' wk-prompt-input-uploads';
          dom.section.insertBefore(domup.warning, dom.inputContainer);
          dom.section.insertBefore(domup.failed, dom.inputContainer);
          dom.section[ac](domup.upload);
          dom.section[ac](domup.dragdrop);
          dom.section[ac](domup.area);
          setText(dom.desc, getText(dom.desc) + strings.prompts.upload);
          crossvent.add(domup.fileinput, 'focus', focusedFileInput);
          crossvent.add(domup.fileinput, 'blur', blurredFileInput);

          function focusedFileInput() {
            classes.add(domup.upload, 'wk-focused');
          }

          function blurredFileInput() {
            classes.rm(domup.upload, 'wk-focused');
          }
          return domup;
        }

        render.uploads = uploads;
        module.exports = render;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9wcm9tcHRzL3JlbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBjcm9zc3ZlbnQgPSByZXF1aXJlKCdjcm9zc3ZlbnQnKTtcbnZhciBnZXRUZXh0ID0gcmVxdWlyZSgnLi4vZ2V0VGV4dCcpO1xudmFyIHNldFRleHQgPSByZXF1aXJlKCcuLi9zZXRUZXh0Jyk7XG52YXIgY2xhc3NlcyA9IHJlcXVpcmUoJy4uL2NsYXNzZXMnKTtcbnZhciBzdHJpbmdzID0gcmVxdWlyZSgnLi4vc3RyaW5ncycpO1xudmFyIGFjID0gJ2FwcGVuZENoaWxkJztcbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIGUgKHR5cGUsIGNscywgdGV4dCkge1xuICB2YXIgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCh0eXBlKTtcbiAgZWwuY2xhc3NOYW1lID0gY2xzO1xuICBpZiAodGV4dCkge1xuICAgIHNldFRleHQoZWwsIHRleHQpO1xuICB9XG4gIHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gcmVuZGVyIChvcHRpb25zKSB7XG4gIHZhciBkb20gPSB7XG4gICAgZGlhbG9nOiBlKCdhcnRpY2xlJywgJ3drLXByb21wdCAnICsgb3B0aW9ucy5pZCksXG4gICAgY2xvc2U6IGUoJ2EnLCAnd2stcHJvbXB0LWNsb3NlJyksXG4gICAgaGVhZGVyOiBlKCdoZWFkZXInLCAnd2stcHJvbXB0LWhlYWRlcicpLFxuICAgIGgxOiBlKCdoMScsICd3ay1wcm9tcHQtdGl0bGUnLCBvcHRpb25zLnRpdGxlKSxcbiAgICBzZWN0aW9uOiBlKCdzZWN0aW9uJywgJ3drLXByb21wdC1ib2R5JyksXG4gICAgZGVzYzogZSgncCcsICd3ay1wcm9tcHQtZGVzY3JpcHRpb24nLCBvcHRpb25zLmRlc2NyaXB0aW9uKSxcbiAgICBpbnB1dENvbnRhaW5lcjogZSgnZGl2JywgJ3drLXByb21wdC1pbnB1dC1jb250YWluZXInKSxcbiAgICBpbnB1dDogZSgnaW5wdXQnLCAnd2stcHJvbXB0LWlucHV0JyksXG4gICAgY2FuY2VsOiBlKCdidXR0b24nLCAnd2stcHJvbXB0LWNhbmNlbCcsICdDYW5jZWwnKSxcbiAgICBvazogZSgnYnV0dG9uJywgJ3drLXByb21wdC1vaycsICdPaycpLFxuICAgIGZvb3RlcjogZSgnZm9vdGVyJywgJ3drLXByb21wdC1idXR0b25zJylcbiAgfTtcbiAgZG9tLm9rLnR5cGUgPSAnYnV0dG9uJztcbiAgZG9tLmhlYWRlclthY10oZG9tLmgxKTtcbiAgZG9tLnNlY3Rpb25bYWNdKGRvbS5kZXNjKTtcbiAgZG9tLnNlY3Rpb25bYWNdKGRvbS5pbnB1dENvbnRhaW5lcik7XG4gIGRvbS5pbnB1dENvbnRhaW5lclthY10oZG9tLmlucHV0KTtcbiAgZG9tLmlucHV0LnBsYWNlaG9sZGVyID0gb3B0aW9ucy5wbGFjZWhvbGRlcjtcbiAgZG9tLmNhbmNlbC50eXBlID0gJ2J1dHRvbic7XG4gIGRvbS5mb290ZXJbYWNdKGRvbS5jYW5jZWwpO1xuICBkb20uZm9vdGVyW2FjXShkb20ub2spO1xuICBkb20uZGlhbG9nW2FjXShkb20uY2xvc2UpO1xuICBkb20uZGlhbG9nW2FjXShkb20uaGVhZGVyKTtcbiAgZG9tLmRpYWxvZ1thY10oZG9tLnNlY3Rpb24pO1xuICBkb20uZGlhbG9nW2FjXShkb20uZm9vdGVyKTtcbiAgZG9jLmJvZHlbYWNdKGRvbS5kaWFsb2cpO1xuICByZXR1cm4gZG9tO1xufVxuXG5mdW5jdGlvbiB1cGxvYWRzIChkb20sIHdhcm5pbmcpIHtcbiAgdmFyIGZ1cCA9ICd3ay1wcm9tcHQtZmlsZXVwbG9hZCc7XG4gIHZhciBkb211cCA9IHtcbiAgICBhcmVhOiBlKCdzZWN0aW9uJywgJ3drLXByb21wdC11cGxvYWQtYXJlYScpLFxuICAgIHdhcm5pbmc6IGUoJ3AnLCAnd2stcHJvbXB0LWVycm9yIHdrLXdhcm5pbmcnLCB3YXJuaW5nKSxcbiAgICBmYWlsZWQ6IGUoJ3AnLCAnd2stcHJvbXB0LWVycm9yIHdrLWZhaWxlZCcsIHN0cmluZ3MucHJvbXB0cy51cGxvYWRmYWlsZWQpLFxuICAgIHVwbG9hZDogZSgnbGFiZWwnLCAnd2stcHJvbXB0LXVwbG9hZCcpLFxuICAgIHVwbG9hZGluZzogZSgnc3BhbicsICd3ay1wcm9tcHQtcHJvZ3Jlc3MnLCBzdHJpbmdzLnByb21wdHMudXBsb2FkaW5nKSxcbiAgICBkcm9wOiBlKCdzcGFuJywgJ3drLXByb21wdC1kcm9wJywgc3RyaW5ncy5wcm9tcHRzLmRyb3ApLFxuICAgIGRyb3BpY29uOiBlKCdwJywgJ3drLWRyb3AtaWNvbiB3ay1wcm9tcHQtZHJvcC1pY29uJyksXG4gICAgYnJvd3NlOiBlKCdzcGFuJywgJ3drLXByb21wdC1icm93c2UnLCBzdHJpbmdzLnByb21wdHMuYnJvd3NlKSxcbiAgICBkcmFnZHJvcDogZSgncCcsICd3ay1wcm9tcHQtZHJhZ2Ryb3AnLCBzdHJpbmdzLnByb21wdHMuZHJvcGhpbnQpLFxuICAgIGZpbGVpbnB1dDogZSgnaW5wdXQnLCBmdXApXG4gIH07XG4gIGRvbXVwLmFyZWFbYWNdKGRvbXVwLmRyb3ApO1xuICBkb211cC5hcmVhW2FjXShkb211cC51cGxvYWRpbmcpO1xuICBkb211cC5hcmVhW2FjXShkb211cC5kcm9waWNvbik7XG4gIGRvbXVwLnVwbG9hZFthY10oZG9tdXAuYnJvd3NlKTtcbiAgZG9tdXAudXBsb2FkW2FjXShkb211cC5maWxlaW5wdXQpO1xuICBkb211cC5maWxlaW5wdXQuaWQgPSBmdXA7XG4gIGRvbXVwLmZpbGVpbnB1dC50eXBlID0gJ2ZpbGUnO1xuICBkb211cC5maWxlaW5wdXQubXVsdGlwbGUgPSAnbXVsdGlwbGUnO1xuICBkb20uZGlhbG9nLmNsYXNzTmFtZSArPSAnIHdrLXByb21wdC11cGxvYWRzJztcbiAgZG9tLmlucHV0Q29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHdrLXByb21wdC1pbnB1dC1jb250YWluZXItdXBsb2Fkcyc7XG4gIGRvbS5pbnB1dC5jbGFzc05hbWUgKz0gJyB3ay1wcm9tcHQtaW5wdXQtdXBsb2Fkcyc7XG4gIGRvbS5zZWN0aW9uLmluc2VydEJlZm9yZShkb211cC53YXJuaW5nLCBkb20uaW5wdXRDb250YWluZXIpO1xuICBkb20uc2VjdGlvbi5pbnNlcnRCZWZvcmUoZG9tdXAuZmFpbGVkLCBkb20uaW5wdXRDb250YWluZXIpO1xuICBkb20uc2VjdGlvblthY10oZG9tdXAudXBsb2FkKTtcbiAgZG9tLnNlY3Rpb25bYWNdKGRvbXVwLmRyYWdkcm9wKTtcbiAgZG9tLnNlY3Rpb25bYWNdKGRvbXVwLmFyZWEpO1xuICBzZXRUZXh0KGRvbS5kZXNjLCBnZXRUZXh0KGRvbS5kZXNjKSArIHN0cmluZ3MucHJvbXB0cy51cGxvYWQpO1xuICBjcm9zc3ZlbnQuYWRkKGRvbXVwLmZpbGVpbnB1dCwgJ2ZvY3VzJywgZm9jdXNlZEZpbGVJbnB1dCk7XG4gIGNyb3NzdmVudC5hZGQoZG9tdXAuZmlsZWlucHV0LCAnYmx1cicsIGJsdXJyZWRGaWxlSW5wdXQpO1xuXG4gIGZ1bmN0aW9uIGZvY3VzZWRGaWxlSW5wdXQgKCkge1xuICAgIGNsYXNzZXMuYWRkKGRvbXVwLnVwbG9hZCwgJ3drLWZvY3VzZWQnKTtcbiAgfVxuICBmdW5jdGlvbiBibHVycmVkRmlsZUlucHV0ICgpIHtcbiAgICBjbGFzc2VzLnJtKGRvbXVwLnVwbG9hZCwgJ3drLWZvY3VzZWQnKTtcbiAgfVxuICByZXR1cm4gZG9tdXA7XG59XG5cbnJlbmRlci51cGxvYWRzID0gdXBsb2Fkcztcbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyO1xuIl19
    }, {
      "../classes": 139,
      "../getText": 144,
      "../setText": 172,
      "../strings": 173,
      "crossvent": 12
    }],
    170: [function (require, module, exports) {
      'use strict';

      var bullseye = require('bullseye');

      function rememberSelection(history) {
        var code = Math.random().toString(18).substr(2).replace(/\d+/g, '');
        var open = 'WoofmarkSelectionOpenMarker' + code;
        var close = 'WoofmarkSelectionCloseMarker' + code;
        var rmarkers = new RegExp(open + '|' + close, 'g');
        return {
          markers: markers(),
          unmark: unmark
        };

        function markers() {
          var state = history.reset().inputState;
          var chunks = state.getChunks();
          var selectionStart = chunks.before.length;
          var selectionEnd = selectionStart + chunks.selection.length;
          return [
            [selectionStart, open],
            [selectionEnd, close]
          ];
        }

        function unmark() {
          var state = history.inputState;
          var chunks = state.getChunks();
          var all = chunks.before + chunks.selection + chunks.after;
          var start = all.lastIndexOf(open);
          var end = all.lastIndexOf(close) + close.length;
          var selectionStart = start === -1 ? 0 : start;
          var selectionEnd = end === -1 ? 0 : end;
          chunks.before = all.substr(0, selectionStart).replace(rmarkers, '');
          chunks.selection = all.substr(selectionStart, selectionEnd - selectionStart).replace(rmarkers, '');
          chunks.after = all.substr(end).replace(rmarkers, '');
          var el = history.surface.current(history.inputMode);
          var eye = bullseye(el, {
            caret: true,
            autoupdateToCaret: false,
            tracking: false
          });
          state.setChunks(chunks);
          state.restore(false);
          state.scrollTop = el.scrollTop = eye.read().y - el.getBoundingClientRect().top - 50;
          eye.destroy();
        }
      }

      module.exports = rememberSelection;

    }, {
      "bullseye": 4
    }],
    171: [function (require, module, exports) {
      'use strict';

      var setText = require('./setText');
      var strings = require('./strings');

      function commands(el, id) {
        setText(el, strings.buttons[id] || id);
      }

      function modes(el, id) {
        setText(el, strings.modes[id] || id);
      }

      module.exports = {
        modes: modes,
        commands: commands
      };

    }, {
      "./setText": 172,
      "./strings": 173
    }],
    172: [function (require, module, exports) {
      'use strict';

      function setText(el, value) {
        el.innerText = el.textContent = value;
      }

      module.exports = setText;

    }, {}],
    173: [function (require, module, exports) {
      'use strict';

      module.exports = {
        placeholders: {
          bold: 'strong text',
          italic: 'emphasized text',
          quote: 'quoted text',
          code: 'code goes here',
          listitem: 'list item',
          heading: 'Heading Text',
          link: 'link text',
          image: 'image description',
          attachment: 'attachment description'
        },
        titles: {
          bold: 'Strong <strong> Ctrl+B',
          italic: 'Emphasis <em> Ctrl+I',
          quote: 'Blockquote <blockquote> Ctrl+J',
          code: 'Code Sample <pre><code> Ctrl+E',
          ol: 'Numbered List <ol> Ctrl+O',
          ul: 'Bulleted List <ul> Ctrl+U',
          heading: 'Heading <h1>, <h2>, ... Ctrl+D',
          link: 'Hyperlink <a> Ctrl+K',
          image: 'Image <img> Ctrl+G',
          attachment: 'Attachment Ctrl+Shift+K',
          markdown: 'Markdown Mode Ctrl+M',
          html: 'HTML Mode Ctrl+H',
          wysiwyg: 'Preview Mode Ctrl+P'
        },
        buttons: {
          bold: 'B',
          italic: 'I',
          quote: '\u201c',
          code: '</>',
          ol: '1.',
          ul: '\u29BF',
          heading: 'Tt',
          link: 'Link',
          image: 'Image',
          attachment: 'Attachment',
          hr: '\u21b5'
        },
        prompts: {
          link: {
            title: 'Insert Link',
            description: 'Type or paste the url to your link',
            placeholder: 'http://example.com/ "title"'
          },
          image: {
            title: 'Insert Image',
            description: 'Enter the url to your image',
            placeholder: 'http://example.com/public/image.png "title"'
          },
          attachment: {
            title: 'Attach File',
            description: 'Enter the url to your attachment',
            placeholder: 'http://example.com/public/report.pdf "title"'
          },
          types: 'You can only upload ',
          browse: 'Browse...',
          drophint: 'You can also drag files from your computer and drop them here!',
          drop: 'Drop your file here to begin upload...',
          upload: ', or upload a file',
          uploading: 'Uploading your file...',
          uploadfailed: 'The upload failed! That\'s all we know.'
        },
        modes: {
          wysiwyg: 'wysiwyg',
          markdown: 'm\u2193',
        },
      };

    }, {}],
    174: [function (require, module, exports) {
      'use strict';

      var crossvent = require('crossvent');
      var classes = require('./classes');
      var dragClass = 'wk-dragging';
      var dragClassSpecific = 'wk-container-dragging';
      var root = document.documentElement;

      function uploads(container, droparea, editor, options, remove) {
        var op = remove ? 'remove' : 'add';
        crossvent[op](root, 'dragenter', dragging);
        crossvent[op](root, 'dragend', dragstop);
        crossvent[op](root, 'mouseout', dragstop);
        crossvent[op](container, 'dragover', handleDragOver, false);
        crossvent[op](droparea, 'drop', handleFileSelect, false);

        function dragging() {
          classes.add(droparea, dragClass);
          classes.add(droparea, dragClassSpecific);
        }

        function dragstop() {
          dragstopper(droparea);
        }

        function handleDragOver(e) {
          stop(e);
          dragging();
          e.dataTransfer.dropEffect = 'copy';
        }

        function handleFileSelect(e) {
          dragstop();
          stop(e);
          editor.runCommand(function runner(chunks, mode) {
            var files = Array.prototype.slice.call(e.dataTransfer.files);
            var type = inferType(files);
            editor.linkOrImageOrAttachment(type, files).call(this, mode, chunks);
          });
        }

        function inferType(files) {
          if (options.images && !options.attachments) {
            return 'image';
          }
          if (!options.images && options.attachments) {
            return 'attachment';
          }
          if (files.every(matches(options.images.validate || never))) {
            return 'image';
          }
          return 'attachment';
        }
      }

      function matches(fn) {
        return function matcher(file) {
          return fn(file);
        };
      }

      function never() {
        return false;
      }

      function stop(e) {
        e.stopPropagation();
        e.preventDefault();
      }

      function dragstopper(droparea) {
        classes.rm(droparea, dragClass);
        classes.rm(droparea, dragClassSpecific);
      }

      uploads.stop = dragstopper;
      module.exports = uploads;

    }, {
      "./classes": 139,
      "crossvent": 12
    }],
    175: [function (require, module, exports) {
      (function (global) {
        'use strict';

        var ls = require('local-storage');
        var crossvent = require('crossvent');
        var kanye = require('kanye');
        var uploads = require('./uploads');
        var strings = require('./strings');
        var setText = require('./setText');
        var rememberSelection = require('./rememberSelection');
        var bindCommands = require('./bindCommands');
        var InputHistory = require('./InputHistory');
        var getCommandHandler = require('./getCommandHandler');
        var getSurface = require('./getSurface');
        var classes = require('./classes');
        var renderers = require('./renderers');
        var prompt = require('./prompts/prompt');
        var closePrompts = require('./prompts/close');
        var modeNames = ['markdown', 'html', 'wysiwyg'];
        var cache = [];
        var mac = /\bMac OS\b/.test(global.navigator.userAgent);
        var doc = document;
        var rparagraph = /^<p><\/p>\n?$/i;

        function find(textarea) {
          for (var i = 0; i < cache.length; i++) {
            if (cache[i] && cache[i].ta === textarea) {
              return cache[i].editor;
            }
          }
          return null;
        }

        function woofmark(textarea, options) {
          var cached = find(textarea);
          if (cached) {
            return cached;
          }

          var parent = textarea.parentElement;
          if (parent.children.length > 1) {
            throw new Error('woofmark demands <textarea> elements to have no siblings');
          }

          var o = options || {};
          if (o.markdown === void 0) {
            o.markdown = true;
          }
          if (o.html === void 0) {
            o.html = true;
          }
          if (o.wysiwyg === void 0) {
            o.wysiwyg = true;
          }

          if (!o.markdown && !o.html && !o.wysiwyg) {
            throw new Error('woofmark expects at least one input mode to be available');
          }

          if (o.hr === void 0) {
            o.hr = false;
          }
          if (o.storage === void 0) {
            o.storage = true;
          }
          if (o.storage === true) {
            o.storage = 'woofmark_input_mode';
          }
          if (o.fencing === void 0) {
            o.fencing = true;
          }
          if (o.render === void 0) {
            o.render = {};
          }
          if (o.render.modes === void 0) {
            o.render.modes = {};
          }
          if (o.render.commands === void 0) {
            o.render.commands = {};
          }
          if (o.prompts === void 0) {
            o.prompts = {};
          }
          if (o.prompts.link === void 0) {
            o.prompts.link = prompt;
          }
          if (o.prompts.image === void 0) {
            o.prompts.image = prompt;
          }
          if (o.prompts.attachment === void 0) {
            o.prompts.attachment = prompt;
          }
          if (o.prompts.close === void 0) {
            o.prompts.close = closePrompts;
          }
          if (o.classes === void 0) {
            o.classes = {};
          }
          if (o.classes.wysiwyg === void 0) {
            o.classes.wysiwyg = [];
          }
          if (o.classes.prompts === void 0) {
            o.classes.prompts = {};
          }
          if (o.classes.input === void 0) {
            o.classes.input = {};
          }

          var preference = o.storage && ls.get(o.storage);
          if (preference) {
            o.defaultMode = preference;
          }

          var droparea = tag({
            c: 'wk-container-drop'
          });
          var switchboard = tag({
            c: 'wk-switchboard'
          });
          var commands = tag({
            c: 'wk-commands'
          });
          var editable = tag({
            c: ['wk-wysiwyg', 'wk-hide'].concat(o.classes.wysiwyg).join(' ')
          });
          var surface = getSurface(textarea, editable, droparea);
          var history = new InputHistory(surface, 'markdown');
          var editor = {
            addCommand: addCommand,
            addCommandButton: addCommandButton,
            runCommand: runCommand,
            parseMarkdown: o.parseMarkdown,
            parseHTML: o.parseHTML,
            destroy: destroy,
            value: getOrSetValue,
            textarea: textarea,
            editable: o.wysiwyg ? editable : null,
            setMode: persistMode,
            history: {
              undo: history.undo,
              redo: history.redo,
              canUndo: history.canUndo,
              canRedo: history.canRedo
            },
            mode: 'markdown'
          };
          var entry = {
            ta: textarea,
            editor: editor
          };
          var i = cache.push(entry);
          var kanyeContext = 'woofmark_' + i;
          var kanyeOptions = {
            filter: parent,
            context: kanyeContext
          };
          var modes = {
            markdown: {
              button: tag({
                t: 'button',
                c: 'wk-mode wk-mode-active'
              }),
              set: markdownMode
            },
            html: {
              button: tag({
                t: 'button',
                c: 'wk-mode wk-mode-inactive'
              }),
              set: htmlMode
            },
            wysiwyg: {
              button: tag({
                t: 'button',
                c: 'wk-mode wk-mode-inactive'
              }),
              set: wysiwygMode
            }
          };
          var place;

          tag({
            t: 'span',
            c: 'wk-drop-text',
            x: strings.prompts.drop,
            p: droparea
          });
          tag({
            t: 'p',
            c: ['wk-drop-icon'].concat(o.classes.dropicon).join(' '),
            p: droparea
          });

          editable.contentEditable = true;
          modes.markdown.button.setAttribute('disabled', 'disabled');
          modeNames.forEach(addMode);

          if (o.wysiwyg) {
            place = tag({
              c: 'wk-wysiwyg-placeholder wk-hide',
              x: textarea.placeholder
            });
            crossvent.add(place, 'click', focusEditable);
          }

          if (o.defaultMode && o[o.defaultMode]) {
            modes[o.defaultMode].set();
          } else if (o.markdown) {
            modes.markdown.set();
          } else if (o.html) {
            modes.html.set();
          } else {
            modes.wysiwyg.set();
          }

          bindCommands(surface, o, editor);
          bindEvents();

          return editor;

          function addMode(id) {
            var button = modes[id].button;
            var custom = o.render.modes;
            if (o[id]) {
              switchboard.appendChild(button);
              (typeof custom === 'function' ? custom : renderers.modes)(button, id);
              crossvent.add(button, 'click', modes[id].set);
              button.type = 'button';
              button.tabIndex = -1;

              var title = strings.titles[id];
              if (title) {
                button.setAttribute('title', mac ? macify(title) : title);
              }
            }
          }

          function bindEvents(remove) {
            var ar = remove ? 'rm' : 'add';
            var mov = remove ? 'removeChild' : 'appendChild';
            if (remove) {
              kanye.clear(kanyeContext);
            } else {
              if (o.markdown) {
                kanye.on('cmd+m', kanyeOptions, markdownMode);
              }
              if (o.html) {
                kanye.on('cmd+h', kanyeOptions, htmlMode);
              }
              if (o.wysiwyg) {
                kanye.on('cmd+p', kanyeOptions, wysiwygMode);
              }
            }
            classes[ar](parent, 'wk-container');
            parent[mov](editable);
            if (place) {
              parent[mov](place);
            }
            parent[mov](commands);
            parent[mov](switchboard);
            if (o.images || o.attachments) {
              parent[mov](droparea);
              uploads(parent, droparea, editor, o, remove);
            }
          }

          function destroy() {
            if (editor.mode !== 'markdown') {
              textarea.value = getMarkdown();
            }
            classes.rm(textarea, 'wk-hide');
            bindEvents(true);
            delete cache[i - 1];
          }

          function markdownMode(e) {
            persistMode('markdown', e);
          }

          function htmlMode(e) {
            persistMode('html', e);
          }

          function wysiwygMode(e) {
            persistMode('wysiwyg', e);
          }

          function persistMode(nextMode, e) {
            var remembrance;
            var currentMode = editor.mode;
            var old = modes[currentMode].button;
            var button = modes[nextMode].button;
            var focusing = !!e || doc.activeElement === textarea || doc.activeElement === editable;

            stop(e);

            if (currentMode === nextMode) {
              return;
            }

            remembrance = focusing && rememberSelection(history, o);
            textarea.blur(); // avert chrome repaint bugs

            if (nextMode === 'markdown') {
              if (currentMode === 'html') {
                textarea.value = parse('parseHTML', textarea.value).trim();
              } else {
                textarea.value = parse('parseHTML', editable).trim();
              }
            } else if (nextMode === 'html') {
              if (currentMode === 'markdown') {
                textarea.value = parse('parseMarkdown', textarea.value).trim();
              } else {
                textarea.value = editable.innerHTML.trim();
              }
            } else if (nextMode === 'wysiwyg') {
              if (currentMode === 'markdown') {
                editable.innerHTML = parse('parseMarkdown', textarea.value).replace(rparagraph, '').trim();
              } else {
                editable.innerHTML = textarea.value.replace(rparagraph, '').trim();
              }
            }

            if (nextMode === 'wysiwyg') {
              classes.add(textarea, 'wk-hide');
              classes.rm(editable, 'wk-hide');
              if (place) {
                classes.rm(place, 'wk-hide');
              }
              if (focusing) {
                setTimeout(focusEditable, 0);
              }
            } else {
              classes.rm(textarea, 'wk-hide');
              classes.add(editable, 'wk-hide');
              if (place) {
                classes.add(place, 'wk-hide');
              }
              if (focusing) {
                textarea.focus();
              }
            }
            classes.add(button, 'wk-mode-active');
            classes.rm(old, 'wk-mode-active');
            classes.add(old, 'wk-mode-inactive');
            classes.rm(button, 'wk-mode-inactive');
            button.setAttribute('disabled', 'disabled');
            old.removeAttribute('disabled');
            editor.mode = nextMode;

            if (o.storage) {
              ls.set(o.storage, nextMode);
            }

            history.setInputMode(nextMode);
            if (remembrance) {
              remembrance.unmark();
            }
            fireLater('woofmark-mode-change');

            function parse(method, input) {
              return o[method](input, {
                markers: remembrance && remembrance.markers || []
              });
            }
          }

          function fireLater(type) {
            setTimeout(function fire() {
              crossvent.fabricate(textarea, type);
            }, 0);
          }

          function focusEditable() {
            editable.focus();
          }

          function getMarkdown() {
            if (editor.mode === 'wysiwyg') {
              return o.parseHTML(editable);
            }
            if (editor.mode === 'html') {
              return o.parseHTML(textarea.value);
            }
            return textarea.value;
          }

          function getOrSetValue(input) {
            var markdown = String(input);
            var sets = arguments.length === 1;
            if (sets) {
              if (editor.mode === 'wysiwyg') {
                editable.innerHTML = asHtml();
              } else {
                textarea.value = editor.mode === 'html' ? asHtml() : markdown;
              }
              history.reset();
            }
            return getMarkdown();

            function asHtml() {
              return o.parseMarkdown(markdown);
            }
          }

          function addCommandButton(id, combo, fn) {
            if (arguments.length === 2) {
              fn = combo;
              combo = null;
            }
            var button = tag({
              t: 'button',
              c: 'wk-command',
              p: commands
            });
            var custom = o.render.commands;
            var render = typeof custom === 'function' ? custom : renderers.commands;
            var title = strings.titles[id];
            if (title) {
              button.setAttribute('title', mac ? macify(title) : title);
            }
            button.type = 'button';
            button.tabIndex = -1;
            render(button, id);
            crossvent.add(button, 'click', getCommandHandler(surface, history, fn));
            if (combo) {
              addCommand(combo, fn);
            }
            return button;
          }

          function addCommand(combo, fn) {
            kanye.on(combo, kanyeOptions, getCommandHandler(surface, history, fn));
          }

          function runCommand(fn) {
            getCommandHandler(surface, history, rearrange)(null);

            function rearrange(e, mode, chunks) {
              return fn.call(this, chunks, mode);
            }
          }
        }

        function tag(options) {
          var o = options || {};
          var el = doc.createElement(o.t || 'div');
          el.className = o.c || '';
          setText(el, o.x || '');
          if (o.p) {
            o.p.appendChild(el);
          }
          return el;
        }

        function stop(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
        }

        function macify(text) {
          return text
            .replace(/\bctrl\b/i, '\u2318')
            .replace(/\balt\b/i, '\u2325')
            .replace(/\bshift\b/i, '\u21e7');
        }

        woofmark.find = find;
        woofmark.strings = strings;
        module.exports = woofmark;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
      //# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93b29mbWFyay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBscyA9IHJlcXVpcmUoJ2xvY2FsLXN0b3JhZ2UnKTtcbnZhciBjcm9zc3ZlbnQgPSByZXF1aXJlKCdjcm9zc3ZlbnQnKTtcbnZhciBrYW55ZSA9IHJlcXVpcmUoJ2thbnllJyk7XG52YXIgdXBsb2FkcyA9IHJlcXVpcmUoJy4vdXBsb2FkcycpO1xudmFyIHN0cmluZ3MgPSByZXF1aXJlKCcuL3N0cmluZ3MnKTtcbnZhciBzZXRUZXh0ID0gcmVxdWlyZSgnLi9zZXRUZXh0Jyk7XG52YXIgcmVtZW1iZXJTZWxlY3Rpb24gPSByZXF1aXJlKCcuL3JlbWVtYmVyU2VsZWN0aW9uJyk7XG52YXIgYmluZENvbW1hbmRzID0gcmVxdWlyZSgnLi9iaW5kQ29tbWFuZHMnKTtcbnZhciBJbnB1dEhpc3RvcnkgPSByZXF1aXJlKCcuL0lucHV0SGlzdG9yeScpO1xudmFyIGdldENvbW1hbmRIYW5kbGVyID0gcmVxdWlyZSgnLi9nZXRDb21tYW5kSGFuZGxlcicpO1xudmFyIGdldFN1cmZhY2UgPSByZXF1aXJlKCcuL2dldFN1cmZhY2UnKTtcbnZhciBjbGFzc2VzID0gcmVxdWlyZSgnLi9jbGFzc2VzJyk7XG52YXIgcmVuZGVyZXJzID0gcmVxdWlyZSgnLi9yZW5kZXJlcnMnKTtcbnZhciBwcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdHMvcHJvbXB0Jyk7XG52YXIgY2xvc2VQcm9tcHRzID0gcmVxdWlyZSgnLi9wcm9tcHRzL2Nsb3NlJyk7XG52YXIgbW9kZU5hbWVzID0gWydtYXJrZG93bicsICdodG1sJywgJ3d5c2l3eWcnXTtcbnZhciBjYWNoZSA9IFtdO1xudmFyIG1hYyA9IC9cXGJNYWMgT1NcXGIvLnRlc3QoZ2xvYmFsLm5hdmlnYXRvci51c2VyQWdlbnQpO1xudmFyIGRvYyA9IGRvY3VtZW50O1xudmFyIHJwYXJhZ3JhcGggPSAvXjxwPjxcXC9wPlxcbj8kL2k7XG5cbmZ1bmN0aW9uIGZpbmQgKHRleHRhcmVhKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGUubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY2FjaGVbaV0gJiYgY2FjaGVbaV0udGEgPT09IHRleHRhcmVhKSB7XG4gICAgICByZXR1cm4gY2FjaGVbaV0uZWRpdG9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gd29vZm1hcmsgKHRleHRhcmVhLCBvcHRpb25zKSB7XG4gIHZhciBjYWNoZWQgPSBmaW5kKHRleHRhcmVhKTtcbiAgaWYgKGNhY2hlZCkge1xuICAgIHJldHVybiBjYWNoZWQ7XG4gIH1cblxuICB2YXIgcGFyZW50ID0gdGV4dGFyZWEucGFyZW50RWxlbWVudDtcbiAgaWYgKHBhcmVudC5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd3b29mbWFyayBkZW1hbmRzIDx0ZXh0YXJlYT4gZWxlbWVudHMgdG8gaGF2ZSBubyBzaWJsaW5ncycpO1xuICB9XG5cbiAgdmFyIG8gPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoby5tYXJrZG93biA9PT0gdm9pZCAwKSB7IG8ubWFya2Rvd24gPSB0cnVlOyB9XG4gIGlmIChvLmh0bWwgPT09IHZvaWQgMCkgeyBvLmh0bWwgPSB0cnVlOyB9XG4gIGlmIChvLnd5c2l3eWcgPT09IHZvaWQgMCkgeyBvLnd5c2l3eWcgPSB0cnVlOyB9XG5cbiAgaWYgKCFvLm1hcmtkb3duICYmICFvLmh0bWwgJiYgIW8ud3lzaXd5Zykge1xuICAgIHRocm93IG5ldyBFcnJvcignd29vZm1hcmsgZXhwZWN0cyBhdCBsZWFzdCBvbmUgaW5wdXQgbW9kZSB0byBiZSBhdmFpbGFibGUnKTtcbiAgfVxuXG4gIGlmIChvLmhyID09PSB2b2lkIDApIHsgby5ociA9IGZhbHNlOyB9XG4gIGlmIChvLnN0b3JhZ2UgPT09IHZvaWQgMCkgeyBvLnN0b3JhZ2UgPSB0cnVlOyB9XG4gIGlmIChvLnN0b3JhZ2UgPT09IHRydWUpIHsgby5zdG9yYWdlID0gJ3dvb2ZtYXJrX2lucHV0X21vZGUnOyB9XG4gIGlmIChvLmZlbmNpbmcgPT09IHZvaWQgMCkgeyBvLmZlbmNpbmcgPSB0cnVlOyB9XG4gIGlmIChvLnJlbmRlciA9PT0gdm9pZCAwKSB7IG8ucmVuZGVyID0ge307IH1cbiAgaWYgKG8ucmVuZGVyLm1vZGVzID09PSB2b2lkIDApIHsgby5yZW5kZXIubW9kZXMgPSB7fTsgfVxuICBpZiAoby5yZW5kZXIuY29tbWFuZHMgPT09IHZvaWQgMCkgeyBvLnJlbmRlci5jb21tYW5kcyA9IHt9OyB9XG4gIGlmIChvLnByb21wdHMgPT09IHZvaWQgMCkgeyBvLnByb21wdHMgPSB7fTsgfVxuICBpZiAoby5wcm9tcHRzLmxpbmsgPT09IHZvaWQgMCkgeyBvLnByb21wdHMubGluayA9IHByb21wdDsgfVxuICBpZiAoby5wcm9tcHRzLmltYWdlID09PSB2b2lkIDApIHsgby5wcm9tcHRzLmltYWdlID0gcHJvbXB0OyB9XG4gIGlmIChvLnByb21wdHMuYXR0YWNobWVudCA9PT0gdm9pZCAwKSB7IG8ucHJvbXB0cy5hdHRhY2htZW50ID0gcHJvbXB0OyB9XG4gIGlmIChvLnByb21wdHMuY2xvc2UgPT09IHZvaWQgMCkgeyBvLnByb21wdHMuY2xvc2UgPSBjbG9zZVByb21wdHM7IH1cbiAgaWYgKG8uY2xhc3NlcyA9PT0gdm9pZCAwKSB7IG8uY2xhc3NlcyA9IHt9OyB9XG4gIGlmIChvLmNsYXNzZXMud3lzaXd5ZyA9PT0gdm9pZCAwKSB7IG8uY2xhc3Nlcy53eXNpd3lnID0gW107IH1cbiAgaWYgKG8uY2xhc3Nlcy5wcm9tcHRzID09PSB2b2lkIDApIHsgby5jbGFzc2VzLnByb21wdHMgPSB7fTsgfVxuICBpZiAoby5jbGFzc2VzLmlucHV0ID09PSB2b2lkIDApIHsgby5jbGFzc2VzLmlucHV0ID0ge307IH1cblxuICB2YXIgcHJlZmVyZW5jZSA9IG8uc3RvcmFnZSAmJiBscy5nZXQoby5zdG9yYWdlKTtcbiAgaWYgKHByZWZlcmVuY2UpIHtcbiAgICBvLmRlZmF1bHRNb2RlID0gcHJlZmVyZW5jZTtcbiAgfVxuXG4gIHZhciBkcm9wYXJlYSA9IHRhZyh7IGM6ICd3ay1jb250YWluZXItZHJvcCcgfSk7XG4gIHZhciBzd2l0Y2hib2FyZCA9IHRhZyh7IGM6ICd3ay1zd2l0Y2hib2FyZCcgfSk7XG4gIHZhciBjb21tYW5kcyA9IHRhZyh7IGM6ICd3ay1jb21tYW5kcycgfSk7XG4gIHZhciBlZGl0YWJsZSA9IHRhZyh7IGM6IFsnd2std3lzaXd5ZycsICd3ay1oaWRlJ10uY29uY2F0KG8uY2xhc3Nlcy53eXNpd3lnKS5qb2luKCcgJykgfSk7XG4gIHZhciBzdXJmYWNlID0gZ2V0U3VyZmFjZSh0ZXh0YXJlYSwgZWRpdGFibGUsIGRyb3BhcmVhKTtcbiAgdmFyIGhpc3RvcnkgPSBuZXcgSW5wdXRIaXN0b3J5KHN1cmZhY2UsICdtYXJrZG93bicpO1xuICB2YXIgZWRpdG9yID0ge1xuICAgIGFkZENvbW1hbmQ6IGFkZENvbW1hbmQsXG4gICAgYWRkQ29tbWFuZEJ1dHRvbjogYWRkQ29tbWFuZEJ1dHRvbixcbiAgICBydW5Db21tYW5kOiBydW5Db21tYW5kLFxuICAgIHBhcnNlTWFya2Rvd246IG8ucGFyc2VNYXJrZG93bixcbiAgICBwYXJzZUhUTUw6IG8ucGFyc2VIVE1MLFxuICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgdmFsdWU6IGdldE9yU2V0VmFsdWUsXG4gICAgdGV4dGFyZWE6IHRleHRhcmVhLFxuICAgIGVkaXRhYmxlOiBvLnd5c2l3eWcgPyBlZGl0YWJsZSA6IG51bGwsXG4gICAgc2V0TW9kZTogcGVyc2lzdE1vZGUsXG4gICAgaGlzdG9yeToge1xuICAgICAgdW5kbzogaGlzdG9yeS51bmRvLFxuICAgICAgcmVkbzogaGlzdG9yeS5yZWRvLFxuICAgICAgY2FuVW5kbzogaGlzdG9yeS5jYW5VbmRvLFxuICAgICAgY2FuUmVkbzogaGlzdG9yeS5jYW5SZWRvXG4gICAgfSxcbiAgICBtb2RlOiAnbWFya2Rvd24nXG4gIH07XG4gIHZhciBlbnRyeSA9IHsgdGE6IHRleHRhcmVhLCBlZGl0b3I6IGVkaXRvciB9O1xuICB2YXIgaSA9IGNhY2hlLnB1c2goZW50cnkpO1xuICB2YXIga2FueWVDb250ZXh0ID0gJ3dvb2ZtYXJrXycgKyBpO1xuICB2YXIga2FueWVPcHRpb25zID0ge1xuICAgIGZpbHRlcjogcGFyZW50LFxuICAgIGNvbnRleHQ6IGthbnllQ29udGV4dFxuICB9O1xuICB2YXIgbW9kZXMgPSB7XG4gICAgbWFya2Rvd246IHtcbiAgICAgIGJ1dHRvbjogdGFnKHsgdDogJ2J1dHRvbicsIGM6ICd3ay1tb2RlIHdrLW1vZGUtYWN0aXZlJyB9KSxcbiAgICAgIHNldDogbWFya2Rvd25Nb2RlXG4gICAgfSxcbiAgICBodG1sOiB7XG4gICAgICBidXR0b246IHRhZyh7IHQ6ICdidXR0b24nLCBjOiAnd2stbW9kZSB3ay1tb2RlLWluYWN0aXZlJyB9KSxcbiAgICAgIHNldDogaHRtbE1vZGVcbiAgICB9LFxuICAgIHd5c2l3eWc6IHtcbiAgICAgIGJ1dHRvbjogdGFnKHsgdDogJ2J1dHRvbicsIGM6ICd3ay1tb2RlIHdrLW1vZGUtaW5hY3RpdmUnIH0pLFxuICAgICAgc2V0OiB3eXNpd3lnTW9kZVxuICAgIH1cbiAgfTtcbiAgdmFyIHBsYWNlO1xuXG4gIHRhZyh7IHQ6ICdzcGFuJywgYzogJ3drLWRyb3AtdGV4dCcsIHg6IHN0cmluZ3MucHJvbXB0cy5kcm9wLCBwOiBkcm9wYXJlYSB9KTtcbiAgdGFnKHsgdDogJ3AnLCBjOiBbJ3drLWRyb3AtaWNvbiddLmNvbmNhdChvLmNsYXNzZXMuZHJvcGljb24pLmpvaW4oJyAnKSwgcDogZHJvcGFyZWEgfSk7XG5cbiAgZWRpdGFibGUuY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcbiAgbW9kZXMubWFya2Rvd24uYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgbW9kZU5hbWVzLmZvckVhY2goYWRkTW9kZSk7XG5cbiAgaWYgKG8ud3lzaXd5Zykge1xuICAgIHBsYWNlID0gdGFnKHsgYzogJ3drLXd5c2l3eWctcGxhY2Vob2xkZXIgd2staGlkZScsIHg6IHRleHRhcmVhLnBsYWNlaG9sZGVyIH0pO1xuICAgIGNyb3NzdmVudC5hZGQocGxhY2UsICdjbGljaycsIGZvY3VzRWRpdGFibGUpO1xuICB9XG5cbiAgaWYgKG8uZGVmYXVsdE1vZGUgJiYgb1tvLmRlZmF1bHRNb2RlXSkge1xuICAgIG1vZGVzW28uZGVmYXVsdE1vZGVdLnNldCgpO1xuICB9IGVsc2UgaWYgKG8ubWFya2Rvd24pIHtcbiAgICBtb2Rlcy5tYXJrZG93bi5zZXQoKTtcbiAgfSBlbHNlIGlmIChvLmh0bWwpIHtcbiAgICBtb2Rlcy5odG1sLnNldCgpO1xuICB9IGVsc2Uge1xuICAgIG1vZGVzLnd5c2l3eWcuc2V0KCk7XG4gIH1cblxuICBiaW5kQ29tbWFuZHMoc3VyZmFjZSwgbywgZWRpdG9yKTtcbiAgYmluZEV2ZW50cygpO1xuXG4gIHJldHVybiBlZGl0b3I7XG5cbiAgZnVuY3Rpb24gYWRkTW9kZSAoaWQpIHtcbiAgICB2YXIgYnV0dG9uID0gbW9kZXNbaWRdLmJ1dHRvbjtcbiAgICB2YXIgY3VzdG9tID0gby5yZW5kZXIubW9kZXM7XG4gICAgaWYgKG9baWRdKSB7XG4gICAgICBzd2l0Y2hib2FyZC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgKHR5cGVvZiBjdXN0b20gPT09ICdmdW5jdGlvbicgPyBjdXN0b20gOiByZW5kZXJlcnMubW9kZXMpKGJ1dHRvbiwgaWQpO1xuICAgICAgY3Jvc3N2ZW50LmFkZChidXR0b24sICdjbGljaycsIG1vZGVzW2lkXS5zZXQpO1xuICAgICAgYnV0dG9uLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIGJ1dHRvbi50YWJJbmRleCA9IC0xO1xuXG4gICAgICB2YXIgdGl0bGUgPSBzdHJpbmdzLnRpdGxlc1tpZF07XG4gICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBtYWMgPyBtYWNpZnkodGl0bGUpIDogdGl0bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmRFdmVudHMgKHJlbW92ZSkge1xuICAgIHZhciBhciA9IHJlbW92ZSA/ICdybScgOiAnYWRkJztcbiAgICB2YXIgbW92ID0gcmVtb3ZlID8gJ3JlbW92ZUNoaWxkJyA6ICdhcHBlbmRDaGlsZCc7XG4gICAgaWYgKHJlbW92ZSkge1xuICAgICAga2FueWUuY2xlYXIoa2FueWVDb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG8ubWFya2Rvd24pIHsga2FueWUub24oJ2NtZCttJywga2FueWVPcHRpb25zLCBtYXJrZG93bk1vZGUpOyB9XG4gICAgICBpZiAoby5odG1sKSB7IGthbnllLm9uKCdjbWQraCcsIGthbnllT3B0aW9ucywgaHRtbE1vZGUpOyB9XG4gICAgICBpZiAoby53eXNpd3lnKSB7IGthbnllLm9uKCdjbWQrcCcsIGthbnllT3B0aW9ucywgd3lzaXd5Z01vZGUpOyB9XG4gICAgfVxuICAgIGNsYXNzZXNbYXJdKHBhcmVudCwgJ3drLWNvbnRhaW5lcicpO1xuICAgIHBhcmVudFttb3ZdKGVkaXRhYmxlKTtcbiAgICBpZiAocGxhY2UpIHsgcGFyZW50W21vdl0ocGxhY2UpOyB9XG4gICAgcGFyZW50W21vdl0oY29tbWFuZHMpO1xuICAgIHBhcmVudFttb3ZdKHN3aXRjaGJvYXJkKTtcbiAgICBpZiAoby5pbWFnZXMgfHwgby5hdHRhY2htZW50cykge1xuICAgICAgcGFyZW50W21vdl0oZHJvcGFyZWEpO1xuICAgICAgdXBsb2FkcyhwYXJlbnQsIGRyb3BhcmVhLCBlZGl0b3IsIG8sIHJlbW92ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gICAgaWYgKGVkaXRvci5tb2RlICE9PSAnbWFya2Rvd24nKSB7XG4gICAgICB0ZXh0YXJlYS52YWx1ZSA9IGdldE1hcmtkb3duKCk7XG4gICAgfVxuICAgIGNsYXNzZXMucm0odGV4dGFyZWEsICd3ay1oaWRlJyk7XG4gICAgYmluZEV2ZW50cyh0cnVlKTtcbiAgICBkZWxldGUgY2FjaGVbaSAtIDFdO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFya2Rvd25Nb2RlIChlKSB7IHBlcnNpc3RNb2RlKCdtYXJrZG93bicsIGUpOyB9XG4gIGZ1bmN0aW9uIGh0bWxNb2RlIChlKSB7IHBlcnNpc3RNb2RlKCdodG1sJywgZSk7IH1cbiAgZnVuY3Rpb24gd3lzaXd5Z01vZGUgKGUpIHsgcGVyc2lzdE1vZGUoJ3d5c2l3eWcnLCBlKTsgfVxuXG4gIGZ1bmN0aW9uIHBlcnNpc3RNb2RlIChuZXh0TW9kZSwgZSkge1xuICAgIHZhciByZW1lbWJyYW5jZTtcbiAgICB2YXIgY3VycmVudE1vZGUgPSBlZGl0b3IubW9kZTtcbiAgICB2YXIgb2xkID0gbW9kZXNbY3VycmVudE1vZGVdLmJ1dHRvbjtcbiAgICB2YXIgYnV0dG9uID0gbW9kZXNbbmV4dE1vZGVdLmJ1dHRvbjtcbiAgICB2YXIgZm9jdXNpbmcgPSAhIWUgfHwgZG9jLmFjdGl2ZUVsZW1lbnQgPT09IHRleHRhcmVhIHx8IGRvYy5hY3RpdmVFbGVtZW50ID09PSBlZGl0YWJsZTtcblxuICAgIHN0b3AoZSk7XG5cbiAgICBpZiAoY3VycmVudE1vZGUgPT09IG5leHRNb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVtZW1icmFuY2UgPSBmb2N1c2luZyAmJiByZW1lbWJlclNlbGVjdGlvbihoaXN0b3J5LCBvKTtcbiAgICB0ZXh0YXJlYS5ibHVyKCk7IC8vIGF2ZXJ0IGNocm9tZSByZXBhaW50IGJ1Z3NcblxuICAgIGlmIChuZXh0TW9kZSA9PT0gJ21hcmtkb3duJykge1xuICAgICAgaWYgKGN1cnJlbnRNb2RlID09PSAnaHRtbCcpIHtcbiAgICAgICAgdGV4dGFyZWEudmFsdWUgPSBwYXJzZSgncGFyc2VIVE1MJywgdGV4dGFyZWEudmFsdWUpLnRyaW0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHRhcmVhLnZhbHVlID0gcGFyc2UoJ3BhcnNlSFRNTCcsIGVkaXRhYmxlKS50cmltKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChuZXh0TW9kZSA9PT0gJ2h0bWwnKSB7XG4gICAgICBpZiAoY3VycmVudE1vZGUgPT09ICdtYXJrZG93bicpIHtcbiAgICAgICAgdGV4dGFyZWEudmFsdWUgPSBwYXJzZSgncGFyc2VNYXJrZG93bicsIHRleHRhcmVhLnZhbHVlKS50cmltKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9IGVkaXRhYmxlLmlubmVySFRNTC50cmltKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChuZXh0TW9kZSA9PT0gJ3d5c2l3eWcnKSB7XG4gICAgICBpZiAoY3VycmVudE1vZGUgPT09ICdtYXJrZG93bicpIHtcbiAgICAgICAgZWRpdGFibGUuaW5uZXJIVE1MID0gcGFyc2UoJ3BhcnNlTWFya2Rvd24nLCB0ZXh0YXJlYS52YWx1ZSkucmVwbGFjZShycGFyYWdyYXBoLCAnJykudHJpbSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdGFibGUuaW5uZXJIVE1MID0gdGV4dGFyZWEudmFsdWUucmVwbGFjZShycGFyYWdyYXBoLCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZXh0TW9kZSA9PT0gJ3d5c2l3eWcnKSB7XG4gICAgICBjbGFzc2VzLmFkZCh0ZXh0YXJlYSwgJ3drLWhpZGUnKTtcbiAgICAgIGNsYXNzZXMucm0oZWRpdGFibGUsICd3ay1oaWRlJyk7XG4gICAgICBpZiAocGxhY2UpIHsgY2xhc3Nlcy5ybShwbGFjZSwgJ3drLWhpZGUnKTsgfVxuICAgICAgaWYgKGZvY3VzaW5nKSB7IHNldFRpbWVvdXQoZm9jdXNFZGl0YWJsZSwgMCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2xhc3Nlcy5ybSh0ZXh0YXJlYSwgJ3drLWhpZGUnKTtcbiAgICAgIGNsYXNzZXMuYWRkKGVkaXRhYmxlLCAnd2staGlkZScpO1xuICAgICAgaWYgKHBsYWNlKSB7IGNsYXNzZXMuYWRkKHBsYWNlLCAnd2staGlkZScpOyB9XG4gICAgICBpZiAoZm9jdXNpbmcpIHsgdGV4dGFyZWEuZm9jdXMoKTsgfVxuICAgIH1cbiAgICBjbGFzc2VzLmFkZChidXR0b24sICd3ay1tb2RlLWFjdGl2ZScpO1xuICAgIGNsYXNzZXMucm0ob2xkLCAnd2stbW9kZS1hY3RpdmUnKTtcbiAgICBjbGFzc2VzLmFkZChvbGQsICd3ay1tb2RlLWluYWN0aXZlJyk7XG4gICAgY2xhc3Nlcy5ybShidXR0b24sICd3ay1tb2RlLWluYWN0aXZlJyk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICBvbGQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIGVkaXRvci5tb2RlID0gbmV4dE1vZGU7XG5cbiAgICBpZiAoby5zdG9yYWdlKSB7IGxzLnNldChvLnN0b3JhZ2UsIG5leHRNb2RlKTsgfVxuXG4gICAgaGlzdG9yeS5zZXRJbnB1dE1vZGUobmV4dE1vZGUpO1xuICAgIGlmIChyZW1lbWJyYW5jZSkgeyByZW1lbWJyYW5jZS51bm1hcmsoKTsgfVxuICAgIGZpcmVMYXRlcignd29vZm1hcmstbW9kZS1jaGFuZ2UnKTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlIChtZXRob2QsIGlucHV0KSB7XG4gICAgICByZXR1cm4gb1ttZXRob2RdKGlucHV0LCB7XG4gICAgICAgIG1hcmtlcnM6IHJlbWVtYnJhbmNlICYmIHJlbWVtYnJhbmNlLm1hcmtlcnMgfHwgW11cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpcmVMYXRlciAodHlwZSkge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gZmlyZSAoKSB7XG4gICAgICBjcm9zc3ZlbnQuZmFicmljYXRlKHRleHRhcmVhLCB0eXBlKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvY3VzRWRpdGFibGUgKCkge1xuICAgIGVkaXRhYmxlLmZvY3VzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXJrZG93biAoKSB7XG4gICAgaWYgKGVkaXRvci5tb2RlID09PSAnd3lzaXd5ZycpIHtcbiAgICAgIHJldHVybiBvLnBhcnNlSFRNTChlZGl0YWJsZSk7XG4gICAgfVxuICAgIGlmIChlZGl0b3IubW9kZSA9PT0gJ2h0bWwnKSB7XG4gICAgICByZXR1cm4gby5wYXJzZUhUTUwodGV4dGFyZWEudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGV4dGFyZWEudmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRPclNldFZhbHVlIChpbnB1dCkge1xuICAgIHZhciBtYXJrZG93biA9IFN0cmluZyhpbnB1dCk7XG4gICAgdmFyIHNldHMgPSBhcmd1bWVudHMubGVuZ3RoID09PSAxO1xuICAgIGlmIChzZXRzKSB7XG4gICAgICBpZiAoZWRpdG9yLm1vZGUgPT09ICd3eXNpd3lnJykge1xuICAgICAgICBlZGl0YWJsZS5pbm5lckhUTUwgPSBhc0h0bWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHRhcmVhLnZhbHVlID0gZWRpdG9yLm1vZGUgPT09ICdodG1sJyA/IGFzSHRtbCgpIDogbWFya2Rvd247XG4gICAgICB9XG4gICAgICBoaXN0b3J5LnJlc2V0KCk7XG4gICAgfVxuICAgIHJldHVybiBnZXRNYXJrZG93bigpO1xuICAgIGZ1bmN0aW9uIGFzSHRtbCAoKSB7XG4gICAgICByZXR1cm4gby5wYXJzZU1hcmtkb3duKG1hcmtkb3duKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRDb21tYW5kQnV0dG9uIChpZCwgY29tYm8sIGZuKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGZuID0gY29tYm87XG4gICAgICBjb21ibyA9IG51bGw7XG4gICAgfVxuICAgIHZhciBidXR0b24gPSB0YWcoeyB0OiAnYnV0dG9uJywgYzogJ3drLWNvbW1hbmQnLCBwOiBjb21tYW5kcyB9KTtcbiAgICB2YXIgY3VzdG9tID0gby5yZW5kZXIuY29tbWFuZHM7XG4gICAgdmFyIHJlbmRlciA9IHR5cGVvZiBjdXN0b20gPT09ICdmdW5jdGlvbicgPyBjdXN0b20gOiByZW5kZXJlcnMuY29tbWFuZHM7XG4gICAgdmFyIHRpdGxlID0gc3RyaW5ncy50aXRsZXNbaWRdO1xuICAgIGlmICh0aXRsZSkge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBtYWMgPyBtYWNpZnkodGl0bGUpIDogdGl0bGUpO1xuICAgIH1cbiAgICBidXR0b24udHlwZSA9ICdidXR0b24nO1xuICAgIGJ1dHRvbi50YWJJbmRleCA9IC0xO1xuICAgIHJlbmRlcihidXR0b24sIGlkKTtcbiAgICBjcm9zc3ZlbnQuYWRkKGJ1dHRvbiwgJ2NsaWNrJywgZ2V0Q29tbWFuZEhhbmRsZXIoc3VyZmFjZSwgaGlzdG9yeSwgZm4pKTtcbiAgICBpZiAoY29tYm8pIHtcbiAgICAgIGFkZENvbW1hbmQoY29tYm8sIGZuKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZENvbW1hbmQgKGNvbWJvLCBmbikge1xuICAgIGthbnllLm9uKGNvbWJvLCBrYW55ZU9wdGlvbnMsIGdldENvbW1hbmRIYW5kbGVyKHN1cmZhY2UsIGhpc3RvcnksIGZuKSk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5Db21tYW5kIChmbikge1xuICAgIGdldENvbW1hbmRIYW5kbGVyKHN1cmZhY2UsIGhpc3RvcnksIHJlYXJyYW5nZSkobnVsbCk7XG4gICAgZnVuY3Rpb24gcmVhcnJhbmdlIChlLCBtb2RlLCBjaHVua3MpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGNodW5rcywgbW9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRhZyAob3B0aW9ucykge1xuICB2YXIgbyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KG8udCB8fCAnZGl2Jyk7XG4gIGVsLmNsYXNzTmFtZSA9IG8uYyB8fCAnJztcbiAgc2V0VGV4dChlbCwgby54IHx8ICcnKTtcbiAgaWYgKG8ucCkgeyBvLnAuYXBwZW5kQ2hpbGQoZWwpOyB9XG4gIHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gc3RvcCAoZSkge1xuICBpZiAoZSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH1cbn1cblxuZnVuY3Rpb24gbWFjaWZ5ICh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0XG4gICAgLnJlcGxhY2UoL1xcYmN0cmxcXGIvaSwgJ1xcdTIzMTgnKVxuICAgIC5yZXBsYWNlKC9cXGJhbHRcXGIvaSwgJ1xcdTIzMjUnKVxuICAgIC5yZXBsYWNlKC9cXGJzaGlmdFxcYi9pLCAnXFx1MjFlNycpO1xufVxuXG53b29mbWFyay5maW5kID0gZmluZDtcbndvb2ZtYXJrLnN0cmluZ3MgPSBzdHJpbmdzO1xubW9kdWxlLmV4cG9ydHMgPSB3b29mbWFyaztcbiJdfQ==
    }, {
      "./InputHistory": 133,
      "./bindCommands": 135,
      "./classes": 139,
      "./getCommandHandler": 142,
      "./getSurface": 143,
      "./prompts/close": 167,
      "./prompts/prompt": 168,
      "./rememberSelection": 170,
      "./renderers": 171,
      "./setText": 172,
      "./strings": 173,
      "./uploads": 174,
      "crossvent": 12,
      "kanye": 41,
      "local-storage": 42
    }]
  }, {}, [1])(1)
});
