import { describe, expect, it } from 'vitest'

import { inspectPsbt } from '$/lib/psbtInspect.ts'

// BIP174, case: PSBT with one P2PKH input and one P2SH-P2WPKH input; first input finalized.
const bip174FinalizedPsbtV0Base64 = 'cHNidP8BAKACAAAAAqsJSaCMWvfEm4IS9Bfi8Vqz9cM9zxU4IagTn4d6W3vkAAAAAAD+////qwlJoIxa98SbghL0F+LxWrP1wz3PFTghqBOfh3pbe+QBAAAAAP7///8CYDvqCwAAAAAZdqkUdopAu9dAy+gdmI5x3ipNXHE5ax2IrI4kAAAAAAAAGXapFG9GILVT+glechue4O/p+gOcykWXiKwAAAAAAAEHakcwRAIgR1lmF5fAGwNrJZKJSGhiGDR9iYZLcZ4ff89X0eURZYcCIFMJ6r9Wqk2Ikf/REf3xM286KdqGbX+EhtdVRs7tr5MZASEDXNxh/HupccC1AaZGoqg7ECy0OIEhfKaC3Ibi1z+ogpIAAQEgAOH1BQAAAAAXqRQ1RebjO4MsRwUPJNPuuTycA5SLx4cBBBYAFIXRNTfy4mVAWjTbr6nj3aAfuCMIAAAA'

// BIP370, case: 1 input, 2 output PSBTv2, required fields only.
const bip370PsbtV2Base64 = 'cHNidP8BAgQCAAAAAQQBAQEFAQIB+wQCAAAAAAEOIAsK2SFBnByHGXNdctxzn56p4GONH+TB7vD5lECEgV/IAQ8EAAAAAAABAwgACK8vAAAAAAEEFgAUxDD2TEdW2jENvRoIVXLvKZkmJywAAQMIi73rCwAAAAABBBYAFE3Rk6yWSlasG54cyoRU/i9HT4UTAA=='

// BIP370 invalid test vector, case: PSBTv0 but with PSBT_GLOBAL_VERSION set to 2.
const bip370MixedVersionBase64 = 'cHNidP8BAHECAAAAAQsK2SFBnByHGXNdctxzn56p4GONH+TB7vD5lECEgV/IAAAAAAD+////AgAIry8AAAAAFgAUxDD2TEdW2jENvRoIVXLvKZkmJyyLvesLAAAAABYAFKB9rIq2ypQtN57Xlfg1unHJzGiFAAAAAAH7BAIAAAAAAQBSAgAAAAHBqiVuIUuWoYIvk95Cv/O18/+NBRkwbjUV11FaXoBbEgAAAAAA/////wEYxpo7AAAAABYAFLCjrxRCCEEmk8p9FmhStS2wrvBuAAAAAAEBHxjGmjsAAAAAFgAUsKOvFEIIQSaTyn0WaFK1LbCu8G4BCGsCRzBEAiAFJ1pIVzTgrh87lxI3WG8OctyFgz0njA5HTNIxEsD6XgIgawSMg868PEHQuTzH2nYYXO29Aw0AWwgBi+K5i7rL33sBIQN2DcygXzmX3GWykwYPfynxUUyMUnBI4SgCsEHU/DQKJwAiAgLWAfhIRqZ1X3dr4A49nej7EKzJNfuDxF+wFi1MrVq3khj2nYc+VAAAgAEAAIAAAACAAAAAACoAAAAAIgIDbv4sJVYhmGVTup1lw93GQWXKFDbgWqNaTG6wJFHPeW0Y9p2HPlQAAIABAACAAAAAgAEAAABiAAAAAA=='

const decodeBase64 = (
	encoded: string
) => Uint8Array.from(Buffer.from(encoded, 'base64'))

describe('inspectPsbt', () => {
	it('inspects official BIP174 and BIP370 vectors without changing their scope', () => {
		const v0 = decodeBase64(bip174FinalizedPsbtV0Base64)
		const v2 = decodeBase64(bip370PsbtV2Base64)
		const v0Snapshot = v0.slice()

		expect(inspectPsbt(v0)).toEqual({
			psbtVersion: 0,
			txVersion: 2,
			locktime: 0,
			inputCount: 2,
			outputCount: 2,
			finalizedInputCount: 1,
			inputs: [
				{
					index: 0,
					isFinalized: true,
					hasNonWitnessUtxo: false,
					hasWitnessUtxo: false,
					hasPartialSig: false,
					hasRedeemScript: false,
					hasWitnessScript: false,
					hasBip32Derivation: false,
				},
				{
					index: 1,
					isFinalized: false,
					hasNonWitnessUtxo: false,
					hasWitnessUtxo: true,
					hasPartialSig: false,
					hasRedeemScript: true,
					hasWitnessScript: false,
					hasBip32Derivation: false,
					valueSats: 100000000n,
				},
			],
			outputs: [
				{
					index: 0,
					hasRedeemScript: false,
					hasWitnessScript: false,
					hasBip32Derivation: false,
					valueSats: 199900000n,
				},
				{
					index: 1,
					hasRedeemScript: false,
					hasWitnessScript: false,
					hasBip32Derivation: false,
					valueSats: 9358n,
				},
			],
		})
		expect(inspectPsbt(v2)).toEqual({
			psbtVersion: 2,
			txVersion: 2,
			inputCount: 1,
			outputCount: 2,
			finalizedInputCount: 0,
			inputs: [
				{
					index: 0,
					isFinalized: false,
					hasNonWitnessUtxo: false,
					hasWitnessUtxo: false,
					hasPartialSig: false,
					hasRedeemScript: false,
					hasWitnessScript: false,
					hasBip32Derivation: false,
				},
			],
			outputs: [
				{
					index: 0,
					hasRedeemScript: false,
					hasWitnessScript: false,
					hasBip32Derivation: false,
					valueSats: 800000000n,
				},
				{
					index: 1,
					hasRedeemScript: false,
					hasWitnessScript: false,
					hasBip32Derivation: false,
					valueSats: 199998859n,
				},
			],
		})
		expect(v0).toEqual(v0Snapshot)
	})

	it('preserves the library validation identity for malformed and mixed-version vectors', () => {
		const mixedVersion = decodeBase64(bip370MixedVersionBase64)

		expect(() => inspectPsbt(new Uint8Array([
			0x70,
			0x73,
			0x62,
		]))).toThrowError('PSBT: invalid magic')
		expect(() => inspectPsbt(mixedVersion)).toThrowError(
			'PSBTv2: unsigned transaction is not allowed'
		)
	})
})
