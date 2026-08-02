import bindings from '$/sources/Juno/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { starknetJsonRpc } from '$/sources/_shared/interfaces/StarknetJsonRpc/queries.ts'

export default starknetJsonRpc(bindings[Source.Juno_JsonRpc][0])
