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
	}: EntityListViewProps<EntityType.LogosBlockchainNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LogosBlockchainNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				height: true,
				mode: true,
			},
		})
	}
>
	{#snippet Item({ item: logosBlockchainNetworkTimestamp })}
		{@const logosBlockchainNetworkTimestampSelector = logosBlockchainNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LogosBlockchainNetwork_Timestamp}
			entitySelector={logosBlockchainNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in logosBlockchainNetworkTimestampSelector.$network.$network ?
								caip2StringFromValue(logosBlockchainNetworkTimestampSelector.$network.$network.caip2)
							:
								logosBlockchainNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(logosBlockchainNetworkTimestampSelector.timestampMs),
						source: logosBlockchainNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{logosBlockchainNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{logosBlockchainNetworkTimestamp.height ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{logosBlockchainNetworkTimestamp.mode ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
