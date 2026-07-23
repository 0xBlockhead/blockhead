export type EasScanAttestation = {
	id: string
	schemaId: string
	attester: string
	recipient: string
	refUID: string
	revocable: boolean
	revocationTime: number
	expirationTime: number
	time: number
	data: string
}

export type EasScanAttestationResponse = {
	attestation: EasScanAttestation | null
}

export type EasScanAttestationsResponse = {
	attestations: EasScanAttestation[]
}
