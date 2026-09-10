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
	}: EntityListViewProps<EntityType.BlockheadWalletRequestCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletRequestCall}
	bind:open
	resource={
		selection({
			fields: {
				callIndex: true,
				toAddress: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWalletRequestCall })}
		{@const blockheadWalletRequestCallSelector = blockheadWalletRequestCall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletRequestCall}
			entitySelector={blockheadWalletRequestCallSelector}
			href={
				resolve(
					'/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/evm-request/(blockheadEvmWalletRequest)/call/[callIndex=nonNegativeInteger]',
					{
						id: blockheadWalletRequestCallSelector.$evmRequest.$walletRequest.id,
						callIndex: String(blockheadWalletRequestCallSelector.callIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{`Call #${blockheadWalletRequestCallSelector.callIndex}`}
			{/snippet}

			{#snippet Value()}
				{blockheadWalletRequestCall.toAddress ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
