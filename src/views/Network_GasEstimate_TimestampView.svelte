<script lang="ts">
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
			'/(explore)/(networks)/network/[networkId]',
			{ networkId: String(entityId.$network.chainId) },
		),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Network_GasEstimate_Timestamp>
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
		EntityType.Network_GasEstimate_Timestamp,
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
	entityType={EntityType.Network_GasEstimate_Timestamp}
	{entityId}
	{href}
	{layout}
	{open}
	title="Gas oracle"
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			chain {String(entityId.$network.chainId)}
		</span>
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
		<span>
			chain {String(entityId.$network.chainId)}
		</span>
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
							{#snippet children(loadedNetworkGasEstimateTimestamp)}
								<NumberValue
									value={loadedNetworkGasEstimateTimestamp.slowGwei}
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
							{#snippet children(loadedNetworkGasEstimateTimestamp)}
								<NumberValue
									value={loadedNetworkGasEstimateTimestamp.averageGwei}
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
							{#snippet children(loadedNetworkGasEstimateTimestamp)}
								<NumberValue
									value={loadedNetworkGasEstimateTimestamp.fastGwei}
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
							{#snippet children(loadedNetworkGasEstimateTimestamp)}
								<code>{loadedNetworkGasEstimateTimestamp.transport}</code>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Network_GasEstimate_Timestamp}
			{entityId}
		/>
	{/snippet}
</EntityView>
