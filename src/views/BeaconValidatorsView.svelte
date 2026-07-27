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
		title = 'Validators',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconValidator}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInNetwork: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconValidator })}
		{@const beaconValidatorSelector = beaconValidator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconValidator}
			entitySelector={beaconValidatorSelector}
			href={
				(
					'indexInNetwork' in beaconValidatorSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]',
							{
								network: (
									'caip2' in beaconValidatorSelector.$network ?
										String(caip2StringFromValue(beaconValidatorSelector.$network.caip2))
									:
										String(beaconValidatorSelector.$network.slug)
								),
								validatorId: String(beaconValidatorSelector.indexInNetwork),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{(String(beaconValidatorSelector.indexInNetwork ?? '') ? 'Validator #' + String(beaconValidatorSelector.indexInNetwork ?? '') : '') || 'beacon validator'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(beaconValidator.status ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
