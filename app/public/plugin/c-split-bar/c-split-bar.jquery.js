;
(function ($) {

	function formatStr() {
		if (!arguments || arguments.length == 0) return '';
		var args = arguments;
		return args[0].replace(/\{(\d+)\}/g,
			function (m, i) {
				return args[parseInt(i) + 1];
			});
	}

	var colorSwitch = (function () {
		var g = ['', 'green', 'green2', 'orange', 'orange2'];
		var current = 0;
		return {
			green: function () {
				if (current == 1) return g[++current];
				else return g[(current = 1)];
			},
			orange: function () {
				if (current == 3) return g[++current];
				else return g[(current = 3)];
			},
			reset: function () { current = 0 }
		}
	})();

	function getBar(index, width, enable, reserved, canRevert, currentUser, first, user) {
		width = width * 100;
		var cls = '';
		if (currentUser) {
			cls += colorSwitch.green();
		} else if (reserved) {
			cls += colorSwitch.orange();
		} else {
			cls += " opacity ";
			colorSwitch.reset();
		}
		cls += first ? ' first ' : '';
		cls += canRevert ? ' canRevert ' : '';
		var barIndex = (index >= 0 ? '" bar-index="' + index + '"' : '');
		return '<span style="width:' + width + '%; overflow:hidden;text-align:center;" class="' + cls + '" ' + barIndex + '>' + user + '</span>';
	}

	function getGraduation(width, text, first, textLast) {
		width = width * 100;
		var s = '<div style="width:{0}%" {1}><span>{2}</span>{3}</div>';
		var text2 = textLast ? '<label class="last">' + textLast + '</label>' : '';
		var divLast = textLast ? ' class="last" ' : (first ? ' class="first" ' : '');
		return formatStr(s, width, divLast, text, text2);
	}

	function splitBar(ctrl, option) {
		$(ctrl).data('bar-data', {});
		var barData = $(ctrl).data('bar-data');
		var defaultOpts = $.splitBar.config.opts || $.splitBar.config.default || {};
		var opts = $.extend(defaultOpts, option, true);

		var total = opts.end - opts.start;

		var builder = [];
		//bar
		builder.push('<div class="c-split-bar">');

		opts.bars = opts.bars || [];
		for (var i = 0; i < opts.bars.length; i++) {
			var bar = opts.bars[i];
			var width = (bar.end - bar.start) * 1.0 / total;
			builder.push(getBar(bar.data ? i : -1, width, bar.enable, bar.reserved, bar.canRevert, bar.currentUser, i == 0, bar.user));
			barData[i] = bar.data;
		}

		builder.push('</div>');

		//graduation
		builder.push('<div class="c-split-graduation">');

		var graduationWidth = opts.split * 1.0 / total;
		for (var i = opts.start; i < opts.end - opts.split; i += opts.split) {
			builder.push(getGraduation(graduationWidth, opts.textFormat(i), i == opts.start, false));
		}
		builder.push(getGraduation(graduationWidth, opts.textFormat(opts.end - opts.split), false, opts.textFormat(opts.end)));

		builder.push('</div>');

		$(ctrl).html(builder.join(''));
		$(ctrl).data('bar-data', barData);
	}



	$.fn.splitBar = function (opts) {
		return this.each(function (i, e) {
			splitBar($(e), opts);
		});
	}

	$.splitBar = {};
	$.splitBar.config = function (opts) {
		$.splitBar.config.opts = $.extend($.splitBar.config.default, opts, true);
	};

	$.splitBar.config.default = {
		start: 9 * 60,
		end: 18 * 60,
		split: 60,
		textFormat: function (value) {
			value = value / 60;
			return value > 9 ? value + ':00' : '0' + value + ":00";
		},
		bars: [
			{
				start: 9 * 60,
				end: 18 * 60,
				enable: true,
				reserved: false,
				data: null
			}
		]
	};

})(jQuery);