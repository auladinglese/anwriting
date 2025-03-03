/**
 * angular-growl-v2 - v0.7.8 - 2015-10-25
 * http://janstevens.github.io/angular-growl-2
 * Copyright (c) 2015 Marco Rinck,Jan Stevens,Silvan van Leeuwen; Licensed MIT
 */
angular.module('angular-growl', []),
  angular.module('angular-growl').directive('growl', [
    function() {
      'use strict';
      return {
        restrict: 'A',
        templateUrl: 'templates/growl/growl.html',
        replace: !1,
        scope: { reference: '@', inline: '=', limitMessages: '=' },
        controller: [
          '$scope',
          '$interval',
          'growl',
          'growlMessages',
          function(a, b, c, d) {
            (a.referenceId = a.reference || 0),
              d.initDirective(a.referenceId, a.limitMessages),
              (a.growlMessages = d),
              (a.inlineMessage = angular.isDefined(a.inline) ? a.inline : c.inlineMessages()),
              a.$watch('limitMessages', function(b) {
                var c = d.directives[a.referenceId];
                angular.isUndefined(b) || angular.isUndefined(c) || (c.limitMessages = b);
              }),
              (a.stopTimeoutClose = function(a) {
                a.clickToClose ||
                  (angular.forEach(a.promises, function(a) {
                    b.cancel(a);
                  }),
                  a.close ? d.deleteMessage(a) : (a.close = !0));
              }),
              (a.alertClasses = function(a) {
                return {
                  'alert-success': 'success' === a.severity,
                  'alert-error': 'error' === a.severity,
                  'alert-danger': 'error' === a.severity,
                  'alert-info': 'info' === a.severity,
                  'alert-warning': 'warning' === a.severity,
                  icon: a.disableIcons === !1,
                  'alert-dismissable': !a.disableCloseButton
                };
              }),
              (a.showCountDown = function(a) {
                return !a.disableCountDown && a.ttl > 0;
              }),
              (a.wrapperClasses = function() {
                var b = {};
                return (b['growl-fixed'] = !a.inlineMessage), (b[c.position()] = !0), b;
              }),
              (a.computeTitle = function(a) {
                var b = { success: 'Success', error: 'Error', info: 'Information', warn: 'Warning' };
                return b[a.severity];
              });
          }
        ]
      };
    }
  ]),
  angular.module('angular-growl').run([
    '$templateCache',
    function(a) {
      'use strict';
      void 0 === a.get('templates/growl/growl.html') &&
        a.put(
          'templates/growl/growl.html',
          '<div class="growl-container" ng-class="wrapperClasses()"><div class="growl-item alert" ng-repeat="message in growlMessages.directives[referenceId].messages" ng-class="alertClasses(message)" ng-click="stopTimeoutClose(message)"><button type="button" class="close" data-dismiss="alert" aria-hidden="true" ng-click="growlMessages.deleteMessage(message)" ng-show="!message.disableCloseButton">&times;</button><button type="button" class="close" aria-hidden="true" ng-show="showCountDown(message)">{{message.countdown}}</button><h4 class="growl-title" ng-show="message.title" ng-bind="message.title"></h4><div class="growl-message" ng-bind-html="message.text"></div></div></div>'
        );
    }
  ]),
  angular.module('angular-growl').provider('growl', function() {
    'use strict';
    var a = { success: null, error: null, warning: null, info: null },
      b = 'messages',
      c = 'text',
      d = 'title',
      e = 'severity',
      f = 'ttl',
      g = !0,
      h = 'variables',
      i = 0,
      j = !1,
      k = 'top-right',
      l = !1,
      m = !1,
      n = !1,
      o = !1,
      p = !0;
    (this.globalTimeToLive = function(b) {
      if ('object' == typeof b) for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
      else for (var d in a) a.hasOwnProperty(d) && (a[d] = b);
      return this;
    }),
      (this.globalTranslateMessages = function(a) {
        return (p = a), this;
      }),
      (this.globalDisableCloseButton = function(a) {
        return (l = a), this;
      }),
      (this.globalDisableIcons = function(a) {
        return (m = a), this;
      }),
      (this.globalReversedOrder = function(a) {
        return (n = a), this;
      }),
      (this.globalDisableCountDown = function(a) {
        return (o = a), this;
      }),
      (this.messageVariableKey = function(a) {
        return (h = a), this;
      }),
      (this.globalInlineMessages = function(a) {
        return (j = a), this;
      }),
      (this.globalPosition = function(a) {
        return (k = a), this;
      }),
      (this.messagesKey = function(a) {
        return (b = a), this;
      }),
      (this.messageTextKey = function(a) {
        return (c = a), this;
      }),
      (this.messageTitleKey = function(a) {
        return (d = a), this;
      }),
      (this.messageSeverityKey = function(a) {
        return (e = a), this;
      }),
      (this.messageTTLKey = function(a) {
        return (f = a), this;
      }),
      (this.onlyUniqueMessages = function(a) {
        return (g = a), this;
      }),
      (this.serverMessagesInterceptor = [
        '$q',
        'growl',
        function(a, c) {
          function d(a) {
            void 0 !== a && a.data && a.data[b] && a.data[b].length > 0 && c.addServerMessages(a.data[b]);
          }
          return {
            response: function(a) {
              return d(a), a;
            },
            responseError: function(b) {
              return d(b), a.reject(b);
            }
          };
        }
      ]),
      (this.$get = [
        '$rootScope',
        '$interpolate',
        '$sce',
        '$filter',
        '$interval',
        'growlMessages',
        function(b, q, r, s, t, u) {
          function v(a) {
            if (H && a.translateMessage) (a.text = H(a.text, a.variables) || a.text), (a.title = H(a.title) || a.title);
            else {
              var c = q(a.text);
              a.text = c(a.variables);
            }
            var d = u.addMessage(a);
            return b.$broadcast('growlMessage', a), t(function() {}, 0, 1), d;
          }
          function w(b, c, d) {
            var e,
              f = c || {};
            return (
              (e = {
                text: b,
                title: f.title,
                severity: d,
                ttl: f.ttl || a[d],
                variables: f.variables || {},
                disableCloseButton: void 0 === f.disableCloseButton ? l : f.disableCloseButton,
                disableIcons: void 0 === f.disableIcons ? m : f.disableIcons,
                disableCountDown: void 0 === f.disableCountDown ? o : f.disableCountDown,
                position: f.position || k,
                referenceId: f.referenceId || i,
                translateMessage: void 0 === f.translateMessage ? p : f.translateMessage,
                destroy: function() {
                  u.deleteMessage(e);
                },
                setText: function(a) {
                  e.text = r.trustAsHtml(String(a));
                },
                onclose: f.onclose,
                onopen: f.onopen
              }),
              v(e)
            );
          }
          function x(a, b) {
            return w(a, b, 'warning');
          }
          function y(a, b) {
            return w(a, b, 'error');
          }
          function z(a, b) {
            return w(a, b, 'info');
          }
          function A(a, b) {
            return w(a, b, 'success');
          }
          function B(a, b, c) {
            return (c = (c || 'error').toLowerCase()), w(a, b, c);
          }
          function C(a) {
            if (a && a.length) {
              var b, g, i, j;
              for (j = a.length, b = 0; j > b; b++)
                if (((g = a[b]), g[c])) {
                  i = (g[e] || 'error').toLowerCase();
                  var k = {};
                  (k.variables = g[h] || {}), (k.title = g[d]), g[f] && (k.ttl = g[f]), w(g[c], k, i);
                }
            }
          }
          function D() {
            return g;
          }
          function E() {
            return n;
          }
          function F() {
            return j;
          }
          function G() {
            return k;
          }
          var H;
          (u.onlyUnique = g), (u.reverseOrder = n);
          try {
            H = s('translate');
          } catch (I) {}
          return {
            warning: x,
            error: y,
            info: z,
            success: A,
            general: B,
            addServerMessages: C,
            onlyUnique: D,
            reverseOrder: E,
            inlineMessages: F,
            position: G
          };
        }
      ]);
  }),
  angular.module('angular-growl').service('growlMessages', [
    '$sce',
    '$interval',
    function(a, b) {
      'use strict';
      function c(a) {
        var b;
        return (b = f[a] ? f[a] : (f[a] = { messages: [] }));
      }
      function d(a) {
        var b = a || 0;
        return e.directives[b] || f[b];
      }
      var e = this;
      this.directives = {};
      var f = {};
      (this.initDirective = function(a, b) {
        return (
          f[a]
            ? ((this.directives[a] = f[a]), (this.directives[a].limitMessages = b))
            : (this.directives[a] = { messages: [], limitMessages: b }),
          this.directives[a]
        );
      }),
        (this.getAllMessages = function(a) {
          a = a || 0;
          var b;
          return (b = d(a) ? d(a).messages : []);
        }),
        (this.destroyAllMessages = function(a) {
          for (var b = this.getAllMessages(a), c = b.length - 1; c >= 0; c--) b[c].destroy();
          var e = d(a);
          e && (e.messages = []);
        }),
        (this.addMessage = function(d) {
          var e, f, g, h;
          if (
            ((e = this.directives[d.referenceId] ? this.directives[d.referenceId] : c(d.referenceId)),
            (f = e.messages),
            !this.onlyUnique ||
              (angular.forEach(f, function(b) {
                (h = a.getTrustedHtml(b.text)),
                  d.text === h && d.severity === b.severity && d.title === b.title && (g = !0);
              }),
              !g))
          ) {
            if (
              ((d.text = a.trustAsHtml(String(d.text))),
              d.ttl &&
                -1 !== d.ttl &&
                ((d.countdown = d.ttl / 1e3),
                (d.promises = []),
                (d.close = !1),
                (d.countdownFunction = function() {
                  d.countdown > 1 ? (d.countdown--, d.promises.push(b(d.countdownFunction, 1e3, 1, 1))) : d.countdown--;
                })),
              angular.isDefined(e.limitMessages))
            ) {
              var i = f.length - (e.limitMessages - 1);
              i > 0 && f.splice(e.limitMessages - 1, i);
            }
            if (
              (this.reverseOrder ? f.unshift(d) : f.push(d),
              'function' == typeof d.onopen && d.onopen(),
              d.ttl && -1 !== d.ttl)
            ) {
              var j = this;
              d.promises.push(
                b(
                  angular.bind(this, function() {
                    j.deleteMessage(d);
                  }),
                  d.ttl,
                  1,
                  1
                )
              ),
                d.promises.push(b(d.countdownFunction, 1e3, 1, 1));
            }
            return d;
          }
        }),
        (this.deleteMessage = function(a) {
          var b = this.getAllMessages(a.referenceId),
            c = -1;
          for (var d in b) b.hasOwnProperty(d) && (c = b[d] === a ? d : c);
          c > -1 && ((b[c].close = !0), b.splice(c, 1)), 'function' == typeof a.onclose && a.onclose();
        });
    }
  ]);
