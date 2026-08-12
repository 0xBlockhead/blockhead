import { query } from '$app/server'
import { type } from 'arktype'

import {
	retrieveFileText,
	retrieveModel,
} from '$/sources/HuggingFace/Rest/queries.ts'

export const retrieveHuggingFaceModelRemote = query(
	type({
		repoId: 'string > 0',
		'revision?': 'string > 0',
	}),
	(input) => retrieveModel(input)
)

export const retrieveHuggingFaceFileTextRemote = query(
	type({
		repoId: 'string > 0',
		revision: 'string > 0',
		path: 'string > 0',
	}),
	(input) => retrieveFileText(input)
)
