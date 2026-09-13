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
	}: EntityListViewProps<EntityType.IcpCertifiedState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCertifiedState}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCertifiedState })}
		{@const icpCertifiedStateSelector = icpCertifiedState[EntityMetaKey.Selector]}
		{@const canister = icpCertifiedStateSelector.$canister}
		<EntityView
			entityType={EntityType.IcpCertifiedState}
			entitySelector={icpCertifiedStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/certified-state/[certificateHash=stringSegment]/[pathHash=stringSegment]',
					{
						network: (
							canister.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(canister.$network.$network.caip2)
							:
								canister.$network.$network.slug
						),
						canisterId: canister.canisterId,
						certificateHash: icpCertifiedStateSelector.certificateHash,
						pathHash: icpCertifiedStateSelector.pathHash,
					}
				)
			}
		>
			{#snippet Title()}
				ICP certified state
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
