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
				indexInBlock: true,
				$block: {
					fields: {
						version: true,
						$slot: {
							fields: {
								$epoch: true,
							},
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconAttestation })}
		{@const beaconAttestationSelector = beaconAttestation[EntityMetaKey.Selector]}
		{@const block = beaconAttestationSelector.$block}
		<EntityView
			entityType={EntityType.BeaconAttestation}
			entitySelector={beaconAttestationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/attestation/[indexInBlock=nonNegativeInteger]',
					{
						network: (
							block.$network.caip2 !== undefined ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						root: block.root,
						indexInBlock: String(beaconAttestationSelector.indexInBlock),
					}
				)
			}
		>
			{#snippet Title()}
				{`Attestation #${beaconAttestationSelector.indexInBlock}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconAttestationSelector.$block.root || 'beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
