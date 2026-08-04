import {
	describe,
	expect,
	it,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	evmDomainSupportByDomainId,
	evmDomainSupports,
	solanaDomainSupport,
	solanaDomainSupportByDomainId,
	stellarDomainSupport,
	stellarDomainSupportByDomainId,
} from '$/sources/CircleCctp/Catalog/constants.ts'
import { Source } from '$/sources/Source.ts'

const { default: circleCctpContractsEvm } = await import('$/resolvers/CircleCctpContracts-Evm.ts')
const { default: circleCctpContractsSolana } = await import('$/resolvers/CircleCctpContracts-Solana.ts')
const { default: circleCctpContractsStellar } = await import('$/resolvers/CircleCctpContracts-Stellar.ts')

describe('Circle CCTP contract catalogs', () => {
	it('keeps unique V2 domain ids across EVM rows and known non-EVM domains', () => {
		expect(new Set(evmDomainSupports.map((row) => row.domainId)).size).toBe(evmDomainSupports.length)
		expect(evmDomainSupportByDomainId[0]).toMatchObject({
			name: 'Ethereum',
			chainId: 1,
			tokenMessengerAddress: '0x28b5a0e9c621a5badaa536219b3a228c8168cf5d',
		})
		expect(evmDomainSupportByDomainId[28]?.tokenMessengerAddress).toBe('0x98706a006bc632df31cadfcbd43f38887ce2ca5c')
		expect(solanaDomainSupportByDomainId[5]).toEqual(solanaDomainSupport)
		expect(stellarDomainSupportByDomainId[27]).toEqual(stellarDomainSupport)
		expect(evmDomainSupportByDomainId[5]).toBeUndefined()
		expect(solanaDomainSupportByDomainId[0]).toBeUndefined()
		expect(stellarDomainSupportByDomainId[0]).toBeUndefined()
	})

	it('resolves schema-shaped CctpDomainSupport rows for each contract source', async () => {
		expect(circleCctpContractsEvm.source).toBe(Source.CircleCctpContracts_Evm)
		expect(circleCctpContractsSolana.source).toBe(Source.CircleCctpContracts_Solana)
		expect(circleCctpContractsStellar.source).toBe(Source.CircleCctpContracts_Stellar)

		const evmResolver = circleCctpContractsEvm.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpDomainSupport
		))
		const solanaResolver = circleCctpContractsSolana.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpDomainSupport
		))
		const stellarResolver = circleCctpContractsStellar.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpDomainSupport
		))
		if (evmResolver == null || solanaResolver == null || stellarResolver == null)
			throw new Error('missing CctpDomainSupport resolvers')

		await expect(evmResolver.resolve.CctpVersionDomainId.resolve({
			cctpVersion: 2,
			domainId: 0,
		})).resolves.toMatchObject({
			cctpVersion: 2,
			domainId: 0,
			name: 'Ethereum',
			$network: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			},
			supportedTokens: ['USDC'],
			tokenMinterAddress: '0xfd78ee919681417d192449715b2594ab58f5d002',
		})

		await expect(solanaResolver.resolve.CctpVersionDomainId.resolve({
			cctpVersion: 2,
			domainId: 5,
		})).resolves.toMatchObject({
			name: 'Solana',
			tokenMessengerAddress: solanaDomainSupport.tokenMessengerAddress,
			messageTransmitterAddress: solanaDomainSupport.messageTransmitterAddress,
			$network: {
				[EntityMetaKey.Selector]: {
					caip2: solanaDomainSupport.caip2,
				},
			},
		})

		await expect(stellarResolver.resolve.CctpVersionDomainId.resolve({
			cctpVersion: 2,
			domainId: 27,
		})).resolves.toMatchObject({
			name: 'Stellar',
			forwardingDestination: true,
			$network: {
				[EntityMetaKey.Selector]: {
					slug: 'stellar',
				},
			},
		})

		await expect(evmResolver.resolve.CctpVersionDomainId.resolve({
			cctpVersion: 2,
			domainId: 5,
		})).rejects.toThrow('no EVM CCTP domain')
	})
})
