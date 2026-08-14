import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'


const {
	sourceGetJson,
	sourceGetText,
} = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
	sourceGetText: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
	sourceGetText,
}))

const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
const { default: ethereumEips } = await import('$/resolvers/EthereumEips-Github.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const proposalResolver = ethereumEips.resolvers.find((resolver) => resolver.entityType === EntityType.SpecificationProposal)
const globalResolver = ethereumEips.resolvers.find((resolver) => resolver.entityType === EntityType._Global)
const kindResolver = ethereumEips.resolvers.find((resolver) => resolver.entityType === EntityType.SpecificationProposalKind)
if (proposalResolver == null || globalResolver == null || kindResolver == null)
	throw new Error('Ethereum EIPs proposal resolvers must all be registered')

describe('Ethereum EIPs source binding selection', () => {
	it.each([
		[
			'eip',
			'ethereum/EIPs@master:EIPS',
		],
		[
			'erc',
			'ethereum/ercs@master:ERCS',
		],
	] as const)('selects the %s repository inside the source layer', async (
		ledger,
		targetKey
	) => {
		sourceGetJson.mockResolvedValueOnce([])

		await getContents({ ledger })

		expect(sourceGetJson.mock.calls.at(-1)?.[0].target.key).toBe(targetKey)
	})
})

describe('Ethereum EIPs proposal index', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetText.mockReset()
	})

	it('indexes EIP and ERC files by native number identity and reports the exact directory total', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				{
					type: 'file',
					name: 'eip-2.md',
				},
				{
					type: 'dir',
					name: 'assets',
				},
				{
					type: 'file',
					name: 'README.md',
				},
				{
					type: 'file',
					name: 'eip-1.md',
				},
			])
			.mockResolvedValueOnce([
				{
					type: 'file',
					name: 'erc-20.md',
				},
			])

		const snapshot = await globalResolver.resolve.Scope.resolve({
			scope: '_Global',
		}, context)
		const pageContext = {
			...context,
			pagination: {
				limit: 2,
			},
		}

		expect(snapshot.map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				realm: SpecificationRealm.Ethereum,
				category: ProposalCategory.Eip,
				number: 1,
			},
			{
				realm: SpecificationRealm.Ethereum,
				category: ProposalCategory.Eip,
				number: 2,
			},
			{
				realm: SpecificationRealm.Ethereum,
				category: ProposalCategory.Erc,
				number: 20,
			},
		])
		expect(globalResolver.projections.$$proposals.resolveCount(snapshot, {
			scope: '_Global',
		}, pageContext)).toBe(3)
		expect(globalResolver.projections.$$proposals.select(snapshot, {
			scope: '_Global',
		}, pageContext)).toEqual(snapshot.slice(0, 2))
	})

	it('scopes kind lists to one ledger while preserving the complete ledger total', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				type: 'file',
				name: 'erc-721.md',
			},
			{
				type: 'file',
				name: 'erc-20.md',
			},
		])
		const selector = {
			realm: SpecificationRealm.Ethereum,
			category: ProposalCategory.Erc,
		}
		const pageContext = {
			...context,
			pagination: {
				limit: 1,
				offset: 1,
			},
		}
		const snapshot = await kindResolver.resolve.RealmCategory.resolve(selector, pageContext)

		expect(sourceGetJson).toHaveBeenCalledOnce()
		expect(snapshot.totalCount).toBe(2)
		expect(kindResolver.projections.$$proposals.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					realm: SpecificationRealm.Ethereum,
					category: ProposalCategory.Erc,
					number: 721,
				},
			},
		])
		expect(kindResolver.projections.$$proposals.resolveCount(snapshot)).toBe(2)
	})

	it('rejects padded and unpadded files that collide on the same proposal number', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				type: 'file',
				name: 'eip-1.md',
			},
			{
				type: 'file',
				name: 'eip-01.md',
			},
		])

		await expect(kindResolver.resolve.RealmCategory.resolve({
			realm: SpecificationRealm.Ethereum,
			category: ProposalCategory.Eip,
		}, context)).rejects.toThrow('EthereumEips_Github: duplicate proposal identity Ethereum:Eip:1')
	})

	it('keeps proposal document facts on the native markdown owner', async () => {
		sourceGetText.mockResolvedValueOnce(`---
title: Token Standard
category: ERC
status: Final
---

# ERC-20

See [eip-1.md](./eip-1.md).
`)

		await expect(proposalResolver.resolve.RealmCategoryNumber.resolve({
			realm: SpecificationRealm.Ethereum,
			category: ProposalCategory.Erc,
			number: 20,
		})).resolves.toMatchObject({
			documentCategory: 'ERC',
			documentTitle: 'Token Standard',
			documentStatus: 'Final',
			documentBody: expect.stringContaining('](/proposals/ethereum/eip/eip-1)'),
		})
	})

	it('rejects empty proposal markdown', async () => {
		sourceGetText.mockResolvedValueOnce('   ')

		await expect(proposalResolver.resolve.RealmCategoryNumber.resolve({
			realm: SpecificationRealm.Ethereum,
			category: ProposalCategory.Eip,
			number: 1,
		})).rejects.toThrow('EthereumEips_Github: empty proposal markdown')
	})
})
