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
		if (line.trim() == "") { continue; }
		let name = line.split(" ")[0];
		let link = line.split(" ")[1];
		list_html += `<li><a href=${fix_url(link)}>${name}</a></li>`;
		member_count++;
	}

	list_element.innerHTML = list_html;

	let count_element = document.getElementById("members_count");
	count_element.textContent = member_count;
}

function copy(text_to_copy) {
	if (text_to_copy == "nav") { text_to_copy = `<p id="soweliring"><a href="https://thedressedmolerat.github.io/webring?name=NAME&to=skipprevious">⇇</a> <a href="https://thedressedmolerat.github.io/webring?name=NAME&to=previous">⮜</a> <a href="https://thedressedmolerat.github.io/webring?to=random">⇅</a> <a href="https://thedressedmolerat.github.io/webring">soweli ring</a> <a href="https://thedressedmolerat.github.io/webring?name=NAME&to=next">⮞</a> <a href="https://thedressedmolerat.github.io/webring?name=NAME&to=skipprevious">⇉</a></p>`; }

	navigator.clipboard.writeText(text_to_copy);
}

// wow promise chaining is wild
fetch('EVERYONE.txt').then(fetch_response => fetch_response.text()).then(display_members);

// handle query strings here