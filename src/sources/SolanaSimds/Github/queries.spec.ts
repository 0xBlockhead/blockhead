import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/SolanaSimds/bindings.ts'
import { Source } from '$/sources/Source.ts'

const httpRuntime = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
	sourceGetText: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => httpRuntime)

const {
	getProposalContents,
	getProposalMarkdownText,
} = await import('$/sources/SolanaSimds/Github/queries.ts')

const binding = bindings[Source.SolanaSimds_Github][0]

describe('Solana SIMDs GitHub queries', () => {
	beforeEach(() => {
		httpRuntime.sourceGetJson.mockReset()
		httpRuntime.sourceGetText.mockReset()
	})

	it('uses the registered repository target', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([])

		await getProposalContents()

		expect(httpRuntime.sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.github.com/repos/solana-foundation/solana-improvement-documents/contents/proposals?ref=main'
		)
	})

	it('fetches the exact Markdown entry discovered for a proposal number', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: '0326-alpenglow.md',
				type: 'file',
				download_url: 'https://raw.githubusercontent.com/solana-foundation/solana-improvement-documents/main/proposals/0326-alpenglow.md',
			},
		])
		httpRuntime.sourceGetText.mockResolvedValueOnce('SIMD')

		await expect(getProposalMarkdownText({ number: 326 })).resolves.toBe('SIMD')
		expect(httpRuntime.sourceGetText).toHaveBeenCalledWith(
			binding,
			'https://raw.githubusercontent.com/solana-foundation/solana-improvement-documents/main/proposals/0326-alpenglow.md'
		)
	})

	it('rejects invalid proposal numbers before requesting the index', async () => {
		await expect(getProposalMarkdownText({ number: -1 })).rejects.toThrow(/invalid proposal number/)
		await expect(getProposalMarkdownText({ number: 1.5 })).rejects.toThrow(/invalid proposal number/)
		await expect(getProposalMarkdownText({ number: Number.MAX_SAFE_INTEGER + 1 })).rejects.toThrow(/invalid proposal number/)
		expect(httpRuntime.sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects directories and duplicate files for one proposal number', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: '0326-directory.md',
				type: 'dir',
				download_url: null,
			},
		])
		await expect(getProposalMarkdownText({ number: 326 })).rejects.toThrow(/not found/)

		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: '0326-alpenglow.md',
				type: 'file',
				download_url: 'https://example.com/first.md',
			},
			{
				name: '0326-other.md',
				type: 'file',
				download_url: 'https://example.com/second.md',
			},
		])
		await expect(getProposalMarkdownText({ number: 326 })).rejects.toThrow(/duplicate files/)
	})

	it('rejects a discovered file whose download URL escapes the bound repository snapshot', async () => {
		httpRuntime.sourceGetJson.mockResolvedValueOnce([
			{
				name: '0326-alpenglow.md',
				type: 'file',
				download_url: 'https://example.com/0326-alpenglow.md',
			},
		])

		await expect(getProposalMarkdownText({ number: 326 })).rejects.toThrow(/does not match the bound repository target/)
		expect(httpRuntime.sourceGetText).not.toHaveBeenCalled()
	})
})
