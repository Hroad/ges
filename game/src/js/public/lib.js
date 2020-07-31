/**
 * Timer 通用高效定时器
 * 兼容FF，Chrome，Safari，IE9及以上浏览器
 * qizi 2016-8-1
 */
/**
 * 曾祥良修改
 * 兼容FF，Chrome，Safari，IE5及以上浏览器
 * 可以通过---param---给回调方法callbackfun传入的参数
 * @param  这里传入window参数使插件更加高效
 */
(function(window) {
	/*兼容处理requestAnimationFrame*/
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0, length = vendors.length; x < length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
})(window);

/**
 * Timer
 * @param  dis 时间间隔
 * @param  loop 循环次数，如果为0则无限循环
 * @param  callbackfun 回调方法
 * @param  param 给回调方法callbackfun传入的参数
 */
;(function(w) {
	/*定义Timer*/
	function Timer(dis, loop, callbackfun, param) {
		this.dis = dis || 0;
		this.loop = loop || 0;
		this.count = 0;
		this.callbackfun = callbackfun || null;
		this.tid = null;
		this.pretime = 0;
		this.ispause = false;
		this.param = param || null;
	}

	Timer.prototype.start = function() {
		if (this.callbackfun == null) {
			this.errors("回调函数不能为空");
			return;
		} else if (this.loop < 0 || this.dis < 0) {
			this.errors("请输入正确数值");
			return;
		}
		this.pretime = (new Date()).getTime();
		this.ispause = false;
		this.processing();
	}
	Timer.prototype.processing = function() {
		//console.log("test");
		var _self = this;
		if (this.loop > 0 && this.count == this.loop) {
			this.stop();
			return;
		}
		if (this.ispause == true) {
			return;
		}
		if (this.dis > 16.7) {
			var nowtime = (new Date()).getTime();
			if (nowtime - this.pretime > this.dis) {
				this.count++;
				this.callbackfun(this.count, this.param);
				this.pretime = nowtime;
			}
		} else {
			this.count++;
			this.callbackfun(this.count, this.param);
		}
		this.tid = window.requestAnimationFrame(function() {
			_self.processing();
		});
	}
	Timer.prototype.stop = function() {
		if (this.tid != null) {
			this.ispause = true;
			window.cancelAnimationFrame(this.tid);
			this.count = 0;
			this.tid = null;
		}
	}
	Timer.prototype.pause = function() {
		if (this.tid != null) {
			this.ispause = true;
			window.cancelAnimationFrame(this.tid);
			this.tid = null;
		}
	}
	Timer.prototype.errors = function(msg) {
		throw new Error(msg);
	}

	w.Timer = Timer;

})(typeof window !== "undefined" ? window : this);



/**
 * @author: xiangliang.zeng
 * @description:
 * @Date: 2017/2/13 15:52
 * @Last Modified by:   xiangliang.zeng
 * @Last Modified time: 2017/3/2 15:52
 */

/*
 * isAutoLoad:是否自动加载，即自动绑定DOMContentLoaded和load事件。
 * ①如果isAutoLoad为false,则必须手动调用：onReadyStart及onComplete函数，适用与你不想在window的'load'事件中消失loading动画。而是
 * 在js中动态加载的元素（比如obj模型或者其他图片）都加载完成时调用。
 * ②如果isAutoLoad为undefined,则默认为true.
 * ③需要注意的是，如果isAutoLoad填0、-0、null、""、false 或者 NaN则视为false.
 *
 * 公共方法：onReadyStart及onComplete。
 * onReadyStart：如果isAutoLoad为false时必须手动调用，一般情况是在document.ready里面调用，参数是函数。
 * 如果构造函数中有readyCb时，且isAutoLoad为true.则onReadyStart中的callback会覆盖readyCb
 *
 * onComplete：如果isAutoLoad为false时必须手动调用，否则会一直停留在82%的状态。即可以在任何需要的时候调用。不一定要在window.onload里面调用。
 *
 * stop: 这个仅仅是暂停加载动画效果的，一般不需要。
 * start: 这个仅仅是开启加载动画效果的，一般不需要。
 *
 * 如果isAutoLoad为true，或者不填，则会自动loading,可以传入对应的readyCallback及completeCallback供回调使用。
 * 如果参数后面有回调函数参数，则isAutoLoad参数**不可省略。
 *
 * completeCallback中可以执行一些比如H5添加首屏类名以添加动画之类的代码。不要自己监听window.addEventListener('load')事件
 * 会导致动画时机不对。
 *
 *  Example：
 *  function f1(){
 *      console.log(f1);
 *  }
 *  function f2() {
 *      console.log(f2);
 *  }
 *  function f3() {
 *      console.log(f3);
 *  }
 *  function f4() {
 *      console.log(f4);
 *  }
 *  var load1 = new Load51(true,f1,f2);    // 自动执行回调，并绑定DOMContentLoaded和load事件
 *
 *  var load2 = new Load51(false);    // 手动调用,
 *  load2.onReadyStart(f3);   // 可以在需要的时候调用
 *  load2.onComplete(f4);   // 可以在需要的时候调用
 *
 *  .....
 * */
