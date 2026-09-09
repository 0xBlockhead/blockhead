<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Filecoin pending messages',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadFilecoinPendingMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFilecoinPendingMessage}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				messageCid: true,
				observedAtMs: true,
				local: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadFilecoinPendingMessage })}
		{@const blockheadFilecoinPendingMessageSelector = blockheadFilecoinPendingMessage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadFilecoinPendingMessage}
			entitySelector={blockheadFilecoinPendingMessageSelector}
			href={
				resolve(
					'/~/filecoin/node/[nodeId=stringSegment]/pending-message/[messageCid=stringSegment]/[observedAtMs=nonNegativeInteger]',
					{
						nodeId: blockheadFilecoinPendingMessageSelector.nodeId,
						messageCid: blockheadFilecoinPendingMessageSelector.messageCid,
						observedAtMs: String(blockheadFilecoinPendingMessageSelector.observedAtMs),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadFilecoinPendingMessageSelector.messageCid || 'blockhead filecoin pending message'}
			{/snippet}

			{#snippet Value()}
				{blockheadFilecoinPendingMessageSelector.observedAtMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadFilecoinPendingMessage.local ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
