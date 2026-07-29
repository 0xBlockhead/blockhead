<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Kaspa node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadKaspaNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				isSynced: true,
				hasUtxoIndex: true,
				peerCount: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadKaspaNodeStateTimestamp })}
		{@const blockheadKaspaNodeStateTimestampSelector = blockheadKaspaNodeStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
			entitySelector={blockheadKaspaNodeStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadKaspaNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadKaspaNodeStateTimestamp.isSynced ?? ''), String(blockheadKaspaNodeStateTimestamp.hasUtxoIndex ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadKaspaNodeStateTimestamp.peerCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
