<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
				iso4217: entityId.$currency.iso4217,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Currency_Timestamp>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const currencyTimestamp = useEntity(
		EntityType.Currency_Timestamp,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			marketCap: {},
		},
	)

	const currency = useEntity(
		EntityType.Currency,
		entityId.$currency,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
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
	{entityId}
	href={href}
	title={`Currency snapshot ${entityId.$currency.iso4217}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={currencyTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(currencyTimestamp)}
				{#if currencyTimestamp.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={currencyTimestamp.marketCap}
					/>
				{:else}
					<span>
						{entityId.$currency.iso4217}
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
				{#if currencyTimestamp.marketCap !== undefined}
					<CurrencyAmount
						currency="USD"
						value={currencyTimestamp.marketCap}
					/>
				{:else}
					<span>
						{entityId.$currency.iso4217}
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
					{#if currencyTimestamp.marketCap !== undefined}
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
									value={currencyTimestamp.marketCap}
								/>
							</dd>
						</div>
					{/if}
					<div>
						<dt>Currency</dt>
						<dd>
							<ResourceBoundary
								resource={currency}
								placeholderText="Loading currency…"
							>
								{#snippet children(currency)}
									{currency.name ?? entityId.$currency.iso4217}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					<div>
						<dt>Snapshot wall time</dt>
						<dd>
							<Timestamp
								timestamp={entityId.timestampMs}
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
				entityId={entityId.$currency}
				id={`${stringify(entityId)}:currency`}
				open={false}
			/>
		</section>

	{/snippet}
</EntityView>
