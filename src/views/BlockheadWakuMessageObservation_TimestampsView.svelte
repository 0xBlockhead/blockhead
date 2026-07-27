<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		title = 'Blockhead Waku message observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWakuMessageObservation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				messageHash: true,
				timestampMs: true,
				contentTopic: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWakuMessageObservationTimestamp })}
		{@const blockheadWakuMessageObservationTimestampSelector = blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
			entitySelector={blockheadWakuMessageObservationTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadWakuMessageObservationTimestampSelector.messageHash) || 'blockhead waku message observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadWakuMessageObservationTimestampSelector.timestampMs)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadWakuMessageObservationTimestamp.contentTopic ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
