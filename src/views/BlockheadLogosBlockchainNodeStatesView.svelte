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
	}: EntityListViewProps<EntityType.BlockheadLogosBlockchainNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLogosBlockchainNodeState}
	bind:open
	resource={
		selection({
			fields: {
				peerId: true,
				connectionId: true,
				endpoint: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLogosBlockchainNodeState })}
		{@const blockheadLogosBlockchainNodeStateSelector = blockheadLogosBlockchainNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainNodeState}
			entitySelector={blockheadLogosBlockchainNodeStateSelector}
		>
			{#snippet Title()}
				{blockheadLogosBlockchainNodeStateSelector.peerId || 'blockhead Logos blockchain node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadLogosBlockchainNodeStateSelector.connectionId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLogosBlockchainNodeState.endpoint ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
