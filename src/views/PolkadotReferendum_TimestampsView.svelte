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
		title = 'Referendum observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotReferendum_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotReferendum_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				status: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotReferendumTimestamp })}
		{@const polkadotReferendumTimestampSelector = polkadotReferendumTimestamp[EntityMetaKey.Selector]}
		{@const referendum = polkadotReferendumTimestampSelector.$referendum}
		<EntityView
			entityType={EntityType.PolkadotReferendum_Timestamp}
			entitySelector={polkadotReferendumTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(polkadot)/referendum/[referendumId=stringSegment]/(polkadotReferendum)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in referendum.$network ?
								caip2StringFromValue(referendum.$network.caip2)
							:
								referendum.$network.slug
						),
						referendumId: referendum.referendumId,
						timestampMs: String(polkadotReferendumTimestampSelector.timestampMs),
						source: polkadotReferendumTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{(polkadotReferendumTimestamp.status ?? '') || 'Polkadot referendum timestamp'}
			{/snippet}

			{#snippet Value()}
				{polkadotReferendumTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotReferendumTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
