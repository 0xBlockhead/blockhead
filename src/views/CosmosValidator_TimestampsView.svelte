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
		title = 'Validator snapshots',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosValidator_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					source: true,
					status: true,
					tokens: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cosmosValidatorTimestamp })}
		{@const cosmosValidatorTimestampSelector = cosmosValidatorTimestamp[EntityMetaKey.Selector]}
		{@const validator = cosmosValidatorTimestampSelector.$validator}
		<EntityView
			entityType={EntityType.CosmosValidator_Timestamp}
			entitySelector={cosmosValidatorTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkeyOrStringSegment]/(selection)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in validator.$network ?
								caip2StringFromValue(validator.$network.caip2)
							:
								validator.$network.slug
						),
						validatorId: validator.operatorAddress,
						timestampMs: String(cosmosValidatorTimestampSelector.timestampMs),
						source: cosmosValidatorTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{cosmosValidatorTimestampSelector.source || 'Cosmos validator timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(cosmosValidatorTimestamp.status ?? ''), String(cosmosValidatorTimestamp.tokens ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosValidatorTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
