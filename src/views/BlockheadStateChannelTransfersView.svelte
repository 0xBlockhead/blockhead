<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'State channel transfers',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadStateChannelTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelTransfer}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				amount: true,
				status: true,
				timestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadStateChannelTransfer })}
		{@const blockheadStateChannelTransferSelector = blockheadStateChannelTransfer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadStateChannelTransfer}
			entitySelector={blockheadStateChannelTransferSelector}
		>
			{#snippet Title()}
				{blockheadStateChannelTransferSelector.amount}
			{/snippet}

			{#snippet Value()}
				{blockheadStateChannelTransfer.status}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadStateChannelTransfer.timestamp}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
