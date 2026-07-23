<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.Currency_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Currency_Timestamp>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const currencyTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			marketCap: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			marketCap: true,
		},
	}))
	const titleFallback = 'currency timestamp'
	const viewDomId = $derived('currency-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<EntityView
	entityType={EntityType.Currency_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && '$currency' in selection.entitySelector
			&& selection.entitySelector.$currency != null && 'iso4217' in selection.entitySelector.$currency
			&& selection.entitySelector.$currency.iso4217 != null ?
				resolve('/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			iso4217: String(selection.entitySelector.$currency.iso4217 ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$currency') && prefetched.$currency != null && Object.hasOwn(prefetched.$currency, 'name') && Object.hasOwn(prefetched, 'marketCap')}
			{@const currency0 = pendingEntity.$currency}
			{#if currency0 != null && selection.entitySelector.$currency != null}
				<CurrencyView
					selection={select(EntityType.Currency, selection.entitySelector.$currency, { sources: selection.sources })}
					prefetched={currency0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={currencyTimestamp}>
				{#snippet children(entity)}
					<CurrencyView
						selection={select(EntityType.Currency, selection.entitySelector.$currency)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$currency') && prefetched.$currency != null && Object.hasOwn(prefetched.$currency, 'name') && Object.hasOwn(prefetched, 'marketCap')}
			{@const marketCap0 = pendingEntity.marketCap}
			{#if marketCap0 !== undefined && marketCap0 !== null}
				<NumberValue
					value={Number(marketCap0)}
					formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={currencyTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const marketCap0 = resolvedEntity.marketCap}
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$currency') && prefetched.$currency != null && Object.hasOwn(prefetched.$currency, 'name') && Object.hasOwn(prefetched, 'marketCap')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={currencyTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							marketCap: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const marketCap = resolvedEntity.marketCap}
					{#if marketCap !== undefined && marketCap !== null}
						<div>
							<dt>Market cap</dt>
							<dd>
								<NumberValue
									value={Number(marketCap)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Currency</dt>
				<dd>
					<CurrencyView
						selection={select(EntityType.Currency, selection.entitySelector.$currency)}
						href={
							(
								selection.entitySelector.$currency != null && 'iso4217' in selection.entitySelector.$currency
								&& selection.entitySelector.$currency.iso4217 != null ?
									resolve('/currency/[iso4217=iso4217]', {
								iso4217: String(selection.entitySelector.$currency.iso4217 ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
