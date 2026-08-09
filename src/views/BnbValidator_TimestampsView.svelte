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
	}: EntityListViewProps<EntityType.BnbValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbValidator_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					jailed: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bnbValidatorTimestamp })}
		{@const bnbValidatorTimestampSelector = bnbValidatorTimestamp[EntityMetaKey.Selector]}
		{@const validator = bnbValidatorTimestampSelector.$validator}
		<EntityView
			entityType={EntityType.BnbValidator_Timestamp}
			entitySelector={bnbValidatorTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/validator/[operatorAddress=stringSegment]/(bnbValidator)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in validator.$network.$network ?
								caip2StringFromValue(validator.$network.$network.caip2)
							:
								validator.$network.$network.slug
						),
						operatorAddress: validator.operatorAddress,
						timestampMs: String(bnbValidatorTimestampSelector.timestampMs),
						source: bnbValidatorTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bnbValidatorTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(bnbValidatorTimestamp.status ?? ''), String(bnbValidatorTimestamp.jailed ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbValidatorTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
