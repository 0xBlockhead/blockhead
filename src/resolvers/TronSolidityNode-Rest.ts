import { tronNodeRestResolvers } from '$/resolvers/TronNodeRest.ts'
import { Source } from '$/sources/Source.ts'

export default tronNodeRestResolvers(
	Source.TronSolidityNode_Rest,
	() => import('$/sources/TronSolidityNode/Rest/queries.ts')
)
