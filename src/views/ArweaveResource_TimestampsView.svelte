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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ArweaveResource_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveResource_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					contentType: true,
					displayType: true,
					reachable: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: arweaveResourceTimestamp })}
		{@const arweaveResourceTimestampSelector = arweaveResourceTimestamp[EntityMetaKey.Selector]}
		{@const resource = arweaveResourceTimestampSelector.$resource}
		<EntityView
			entityType={EntityType.ArweaveResource_Timestamp}
			entitySelector={arweaveResourceTimestampSelector}
			href={
				resolve(
					'/(arweave)/arweave/resource/[transactionId=stringSegment]/[contentPath=stringSegment]/(arweaveResource)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						transactionId: resource.transactionId,
						contentPath: resource.contentPath,
						timestampMs: String(arweaveResourceTimestampSelector.timestampMs),
						source: arweaveResourceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{arweaveResourceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(arweaveResourceTimestamp.contentType ?? ''), (arweaveResourceTimestamp.displayType ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{arweaveResourceTimestamp.reachable ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
