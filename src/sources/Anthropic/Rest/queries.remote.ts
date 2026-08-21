import { query } from '$app/server'
import { type } from 'arktype'
import { env as privateEnv } from '$env/dynamic/private'

import bindings from '$/sources/Anthropic/bindings.ts'
import {
	listModels,
	retrieveModel,
} from '$/sources/Anthropic/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Anthropic_Rest][0]
const anthropicVersion = '2023-06-01'

const credential = () => {
	const value = privateEnv.ANTHROPIC_API_KEY?.trim() ?? ''
	if (value === '')
		throw new Error('Anthropic_Rest: missing runtime credential ANTHROPIC_API_KEY')
	return value
}

export const listModelsRemote = query(
	type({}),
	() => listModels({ binding, credential: credential(), anthropicVersion })
)

export const retrieveModelRemote = query(
	type({ modelId: 'string > 0' }),
	({ modelId }) => retrieveModel({
		binding,
		modelId,
		credential: credential(),
		anthropicVersion,
	})
)
