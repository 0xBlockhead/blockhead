<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'ERC-8004 Registrations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmNft> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNft}
	{title}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Eip8004Scan_Rest,
			],
			fields: {
				name: true,
				tokenId: true,
			},
			limit: 100,
		})
	}
>
	{#snippet Item({ item: evmNft })}
		{@const evmNftSelector = evmNft[EntityMetaKey.Selector]}
		{@const contract = evmNftSelector.$contract}
		<EntityView
			entityType={EntityType.EvmNft}
			entitySelector={evmNftSelector}
			href={
				'caip2' in contract.$network ?
					resolve(
						'/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]',
						{
							chainId: contract.$network.caip2.reference,
							contractAddress: contract.address,
							tokenId: evmNftSelector.tokenId,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{(evmNft.name ?? '') || evmNftSelector.tokenId || 'EVM NFT'}
			{/snippet}

			{#snippet Value()}
				{evmNftSelector.tokenId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
