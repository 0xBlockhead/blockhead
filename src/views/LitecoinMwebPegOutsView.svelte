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
	}: EntityListViewProps<EntityType.LitecoinMwebPegOut> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebPegOut}
	bind:open
	resource={
		selection({
			fields: {
				$transaction: true,
				pegOutIndex: true,
				$transparentOutput: true,
			},
		})
	}
>
	{#snippet Item({ item: litecoinMwebPegOut })}
		{@const litecoinMwebPegOutSelector = litecoinMwebPegOut[EntityMetaKey.Selector]}
		{@const transaction = litecoinMwebPegOutSelector.$transaction}
		<EntityView
			entityType={EntityType.LitecoinMwebPegOut}
			entitySelector={litecoinMwebPegOutSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/peg-out/[pegOutIndex=nonNegativeInteger]',
					{
						network: (
							transaction.$mwebBlock.$block.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$mwebBlock.$block.$network.caip2)
							:
								transaction.$mwebBlock.$block.$network.slug
						),
						blockNumber: String(transaction.$mwebBlock.$block.height),
						transactionIndex: String(transaction.transactionIndex),
						pegOutIndex: String(litecoinMwebPegOutSelector.pegOutIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{`Block #${litecoinMwebPegOutSelector.$transaction.$mwebBlock.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebPegOutSelector.pegOutIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{litecoinMwebPegOut.$transparentOutput == null ? '' : `Output #${litecoinMwebPegOut.$transparentOutput.indexInTransaction}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
