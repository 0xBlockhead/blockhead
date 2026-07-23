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
		title = 'Currency observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Currency_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Currency_Timestamp>
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
	entityType={EntityType.Currency_Timestamp}
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
	{countResource}
	getResourceItems={(currencyTimestamps) => [...new Map(currencyTimestamps.values.map((currencyTimestamp) => [currencyTimestamp[EntityMetaKey.SelectorKey], currencyTimestamp])).values()]}
	getKey={(currencyTimestamp) => currencyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Currency observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: currencyTimestamp })}
		{@const currencyTimestampFields = { ...currencyTimestamp[EntityMetaKey.Selector], ...currencyTimestamp }}
		<EntityView
			entityType={EntityType.Currency_Timestamp}
			entitySelector={currencyTimestamp[EntityMetaKey.Selector]}
			href={
				(
					currencyTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in currencyTimestamp[EntityMetaKey.Selector]
					&& currencyTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& currencyTimestamp[EntityMetaKey.Selector] != null && '$currency' in currencyTimestamp[EntityMetaKey.Selector]
					&& currencyTimestamp[EntityMetaKey.Selector].$currency != null && 'iso4217' in currencyTimestamp[EntityMetaKey.Selector].$currency
					&& currencyTimestamp[EntityMetaKey.Selector].$currency.iso4217 != null ?
						resolve('/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(currencyTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					iso4217: String(currencyTimestamp[EntityMetaKey.Selector].$currency.iso4217 ?? ''),
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
				{[[String((currencyTimestampFields.$currency.name) ?? '')].filter(Boolean).join(' ') || [String((currencyTimestampFields.$currency.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency'].filter(Boolean).join(' ') || 'currency timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((currencyTimestampFields.marketCap) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((currencyTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
