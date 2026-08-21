import { createKaspaNodeResolverModule } from '$/resolvers/KaspaNode.ts'
import { Source } from '$/sources/Source.ts'

const loadQueries = async () => {
	if (typeof window !== 'undefined')
		return import('$/sources/KaspaNode/Rest/queries.remote.ts')
	return import('$/sources/KaspaNode/Rest/queries.ts')
}

export default createKaspaNodeResolverModule(Source.KaspaNode_Rest, loadQueries)
