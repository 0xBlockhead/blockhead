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
	}: EntityListViewProps<EntityType.StarknetAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$contract: true,
				blockNumber: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetAccountTimestamp })}
		{@const starknetAccountTimestampSelector = starknetAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetAccount_Timestamp}
			entitySelector={starknetAccountTimestampSelector}
		>
			{#snippet Title()}
				{starknetAccountTimestampSelector.$contract.address || 'starknet contract'}
			{/snippet}

			{#snippet Value()}
				{starknetAccountTimestampSelector.blockNumber}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetAccountTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
