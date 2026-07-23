<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Currencies',
		typeAnnotationParagraphs = ['A currency unit used for quoting values, balances, and market data.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Currencies-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Currency>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Currency}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				name: true,
				iso4217: true,
			},
		})
	}
	{countResource}
	getResourceItems={(currencies) => [...new Map(currencies.values.map((currency) => [currency[EntityMetaKey.SelectorKey], currency])).values()]}
	getKey={(currency) => currency[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Currencies yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: currency })}
		{@const currencyFields = { ...currency[EntityMetaKey.Selector], ...currency }}
		<EntityView
			entityType={EntityType.Currency}
			entitySelector={currency[EntityMetaKey.Selector]}
			href={
				(
					currency[EntityMetaKey.Selector] != null && 'iso4217' in currency[EntityMetaKey.Selector]
					&& currency[EntityMetaKey.Selector].iso4217 != null ?
						resolve('/currency/[iso4217=iso4217]', {
					iso4217: String(currency[EntityMetaKey.Selector].iso4217 ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((currencyFields.name) ?? '')].filter(Boolean).join(' ') || [String((currencyFields.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency'}
			{/snippet}

			{#snippet Value()}
				{[String((currencyFields.iso4217) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
