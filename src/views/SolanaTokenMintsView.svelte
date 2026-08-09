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
		title = 'Token mints',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaTokenMint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTokenMint}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					mintAddress: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: solanaTokenMint })}
		{@const solanaTokenMintSelector = solanaTokenMint[EntityMetaKey.Selector]}
		{@const network = solanaTokenMintSelector.$network}
		<EntityView
			entityType={EntityType.SolanaTokenMint}
			entitySelector={solanaTokenMintSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						mintAddress: solanaTokenMintSelector.mintAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaTokenMintSelector.mintAddress || 'solana token mint'}
			{/snippet}

			{#snippet Value()}
				{solanaTokenMintSelector.mintAddress}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaTokenMint.$network.name || (solanaTokenMint.$network.caip2 == null ? '' : `${solanaTokenMint.$network.caip2.namespace}:${solanaTokenMint.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
