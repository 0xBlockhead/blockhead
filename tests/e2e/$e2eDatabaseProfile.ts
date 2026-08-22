const e2eProfileHash = (name: string) => {
	let hash = 0x811c9dc5
	for (const character of name)
		hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193)

	return (hash >>> 0).toString(36)
}

export const e2eProfileDatabaseName = (name: string) => (
	`blockhead-e2e-${e2eProfileHash(name)}.sqlite`
)

export const e2eProfileVfsName = (name: string) => (
	`e2e-${e2eProfileHash(name)}`
)
