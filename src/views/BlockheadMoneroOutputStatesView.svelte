<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Monero output states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroOutputState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroOutputState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
				outputIndex: true,
				amountAtomicUnits: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroOutputState })}
		{@const blockheadMoneroOutputStateSelector = blockheadMoneroOutputState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroOutputState}
			entitySelector={blockheadMoneroOutputStateSelector}
		>
			{#snippet Title()}
				{blockheadMoneroOutputStateSelector.txHash || 'blockhead monero output state'}
			{/snippet}

			{#snippet Value()}
				{blockheadMoneroOutputStateSelector.outputIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroOutputState.amountAtomicUnits ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
