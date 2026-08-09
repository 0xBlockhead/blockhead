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
	}: EntityListViewProps<EntityType.MevRelay_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MevRelay_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					deliveredPayloadSampleCount: true,
					builderSampleCount: true,
					$relay: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: mevRelayTimestamp })}
		{@const mevRelayTimestampSelector = mevRelayTimestamp[EntityMetaKey.Selector]}
		{@const relay = mevRelayTimestampSelector.$relay}
		<EntityView
			entityType={EntityType.MevRelay_Timestamp}
			entitySelector={mevRelayTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in relay.$network ?
								caip2StringFromValue(relay.$network.caip2)
							:
								relay.$network.slug
						),
						host: relay.host,
						timestampMs: String(mevRelayTimestampSelector.timestampMs),
						source: mevRelayTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{mevRelayTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(mevRelayTimestamp.deliveredPayloadSampleCount ?? ''), String(mevRelayTimestamp.builderSampleCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mevRelayTimestampSelector.$relay.host || 'MEV relay'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
