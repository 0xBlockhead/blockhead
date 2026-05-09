/**
 * Standard Ethereum beacon node REST (`/eth/v1/...`) — @see https://github.com/ethereum/beacon-APIs
 */

import { proxyFetch } from '$/lib/http.ts'

type BeaconHeaderHeadWire = {
	data?: {
		header?: {
			message?: {
				slot?: string
			}
		}
	}
}

type BeaconHeaderWire = {
	data?: {
		root?: string
		canonical?: boolean
		header?: {
			message?: {
				slot?: string
				proposer_index?: string
				parent_root?: string
				state_root?: string
				body_root?: string
			}
		}
	}
}

export type BeaconHeader = {
	bodyRoot: string
	canonical: boolean | undefined
	parentRoot: string
	proposerIndex: number
	root: string
	slot: number
	stateRoot: string
}

export const getBeaconHeadSlot = async (beaconRestBaseUrl: string): Promise<number> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(`${base}/eth/v1/beacon/headers/head`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) throw new Error(`Beacon GET head ${res.status} ${res.statusText}`)
	const wire = await res.json<BeaconHeaderHeadWire>()
	const data = wire.data
	if (data == null) throw new Error('Beacon: head response missing data')
	const header = data.header
	if (header == null) throw new Error('Beacon: head response missing header')
	const message = header.message
	if (message == null) throw new Error('Beacon: head response missing message')
	const slotRaw = message.slot
	if (slotRaw == null) throw new Error('Beacon: head response missing slot')
	const n = Number.parseInt(String(slotRaw), 10)
	if (!Number.isFinite(n)) throw new Error('Beacon: invalid head slot')
	return n
}

export const getBeaconHeader = async (
	beaconRestBaseUrl: string,
	blockId: string | number,
): Promise<BeaconHeader> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(`${base}/eth/v1/beacon/headers/${blockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) throw new Error(`Beacon GET header ${res.status} ${res.statusText}`)
	const wire = await res.json<BeaconHeaderWire>()
	const data = wire.data
	if (data == null) throw new Error('Beacon: header response missing data')
	const root = data.root
	if (root == null) throw new Error('Beacon: header response missing root')
	const header = data.header
	if (header == null) throw new Error('Beacon: header response missing header')
	const message = header.message
	if (message == null) throw new Error('Beacon: header response missing message')
	const slotRaw = message.slot
	const proposerRaw = message.proposer_index
	if (slotRaw == null) throw new Error('Beacon: header response missing slot')
	if (proposerRaw == null) throw new Error('Beacon: header response missing proposer index')
	const slot = Number.parseInt(String(slotRaw), 10)
	const proposerIndex = Number.parseInt(String(proposerRaw), 10)
	if (!Number.isFinite(slot)) throw new Error('Beacon: header response invalid slot')
	if (!Number.isFinite(proposerIndex)) throw new Error('Beacon: header response invalid proposer index')
	const parentRoot = message.parent_root
	if (parentRoot == null) throw new Error('Beacon: header response missing parent root')
	const stateRoot = message.state_root
	if (stateRoot == null) throw new Error('Beacon: header response missing state root')
	const bodyRoot = message.body_root
	if (bodyRoot == null) throw new Error('Beacon: header response missing body root')
	return {
		bodyRoot,
		canonical: data.canonical,
		parentRoot,
		proposerIndex,
		root,
		slot,
		stateRoot,
	}
}
