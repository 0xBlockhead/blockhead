import { describe, expect, it } from 'vitest'

import {
	EntityMetaKey,
	entityIdentityIdsFromFields,
} from '$/schema/$EntityDefinition.ts'
import ActivityPubActor from '$/schema/ActivityPubActor.ts'
import AtprotoActor from '$/schema/AtprotoActor.ts'
import CosmosBlock from '$/schema/CosmosBlock.ts'
import EvmBlock from '$/schema/EvmBlock.ts'
import FarcasterCast from '$/schema/FarcasterCast.ts'
import HyperliquidBlock from '$/schema/HyperliquidBlock.ts'
import IpfsResource from '$/schema/IpfsResource.ts'
import LensAccount from '$/schema/LensAccount.ts'
import Network from '$/schema/Network.ts'
import SolanaBlock from '$/schema/SolanaBlock.ts'
import SwarmResource from '$/schema/SwarmResource.ts'
import XUser from '$/schema/XUser.ts'


describe('entity identity projections', () => {
	it('keeps Farcaster lookup-only ids separate from durable cast identities', () => {
		expect(FarcasterCast.lookups.map((lookup) => lookup.name)).toEqual([
			'usernameHashPrefix',
			'clientUrl',
		])
		expect(FarcasterCast.identities.map((identity) => identity.name)).toEqual([
			'hash',
			'fidHash',
		])
		expect(entityIdentityIdsFromFields(
			FarcasterCast,
			{
				username: 'dwr.eth',
				hashPrefix: '0xAB',
			},
			{
				username: 'dwr.eth',
				hashPrefix: '0xAB',
				fid: 1,
				hash: '0xABC',
			},
		)).toEqual([
			{
				username: 'dwr.eth',
				hashPrefix: '0xAB',
			},
			{
				hash: '0xabc',
			},
			{
				fid: 1,
				hash: '0xabc',
			},
		])
	})

	it('projects Network slug and CAIP-2 ids from returned fields', () => {
		expect(entityIdentityIdsFromFields(
			Network,
			{
				networkSlug: 'ethereum',
			},
			{
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
				slug: 'ethereum',
			},
		)).toEqual([
			{
				networkSlug: 'ethereum',
			},
			{
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
		])
	})

	it('keeps AT Protocol handle lookups separate from durable DID identity', () => {
		expect(AtprotoActor.lookups.map((lookup) => lookup.name)).toEqual([
			'handle',
		])
		expect(AtprotoActor.identities.map((identity) => identity.name)).toEqual([
			'did',
		])
		expect(entityIdentityIdsFromFields(
			AtprotoActor,
			{
				handle: 'Alice.Bsky.Social',
			},
			{
				did: 'did:plc:abc234',
				handle: 'alice.bsky.social',
			},
		)).toEqual([
			{
				handle: 'Alice.Bsky.Social',
			},
			{
				did: 'did:plc:abc234',
			},
		])
	})

	it('keeps ActivityPub acct lookups separate from durable local account ids', () => {
		expect(ActivityPubActor.lookups.map((lookup) => lookup.name)).toEqual([
			'acct',
		])
		expect(ActivityPubActor.identities.map((identity) => identity.name)).toEqual([
			'localAccountId',
		])
		expect(entityIdentityIdsFromFields(
			ActivityPubActor,
			{
				instanceOrigin: 'https://mastodon.social',
				acct: 'Alice@Mastodon.Social',
			},
			{
				instanceOrigin: 'https://mastodon.social',
				localAccountId: '123',
				acct: 'alice@mastodon.social',
			},
		)).toEqual([
			{
				instanceOrigin: 'https://mastodon.social',
				acct: 'Alice@Mastodon.Social',
			},
			{
				instanceOrigin: 'https://mastodon.social',
				localAccountId: '123',
			},
		])
	})

	it('keeps Lens username and legacy profile lookups separate from durable addresses', () => {
		expect(LensAccount.lookups.map((lookup) => lookup.name)).toEqual([
			'localName',
			'legacyProfileId',
		])
		expect(LensAccount.identities.map((identity) => identity.name)).toEqual([
			'address',
		])
		expect(entityIdentityIdsFromFields(
			LensAccount,
			{
				localName: 'Stani',
			},
			{
				address: '0x1234567890ABCDEF1234567890ABCDEF12345678',
				localName: 'stani',
			},
		)).toEqual([
			{
				localName: 'Stani',
			},
			{
				address: '0x1234567890abcdef1234567890abcdef12345678',
			},
		])
		expect(entityIdentityIdsFromFields(
			LensAccount,
			{
				legacyProfileId: '0x01',
			},
			{
				address: '0x1234567890ABCDEF1234567890ABCDEF12345678',
			},
		)).toEqual([
			{
				legacyProfileId: '0x01',
			},
			{
				address: '0x1234567890abcdef1234567890abcdef12345678',
			},
		])
	})

	it('keeps X username lookups separate from durable numeric user ids', () => {
		expect(XUser.lookups.map((lookup) => lookup.name)).toEqual([
			'username',
		])
		expect(XUser.identities.map((identity) => identity.name)).toEqual([
			'id',
		])
		expect(entityIdentityIdsFromFields(
			XUser,
			{
				username: 'Jack',
			},
			{
				id: '12',
				username: 'jack',
			},
		)).toEqual([
			{
				username: 'Jack',
			},
			{
				id: '12',
			},
		])
	})

	it('projects block hash identities from height and slot lookups', () => {
		expect(entityIdentityIdsFromFields(
			CosmosBlock,
			{
				$network: {
					networkSlug: 'cosmoshub',
				},
				height: 1n,
			},
			{
				hash: 'ABCDEF',
			},
		)).toEqual([
			{
				$network: {
					networkSlug: 'cosmoshub',
				},
				height: 1n,
			},
			{
				$network: {
					networkSlug: 'cosmoshub',
				},
				hash: 'abcdef',
			},
		])
		expect(entityIdentityIdsFromFields(
			HyperliquidBlock,
			{
				$network: {
					networkSlug: 'hyperliquid',
				},
				height: 1n,
			},
			{
				hash: '0xABCDEF',
			},
		)).toEqual([
			{
				$network: {
					networkSlug: 'hyperliquid',
				},
				height: 1n,
			},
			{
				$network: {
					networkSlug: 'hyperliquid',
				},
				hash: '0xabcdef',
			},
		])
		expect(entityIdentityIdsFromFields(
			SolanaBlock,
			{
				$network: {
					networkSlug: 'solana',
				},
				slot: 1n,
			},
			{
				blockHash: 'blockhash',
			},
		)).toEqual([
			{
				$network: {
					networkSlug: 'solana',
				},
				slot: 1n,
			},
			{
				$network: {
					networkSlug: 'solana',
				},
				blockHash: 'blockhash',
			},
		])
	})

	it('projects bigint block ids through entity reference fields', () => {
		expect(entityIdentityIdsFromFields(
			EvmBlock,
			{
				$network: {
					networkSlug: 'ethereum',
				},
				blockNumber: 1n,
			},
			{
				$network: {
					[EntityMetaKey.Id]: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
				},
				number: 1n,
				hash: '0xABC',
			},
		)).toEqual([
			{
				$network: {
					networkSlug: 'ethereum',
				},
				blockNumber: 1n,
			},
			{
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				blockNumber: 1n,
				hash: '0xabc',
			},
		])
	})

	it('projects equivalent content and hex encodings through schema identities', () => {
		expect(entityIdentityIdsFromFields(
			IpfsResource,
			{
				namespace: 'ipfs',
				target: 'QmYwAPJzv5CZsnAzt8auVTLW5FfYJcJQ5g7i6n4f5x9g9d',
				contentPath: 'readme',
			},
			{
				namespace: 'ipfs',
				target: 'QmYwAPJzv5CZsnAzt8auVTLW5FfYJcJQ5g7i6n4f5x9g9d',
				contentPath: 'readme',
			},
		)).toEqual([
			{
				namespace: 'ipfs',
				target: 'QmYwAPJzv5CZsnAzt8auVTLW5FfYJcJQ5g7i6n4f5x9g9d',
				contentPath: 'readme',
			},
			{
				namespace: 'ipfs',
				target: 'bafybeie5nqv6kd3qnfjuprw2scvubkrvqjwnrhhnxowqzcyio3mdp2myua',
				contentPath: 'readme',
			},
		])
		expect(entityIdentityIdsFromFields(
			SwarmResource,
			{
				reference: '0xABCDEF',
				contentPath: 'a',
			},
			{
				reference: 'ABCDEF',
				contentPath: 'a',
			},
		)).toEqual([
			{
				reference: '0xABCDEF',
				contentPath: 'a',
			},
			{
				reference: 'abcdef',
				contentPath: 'a',
			},
		])
	})
})
