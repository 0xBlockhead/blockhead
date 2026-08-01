<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Validator snapshots',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosValidator_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				source: true,
				status: true,
				tokens: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosValidatorTimestamp })}
		{@const cosmosValidatorTimestampSelector = cosmosValidatorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CosmosValidator_Timestamp}
			entitySelector={cosmosValidatorTimestampSelector}
		>
			{#snippet Title()}
				{cosmosValidatorTimestampSelector.source || 'Cosmos validator timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(cosmosValidatorTimestamp.status ?? ''), String(cosmosValidatorTimestamp.tokens ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosValidatorTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
