export const resolverAccountabilityReport = ({
	entityTypes,
	entityTypesWithResolver,
	sourceBackedEntityTypes,
}: {
	entityTypes: readonly string[]
	entityTypesWithResolver: ReadonlySet<string>
	sourceBackedEntityTypes: ReadonlySet<string>
}) => {
	const unresolvedEntityTypes = entityTypes.filter((entityType) => (
		!entityTypesWithResolver.has(entityType)
	))
	const unresolvedSourceBackedEntityTypes = unresolvedEntityTypes.filter((entityType) => (
		sourceBackedEntityTypes.has(entityType)
	))
	const unresolvedNoDeclaredSourceEntityTypes = unresolvedEntityTypes.filter((entityType) => (
		!sourceBackedEntityTypes.has(entityType)
	))

	return {
		total: unresolvedEntityTypes.length,
		unresolvedEntityTypes,
		sourceBacked: unresolvedSourceBackedEntityTypes.length,
		unresolvedSourceBackedEntityTypes,
		noDeclaredSource: unresolvedNoDeclaredSourceEntityTypes.length,
		unresolvedNoDeclaredSourceEntityTypes,
	}
}
