import { beforeEach, expect, it, vi } from 'vitest'

const sourceGetJson = vi.hoisted(() => vi.fn())
const sourceGetText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
	sourceGetText,
}))

const caipsQueries = await import('$/sources/Caips/Github/queries.ts')
const ensipsQueries = await import('$/sources/Ensips/Github/queries.ts')
const litecoinLipsQueries = await import('$/sources/LitecoinLips/Github/queries.ts')

const documentSources = [
	{
		name: 'CAIP',
		queries: {
			...caipsQueries,
			getMarkdownText: caipsQueries.getMarkdownTextForNumber,
		},
		number: 2,
		text: '# CAIP 2',
		contentsUrl: 'https://api.github.com/repos/ChainAgnostic/CAIPs/contents/CAIPs?ref=main',
		documentUrl: 'https://raw.githubusercontent.com/ChainAgnostic/CAIPs/main/CAIPs/caip-2.md',
		error: 'CAIP number must be a positive safe integer',
	},
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
		name: 'ENSIP',
		queries: {
			...ensipsQueries,
			getMarkdownText: ensipsQueries.getProposalMarkdownText,
		},
		number: 9,
		text: '# ENSIP 9',
		contentsUrl: 'https://api.github.com/repos/ensdomains/ensips/contents/ensips?ref=master',
		documentUrl: 'https://raw.githubusercontent.com/ensdomains/ensips/master/ensips/9.md',
		error: 'ENSIP number must be a positive safe integer',
	},
	{
		name: 'Litecoin LIP',
		queries: {
			...litecoinLipsQueries,
			getMarkdownText: litecoinLipsQueries.getMediaWikiText,
		},
		number: 2,
		text: 'LIP 2',
		contentsUrl: 'https://api.github.com/repos/litecoin-project/lips/contents/?ref=master',
		documentUrl: 'https://raw.githubusercontent.com/litecoin-project/lips/master/lip-0002.mediawiki',
		error: 'LIP number must be a positive safe integer',
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

it('preserves CAIP download authority and human-document coordinates', async () => {
	const queries = await import('$/sources/Caips/Github/queries.ts')
	sourceGetText.mockResolvedValue('CAIP')

	await expect(queries.getRawMarkdownText({
		fileName: 'caip-10.md',
		downloadUrl: 'https://download.example/caip-10.md',
	})).resolves.toBe('CAIP')
	expect(sourceGetText).toHaveBeenLastCalledWith(
		expect.anything(),
		'https://download.example/caip-10.md'
	)

	await queries.getRawMarkdownText({
		fileName: 'caip-10.md',
		downloadUrl: null,
	})
	expect(sourceGetText).toHaveBeenLastCalledWith(
		expect.anything(),
		'https://raw.githubusercontent.com/ChainAgnostic/CAIPs/main/CAIPs/caip-10.md'
	)
	expect(queries.getHumanDocUrl({ number: 10 })).toBe('https://standards.chainagnostic.org/CAIPs/caip-10')
})

it('reads CAIP namespace profiles from their bound repository and human site', async () => {
	const queries = await import('$/sources/Caips/Namespaces/Github/queries.ts')
	sourceGetJson.mockResolvedValueOnce([])

	await expect(queries.getContents()).resolves.toEqual([])
	expect(sourceGetJson).toHaveBeenCalledWith(
		expect.anything(),
		'https://api.github.com/repos/ChainAgnostic/namespaces/contents/namespaces?ref=main'
	)
	expect(queries.getProfileUrl('eip155')).toBe('https://namespaces.chainagnostic.org/eip155/caip2')
})

it('reads Codex network preset contents and requested raw paths', async () => {
	const queries = await import('$/sources/CodexNetworkPresets/Github/queries.ts')
	sourceGetJson.mockResolvedValueOnce([])
	sourceGetText.mockResolvedValueOnce('preset')

	await expect(queries.getContents()).resolves.toEqual([])
	await expect(queries.getRawText('devnet/config.toml')).resolves.toBe('preset')
	expect(sourceGetJson).toHaveBeenCalledWith(
		expect.anything(),
		'https://api.github.com/repos/codex-storage-network/codex-network-presets/contents/?ref=master'
	)
	expect(sourceGetText).toHaveBeenCalledWith(
		expect.anything(),
		'https://raw.githubusercontent.com/codex-storage-network/codex-network-presets/master/devnet/config.toml'
	)
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
	for (const invalid of [0, 1.5, Number.MAX_SAFE_INTEGER + 1])
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
