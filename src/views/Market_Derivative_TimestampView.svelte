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
		href = resolve('/(assets)/(markets)/market/[marketKey]', {
			marketKey: stringify(selector.$market),
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Market_Derivative_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()

	const derivativeTimestamp = $derived(proxy(EntityType.Market_Derivative_Timestamp, selector, ({ sources: [
				Source.Coingecko_OpenApi,
			], fields: { fundingRate: true, openInterestUsd: true, indexBasisPercent: true, markPrice: true, indexPrice: true, expiredAtMs: true, lastTradedAtMs: true, providerAssetId: true, transport: true } })))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Derivative_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="Derivative observation"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			placeholderText="Loading derivative observation…"
			resource={derivativeTimestamp}
		>
			{#snippet children(derivativeTimestamp)}
				{#if derivativeTimestamp.fields.fundingRate !== undefined}
					{String(derivativeTimestamp.fields.fundingRate)}%
				{:else}
					<Timestamp
						timestamp={selector.timestampMs}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			placeholderText="Loading derivative observation…"
			resource={derivativeTimestamp}
		>
			{#snippet children(derivativeTimestamp)}
				{#if derivativeTimestamp.fields.fundingRate !== undefined}
					{String(derivativeTimestamp.fields.fundingRate)}%
				{:else}
					<Timestamp
						timestamp={selector.timestampMs}
					/>
				{/if}
	{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A timestamped derivative-market observation, separated from the stable market identity.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			placeholderText="Loading derivative observation…"
			resource={derivativeTimestamp}
		>
			{#snippet children(derivativeTimestamp)}
				<dl data-column-item="center">
					<div>
						<dt>Observed at</dt>
						<dd>
							<Timestamp
								timestamp={selector.timestampMs}
							/>
						</dd>
					</div>

					{#if derivativeTimestamp.fields.fundingRate !== undefined}
						<div>
							<dt>Funding rate</dt>
							<dd>{String(derivativeTimestamp.fields.fundingRate)}%</dd>
						</div>
					{/if}

					{#if derivativeTimestamp.fields.openInterestUsd !== undefined}
						<div>
							<dt>Open interest</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									scale={1}
									value={derivativeTimestamp.fields.openInterestUsd}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.fields.indexBasisPercent !== undefined
					)}
						<div>
							<dt>Index basis</dt>
							<dd>{String(derivativeTimestamp.fields.indexBasisPercent)}%</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.fields.expiredAtMs !== undefined
					)}
						<div>
							<dt>Expires</dt>
							<dd>
								<Timestamp
									timestamp={derivativeTimestamp.fields.expiredAtMs}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.fields.lastTradedAtMs !== undefined
					)}
						<div>
							<dt>Last traded</dt>
							<dd>
								<Timestamp
									timestamp={derivativeTimestamp.fields.lastTradedAtMs}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.fields.transport !== undefined
					)}
						<div>
							<dt>Transport</dt>
							<dd>{derivativeTimestamp.fields.transport}</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.fields.providerAssetId != null
					)}
						<div>
							<dt>Provider asset id</dt>
							<dd>{derivativeTimestamp.fields.providerAssetId}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
