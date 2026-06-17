<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]',
			{ .caip2:  },
		),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { proxy } from '$/routes/+layout.svelte'

	const networkGasEstimateTimestamp = $derived(proxy(
		EntityType.EvmNetwork_GasEstimate_Timestamp,
		selector,
		{
			sources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
	))
	const slowGwei = $derived(networkGasEstimateTimestamp.slowGwei)
	const averageGwei = $derived(networkGasEstimateTimestamp.averageGwei)
	const fastGwei = $derived(networkGasEstimateTimestamp.fastGwei)
	const transport = $derived(networkGasEstimateTimestamp.transport)



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	entitySelector={selector}
	{href}
	{layout}
	{open}
	title="Gas oracle"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={averageGwei}
			placeholderText="Loading gas estimate…"
		>
			{#snippet children(averageGwei)}
				{#if averageGwei != null}
					<NumberValue
						value={averageGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei
				{:else if fastGwei != null}
					<NumberValue
						value={fastGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei fast
				{:else if slowGwei != null}
					<NumberValue
						value={slowGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei slow
				{:else}
					<span>
						chain {String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`))}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<Timestamp
			timestamp={selector.timestampMs}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped explorer-oracle gas suggestions: slow, average, and fast tiers in gwei.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>As of</dt>
				<dd>
					<Timestamp
						timestamp={selector.timestampMs}
					/>
				</dd>
			</div>

			{#if (
				!slowGwei.ready
				|| slowGwei.current != null
			)}
				<div>
					<dt>Slow</dt>
					<dd>
						<ResourceBoundary
							resource={slowGwei}
							placeholderText="Loading gas estimate…"
							>
								{#snippet children(slowGwei)}
									{#if slowGwei !== undefined}
										<NumberValue
											value={slowGwei}
											options={{ maximumFractionDigits: 4 }}
										/>
										gwei
									{/if}
								{/snippet}
							</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				!averageGwei.ready
				|| averageGwei.current != null
			)}
				<div>
					<dt>Average</dt>
					<dd>
						<ResourceBoundary
							resource={averageGwei}
							placeholderText="Loading gas estimate…"
							>
								{#snippet children(averageGwei)}
									{#if averageGwei !== undefined}
										<NumberValue
											value={averageGwei}
											options={{ maximumFractionDigits: 4 }}
										/>
										gwei
									{/if}
								{/snippet}
							</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				!fastGwei.ready
				|| fastGwei.current != null
			)}
				<div>
					<dt>Fast</dt>
					<dd>
						<ResourceBoundary
							resource={averageGwei}
							placeholderText="Loading gas estimate…"
							>
								{#snippet children(averageGwei)}
									{#if fastGwei !== undefined}
										<NumberValue
											value={fastGwei}
											options={{ maximumFractionDigits: 4 }}
										/>
										gwei
									{/if}
								{/snippet}
							</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				!transport.ready
				|| transport.current !== undefined
			)}
				<div>
					<dt>Transport</dt>
					<dd>
						<ResourceBoundary
							resource={transport}
							placeholderText="Loading gas estimate…"
						>
							{#snippet children(transport)}
								<code>{transport}</code>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}
</EntityView>
