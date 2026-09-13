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
	}: EntityListViewProps<EntityType.SolanaTokenMint_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTokenMint_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				supply: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaTokenMintTimestamp })}
		{@const solanaTokenMintTimestampSelector = solanaTokenMintTimestamp[EntityMetaKey.Selector]}
		{@const mint = solanaTokenMintTimestampSelector.$mint}
		<EntityView
			entityType={EntityType.SolanaTokenMint_Timestamp}
			entitySelector={solanaTokenMintTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]/(solanaTokenMint)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							mint.$network.caip2 !== undefined ?
								caip2StringFromValue(mint.$network.caip2)
							:
								mint.$network.slug
						),
						mintAddress: mint.mintAddress,
						slot: String(solanaTokenMintTimestampSelector.slot),
						source: solanaTokenMintTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaTokenMintTimestampSelector.slot}
			{/snippet}

			{#snippet Value()}
				{solanaTokenMintTimestamp.supply ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaTokenMintTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
