// author:	Jason DeShazer
// date:	1/25/2015

// this function is used to contstruct the API request and
// add the script tag that performs the request to the head
// of the document

function searchImages(site, search, opts) {
	var queryURL = (opts.ssl ? "https" : "http") + "://" + site;
	queryURL += "/w/api.php";
	queryURL += "?format=json";
	queryURL += "&action=query";
	queryURL += "&titles=" + encodeURIComponent(search);
	queryURL += "&prop=revisions";
	queryURL += "&rvprop=content";
	queryURL += "&list=allimages";
	queryURL += "&aifrom=" + encodeURIComponent(search);
	queryURL += "&ailimit=" + (opts.limit || 10);
	queryURL += "&aicontinue=" + (opts.cont || "");
	queryURL += "&aisort=name";
		
	var searchImageScript = document.createElement("script");
	searchImageScript.setAttribute("type", "text/javascript");
	searchImageScript.setAttribute("src", queryURL + "&callback=" + opts.callback);
	document.head.appendChild(searchImageScript);
}

// this function is a callback and is triggered when the search request
// comes back from mediaWiki's API
// it iterates over the returned data and calls helper methods
// to render the UI components

function cbSearchImages(data) {
	for(var image in data.query.allimages) {		
		renderImage(
			data.query.allimages[image].url,
			data.query.allimages[image].descriptionurl,
			data.query.allimages[image].name
		);
	}
	renderContinueButton(
		data['query-continue'].allimages.aicontinue,
		data.query.normalized[0].from
	);
}

// renders the continue button
// sets a click listener that allows the user to continue their query

function renderContinueButton(cont, search) {
	var continueButton = document.createElement("button");
	continueButton.innerHTML = "click to add more results";
	continueButton.onclick = function() {
		searchImages("en.wikipedia.org", search, {
			ssl: true,
			limit: 10,
			cont: cont,
			callback: "cbSearchImages"
		});
	}
	document.getElementById("continue-button-container").innerHTML = "";
	document.getElementById("continue-button-container").appendChild(continueButton);
}

// renders the image components
// this function is called for every image that is returned by the API

function renderImage(thumburl, descriptionurl, name) {
	var result = "<tr>";
	result +=    "	<td><img src='"+thumburl+"' alt='"+thumburl+"'></td>";
	result +=    "	<td><a href='"+descriptionurl+"'>"+name+"</a></td>";
	result +=    "</tr>";
	
	document.getElementById("search-results").innerHTML += result;
}

// this event listener is fired when the search-form is submitted
// it initiates the first search for the page

document.getElementById("search-form").onsubmit = function() {
	searchImages("en.wikipedia.org", this["search-field"].value, {
		ssl: true,
		limit: 10,
		callback: "cbSearchImages"
	});
	return false;
}