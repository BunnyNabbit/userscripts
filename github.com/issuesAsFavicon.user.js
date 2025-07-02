// ==UserScript==
// @name Issues as favicon
// @namespace https://bunnynabbit.com
// @version 1.1.1
// @description Sets the favicon in issue pages to match that issue's state
// @author BunnyNabbit "Aon Langton"
// @match https://github.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant none
// ==/UserScript==

;(function () {
	"use strict"
	setInterval(() => {
		try {
			const initialString = document.querySelector('[data-testid="header-state"]').children[0].outerHTML.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
			const svgDocument = new DOMParser().parseFromString(initialString, "text/xml")
			let color = attemptGetIssueColor()
			if (color) svgDocument.querySelector("svg").setAttribute("fill", color)
			document.querySelector('[rel="icon"]').setAttribute("href", "data:image/svg+xml," + new XMLSerializer().serializeToString(svgDocument))
		} catch (err) {}
	}, 1000)
	let loggedError = false
	function attemptGetIssueColor() {
		try {
			const preloadedQueries = JSON.parse(document.querySelector("react-app > script").innerText).payload.preloadedQueries
			let color = null
			preloadedQueries.forEach((query) => {
				if (query.queryName !== "IssueViewerViewQuery") return
				const tags = query.result.data.repository.issue.labels.edges
				if (tags.length) {
					color = `rgb(${[0, 2, 4].map((val) => parseInt(tags[0].node.color.slice(0 + val, 2 + val), 16)).join()})`
				}
			})
			return color
		} catch (err) {
			if (!loggedError) {
				console.error("Failed to get issue color.", err)
				loggedError = true
			}
		}
	}
})()
