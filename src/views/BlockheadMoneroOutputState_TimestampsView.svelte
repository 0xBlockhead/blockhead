<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Monero output state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroOutputState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroOutputState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				spent: true,
				unlocked: true,
				confirmations: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroOutputStateTimestamp })}
		{@const blockheadMoneroOutputStateTimestampSelector = blockheadMoneroOutputStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroOutputState_Timestamp}
			entitySelector={blockheadMoneroOutputStateTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadMoneroOutputStateTimestampSelector.timestampMs) || 'blockhead monero output state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadMoneroOutputStateTimestamp.spent ?? ''), String(blockheadMoneroOutputStateTimestamp.unlocked ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadMoneroOutputStateTimestamp.confirmations ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