var Load51 = function(isAutoLoad, readyCb, completeCb) {
	this.Version = "Load51_v3.0";
	this._isAutoLoad = isAutoLoad === undefined ? true : isAutoLoad;
	this._isReady = false;
	this._isLoaded = false;
	this._num = 0;
	this._targetNum = 0.82;
	this._progressTime = null;
	this._loading = document.querySelector('.loading');
	this._progress = document.querySelector('.progress');
	this._progressNum = document.querySelector('.progress-num');

	this._readyCb = readyCb || null;   //ready回调
	this._completeCb = completeCb || null;   // load回调

	this._onDomReady = this._readyHandler.bind(this);
	this._onWindowLoad = this._loadHandler.bind(this);

	this.init();
};
Load51.prototype = {
	constructor: 'Load51',
	init: function() {
		if (this._isAutoLoad) {
			this._addReadyEvent();
			this._addLoadEvent();
		}
		this._changeView();
	},
	_ready: function() {
		if (this._num <= this._targetNum) {
			this._num += 0.01;
			this._progress.style.webkitTransform = 'scaleX(' + this._num + ')';
			this._progressNum.innerHTML = Math.round(this._num * 100) + '%';
		}
	},
	_load: function() {
		this._num += 0.05;
		if (this._num >= 1) {
			this._removeReadyEvent();
			this._removeLoadEvent();
			this._removeTimer(this._progressTime);
			this._loading.style.display = 'none';
			typeof this._completeCb === 'function' && this._completeCb();
		}
		this._progress.style.webkitTransform = 'scaleX(' + (this._num > 1 ? 1 : this._num) + ')';
		this._progressNum.innerHTML = (Math.round(this._num * 100) > 100 ? 100 : Math.round(this._num * 100)) + '%';
	},
	onReadyStart: function(callback) {
		this._readyCb = callback ? callback : this._readyCb;
		if (!this._isAutoLoad) {
			this._readyHandler();
		} else if (this._isReady) {
			console.warn('DOMContentLoaded has already done it,if you need to manually call, please set the isAutoLoad to false');
		}
	},
	onComplete: function(callback) {
		this._completeCb = callback ? callback : this._completeCb;
		if (!this._isAutoLoad) {
			this._loadHandler();
		} else if (this._isLoaded) {
			console.warn('The load event has been executed,if you need to manually call, please set the isAutoLoad to false');
		}
	},
	_readyHandler: function() {
		this._isReady = true;
		typeof this._readyCb === 'function' && this._readyCb();
	},
	_loadHandler: function() {
		this._isLoaded = true;
	},
	_changeView: function() {
		var self = this;
		this._progressTime = new Timer(100, 0, function() {
			if (self._isLoaded) {
				self._load();
			} else if (self._isReady) {
				self._ready();
			}
		});
		this._progressTime.start();
	},
	_removeTimer: function(timer) {
		timer.stop();
		timer = null;
	},
	_addReadyEvent: function() {
		document.addEventListener('DOMContentLoaded', this._onDomReady, false);
	},
	_addLoadEvent: function() {
		window.addEventListener('load', this._onWindowLoad, false);
	},
	_removeReadyEvent: function() {
		document.removeEventListener('DOMContentLoaded', this._onDomReady, false);
	},
	_removeLoadEvent: function() {
		window.removeEventListener('load', this._onWindowLoad, false);
	},
	pause: function() {
		this._progressTime.pause();
	},
	start: function() {
		this._progressTime.start();
	}
};




