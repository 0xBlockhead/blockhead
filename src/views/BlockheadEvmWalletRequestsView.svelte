<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadEvmWalletRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadEvmWalletRequest}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
				$simulation: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadEvmWalletRequest })}
		{@const blockheadEvmWalletRequestSelector = blockheadEvmWalletRequest[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadEvmWalletRequest}
			entitySelector={blockheadEvmWalletRequestSelector}
			href={
				resolve(
					'/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/evm-request',
					{
						id: blockheadEvmWalletRequestSelector.$walletRequest.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadEvmWalletRequest.$network.name || (blockheadEvmWalletRequest.$network.caip2 == null ? '' : `${blockheadEvmWalletRequest.$network.caip2.namespace}:${blockheadEvmWalletRequest.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{blockheadEvmWalletRequest.$simulation == null ? '' : blockheadEvmWalletRequest.$simulation.status || 'blockhead session simulation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
