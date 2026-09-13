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
		{@const network = beaconValidatorSelector.$network}
		<EntityView
			entityType={EntityType.BeaconValidator}
			entitySelector={beaconValidatorSelector}
			href={
				beaconValidatorSelector.pubkey !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/pubkey/[validatorPubkey=stringSegment]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							validatorPubkey: beaconValidatorSelector.pubkey,
						}
					)
				:
					beaconValidatorSelector.indexInNetwork !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								validatorId: String(beaconValidatorSelector.indexInNetwork),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{`Validator #${beaconValidator.indexInNetwork}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconValidator.status ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
