import { tronNodeRestResolvers } from '$/resolvers/TronNodeRest.ts'
import { Source } from '$/sources/Source.ts'

export default tronNodeRestResolvers(
	Source.TronFullNode_Rest,
	() => import('$/sources/TronFullNode/Rest/queries.ts')
)
