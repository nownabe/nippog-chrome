


$(function(){
	
	function itemize(content) {
		var items = content.split("\n")
		var text = "<ul>\n"
		for (var i=0; i<items.length; i++)
			text += "<li>" + $('<div/>').text(items[i]).html() + "</li>\n"
		text += "</ul>\n"
		return text
	}

	/*
	 * Add Section Function
	 */

	$(document).on('click', "button.btnAddSection", function(){
		var nums = $(this).attr('value').split('-')
		var lnum = Number(nums[0])
		var mnum = Number(nums[1])
		mnum += 1
		
		var divname = 'l' + lnum + 's'
		var tname = 'l' + lnum + 'm' + mnum + 't'
		var cname = 'l' + lnum + 'm' + mnum + 'c'
		
		$('div#' + divname).append(" \
			<div class='span4'> \
				<div class='control-group'> \
				  <label>Section" + mnum + "</label> \
				  <input class='span4' type='text' placeholder='目的' name='" + tname + "'> \
				</div> \
				<div class='control-group'> \
				  <label>Content</label> \
			  	<textarea class='span4' name='" + cname + "'></textarea> \
				</div> \
			</div> \
		")
		
		$(this).attr('value', lnum + '-' + mnum)
	})
	
	/*
	 * Add Chapter Function
	 */
	$(document).on('click', "button.btnAddChapter", function(){
		var num = Number($(this).attr('value'))
		num += 1
		
		$(this).before(" \
<div class='row'>\
	<div class='span12'>\
		<fieldset> \
      <legend>Chapter" + num + "</legend> \
      <div class='control-group'> \
        <label>title</label> \
        <input class='span12' name='l" + num + "t' placeholder='営業同行：Yahoo!様' type='text'> \
      </div> \
\
      <div id='l" + num + "s' class='row'>\
      	<div class='span4'>\
          <div class='control-group'> \
            <label>Section1</label> \
            <input class='span4' name='l" + num + "m1t' placeholder='目的' type='text'> \
          </div> \
          <div class='control-group'> \
            <label>Content</label> \
            <textarea class='span4' name='l" + num + "m1c'></textarea> \
          </div> \
        </div>\
      </div>\
\
      <div class='row'>\
      	<div class='span12'>\
          <div class='control-group'> \
            <button class='btn btnAddSection' type='button' value='" + num + "-1'>Add section</button> \
          </div> \
        </div>\
      </div>\
    </fieldset> \
  </div>\
</div>\
		")
		
		$(this).attr('value', num)
	})

	/*
	 * Copy Source
	 */
	$("button#btnHilightSource").click(function(){
		$('textarea#source').select()
	})

	/*
	 * Modal Scroll
	 */
	$(".modal").on("shown", function(){
		$("body").addClass("modal-open")
	})
	$(".modal").on("hidden", function(){
		$("body").removeClass("modal-open")
	})

	/*
	 * Preview
	 */
	$("a#btnPreview").click(function(){
		var chapters = getChapters()
		var src = formatChapters(chapters)
		$('div#preview').html(src)
	})

	/*
	 * view source
	 */
	$("a#btnViewSource").click(function(){
		var chapters = getChapters()
		var src = formatChapters(chapters)
		$('textarea#source').val(src)
	})

	function formatChapters(chapters) {
		var src = ""

		// table of contents
		src += "<ol>\n"
		for (var i=0; i<chapters.length; i++)
			src += "<li>" + chapters[i].title + "</li>\n"
		src += "</ol>\n\n"

		// contents
		for (var i=0; i<chapters.length; i++) {
			src += "<p><strong><u>" + (i+1) + ". " + chapters[i].title + "</u></strong></p>\n"

			for (var j=0; j<chapters[i].sections.length; j++) {
				src += "<p><u>" + chapters[i].sections[j].title + "</u></p>\n"
				src += itemize(chapters[i].sections[j].content) + "\n"
			}
		}

		return src
	}

	function getChapters() {
		// Read inputs
		var chapters = new Array()

		var lnum = 1
		while (true) {
			var lelem = $("input[name=l" + lnum + "t]")
			if　( lelem.size() == 0 || lelem.val() == "" ) break
			chapters.push({title: lelem.val(), sections: new Array()})

			var mnum = 1
			while (true) {
				var melemt = $("input[name=l" + lnum + "m" + mnum + "t]")
				if ( melemt.size() == 0 || melemt.val() == "" ) break
				chapters[lnum-1].sections.push({
					title: melemt.val(),
					content: $("textarea[name=l" + lnum + "m" + mnum + "c]").val()
				})
				mnum++
			}

			lnum++
		}

		return chapters
	}
/*
	$("form#input-form").change(function(){

		// Read inputs
		var chapters = new Array()

		var lnum = 1
		while (true) {
			var lelem = $("input[name=l" + lnum + "t]")
			if　( lelem.size() == 0 || lelem.val() == "" ) break
			chapters.push({title: lelem.val(), sections: new Array()})

			var mnum = 1
			while (true) {
				var melemt = $("input[name=l" + lnum + "m" + mnum + "t]")
				if ( melemt.size() == 0 || melemt.val() == "" ) break
				chapters[lnum-1].sections.push({
					title: melemt.val(),
					content: $("textarea[name=l" + lnum + "m" + mnum + "c]").val()
				})
				mnum++
			}

			lnum++
		}

		// Format
		var src = ""

		// table of contents
		src += "<ol>\n"
		for (var i=0; i<chapters.length; i++)
			src += "<li>" + chapters[i].title + "</li>\n"
		src += "</ol>\n\n"

		// contents
		for (var i=0; i<chapters.length; i++) {
			src += "<p><strong><u>" + (i+1) + ". " + chapters[i].title + "</u></strong></p>\n"

			for (var j=0; j<chapters[i].sections.length; j++) {
				src += "<p><u>" + chapters[i].sections[j].title + "</u></p>\n"
				src += itemize(chapters[i].sections[j].content) + "\n"
			}
		}

		$('div#preview').html(src)
		$('textarea#source').val(src)
	})
*/
	/*
	 * Post Nippo
	 */
	
	/*
	$("button#btnPost").click(function(){
		//var formWin = window.open($('input[name=post-url]').val(), "formPage")
		var formWin = window.open("http://intra/sites/skillcompass/freshman2013/Lists/List21/NewForm.aspx", "formPage")
		//var formWin = window.open("form.html", "formPage")
		
		/*
		var postUrl = "http://intra/sites/skillcompass/freshman2013/Lists/List21/NewForm.aspx"
		var data = {
			
		}
		* /

		
		formWin.onload = function() {
			alert("load!")
			$(formWin.document).contents().find("input").each(function(){
				alert("unko")
				if ($(this).attr('title')=="タイトル") {$(this).val($('input[name=title]').val()); alert("koito")}
				if ($(this).attr('title')=="研修テーマ") $(this).val($('input[name=theme]').val())
				if ($(this).attr('title')=="研修担当") $(this).val($('input[name=tanto]').val())
			})
			$(formWin.document).contents().find("textarea").each(function(){
				if ($(this).attr('title')=="研修内容") $(this).val($('div#preview').html())
			})
			//$(formWin.document).contents().find("input[title='研修担当']").val($('input[name=tanto]').val())
			//$(formWin.document).contents().find("textarea").get(0).val($('div#preview').html())
			//$(formWin.document).contents().find('input[name="title1"]').val("unko")
		}
		
	})
	*/
	
})