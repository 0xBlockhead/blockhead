import { expect, test } from '@playwright/test'
import * as devalue from 'devalue'

import mcpBindings from '$/sources/Mcp/bindings.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const registryServerName = 'ac.inference.sh/inference'
const packagePath = `/mcp/package/registry/${encodeURIComponent(registryServerName)}`
const mcpRegistryBindingId = sourceBindingId(mcpBindings[Source.McpPackageRegistry_Rest][0])

test('renders an exact deleted version while requesting deleted parent latest metadata', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const remoteRequests: string[] = []
	const unexpectedRequests: string[] = []
	await page.route('**/_app/remote/**', async (route) => {
		const requestUrl = route.request().url()
		const url = new URL(requestUrl)
		const payload = url.searchParams.get('payload')
		const decodedPayload = payload == null ? '' : Buffer.from(payload, 'base64url').toString()
		const remoteId = url.pathname.split('/_app/remote/')[1]
		const fulfill = (result: JsonValue) => route.fulfill({
			contentType: 'application/json',
			json: {
				type: 'result',
				data: devalue.stringify({
					_: result,
					q: {
						[`${remoteId}/${payload ?? ''}`]: {
							v: result,
						},
					},
				}),
			},
		})
		if (remoteId.endsWith('/sourceRuntimeCapabilities') && payload == null) {
			remoteRequests.push(`${route.request().method()} ${requestUrl} sourceRuntimeCapabilities`)
			await fulfill({ enabledServerBindingIds: [mcpRegistryBindingId] })
			return
		}
		if (
			decodedPayload.includes(registryServerName)
			&& (decodedPayload.includes('latest') || decodedPayload.includes('1.0.0'))
		) {
			remoteRequests.push(`${route.request().method()} ${requestUrl} ${decodedPayload}`)
			const result = {
				server: {
					name: registryServerName,
					description: 'Deleted MCP fixture',
					title: 'inference.sh',
					version: '1.0.0',
				},
				_meta: {
					'io.modelcontextprotocol.registry/official': {
						status: 'deleted',
						publishedAt: '2026-04-13T17:17:43.522108Z',
						isLatest: true,
					},
				},
			}
			await fulfill(result)
			return
		}

		unexpectedRequests.push(`${route.request().method()} ${requestUrl} ${decodedPayload}`)
		await route.fulfill({ body: 'Unexpected MCP remote fixture request', status: 418 })
	})
	await page.route('**/api-proxy/**', async (route) => {
		unexpectedRequests.push(`${route.request().method()} ${decodeURIComponent(route.request().url())}`)
		await route.fulfill({ body: 'Unexpected MCP proxy fixture request', status: 418 })
	})
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-mcp-registry-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.goto(packagePath)
	const packageHeading = page.getByRole('heading', { name: 'inference.sh' })
	await expect(packageHeading.or(page.getByText('This section could not be loaded.'))).toBeAttached({ timeout: 120_000 })
	if (!await packageHeading.isVisible()) {
		throw new Error([
			`main: ${await page.locator('#main').innerText()}`,
			`remote requests:\n${remoteRequests.join('\n')}`,
			`unexpected requests:\n${unexpectedRequests.join('\n')}`,
		].join('\n'))
	}
	await expect(page.getByText(registryServerName, { exact: true })).toBeVisible()

	await page.goto(`${packagePath}/version/1.0.0`)
	await expect(page.getByRole('heading', { name: '1.0.0' })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('deleted', { exact: true }).first()).toBeVisible()
	await expect(page.getByText('4/13/2026, 10:17:43 AM', { exact: true })).toBeVisible()
	expect(remoteRequests.some((request) => request.includes('"latest"')), `remote requests:\n${remoteRequests.join('\n')}\nunexpected requests:\n${unexpectedRequests.join('\n')}`).toBe(true)
	expect(remoteRequests.some((request) => request.includes('"1.0.0"')), `remote requests:\n${remoteRequests.join('\n')}\nunexpected requests:\n${unexpectedRequests.join('\n')}`).toBe(true)
	expect(unexpectedRequests, `remote requests:\n${remoteRequests.join('\n')}\nunexpected requests:\n${unexpectedRequests.join('\n')}`).toEqual([])
})
