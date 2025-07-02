// ==UserScript==
// @name "Who Can Join Me in Experiences" Toggle
// @version 1.0.0
// @match https://*.roblox.com/*
// @icon https://bunnynabbit.com/app/defuse/bomb.png
// @namespace https://bunnynabbit.com
// @grant none
// ==/UserScript==

;(function () {
	const onBehavior = "All" // Available: All, Followers, Following, Friends
	const offBehavior = "NoOne"
	let check = false
	if (localStorage.getItem("defuse.joins") == null) localStorage.setItem("defuse.joins", "0")
	if (Date.now() - localStorage.getItem("defuse.joins") > 10000) check = true

	const navBar = document.getElementsByClassName("nav navbar-right rbx-navbar-icon-group")[0]
	const li = document.createElement("li")
	li.className = "navbar-icon-item"
	li.innerHTML = `<button type="button" class="btn-navigation-nav-robux-md" id="toggleJoins"><span id="nav-report-icon" class="nav-robux-icon rbx-menu-item"><span class="icon-flag" id="nav-joins-icon"></span><span class="rbx-text-navbar-right text-header" id="nav-report-amount">...</span></span></button>`
	navBar.append(li)
	const amount = document.getElementById("nav-report-amount")
	const icon = document.getElementById("nav-joins-icon")
	function updateIcon() {
		if (amount.innerText == offBehavior) {
			icon.className = "icon-flag"
		} else {
			icon.className = "icon-share"
		}
	}
	if (check) {
		$.ajax({
			url: `https://apis.roblox.com/user-settings-api/v1/user-settings`,
			contentType: "application/json",
		})
			.then((data) => {
				amount.innerText = `${data.whoCanJoinMeInExperiences}`

				localStorage.setItem("defuse.joins", `${Date.now()}`)
				localStorage.setItem("defuse.joinsCache", amount.innerText)
				updateIcon()
			})
			.fail((error) => {
				console.log(error)
			})
	} else {
		amount.innerText = localStorage.getItem("defuse.joinsCache")
		updateIcon()
	}
	toggleJoins.onclick = function () {
		let toggle = offBehavior
		if (localStorage.getItem("defuse.joinsCache") == offBehavior) toggle = onBehavior
		$.ajax({
			method: "POST",
			url: `https://apis.roblox.com/user-settings-api/v1/user-settings`,
			contentType: "application/json",
			data: JSON.stringify({
				whoCanJoinMeInExperiences: toggle,
			}),
		})
			.then((data) => {
				localStorage.setItem("defuse.joins", `${Date.now()}`)
				localStorage.setItem("defuse.joinsCache", toggle)
				amount.innerText = toggle
				updateIcon()
			})
			.fail((error) => {
				console.log(error)
			})
	}
})()
