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
	}: EntityListViewProps<EntityType.OracleFeed_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OracleFeed_Round}
	bind:open
	resource={
		selection({
			fields: {
				roundId: true,
				updatedAtMs: true,
			},
		})
	}
>
	{#snippet Item({ item: oracleFeedRound })}
		{@const oracleFeedRoundSelector = oracleFeedRound[EntityMetaKey.Selector]}
		{@const oracleFeed = oracleFeedRoundSelector.$oracleFeed}
		<EntityView
			entityType={EntityType.OracleFeed_Round}
			entitySelector={oracleFeedRoundSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/oracle/feed/[address=evmAddress]/(oracleFeed)/round/[roundId=nonNegativeBigInt]',
					{
						network: (
							'caip2' in oracleFeed.$network ?
								caip2StringFromValue(oracleFeed.$network.caip2)
							:
								oracleFeed.$network.slug
						),
						address: oracleFeed.address,
						roundId: String(oracleFeedRoundSelector.roundId),
					}
				)
			}
		>
			{#snippet Title()}
				{oracleFeedRoundSelector.roundId}
			{/snippet}

			{#snippet Value()}
				{oracleFeedRoundSelector.roundId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{oracleFeedRound.updatedAtMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
