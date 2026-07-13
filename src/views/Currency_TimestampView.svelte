<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const currencyTimestamp = $derived(selection({
		fields: {
			marketCap: true,
		},
	}))
	const titleFallback = $derived('currency timestamp')
	const viewDomId = $derived('currency-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.$currency !== undefined && pendingEntity.$currency.iso4217 !== undefined ? resolve('/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			iso4217: String(pendingEntity.$currency.iso4217 ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={currencyTimestamp}>
			{#snippet Pending()}
				<CurrencyView
					selection={select(EntityType.Currency, selection.entitySelector.$currency)}
					href={
						(selection.entitySelector.$currency.iso4217 !== undefined ? resolve('/currency/[iso4217=iso4217]', {
							iso4217: String(selection.entitySelector.$currency.iso4217 ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<CurrencyView
					selection={select(EntityType.Currency, selection.entitySelector.$currency)}
					href={
						(selection.entitySelector.$currency.iso4217 !== undefined ? resolve('/currency/[iso4217=iso4217]', {
							iso4217: String(selection.entitySelector.$currency.iso4217 ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={currencyTimestamp}>
			{#snippet Pending()}
				{@const marketCap0 = pendingEntity.marketCap}
				{#if marketCap0 !== undefined && marketCap0 !== null}
					<NumberValue
						value={Number(marketCap0)}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={currencyTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							marketCap: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const marketCap = pendingEntity.marketCap}
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
						selection={select(EntityType.Currency, selection.entitySelector.$currency, {})}
						href={
							(selection.entitySelector.$currency.iso4217 !== undefined ? resolve('/currency/[iso4217=iso4217]', {
								iso4217: String(selection.entitySelector.$currency.iso4217 ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
