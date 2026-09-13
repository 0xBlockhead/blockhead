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
	}: EntityListViewProps<EntityType.IcpCanisterLog_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterLog_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterLogTimestamp })}
		{@const icpCanisterLogTimestampSelector = icpCanisterLogTimestamp[EntityMetaKey.Selector]}
		{@const canister = icpCanisterLogTimestampSelector.$canister}
		<EntityView
			entityType={EntityType.IcpCanisterLog_Timestamp}
			entitySelector={icpCanisterLogTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/log/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							canister.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(canister.$network.$network.caip2)
							:
								canister.$network.$network.slug
						),
						canisterId: canister.canisterId,
						timestampMs: String(icpCanisterLogTimestampSelector.timestampMs),
						source: icpCanisterLogTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP canister log timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
