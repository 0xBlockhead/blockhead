import { Hex, PersonalMessage, Secp256k1, Signature } from 'ox'

const privateKey = '0x1111111111111111111111111111111111111111111111111111111111111111'
export const personalSigningAccount = '0x19e7e376e7c213b7e7e7e46cc70a5dd086daff2a'
export const personalSigningMessage = Hex.fromString('private test message')
export const personalSigningSignature = Signature.toHex(Secp256k1.sign({
	privateKey,
	payload: PersonalMessage.getSignPayload(personalSigningMessage),
}))
