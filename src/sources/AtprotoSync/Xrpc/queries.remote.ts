import { query } from '$app/server'
import { type } from 'arktype'

import {
	getBlocks,
	getLatestCommit,
	getRepoStatus,
} from '$/sources/AtprotoSync/Xrpc/queries.ts'

const repoReadInput = type({
	did: 'string > 0',
	serviceOrigin: 'string > 0',
})

export const getAtprotoLatestCommitRemote = query(
	repoReadInput,
	(input) => getLatestCommit(input)
)

export const getAtprotoRepoStatusRemote = query(
	repoReadInput,
	(input) => getRepoStatus(input)
)

const repoBlocksReadInput = type({
	did: 'string > 0',
	serviceOrigin: 'string > 0',
	cids: 'string[] > 0',
})

export const getAtprotoBlocksRemote = query(
	repoBlocksReadInput,
	(input) => getBlocks(input)
)
