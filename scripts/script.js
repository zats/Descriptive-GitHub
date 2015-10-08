'use strict';

function addDescription(link, completion) {
	var name = link.text;
	var id = idForRepoNamed(name);
	var description = descriptionForId(id);
	if (description || description == "") {
		completion(description);
	} else {
		$.getJSON("https://api.github.com/repos/" + id, function(data){
			var description = data["description"];
			if (description === undefined || description === null) {
				description = "";
			}
			setDescriptionForId(id, description);
			completion(description);
		});
	}
}

function idForRepoNamed(name) {
	return name.toLowerCase();
}

function descriptionForId(id) {
	return localStorage[id];
}

function setDescriptionForId(id, description) {
	localStorage[id] = description;
}

function recursiveDescriptionFetcher(links) {
	if (!links.length) {
		return;
	}
	var link = links[0];
	addDescription(link, function(data){
		$("<span class=\"time\">" + data + "</span>").insertAfter($(link).parent().parent());
		links.shift();
		recursiveDescriptionFetcher(links);
	})
}

if (!localStorage.descriptions) {
	localStorage.descriptions = {}
}

var repoLinks = $("a[data-ga-click*='target:repo']").toArray();

recursiveDescriptionFetcher(repoLinks);