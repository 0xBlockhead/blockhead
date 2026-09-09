<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FilecoinMessage_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMessage_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				height: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinMessageTimestamp })}
		{@const filecoinMessageTimestampSelector = filecoinMessageTimestamp[EntityMetaKey.Selector]}
		{@const message = filecoinMessageTimestampSelector.$message}
		<EntityView
			entityType={EntityType.FilecoinMessage_Timestamp}
			entitySelector={filecoinMessageTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/tipset/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in message.$network ?
								caip2StringFromValue(message.$network.caip2)
							:
								message.$network.slug
						),
						cid: message.cid,
						height: String(filecoinMessageTimestampSelector.height),
						tipsetKey: filecoinMessageTimestampSelector.tipsetKey,
						source: filecoinMessageTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinMessageTimestamp.timestampMs}
			{/snippet}

			{#snippet Value()}
				{filecoinMessageTimestampSelector.height}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinMessageTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
