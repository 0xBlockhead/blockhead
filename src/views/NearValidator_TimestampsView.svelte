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
	}: EntityListViewProps<EntityType.NearValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearValidator_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				epochId: true,
				validatorSetRole: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: nearValidatorTimestamp })}
		{@const nearValidatorTimestampSelector = nearValidatorTimestamp[EntityMetaKey.Selector]}
		{@const validator = nearValidatorTimestampSelector.$validator}
		<EntityView
			entityType={EntityType.NearValidator_Timestamp}
			entitySelector={nearValidatorTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]/(selection)/epoch/[epochId=stringSegment]/[source=stringSegment]',
					{
						network: (
							validator.$network.caip2 !== undefined ?
								caip2StringFromValue(validator.$network.caip2)
							:
								validator.$network.slug
						),
						validatorId: validator.accountId,
						epochId: nearValidatorTimestampSelector.epochId,
						source: nearValidatorTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{nearValidatorTimestampSelector.epochId || 'near validator timestamp'}
			{/snippet}

			{#snippet Value()}
				{nearValidatorTimestamp.validatorSetRole ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearValidatorTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
