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
	}: EntityListViewProps<EntityType.IcpLedgerBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerBlock })}
		{@const icpLedgerBlockSelector = icpLedgerBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpLedgerBlock}
			entitySelector={icpLedgerBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/block/[blockIndex=nonNegativeBigInt]',
					{
						network: (
							'caip2' in icpLedgerBlockSelector.$ledger.$canister.$network.$network ?
								caip2StringFromValue(icpLedgerBlockSelector.$ledger.$canister.$network.$network.caip2)
							:
								icpLedgerBlockSelector.$ledger.$canister.$network.$network.slug
						),
						canisterId: icpLedgerBlockSelector.$ledger.$canister.canisterId,
						blockIndex: String(icpLedgerBlockSelector.blockIndex),
					}
				)
			}
		>
			{#snippet Title()}
				ICP ledger block
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
