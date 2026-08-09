<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AvalancheValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalancheValidator_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					connected: true,
					uptimePercent: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: avalancheValidatorTimestamp })}
		{@const avalancheValidatorTimestampSelector = avalancheValidatorTimestamp[EntityMetaKey.Selector]}
		{@const validator = avalancheValidatorTimestampSelector.$validator}
		<EntityView
			entityType={EntityType.AvalancheValidator_Timestamp}
			entitySelector={avalancheValidatorTimestampSelector}
			href={
				resolve(
					'/(avalanche)/avalanche/validator/[nodeId=stringSegment]/[subnetId=stringSegment]/[startTimeMs=nonNegativeInteger]/(avalancheValidator)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						nodeId: validator.nodeId,
						subnetId: validator.subnetId,
						startTimeMs: String(validator.startTimeMs),
						timestampMs: String(avalancheValidatorTimestampSelector.timestampMs),
						source: avalancheValidatorTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{avalancheValidatorTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(avalancheValidatorTimestamp.connected ?? ''), String(avalancheValidatorTimestamp.uptimePercent ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{avalancheValidatorTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
