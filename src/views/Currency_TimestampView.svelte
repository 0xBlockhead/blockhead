<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Currency_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Currency_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const currencyTimestamp = $derived(selection({
		fields: {
			marketCap: true,
		},
	}))
	const titleFallback = $derived('currency timestamp')
	const viewDomId = $derived('currency-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<EntityView
	entityType={EntityType.Currency_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
			iso4217: String(({ ...selection.entitySelector, ...prefetched }).$currency.iso4217),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<CurrencyView
				selection={select(EntityType.Currency, selection.entitySelector.$currency)}
				href={
						resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
							iso4217: String(selection.entitySelector.$currency.iso4217),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={currencyTimestamp}>
				{#snippet Pending()}
					<CurrencyView
						selection={select(EntityType.Currency, selection.entitySelector.$currency)}
						href={
							resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
								iso4217: String(selection.entitySelector.$currency.iso4217),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<CurrencyView
						selection={select(EntityType.Currency, selection.entitySelector.$currency)}
						href={
							resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
								iso4217: String(selection.entitySelector.$currency.iso4217),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const marketCap0 = ({ ...selection.entitySelector, ...prefetched }).marketCap}
			{#if marketCap0 !== undefined && marketCap0 !== null}
				<NumberValue
					value={Number(marketCap0)}
					formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={currencyTimestamp}>
				{#snippet Pending()}
					{@const marketCap0 = ({ ...selection.entitySelector, ...prefetched }).marketCap}
					{#if marketCap0 !== undefined && marketCap0 !== null}
						<NumberValue
							value={Number(marketCap0)}
							formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
						/>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const marketCap0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).marketCap}
					{#if marketCap0 !== undefined && marketCap0 !== null}
						<NumberValue
							value={Number(marketCap0)}
							formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = prefetched.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={currencyTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = prefetched.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = entity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
