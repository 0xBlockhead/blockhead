import {
	getRequestEvent,
	query,
} from '$app/server'
import { type } from 'arktype'

import {
	getBlocks,
	getLatestCommit,
	getRepoStatus,
} from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { getCurrentPdsOrigin } from '$/sources/AtprotoSync/Xrpc/identity.ts'

const repoReadInput = type({
	did: 'string > 0',
	serviceOrigin: 'string > 0',
})

const didReadInput = type({
	did: 'string > 0',
})

export const getAtprotoCurrentPdsOriginRemote = query(
	didReadInput,
	(input) => getCurrentPdsOrigin({
		...input,
		signal: getRequestEvent().request.signal,
	})
)

export const getAtprotoLatestCommitRemote = query(
	repoReadInput,
	(input) => getLatestCommit({
		...input,
		signal: getRequestEvent().request.signal,
	})
)

export const getAtprotoRepoStatusRemote = query(
	repoReadInput,
	(input) => getRepoStatus({
		...input,
		signal: getRequestEvent().request.signal,
	})
)

const repoBlocksReadInput = type({
	did: 'string > 0',
	serviceOrigin: 'string > 0',
	cids: 'string[] > 0',
})

export const getAtprotoBlocksRemote = query(
	repoBlocksReadInput,
	(input) => getBlocks({
		...input,
		signal: getRequestEvent().request.signal,
	})
)
