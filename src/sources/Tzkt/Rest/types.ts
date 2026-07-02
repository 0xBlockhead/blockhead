export type TzktAddress = {
	address: string
	alias?: string
}

export type TzktBigMap = {
	ptr: number
	contract: TzktAddress
	path: string
	tags?: string[]
	active: boolean
	firstLevel: number
	lastLevel: number
	totalKeys: number
	activeKeys: number
	updates: number
	keyType?: unknown
	valueType?: unknown
}

export type TzktBigMapKey = {
	id: number
	active: boolean
	hash: string
	key: unknown
	value: unknown
	firstLevel: number
	lastLevel: number
	updates: number
}

export type TzktBigMapUpdateContent = {
	hash: string
	key?: unknown
	value?: unknown
}

export type TzktBigMapUpdate = {
	id: number
	level: number
	timestamp: string
	bigmap: number
	contract?: TzktAddress
	path?: string
	action: string
	content?: TzktBigMapUpdateContent
}

export type TzktBlock = {
	level: number
	timestamp: string
	hash: string
}

export type TzktContract = {
	address: string
	alias?: string
	kind?: string
	type?: string
	balance?: number
}

export type TzktOperation = {
	type: string
	id: number
	level: number
	timestamp: string
	hash: string
	counter?: number
	nonce?: number
	initiator?: TzktAddress
	sender?: TzktAddress
	target?: TzktAddress
	status?: string
	parameter?: {
		entrypoint?: string
	}
}
