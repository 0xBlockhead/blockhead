const implicitAccountAddress = /^0x([0-9a-fA-F]{64})$/

export const implicitAccountReference = (
	accountAddress: string
) => {
	const addressMatch = implicitAccountAddress.exec(accountAddress)
	if (addressMatch == null)
		throw new Error('QuilibriumNodeRpc_Grpc: implicit account address must be 0x-prefixed 32-byte hex')

	return {
		implicitAccount: {
			implicitType: 0,
			address: Uint8Array.from(
				addressMatch[1].match(/.{2}/g) ?? [],
				(byte) => Number.parseInt(byte, 16)
			),
		},
	}
}
