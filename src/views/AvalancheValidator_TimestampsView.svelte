<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
			fields: {
				timestampMs: true,
				connected: true,
				uptimePercent: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: avalancheValidatorTimestamp })}
		{@const avalancheValidatorTimestampSelector = avalancheValidatorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalancheValidator_Timestamp}
			entitySelector={avalancheValidatorTimestampSelector}
		>
			{#snippet Title()}
				{String(avalancheValidatorTimestampSelector.timestampMs) || 'avalanche validator timestamp'}
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
