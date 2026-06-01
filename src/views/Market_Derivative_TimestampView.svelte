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
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(entityId.$market)),
			},
		),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Market_Derivative_Timestamp>
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const derivativeTimestamp = useEntity(
		EntityType.Market_Derivative_Timestamp,
		entityId,
		{
			$: [
				Source.Coingecko_OpenApi,
			],
			fundingRate: {},
			openInterestUsd: {},
			indexBasisPercent: {},
			markPrice: {},
			indexPrice: {},
			expiredAtMs: {},
			lastTradedAtMs: {},
			providerAssetId: {},
			transport: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Derivative_Timestamp}
	{entityId}
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
				{#if derivativeTimestamp.fundingRate !== undefined}
					{String(derivativeTimestamp.fundingRate)}%
				{:else}
					<Timestamp
						timestamp={entityId.timestampMs}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
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
								timestamp={entityId.timestampMs}
							/>
						</dd>
					</div>

					{#if derivativeTimestamp.fundingRate !== undefined}
						<div>
							<dt>Funding rate</dt>
							<dd>{String(derivativeTimestamp.fundingRate)}%</dd>
						</div>
					{/if}

					{#if derivativeTimestamp.openInterestUsd !== undefined}
						<div>
							<dt>Open interest</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									scale={1}
									value={derivativeTimestamp.openInterestUsd}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.indexBasisPercent !== undefined
					)}
						<div>
							<dt>Index basis</dt>
							<dd>{String(derivativeTimestamp.indexBasisPercent)}%</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.expiredAtMs !== undefined
					)}
						<div>
							<dt>Expires</dt>
							<dd>
								<Timestamp
									timestamp={derivativeTimestamp.expiredAtMs}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.lastTradedAtMs !== undefined
					)}
						<div>
							<dt>Last traded</dt>
							<dd>
								<Timestamp
									timestamp={derivativeTimestamp.lastTradedAtMs}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.transport !== undefined
					)}
						<div>
							<dt>Transport</dt>
							<dd>{derivativeTimestamp.transport}</dd>
						</div>
					{/if}

					{#if (
						open
						&& derivativeTimestamp.providerAssetId != null
					)}
						<div>
							<dt>Provider asset id</dt>
							<dd>{derivativeTimestamp.providerAssetId}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
	{/snippet}
</EntityView>
