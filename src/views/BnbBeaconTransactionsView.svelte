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
	}: EntityListViewProps<EntityType.BnbBeaconTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconTransaction}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
				txType: true,
				tokenSymbol: true,
				$block: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconTransaction })}
		{@const bnbBeaconTransactionSelector = bnbBeaconTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconTransaction}
			entitySelector={bnbBeaconTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/transaction/[txHash=stringSegment]',
					{
						network: (
							bnbBeaconTransactionSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(bnbBeaconTransactionSelector.$network.$network.caip2)
							:
								bnbBeaconTransactionSelector.$network.$network.slug
						),
						txHash: bnbBeaconTransactionSelector.txHash,
					}
				)
			}
		>
			{#snippet Title()}
				{bnbBeaconTransactionSelector.txHash || 'bnb beacon transaction'}
			{/snippet}

			{#snippet Value()}
				{[(bnbBeaconTransaction.txType ?? ''), (bnbBeaconTransaction.tokenSymbol ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconTransaction.$block == null ? '' : String(bnbBeaconTransaction.$block.height) || bnbBeaconTransaction.$block.hash || 'bnb beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
