import { describe, expect, it } from 'vitest'

import {
	parseFarcasterUrlIngress,
	verifyFarcasterIngressCast,
} from './farcasterUrlIngress.ts'


describe('Farcaster URL ingress', () => {
	it.each([
		[
			'https://farcaster.xyz/~/profiles/3',
			{
				kind: 'profile',
				fid: 3,
			},
		],
		[
			'https://warpcast.com/~/channel/ethereum',
			{
				kind: 'channel',
				channelId: 'ethereum',
			},
		],
		[
			'https://FARCASTER.XYZ/Vitalik/0xABCDEF12',
			{
				kind: 'cast',
				clientUrl: 'https://farcaster.xyz/vitalik/0xabcdef12',
				username: 'vitalik',
				hashPrefix: '0xabcdef12',
				fullHash: false,
			},
		],
	])('normalizes %s', (input, expected) => {
		expect(parseFarcasterUrlIngress(input)).toEqual(expected)
	})

	it.each([
		'http://farcaster.xyz/alice/0xabcdef12',
		'https://farcaster.xyz.evil.example/alice/0xabcdef12',
		'https://user@farcaster.xyz/alice/0xabcdef12',
		'https://farcaster.xyz:8443/alice/0xabcdef12',
		'https://farcaster.xyz/alice/0xabcdef12#other',
		'https://farcaster.xyz/alice%2Fother/0xabcdef12',
		'https://farcaster.xyz/~/profiles/03',
	])('rejects %s', (input) => {
		expect(() => parseFarcasterUrlIngress(input)).toThrow()
	})

	it('accepts only the cast matching the requested username and hash prefix', () => {
		const ingress = parseFarcasterUrlIngress('https://farcaster.xyz/alice/0xabcdef12')
		if (ingress.kind !== 'cast')
			throw new Error('Expected cast ingress')

		expect(verifyFarcasterIngressCast(ingress, {
			hash: '0xabcdef1234567890123456789012345678901234',
			author: {
				fid: 42,
				username: 'Alice',
			},
		})).toEqual({
			fid: 42,
			hash: '0xabcdef1234567890123456789012345678901234',
		})
		expect(() => verifyFarcasterIngressCast(ingress, {
			hash: '0x1111111111111111111111111111111111111111',
			author: {
				fid: 42,
				username: 'mallory',
			},
		})).toThrow('does not match')
	})
})
