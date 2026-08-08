import bindings from '$/sources/Pathfinder/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { starknetJsonRpc } from '$/sources/_shared/interfaces/StarknetJsonRpc/queries.ts'

export default starknetJsonRpc(Object.fromEntries(bindings[Source.Pathfinder].map((binding) => [binding.target.key, binding]))['starknet'])
