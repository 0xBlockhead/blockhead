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
	}: EntityListViewProps<EntityType.LitecoinMwebPegIn> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebPegIn}
	bind:open
	resource={
		selection({
			fields: {
				$transaction: true,
				pegInIndex: true,
				$transparentOutput: true,
			},
		})
	}
>
	{#snippet Item({ item: litecoinMwebPegIn })}
		{@const litecoinMwebPegInSelector = litecoinMwebPegIn[EntityMetaKey.Selector]}
		{@const transaction = litecoinMwebPegInSelector.$transaction}
		<EntityView
			entityType={EntityType.LitecoinMwebPegIn}
			entitySelector={litecoinMwebPegInSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/peg-in/[pegInIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$mwebBlock.$block.$network ?
								caip2StringFromValue(transaction.$mwebBlock.$block.$network.caip2)
							:
								transaction.$mwebBlock.$block.$network.slug
						),
						blockNumber: String(transaction.$mwebBlock.$block.height),
						transactionIndex: String(transaction.transactionIndex),
						pegInIndex: String(litecoinMwebPegInSelector.pegInIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{`Block #${litecoinMwebPegInSelector.$transaction.$mwebBlock.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebPegInSelector.pegInIndex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{litecoinMwebPegIn.$transparentOutput == null ? '' : `Output #${litecoinMwebPegIn.$transparentOutput.indexInTransaction}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
