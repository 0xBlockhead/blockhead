<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.BeaconValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconValidator_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconValidatorTimestamp })}
		{@const beaconValidatorTimestampSelector = beaconValidatorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconValidator_Timestamp}
			entitySelector={beaconValidatorTimestampSelector}
			href={
				(
					'indexInNetwork' in beaconValidatorTimestampSelector.$validator ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]',
							{
								network: (
									'caip2' in beaconValidatorTimestampSelector.$validator.$network ?
										String(caip2StringFromValue(beaconValidatorTimestampSelector.$validator.$network.caip2))
									:
										String(beaconValidatorTimestampSelector.$validator.$network.slug)
								),
								validatorId: String(beaconValidatorTimestampSelector.$validator.indexInNetwork),
								slot: String(beaconValidatorTimestampSelector.slot),
								source: String(beaconValidatorTimestampSelector.source),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{(String(beaconValidatorTimestampSelector.slot ?? '') ? 'Slot #' + String(beaconValidatorTimestampSelector.slot ?? '') : '') || 'beacon validator timestamp'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(beaconValidatorTimestamp.status ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
