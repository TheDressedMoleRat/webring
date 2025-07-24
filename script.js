let members_names = [];
let members_links = [];
let page_loaded = false;
const offsets = { "next": 1, "previous": -1, "skipnext": 2, "skipprevious": -2 }

function fix_url(url) {
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	} else {
		return 'https://' + url;
	}
}

function display_members(fetched_text) {
	let list_element = document.getElementById("members_list");
	let list_html = "";
	let member_count = 0;

	for (const line of fetched_text.split("\n")) {
		if (line.trim() == "" || line.startsWith("//")) { 
			continue; 
		}

		const colon_index = line.indexOf(":");
		const name = line.slice(0, colon_index).trim();
		const website = line.slice(colon_index + 1).trim();

		list_html += `<li><a href=${fix_url(website)}>${name}</a></li>`;
		members_names.push(name);
		members_links.push(fix_url(website));
		member_count++;
	}

	list_element.innerHTML = list_html;

	let count_element = document.getElementById("members_count");
	count_element.textContent = member_count;
}

function copy(text_to_copy) {
	if (text_to_copy == "nav") { text_to_copy = `<p id="soweliring"><a href="https://thedressedmolerat.github.io/webring?name=NAME&to=skipprevious">⇇</a> <a href="https://thedressedmolerat.github.io/webring?name=NAME&to=previous">&lt;</a> <a href="https://thedressedmolerat.github.io/webring?to=random">⇅</a> <a href="https://thedressedmolerat.github.io/webring">soweli ring</a> <a href="https://thedressedmolerat.github.io/webring?name=NAME&to=next">&gt;</a> <a href="https://thedressedmolerat.github.io/webring?name=NAME&to=skipnext">⇉</a></p>`; }

	let name_value = document.getElementById("user_name").value;
	let updated = text_to_copy.replaceAll("NAME", encodeURIComponent(name_value));
	navigator.clipboard.writeText(updated);
}

// ########################################################################## //

// wow promise chaining is wild

fetch('EVERYONE.txt')
	.then(fetch_response => fetch_response.text())
	.then(display_members)
	.then(() => {

	// redirect
	const url_parameters = new URLSearchParams(window.location.search);

	let url_name = url_parameters.get("name");
	let url_to = url_parameters.get("to");

	let target_url = "";

	if (url_to == "random") {
		target_url = members_links[Math.floor(Math.random()*members_links.length)];
	} else if (url_to in offsets) {
		let current_index = 0;

		// neither members_names or url_name are url encoded
		if (members_names.includes(url_name)) {
			current_index = members_names.indexOf(url_name);
			let target_index = current_index + offsets[url_to];
			target_index = (target_index + members_names.length) % members_names.length;
			target_url = members_links[target_index];
		} else {
			(url_name == "NAME" ) ? alert(`Replace "NAME" in the URL with your name in the ring!`)
			: alert(`"${url_name}" does not exist in the members list!`);
		}
	} else if (url_to != null) {
		alert(`${url_to} isn't a valid to-value. Valid to-values are: ${Object.keys(offsets).join(", ")}`);
	}

	if (target_url) {
		window.location.replace(target_url);
	} else {
		document.getElementById("container").style.display = "block";
		document.getElementById("redirecting").style.display = "none";
		document.body.style.backgroundColor = "#32286f";
	}
})