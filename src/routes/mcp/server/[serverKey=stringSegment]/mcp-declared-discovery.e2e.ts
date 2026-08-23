import { expect, test } from '@playwright/test'

test('declared MCP server route exposes the existing navigable surface', async ({ page }) => {
	const methods: string[] = []
	page.on('request', (request) => {
		if (request.method() === 'POST')
			methods.push(request.postDataJSON()?.method)
	})

	await page.goto('/mcp/server/fake-server')
	await expect(page.getByText('mcp server', { exact: false }).first()).toBeVisible()
	await expect(page.getByText('local runtime unavailable', { exact: false })).toBeVisible()
	expect(methods).not.toContain('tools/call')
})
