<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A currency unit used for quoting values, balances, and market data.'],
		open = $bindable(true),
		id = 'Currencies-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Currency> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Currency}
	{id}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				name: true,
				iso4217: true,
			},
		})
	}
>
	{#snippet Item({ item: currency })}
		{@const currencySelector = currency[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Currency}
			entitySelector={currencySelector}
			href={
				resolve(
					'/(assets)/(currencies)/currency/[iso4217=iso4217]',
					{
						iso4217: currencySelector.iso4217,
					}
				)
			}
		>
			{#snippet Title()}
				{currency.name || currencySelector.iso4217 || 'currency'}
			{/snippet}

			{#snippet Value()}
				{currencySelector.iso4217}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
