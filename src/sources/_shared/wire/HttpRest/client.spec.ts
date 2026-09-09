import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Pendle/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Pendle_Rest][0]
const endpointLocator = vi.hoisted(() => ({ value: 'https://api-v2.pendle.finance/core' }))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => endpointLocator.value,
	sourceFetch: vi.fn(),
	sourceGetJson: vi.fn(),
	sourceGetText: vi.fn(),
}))

const { httpUrl } = await import('$/sources/_shared/wire/HttpRest/client.ts')

describe('httpUrl', () => {
	beforeEach(() => {
		endpointLocator.value = 'https://api-v2.pendle.finance/core'
	})

	it.each([
		['relative paths retain the endpoint base path', 'v2/markets/all', 'https://api-v2.pendle.finance/core/v2/markets/all'],
		['empty paths retain the endpoint URL', '', 'https://api-v2.pendle.finance/core'],
		['query-only paths retain the endpoint pathname', '?page=2', 'https://api-v2.pendle.finance/core?page=2'],
		['absolute URLs remain native URL overrides', 'https://example.test/other', 'https://example.test/other'],
		['root-relative paths remain native URL overrides', '/health', 'https://api-v2.pendle.finance/health'],
		['protocol-relative paths remain native URL overrides', '//example.test/health', 'https://example.test/health'],
		['hash-only paths retain the endpoint pathname', '#section', 'https://api-v2.pendle.finance/core#section'],
	])('%s', (_label, path, expected) => {
		expect(httpUrl(binding, path)).toBe(expected)
	})

	it.each([
		['https://example.test/core', 'https://example.test/core/v1/items'],
		['https://example.test/core/', 'https://example.test/core/v1/items'],
		['https://example.test/core?key=value', 'https://example.test/core/v1/items'],
		['https://example.test/core#fragment', 'https://example.test/core/v1/items'],
	])('normalizes the pathname for a relative path with base %s', (base, expected) => {
		endpointLocator.value = base
		expect(httpUrl(binding, 'v1/items')).toBe(expected)
	})

	it('adds query parameters after resolving the path', () => {
		expect(httpUrl(binding, 'v2/markets/all', { chainId: 1, preview: false }))
			.toBe('https://api-v2.pendle.finance/core/v2/markets/all?chainId=1&preview=false')
	})
})
