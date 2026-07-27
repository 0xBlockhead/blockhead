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
	}: EntityListViewProps<EntityType.IbcChannel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcChannel}
	bind:open
	resource={
		selection({
			fields: {
				channelId: true,
				state: true,
				portId: true,
				counterpartyChainId: true,
			},
		})
	}
>
	{#snippet Item({ item: ibcChannel })}
		{@const ibcChannelSelector = ibcChannel[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IbcChannel}
			entitySelector={ibcChannelSelector}
		>
			{#snippet Title()}
				{ibcChannelSelector.channelId || 'IBC channel'}
			{/snippet}

			{#snippet Value()}
				{[(ibcChannel.state ?? ''), ibcChannelSelector.channelId].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[ibcChannelSelector.portId, (ibcChannel.counterpartyChainId ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
