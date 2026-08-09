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
	}: EntityListViewProps<EntityType.LitecoinMwebOutput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebOutput}
	bind:open
	resource={
		selection({
			...{
				fields: {
					commitment: true,
					outputIndex: true,
					$transaction: {
						fields: {
							$mwebBlock: {
								fields: {
									$block: {
										fields: {
											hash: true,
											transactionCount: true,
										},
									},
									hogExTransactionId: true,
									kernelRoot: true,
								},
							},
							kernelOffset: true,
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: litecoinMwebOutput })}
		{@const litecoinMwebOutputSelector = litecoinMwebOutput[EntityMetaKey.Selector]}
		{@const transaction = litecoinMwebOutputSelector.$transaction}
		<EntityView
			entityType={EntityType.LitecoinMwebOutput}
			entitySelector={litecoinMwebOutputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/output/[outputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$mwebBlock.$block.$network ?
								caip2StringFromValue(transaction.$mwebBlock.$block.$network.caip2)
							:
								transaction.$mwebBlock.$block.$network.slug
						),
						blockNumber: String(transaction.$mwebBlock.$block.height),
						transactionIndex: String(transaction.transactionIndex),
						outputIndex: String(litecoinMwebOutputSelector.outputIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{(litecoinMwebOutput.commitment ?? '') || `Block #${litecoinMwebOutputSelector.$transaction.$mwebBlock.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebOutputSelector.outputIndex}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
