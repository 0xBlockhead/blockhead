import { beforeEach, expect, it, vi } from 'vitest'

const sourceGetJson = vi.hoisted(() => vi.fn())
const sourceGetText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
	sourceGetText,
}))

const documentSources = [
	{
		name: 'Cosmos ADR',
		queries: await import('$/sources/CosmosAdrs/Github/queries.ts'),
		number: 7,
		text: '# ADR 007',
		contentsUrl: 'https://api.github.com/repos/cosmos/cosmos-sdk/contents/docs/architecture?ref=main',
		documentUrl: 'https://raw.githubusercontent.com/cosmos/cosmos-sdk/main/docs/architecture/adr-007.md',
		error: 'ADR number must be a positive safe integer',
	},
	{
		name: 'Near NEP',
		queries: await import('$/sources/NearNeps/Github/queries.ts'),
		number: 171,
		text: '# NEP 171',
		contentsUrl: 'https://api.github.com/repos/near/NEPs/contents/neps?ref=master',
		documentUrl: 'https://raw.githubusercontent.com/near/NEPs/master/neps/nep-0171.md',
		error: 'NEP number must be a positive safe integer',
	},
	{
		name: 'Polkadot RFC',
		queries: await import('$/sources/PolkadotRfcs/Github/queries.ts'),
		number: 42,
		text: '# RFC 42',
		contentsUrl: 'https://api.github.com/repos/polkadot-fellows/RFCs/contents/text?ref=main',
		documentUrl: 'https://raw.githubusercontent.com/polkadot-fellows/RFCs/main/text/0042.md',
		error: 'RFC number must be a positive safe integer',
	},
] as const

beforeEach(() => {
	vi.clearAllMocks()
})

it.each(documentSources)('reads and validates $name coordinates', async ({
	queries,
	number,
	text,
	contentsUrl,
	documentUrl,
	error,
}) => {
	sourceGetJson.mockResolvedValueOnce([])
	sourceGetText.mockResolvedValueOnce(text)

	await expect(queries.getContents()).resolves.toEqual([])
	await expect(queries.getMarkdownText({ number })).resolves.toBe(text)
	expect(sourceGetJson).toHaveBeenCalledWith(expect.anything(), contentsUrl)
	expect(sourceGetText).toHaveBeenCalledWith(expect.anything(), documentUrl)

	vi.clearAllMocks()
	for (const invalid of [0, Number.MAX_SAFE_INTEGER + 1])
		expect(() => queries.getMarkdownText({ number: invalid })).toThrow(error)
	expect(sourceGetText).not.toHaveBeenCalled()
})

it('reads and validates Dogecoin DIP coordinates', async () => {
	const queries = await import('$/sources/DogecoinDips/Github/queries.ts')
	sourceGetJson.mockResolvedValueOnce([])
	sourceGetText.mockResolvedValueOnce('DIP')

	await expect(queries.getContents()).resolves.toEqual([])
	await expect(queries.getMediaWikiText({ number: 70 })).resolves.toBe('DIP')
	expect(sourceGetJson).toHaveBeenCalledWith(
		expect.anything(),
		'https://api.github.com/repos/dogecoin/dips/contents/?ref=master'
	)
	expect(sourceGetText).toHaveBeenCalledWith(
		expect.anything(),
		'https://raw.githubusercontent.com/dogecoin/dips/master/dip-0070.mediawiki'
	)

	vi.clearAllMocks()
	for (const number of [0, Number.MAX_SAFE_INTEGER + 1])
		expect(() => queries.getMediaWikiText({ number })).toThrow('DIP number must be a positive safe integer')
	expect(sourceGetText).not.toHaveBeenCalled()
})
