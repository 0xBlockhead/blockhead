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
	}: EntityListViewProps<EntityType.IcpCanister_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanister_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterTimestamp })}
		{@const icpCanisterTimestampSelector = icpCanisterTimestamp[EntityMetaKey.Selector]}
		{@const canister = icpCanisterTimestampSelector.$canister}
		<EntityView
			entityType={EntityType.IcpCanister_Timestamp}
			entitySelector={icpCanisterTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							canister.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(canister.$network.$network.caip2)
							:
								canister.$network.$network.slug
						),
						canisterId: canister.canisterId,
						timestampMs: String(icpCanisterTimestampSelector.timestampMs),
						source: icpCanisterTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP canister timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
