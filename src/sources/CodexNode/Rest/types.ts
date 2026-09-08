import { type as arktype } from 'arktype'

export type CodexNodePeerIdWire = {
	id: string
}

export type CodexNodeManifestWire = {
	treeCid: string
	datasetSize: number
	blockSize: number
	filename?: string | null
	mimetype?: string | null
}

export type CodexNodeDataItemWire = {
	cid: string
	manifest: CodexNodeManifestWire
}

export type CodexNodeDataWire = {
	content: CodexNodeDataItemWire[]
}

const nonEmptyString = arktype('string > 0')
const nullableString = arktype('string').or(arktype.null)
const nonNegativeInteger = arktype('number.integer >= 0')

export const codexNodePeerIdEnvelope = arktype({
	id: nonEmptyString,
})

const codexNodeManifestEnvelope = arktype({
	treeCid: nonEmptyString,
	datasetSize: nonNegativeInteger,
	blockSize: nonNegativeInteger,
	'filename?': nullableString,
	'mimetype?': nullableString,
})

const codexNodeDataItemEnvelope = arktype({
	cid: nonEmptyString,
	manifest: codexNodeManifestEnvelope,
})

export const codexNodeDataEnvelope = arktype({
	content: codexNodeDataItemEnvelope.array(),
})
