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
	}: EntityListViewProps<EntityType.IcpLedgerTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerTransaction })}
		{@const icpLedgerTransactionSelector = icpLedgerTransaction[EntityMetaKey.Selector]}
		{@const block = icpLedgerTransactionSelector.$block}
		<EntityView
			entityType={EntityType.IcpLedgerTransaction}
			entitySelector={icpLedgerTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/block/[blockIndex=nonNegativeBigInt]/(icpLedgerBlock)/transaction/[transactionIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in block.$ledger.$canister.$network.$network ?
								caip2StringFromValue(block.$ledger.$canister.$network.$network.caip2)
							:
								block.$ledger.$canister.$network.$network.slug
						),
						canisterId: block.$ledger.$canister.canisterId,
						blockIndex: String(block.blockIndex),
						transactionIndex: String(icpLedgerTransactionSelector.transactionIndex),
					}
				)
			}
		>
			{#snippet Title()}
				ICP ledger transaction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
