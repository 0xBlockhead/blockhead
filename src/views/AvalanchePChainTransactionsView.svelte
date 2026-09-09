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
	}: EntityListViewProps<EntityType.AvalanchePChainTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalanchePChainTransaction}
	bind:open
	resource={
		selection({
			fields: {
				txId: true,
				txType: true,
				$block: true,
			},
		})
	}
>
	{#snippet Item({ item: avalanchePChainTransaction })}
		{@const avalanchePChainTransactionSelector = avalanchePChainTransaction[EntityMetaKey.Selector]}
		{@const network = avalanchePChainTransactionSelector.$network}
		<EntityView
			entityType={EntityType.AvalanchePChainTransaction}
			entitySelector={avalanchePChainTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-tx/[txId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						txId: avalanchePChainTransactionSelector.txId,
					}
				)
			}
		>
			{#snippet Title()}
				{avalanchePChainTransactionSelector.txId || 'avalanche p chain transaction'}
			{/snippet}

			{#snippet Value()}
				{avalanchePChainTransaction.txType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{avalanchePChainTransaction.$block == null ? '' : String(avalanchePChainTransaction.$block.height) || avalanchePChainTransaction.$block.blockId || 'avalanche p chain block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
