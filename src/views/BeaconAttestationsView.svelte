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
		title = 'Attestations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconAttestation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconAttestation}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInSlot: true,
				slot: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconAttestation })}
		{@const beaconAttestationSelector = beaconAttestation[EntityMetaKey.Selector]}
		{@const network = beaconAttestationSelector.$network}
		<EntityView
			entityType={EntityType.BeaconAttestation}
			entitySelector={beaconAttestationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/attestation/[index=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						slot: String(beaconAttestationSelector.slot),
						index: String(beaconAttestationSelector.indexInSlot),
					}
				)
			}
		>
			{#snippet Title()}
				{`Attestation #${beaconAttestationSelector.indexInSlot}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{'Slot ' + beaconAttestationSelector.slot}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
