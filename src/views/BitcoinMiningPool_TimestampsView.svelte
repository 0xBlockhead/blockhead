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
	}: EntityListViewProps<EntityType.BitcoinMiningPool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinMiningPool_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					$pool: {
						fields: {
							name: true,
						},
					},
					blockCount24h: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bitcoinMiningPoolTimestamp })}
		{@const bitcoinMiningPoolTimestampSelector = bitcoinMiningPoolTimestamp[EntityMetaKey.Selector]}
		{@const pool = bitcoinMiningPoolTimestampSelector.$pool}
		<EntityView
			entityType={EntityType.BitcoinMiningPool_Timestamp}
			entitySelector={bitcoinMiningPoolTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mining-pool/[slug=stringSegment]/(bitcoinMiningPool)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in pool.$network ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						slug: pool.slug,
						timestampMs: String(bitcoinMiningPoolTimestampSelector.timestampMs),
						source: bitcoinMiningPoolTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bitcoinMiningPoolTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[bitcoinMiningPoolTimestamp.$pool.name || 'Bitcoin mining pool', String(bitcoinMiningPoolTimestamp.blockCount24h ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
