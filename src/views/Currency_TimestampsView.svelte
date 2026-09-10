<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Currency_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Currency_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$currency: {
					fields: {
						name: true,
					},
				},
				marketCap: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: currencyTimestamp })}
		{@const currencyTimestampSelector = currencyTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Currency_Timestamp}
			entitySelector={currencyTimestampSelector}
			href={
				resolve(
					'/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/observations/[timestampMs=nonNegativeInteger]',
					{
						iso4217: currencyTimestampSelector.$currency.iso4217,
						timestampMs: String(currencyTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{currencyTimestamp.$currency.name || currencyTimestampSelector.$currency.iso4217 || 'currency'}
			{/snippet}

			{#snippet Value()}
				{currencyTimestamp.marketCap ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{currencyTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
