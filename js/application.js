


$(function(){
	
	/*
	 * Add Section Function
	 */
	$(document).on('click', "button.btnAddSection", function(){
		var nums = $(this).attr('value').split('-')
		var lnum = Number(nums[0])
		var mnum = Number(nums[1])
		
		addSection(lnum, mnum)
	})

	function addSection(lnum, mnum) {
		mnum++
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
		
		$("button#btnRestore").attr("disabled", "disabled")
		$("button#btnAddSection" + lnum).attr('value', lnum + '-' + mnum)
	}
	
	/*
	 * Add Chapter Function
	 */
	$(document).on('click', "button.btnAddChapter", function(){
		var num = Number($(this).attr('value'))
		addChapter(num)
	})

	function addChapter(num) {
		num++

		$("button.btnAddChapter").before(" \
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
            <button id='btnAddSection" + num + "' class='btn btnAddSection' type='button' value='" + num + "-1'>Add Section</button> \
          </div> \
        </div>\
      </div>\
    </fieldset> \
  </div>\
</div>\
		")
		
		$("button.btnRestore").attr("disabled", "disabled")
		$("button.btnAddChapter").attr('value', num)
	}


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

	function itemize(content) {
		var items = content.split("\n")
		var text = "<ul>\n"
		for (var i=0; i<items.length; i++)
			text += "<li>" + $('<div/>').text(items[i]).html() + "</li>\n"
		text += "</ul>\n"
		return text
	}

	/*
	 * Save
	 */
	$("button#btnSave").click(function(){
		localStorage['nippog-input'] = JSON.stringify(getChapters())
		alert("OK!")
	})

	/*
	 * Restore
	 */
	$("button#btnRestore").click(function(){
		if (!localStorage['nippog-input']) {
			alert("Not Saved")
			return
		}

		var chapters = JSON.parse(localStorage['nippog-input'])
		for (var i=0; i<chapters.length; i++) {
			if ( i>0 ) addChapter(i)
			$("input[name=l" + (i+1) + "t]").val(chapters[i].title)

			var sections = chapters[i].sections
			for (var j=0; j<sections.length; j++) {
				if ( j>0 ) addSection(i+1, j)
				$("input[name=l" + (i+1) + "m" + (j+1) + "t]").val(sections[j].title)
				$("textarea[name=l" + (i+1) + "m" + (j+1) + "c]").val(sections[j].content)
			}
		}

		$("button#btnRestore").attr("disabled", "disabled")
		localStorage.removeItem('nippog-input')
	})
	
})