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
	}: EntityListViewProps<EntityType.IcpCanisterMethod> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterMethod}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterMethod })}
		{@const icpCanisterMethodSelector = icpCanisterMethod[EntityMetaKey.Selector]}
		{@const canister = icpCanisterMethodSelector.$canister}
		<EntityView
			entityType={EntityType.IcpCanisterMethod}
			entitySelector={icpCanisterMethodSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/method/[methodName=stringSegment]/[methodKind=stringSegment]',
					{
						network: (
							canister.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(canister.$network.$network.caip2)
							:
								canister.$network.$network.slug
						),
						canisterId: canister.canisterId,
						methodName: icpCanisterMethodSelector.methodName,
						methodKind: icpCanisterMethodSelector.methodKind,
					}
				)
			}
		>
			{#snippet Title()}
				ICP canister method
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
