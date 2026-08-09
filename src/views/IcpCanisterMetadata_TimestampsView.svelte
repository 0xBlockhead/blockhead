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
	}: EntityListViewProps<EntityType.IcpCanisterMetadata_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterMetadata_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterMetadataTimestamp })}
		{@const icpCanisterMetadataTimestampSelector = icpCanisterMetadataTimestamp[EntityMetaKey.Selector]}
		{@const metadata = icpCanisterMetadataTimestampSelector.$metadata}
		<EntityView
			entityType={EntityType.IcpCanisterMetadata_Timestamp}
			entitySelector={icpCanisterMetadataTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/metadata/[metadataName=stringSegment]/(icpCanisterMetadata)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in metadata.$canister.$network.$network ?
								caip2StringFromValue(metadata.$canister.$network.$network.caip2)
							:
								metadata.$canister.$network.$network.slug
						),
						canisterId: metadata.$canister.canisterId,
						metadataName: metadata.metadataName,
						timestampMs: String(icpCanisterMetadataTimestampSelector.timestampMs),
						source: icpCanisterMetadataTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				ICP canister metadata timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
