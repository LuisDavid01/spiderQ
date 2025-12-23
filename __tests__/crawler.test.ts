import { normalizeURL, urlFromHTML } from "../src/tools/crawler"
import { test, expect, describe } from 'vitest'
test('normalizeURL', () => {
	expect(normalizeURL('https://google.com/path')).toBe('google.com/path')

})



test('trailing slashes', () => {
	expect(normalizeURL('https://google.com/path/')).toBe('google.com/path')
})

test('Capitals in URL', () => {
	expect(normalizeURL('https://GOOGLE.com/path/')).toBe('google.com/path')
})

test('HTTP', () => { 
	expect(normalizeURL('http://google.com/path/')).toBe('google.com/path')
})
test('Get urls from html', () => {
	const inputHTML = `
	<html>
		<body>
		<a href="https://luisdavid01.me/path/">
			my site
	    </a>
		</body>
	<//html>
	`
	const baseURL = 'https://luisdavid01.me'
	expect(urlFromHTML(inputHTML, baseURL)).toEqual(['https://luisdavid01.me/path/'])

})
test('Absolute urls', () => {
	const inputHTML = `
	<html>
		<body>
		<a href="/path/">
			my site
	    </a>
		</body>
	<//html>
	`
	const baseURL = 'https://luisdavid01.me'
	expect(urlFromHTML(inputHTML, baseURL)).toEqual(['https://luisdavid01.me/path/'])

})


test('Absolute and relative urls', () => {
	const inputHTML = `
	<html>
		<body>
		<a href="/path/">
			my site
	    </a>
		<a href="https://luisdavid01.me/blog/">
			my blog site
	    </a>
		</body>
	<//html>
	`
	const baseURL = 'https://luisdavid01.me'
	expect(urlFromHTML(inputHTML, baseURL)).toEqual([
		'https://luisdavid01.me/path/',
		'https://luisdavid01.me/blog/'
	])

})

test('Invalid', () => {
	const inputHTML = `
	<html>
		<body>
		<a href="invalid">
			Invalid
	    </a>
		
		</body>
	<//html>
	`
	const baseURL = 'https://luisdavid01.me'
	expect(urlFromHTML(inputHTML, baseURL)).toEqual([])

}) 
