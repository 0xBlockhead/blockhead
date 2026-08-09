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
	}: EntityListViewProps<EntityType.IcpCanisterMethod_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterMethod_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterMethodTimestamp })}
		{@const icpCanisterMethodTimestampSelector = icpCanisterMethodTimestamp[EntityMetaKey.Selector]}
		{@const method = icpCanisterMethodTimestampSelector.$method}
		<EntityView
			entityType={EntityType.IcpCanisterMethod_Timestamp}
			entitySelector={icpCanisterMethodTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/method/[methodName=stringSegment]/[methodKind=stringSegment]/(icpCanisterMethod)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in method.$canister.$network.$network ?
								caip2StringFromValue(method.$canister.$network.$network.caip2)
							:
								method.$canister.$network.$network.slug
						),
						canisterId: method.$canister.canisterId,
						methodName: method.methodName,
						methodKind: method.methodKind,
						timestampMs: String(icpCanisterMethodTimestampSelector.timestampMs),
						source: icpCanisterMethodTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP canister method timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
