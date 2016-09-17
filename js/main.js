(function(){
	var app = {};

	/**
	 * @description - making a function that will be use to render template in the page
	 */
	app.render = (function(cont, temp, view){
		document.getElementById(cont).innerHTML = "";
		var template = document.getElementById(temp).innerHTML;
	  var output = Mustache.render(template, view);
	  document.getElementById(cont).innerHTML = output;
	});

	/**
	 * @description - populating list of data in the page.
	 */
	$.getJSON("https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites", function(data){
		app.data = data;		
		app.render("websites", "details", data);
	});

	/**
	 * @description - pushing data via api
	 */
	 $(".btn.push").on("click", function() {
		 	var title = $("#title").val();
		 	var url = $("#url").val();
		 	var tag = $("#tag").val();
	 		$("#title").css("border", "none");
			$("#url").css("border", "none");
			$("#tag").css("border", "none");
		 	if(title && url && tag) {
				$.getJSON("https://hackerearth.0x10.info/api/one-push?type=json&query=push&title="+
					title+"&url="+url+"&tag="+tag, function(data){
					if(data.status == "403") {
						$("#message").addClass("bg-danger");
						$("#message").html(data.message);
					} else {
						$("#message").html(data.message);
					}
				});
		 	} else {
		 		if(!title) 
		 			$("#title").css("border", "1px solid red");
		 		if(!url) 
		 			$("#url").css("border", "1px solid red");
		 		if(!tag) 
		 			$("#tag").css("border", "1px solid red");
		 	}
	 });
	
	 app.escapeString = function(word) {
      var regSpclKey = { "*" : "\\\*", "-" : "\\\-", "+" : "\\\+", "=" : "\\\=", "<" : "\\\<", ">" : "\\\>",
             "!" : "\\\!", "&" : "\\\&", "," : "\\\,", "(" : "\\\(", ")" : "\\\)", "/" : "\\\/", "\\" : "\\\\"};

      if(word.constructor === Array)
        word = word[0];

      word = word.split('');
      for(var i=0; i<word.length; i++) {
        if(regSpclKey.hasOwnProperty(word[i])) {
          word[i] = regSpclKey[word[i]];
        }
      }
      //return new Array(word.join(''));
      return word.join('');
   };

	 $("#search").on("keyup", function(event){
	 	var sortedData = [];
	 	if(event.target.value.length > 0) {
	
   	 var word = app.escapeString(event.target.value),
         reg = new RegExp('^'+word +'|'+ word +'|'+word+'$', 'ig');

      sortedData.length = 0;   
      for(var i = 0; i<app.data.websites.length; i++) {
          var data = app.data.websites[i],
          		str =  data.title + " " + data.tag + " " + data.url_address,
              res = str.match(reg);

          if(res && typeof res !== "undefined") {
            sortedData.push(data);
          }
      }

      if(sortedData.length > 0) {
      	app.render("websites", "details", {websites:sortedData});
      } else {
      	document.getElementById("websites").innerHTML = "<div>Sorry...! No records found !!</div>";
      }
	 	} else {
	 		app.render("websites", "details", app.data);
	 	}
	 });	

})();