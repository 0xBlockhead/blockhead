export const requiredPublicEnvString = <_PublicEnv extends object>(
	publicEnv: _PublicEnv,
	key: string,
): string => {
	const value = Object.getOwnPropertyDescriptor(publicEnv, key)?.value
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`Missing or empty required env: ${key}`)
	}
	return value.trim()
}

export const optionalPublicEnvString = <_PublicEnv extends object>(
	publicEnv: _PublicEnv,
	key: string,
): string | undefined => {
	const value = Object.getOwnPropertyDescriptor(publicEnv, key)?.value
	if (typeof value !== 'string' || value.trim() === '') return undefined
	return value.trim()
}
