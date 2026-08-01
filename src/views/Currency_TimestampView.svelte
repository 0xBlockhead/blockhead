<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.Currency_Timestamp> = $props()

	const currencyTimestamp = $derived(selection({
		fields: {
			marketCap: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<EntityView
	entityType={EntityType.Currency_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'currency timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/observations/[timestampMs=nonNegativeInteger]',
				{
					iso4217: selection.entitySelector.$currency.iso4217,
					timestampMs: String(selection.entitySelector.timestampMs),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<CurrencyView
			selection={select(EntityType.Currency, selection.entitySelector.$currency)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={currencyTimestamp}>
			{#snippet children(entity)}
				{@const marketCap = entity.marketCap}
				{#if marketCap != null}
					<NumberValue
						value={Number(marketCap)}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={currencyTimestamp}
			>
				{#snippet children(entity)}
					{@const marketCap = entity.marketCap}
					{#if marketCap != null}
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
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Currency</dt>
				<dd>
					<CurrencyView
						selection={select(EntityType.Currency, selection.entitySelector.$currency)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
