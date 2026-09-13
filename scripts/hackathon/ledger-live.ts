import * as Hex from 'ox/Hex'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import { connectSpeculos } from '../../src/sources/Ledger/Dmk/speculos.ts'


const session = await connectSpeculos()
try {
	if (session.address.toLowerCase() !== '0x7883053bfc5bc3cab18c35452f5ea317c837fa60')
		throw new Error('Emulator returned an address different from the generated test wallet')
	console.log(JSON.stringify({ evidence: 'dmk-speculos-address', address: session.address, physicalHardware: false }))
	if (process.argv.includes('--sign-message')) {
		const message = 'Blockhead ETHOnline 2026: inspect, authorize, verify.'
		console.log(JSON.stringify({ interaction: 'Review the exact message and approve in Speculos' }))
		const signature = await session.signMessage(message)
		const recoveredAddress = Secp256k1.recoverAddress({
			payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
			signature: Signature.fromHex(signature),
		})
		if (recoveredAddress.toLowerCase() !== session.address.toLowerCase())
			throw new Error('Ledger signature does not recover the connected account')
		console.log(JSON.stringify({ evidence: 'dmk-speculos-message-signature', message, signature, recoveredAddress, verified: true, physicalHardware: false }))
	}
} finally {
	await session.close()
}
