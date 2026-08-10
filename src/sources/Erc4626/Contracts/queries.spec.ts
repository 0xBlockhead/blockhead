import { describe, expect, it, vi } from 'vitest'

import {
	getErc4626VaultBlockState,
	getErc4626VaultIdentity,
} from '$/sources/Erc4626/Contracts/queries.ts'


const vaultAddress = '0x1111111111111111111111111111111111111111'
const assetAddress = '0x2222222222222222222222222222222222222222'

const uint256Result = (value: bigint) => `0x${value.toString(16).padStart(64, '0')}`
const addressResult = (address: string) => `0x${address.slice(2).padStart(64, '0')}`


describe('ERC-4626 contract reads', () => {
	it('identifies a vault through the standard asset call', async () => {
		const getCall = vi.fn().mockResolvedValue(addressResult(assetAddress))

		await expect(getErc4626VaultIdentity({
			getCall,
			vaultAddress,
		})).resolves.toEqual({
			vaultAddress,
			assetAddress,
		})
		expect(getCall).toHaveBeenCalledWith({
			to: vaultAddress,
			input: '0x38d52e0f',
			blockTag: 'latest',
		})
	})

	it('reads total assets and supply at the exact selected block', async () => {
		const getCall = vi.fn()
			.mockResolvedValueOnce(uint256Result(123n))
			.mockResolvedValueOnce(uint256Result(456n))

		await expect(getErc4626VaultBlockState({
			getCall,
			vaultAddress,
			blockNumber: 42n,
		})).resolves.toEqual({
			vaultAddress,
			blockNumber: 42n,
			totalAssets: 123n,
			totalSupply: 456n,
		})
		expect(getCall.mock.calls.map(([call]) => call)).toEqual([
			{
				to: vaultAddress,
				input: '0x01e1d114',
				blockTag: '0x2a',
			},
			{
				to: vaultAddress,
				input: '0x18160ddd',
				blockTag: '0x2a',
			},
		])
	})

	it('rejects empty identity and block responses', async () => {
		await expect(getErc4626VaultIdentity({
			getCall: vi.fn().mockResolvedValue('0x'),
			vaultAddress,
		})).rejects.toThrow('empty asset result')
		await expect(getErc4626VaultBlockState({
			getCall: vi.fn().mockResolvedValue('0x'),
			vaultAddress,
			blockNumber: 42n,
		})).rejects.toThrow(/empty totalAssets result|empty totalSupply result/)
	})
})
