import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { SourceDelivery, SourceEndpointKind } from '../../src/sources/SourceBinding.ts'
import { app } from '../../APP.ts'
import { compileApp, productionHttpOrigins } from './generate.ts'

const endpoint = (locator: string, endpointKind = SourceEndpointKind.HttpUrl) => ({ endpointKind, locator })
const binding = (delivery: SourceDelivery, locator: string, credentials: readonly unknown[] = []) => ({
	delivery,
	credentials,
	endpoints: [endpoint(locator)],
})

describe('production security policy', () => {
	it('keeps concrete credential-free HTTP origins for eligible deliveries', () => {
		assert.deepEqual(productionHttpOrigins([
			binding(SourceDelivery.BrowserDirect, 'https://api.example.test/v1'),
			binding(SourceDelivery.HttpProxy, 'http://localhost:8080/rpc'),
		]), ['http://localhost:8080', 'https://api.example.test'])
	})

	it('rejects near-miss origins and bindings', () => {
		assert.deepEqual(productionHttpOrigins([
			binding(SourceDelivery.BrowserDirect, 'https://*.example.test'),
			binding(SourceDelivery.BrowserDirect, 'https://api.example.test/{id}'),
			binding(SourceDelivery.BrowserDirect, 'https://user:secret@api.example.test'),
			binding(SourceDelivery.BrowserDirect, 'env:API_URL'),
			binding(SourceDelivery.BrowserDirect, 'ftp://api.example.test'),
			binding(SourceDelivery.BrowserDirect, 'https://secret.example.test', [{}]),
			binding(SourceDelivery.ServerOnly, 'https://server.example.test'),
			binding(SourceDelivery.BrowserDirect, 'ws://socket.example.test'),
		]), [])
	})

	it('generates the shared CSP from compiled source bindings without dead headers', () => {
		const policyFile = compileApp(app).generatedFiles.find(({ path }) => (
			path === 'scripts/app/production-security-headers.json'
		))
		assert.equal(policyFile?.kind, 'text')
		if (policyFile?.kind !== 'text')
			return

		const headers = JSON.parse(policyFile.body.join('\n'))
		assert.deepEqual(Object.keys(headers), ['Content-Security-Policy'])
		assert.match(headers['Content-Security-Policy'], /connect-src 'self' http:\/\/127\.0\.0\.1:\*/)
		assert.doesNotMatch(headers['Content-Security-Policy'], /connect-src[^;]* https:(?:\s|;)/)
	})
})
