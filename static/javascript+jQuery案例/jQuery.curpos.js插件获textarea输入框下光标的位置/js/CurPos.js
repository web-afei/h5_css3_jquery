;(function($){
	$.fn.extend({
		// 获取当前光标位置的方法
		getCurPos:function() {
			var getCurPos = '';
			if ( navigator.userAgent.indexOf("MSIE") > -1 ) {  // IE
				// 创建一个textRange,并让textRange范围包含元素里所有内容
				var all_range = document.body.createTextRange();all_range.moveToElementText($(this).get(0));$(this).focus();
				// 获取当前的textRange,如果当前的textRange是一个具体位置而不是范围,则此时textRange的范围是start到end.此时start等于end
				var cur_range = document.selection.createRange();
				// 将当前textRange的start,移动到之前创建的textRange的start处,这时,当前textRange范围就变成了从整个内容的start处,到当前范围end处
				cur_range.setEndPoint("StartToStart",all_range);
				// 此时当前textRange的Start到End的长度,就是光标的位置
				curCurPos = cur_range.text.length;
			} else {
				// 获取当前元素光标位置
				curCurPos = $(this).get(0).selectionStart;
			}
			// 返回光标位置
			return curCurPos;
		}
	});
})(jQuery);