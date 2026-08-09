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
	}: EntityListViewProps<EntityType.IcpLedgerCanister_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerCanister_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerCanisterTimestamp })}
		{@const icpLedgerCanisterTimestampSelector = icpLedgerCanisterTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpLedgerCanister_Timestamp}
			entitySelector={icpLedgerCanisterTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in icpLedgerCanisterTimestampSelector.$ledger.$canister.$network.$network ?
								caip2StringFromValue(icpLedgerCanisterTimestampSelector.$ledger.$canister.$network.$network.caip2)
							:
								icpLedgerCanisterTimestampSelector.$ledger.$canister.$network.$network.slug
						),
						canisterId: icpLedgerCanisterTimestampSelector.$ledger.$canister.canisterId,
						timestampMs: String(icpLedgerCanisterTimestampSelector.timestampMs),
						source: icpLedgerCanisterTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP ledger canister timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
