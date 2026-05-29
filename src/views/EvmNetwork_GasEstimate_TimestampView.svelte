<script lang="ts">
	// Types/constants
	import {
		caip2RouteParamsFromNetworkId,
		evmChainIdFromNetworkId,
	} from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]',
			{ ...caip2RouteParamsFromNetworkId(entityId.$network) },
		),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkGasEstimateTimestamp = useEntity(
		EntityType.EvmNetwork_GasEstimate_Timestamp,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
			slowGwei: {},
			averageGwei: {},
			fastGwei: {},
			transport: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	{entityId}
	{href}
	{layout}
	{open}
	title="Gas oracle"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={networkGasEstimateTimestamp}
			placeholderText="Loading gas estimate…"
		>
			{#snippet children(networkGasEstimateTimestamp)}
				{#if networkGasEstimateTimestamp.averageGwei != null}
					<NumberValue
						value={networkGasEstimateTimestamp.averageGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei
				{:else if networkGasEstimateTimestamp.fastGwei != null}
					<NumberValue
						value={networkGasEstimateTimestamp.fastGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei fast
				{:else if networkGasEstimateTimestamp.slowGwei != null}
					<NumberValue
						value={networkGasEstimateTimestamp.slowGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei slow
				{:else}
					<span>
						chain {String(evmChainIdFromNetworkId(entityId.$network))}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<Timestamp
			timestamp={entityId.timestampMs}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped explorer-oracle gas suggestions: slow, average, and fast tiers in gwei.
		</p>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>As of</dt>
				<dd>
					<Timestamp
						timestamp={entityId.timestampMs}
					/>
				</dd>
			</div>

			{#if (
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current.slowGwei != null
			)}
				<div>
					<dt>Slow</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
						>
							{#snippet children(networkGasEstimateTimestamp)}
								<NumberValue
									value={networkGasEstimateTimestamp.slowGwei}
									options={{ maximumFractionDigits: 4 }}
								/>
								gwei
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current.averageGwei != null
			)}
				<div>
					<dt>Average</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
						>
							{#snippet children(networkGasEstimateTimestamp)}
								<NumberValue
									value={networkGasEstimateTimestamp.averageGwei}
									options={{ maximumFractionDigits: 4 }}
								/>
								gwei
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current.fastGwei != null
			)}
				<div>
					<dt>Fast</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
						>
							{#snippet children(networkGasEstimateTimestamp)}
								<NumberValue
									value={networkGasEstimateTimestamp.fastGwei}
									options={{ maximumFractionDigits: 4 }}
								/>
								gwei
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current.transport !== undefined
			)}
				<div>
					<dt>Transport</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
						>
							{#snippet children(networkGasEstimateTimestamp)}
								<code>{networkGasEstimateTimestamp.transport}</code>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
	{/snippet}
</EntityView>
