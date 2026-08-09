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
	}: EntityListViewProps<EntityType.IcpLedgerCanister> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerCanister}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerCanister })}
		{@const icpLedgerCanisterSelector = icpLedgerCanister[EntityMetaKey.Selector]}
		{@const canister = icpLedgerCanisterSelector.$canister}
		<EntityView
			entityType={EntityType.IcpLedgerCanister}
			entitySelector={icpLedgerCanisterSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger',
					{
						network: (
							'caip2' in canister.$network.$network ?
								caip2StringFromValue(canister.$network.$network.caip2)
							:
								canister.$network.$network.slug
						),
						canisterId: canister.canisterId,
					}
				)
			}
		>
			{#snippet Title()}
				ICP ledger canister
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
