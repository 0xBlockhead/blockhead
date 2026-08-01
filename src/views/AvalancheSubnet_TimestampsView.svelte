<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.AvalancheSubnet_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalancheSubnet_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				validatorCount: true,
				delegatorCount: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: avalancheSubnetTimestamp })}
		{@const avalancheSubnetTimestampSelector = avalancheSubnetTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalancheSubnet_Timestamp}
			entitySelector={avalancheSubnetTimestampSelector}
		>
			{#snippet Title()}
				{avalancheSubnetTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(avalancheSubnetTimestamp.validatorCount ?? ''), String(avalancheSubnetTimestamp.delegatorCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{avalancheSubnetTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
