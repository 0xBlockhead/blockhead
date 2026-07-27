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
	}: EntityListViewProps<EntityType.BlockheadLightningChannelState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningChannelState}
	bind:open
	resource={
		selection({
			fields: {
				$channel: true,
				$localNodeState: true,
				private: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningChannelState })}
		{@const blockheadLightningChannelStateSelector = blockheadLightningChannelState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningChannelState}
			entitySelector={blockheadLightningChannelStateSelector}
		>
			{#snippet Title()}
				{(blockheadLightningChannelState.$channel.shortChannelId ?? '') || blockheadLightningChannelStateSelector.$channel.channelId || 'Lightning channel'}
			{/snippet}

			{#snippet Value()}
				{(blockheadLightningChannelState.$localNodeState.alias ?? '') || blockheadLightningChannelStateSelector.$localNodeState.connectionId || 'blockhead Lightning node state'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadLightningChannelState.private ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
