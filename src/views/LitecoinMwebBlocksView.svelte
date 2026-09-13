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
	}: EntityListViewProps<EntityType.LitecoinMwebBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebBlock}
	bind:open
	resource={
		selection({
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
		})
	}
>
	{#snippet Item({ item: litecoinMwebBlock })}
		{@const litecoinMwebBlockSelector = litecoinMwebBlock[EntityMetaKey.Selector]}
		{@const block = litecoinMwebBlockSelector.$block}
		<EntityView
			entityType={EntityType.LitecoinMwebBlock}
			entitySelector={litecoinMwebBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb',
					{
						network: (
							block.$network.caip2 !== undefined ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						blockNumber: String(block.height),
					}
				)
			}
		>
			{#snippet Title()}
				{`Block #${litecoinMwebBlockSelector.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{litecoinMwebBlock.hogExTransactionId ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{litecoinMwebBlock.kernelRoot ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
