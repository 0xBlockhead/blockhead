<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Currency observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Currency_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Currency_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					$currency: true,
					marketCap: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Currency_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(currencyTimestamps)}
			{@const uniqueCurrencyTimestamps = [...new Map(currencyTimestamps.values.map((currencyTimestamp) => [currencyTimestamp[EntityMetaKey.SelectorKey], currencyTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Currency_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={currencyTimestamps.totalCount}
				getKey={(currencyTimestamp) => currencyTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCurrencyTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Currency observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: currencyTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Currency_Timestamp> })}
					{@const currencyTimestampFields = { ...currencyTimestamp[EntityMetaKey.Selector], ...currencyTimestamp }}
					{@const currencyTimestampHrefFields = { ...currencyTimestamp, ...currencyTimestamp[EntityMetaKey.Selector] }}
					<Currency_TimestampView
						selection={select(EntityType.Currency_Timestamp, currencyTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={currencyTimestampFields}
						href={
							(currencyTimestampHrefFields.$currency !== undefined && currencyTimestampHrefFields.$currency.iso4217 !== undefined && currencyTimestampHrefFields.timestampMs !== undefined ? resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
								iso4217: String(currencyTimestampHrefFields.$currency.iso4217 ?? ''),
								timestampMs: String(currencyTimestampHrefFields.timestampMs ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.Currency_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
