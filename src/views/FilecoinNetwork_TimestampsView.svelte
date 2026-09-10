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
	}: EntityListViewProps<EntityType.FilecoinNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				headHeight: true,
				headTipsetKey: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinNetworkTimestamp })}
		{@const filecoinNetworkTimestampSelector = filecoinNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = filecoinNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.FilecoinNetwork_Timestamp}
			entitySelector={filecoinNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(filecoinNetworkTimestampSelector.timestampMs),
						source: filecoinNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{filecoinNetworkTimestamp.headHeight ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinNetworkTimestamp.headTipsetKey ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
