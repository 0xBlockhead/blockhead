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
		id = 'IcpCanisterMetadataEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.IcpCanisterMetadata> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterMetadata}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterMetadata })}
		{@const icpCanisterMetadataSelector = icpCanisterMetadata[EntityMetaKey.Selector]}
		{@const canister = icpCanisterMetadataSelector.$canister}
		<EntityView
			entityType={EntityType.IcpCanisterMetadata}
			entitySelector={icpCanisterMetadataSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/metadata/[metadataName=stringSegment]',
					{
						network: (
							'caip2' in canister.$network.$network ?
								caip2StringFromValue(canister.$network.$network.caip2)
							:
								canister.$network.$network.slug
						),
						canisterId: canister.canisterId,
						metadataName: icpCanisterMetadataSelector.metadataName,
					}
				)
			}
		>
			{#snippet Title()}
				ICP canister metadata
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
