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
	}: EntityListViewProps<EntityType.SolanaValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaValidator_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					slot: true,
					delinquent: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: solanaValidatorTimestamp })}
		{@const solanaValidatorTimestampSelector = solanaValidatorTimestamp[EntityMetaKey.Selector]}
		{@const validator = solanaValidatorTimestampSelector.$validator}
		<EntityView
			entityType={EntityType.SolanaValidator_Timestamp}
			entitySelector={solanaValidatorTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in validator.$network ?
								caip2StringFromValue(validator.$network.caip2)
							:
								validator.$network.slug
						),
						validatorId: validator.votePubkey,
						slot: String(solanaValidatorTimestampSelector.slot),
						source: solanaValidatorTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaValidatorTimestampSelector.slot}
			{/snippet}

			{#snippet Value()}
				{solanaValidatorTimestamp.delinquent ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaValidatorTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
