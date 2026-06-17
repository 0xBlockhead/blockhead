<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
				iso4217: selector.$currency.iso4217,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Currency_Timestamp>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const currencyTimestamp = $derived(proxy(EntityType.Currency_Timestamp, selector, ({ sources: [
				Source.Constants_Internal,
			], fields: { marketCap: true } })))

	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.Currency_Timestamp}
	bind:open
	entitySelector={selector}
	href={href}
	title={`Currency snapshot ${selector.$currency.iso4217}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={currencyTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(currencyTimestamp)}
				{#if currencyTimestamp.fields.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={currencyTimestamp.fields.marketCap}
					/>
				{:else}
					<span>
						{selector.$currency.iso4217}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={currencyTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(currencyTimestamp)}
				{#if currencyTimestamp.fields.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={currencyTimestamp.fields.marketCap}
					/>
				{:else}
					<span>
						{selector.$currency.iso4217}
					</span>
				{/if}
	{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Catalog snapshot for ordering and display: <strong>FX turnover weight</strong> in USD (BIS-style daily share), not crypto market capitalization.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={currencyTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(currencyTimestamp)}
				<dl data-column-item="center">
					{#if currencyTimestamp.fields.marketCap !== undefined}
						<div>
							<dt>
								FX turnover weight (USD)
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Static catalog weight proportional to typical daily FX turnover — used to sort currencies, not live M2 or coin market cap.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="FX turnover weight"
									>ⓘ</abbr>
								</Tooltip>
							</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									value={currencyTimestamp.fields.marketCap}
								/>
							</dd>
						</div>
					{/if}
					<div>
						<dt>Currency</dt>
						<dd>
							<ResourceBoundary
								resource={proxy(EntityType.Currency, selector.$currency, ({ sources: [
										Source.Constants_Internal,
									], fields: { name: true } }))}
								placeholderText="Loading currency…"
							>
								{#snippet children(currency)}
									{currency.fields.name ?? selector.$currency.iso4217}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					<div>
						<dt>Snapshot wall time</dt>
						<dd>
							<Timestamp
								timestamp={selector.timestampMs}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
		<section data-scroll-marker-label="Currency">
			<CurrencyView
				selector={selector.$currency}
				id={`${stringify(selector)}:currency`}

			/>
		</section>

	{/snippet}
</EntityView>
