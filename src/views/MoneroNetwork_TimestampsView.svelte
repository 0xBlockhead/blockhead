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
	}: EntityListViewProps<EntityType.MoneroNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				height: true,
				status: true,
				synchronized: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroNetworkTimestamp })}
		{@const moneroNetworkTimestampSelector = moneroNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = moneroNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.MoneroNetwork_Timestamp}
			entitySelector={moneroNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(moneroNetworkTimestampSelector.timestampMs),
						source: moneroNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{moneroNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{moneroNetworkTimestamp.height ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(moneroNetworkTimestamp.status ?? ''), String(moneroNetworkTimestamp.synchronized ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
