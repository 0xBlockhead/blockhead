<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FilecoinDeal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinDeal}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Filfox_Rest,
				],
				fields: {
					dealId: true,
					$provider: true,
					$client: true,
					verifiedDeal: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: filecoinDeal })}
		{@const filecoinDealSelector = filecoinDeal[EntityMetaKey.Selector]}
		{@const network = filecoinDealSelector.$network}
		<EntityView
			entityType={EntityType.FilecoinDeal}
			entitySelector={filecoinDealSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/deal/[dealId=nonNegativeBigInt]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						dealId: String(filecoinDealSelector.dealId),
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinDealSelector.dealId}
			{/snippet}

			{#snippet Value()}
				{[filecoinDeal.$provider == null ? '' : filecoinDeal.$provider.minerAddress || 'filecoin miner', filecoinDeal.$client == null ? '' : filecoinDeal.$client.address || 'filecoin actor'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinDeal.verifiedDeal ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
