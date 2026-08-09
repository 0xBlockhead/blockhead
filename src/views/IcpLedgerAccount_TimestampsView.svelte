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
	}: EntityListViewProps<EntityType.IcpLedgerAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerAccountTimestamp })}
		{@const icpLedgerAccountTimestampSelector = icpLedgerAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpLedgerAccount_Timestamp}
			entitySelector={icpLedgerAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/account/[owner=stringSegment]/[subaccount=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in icpLedgerAccountTimestampSelector.$ledger.$canister.$network.$network ?
								caip2StringFromValue(icpLedgerAccountTimestampSelector.$ledger.$canister.$network.$network.caip2)
							:
								icpLedgerAccountTimestampSelector.$ledger.$canister.$network.$network.slug
						),
						canisterId: icpLedgerAccountTimestampSelector.$ledger.$canister.canisterId,
						owner: icpLedgerAccountTimestampSelector.owner,
						subaccount: icpLedgerAccountTimestampSelector.subaccount,
						timestampMs: String(icpLedgerAccountTimestampSelector.timestampMs),
						source: icpLedgerAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP ledger account timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
