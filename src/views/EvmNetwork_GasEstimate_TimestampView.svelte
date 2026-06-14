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
			'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]',
			{ ...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference } },
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
	import { subscribe } from '$/routes/+layout.svelte'

	const networkGasEstimateTimestamp = subscribe(EntityType.EvmNetwork_GasEstimate_Timestamp,
		selector,
		({ sources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			], fields: { slowGwei: true, averageGwei: true, fastGwei: true, transport: true } }),
	)


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
			resource={networkGasEstimateTimestamp}
			placeholderText="Loading gas estimate…"
		>
			{#snippet children(networkGasEstimateTimestamp)}
				{#if networkGasEstimateTimestamp.fields.averageGwei != null}
					<NumberValue
						value={networkGasEstimateTimestamp.fields.averageGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei
				{:else if networkGasEstimateTimestamp.fields.fastGwei != null}
					<NumberValue
						value={networkGasEstimateTimestamp.fields.fastGwei}
						options={{ maximumFractionDigits: 4 }}
					/>
					gwei fast
				{:else if networkGasEstimateTimestamp.fields.slowGwei != null}
					<NumberValue
						value={networkGasEstimateTimestamp.fields.slowGwei}
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
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current?.fields.slowGwei != null
			)}
				<div>
					<dt>Slow</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
							>
								{#snippet children(networkGasEstimateTimestamp)}
									{#if networkGasEstimateTimestamp.fields.slowGwei !== undefined}
										<NumberValue
											value={networkGasEstimateTimestamp.fields.slowGwei}
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
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current?.fields.averageGwei != null
			)}
				<div>
					<dt>Average</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
							>
								{#snippet children(networkGasEstimateTimestamp)}
									{#if networkGasEstimateTimestamp.fields.averageGwei !== undefined}
										<NumberValue
											value={networkGasEstimateTimestamp.fields.averageGwei}
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
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current?.fields.fastGwei != null
			)}
				<div>
					<dt>Fast</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
							>
								{#snippet children(networkGasEstimateTimestamp)}
									{#if networkGasEstimateTimestamp.fields.fastGwei !== undefined}
										<NumberValue
											value={networkGasEstimateTimestamp.fields.fastGwei}
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
				!networkGasEstimateTimestamp.ready
				|| networkGasEstimateTimestamp.current?.fields.transport !== undefined
			)}
				<div>
					<dt>Transport</dt>
					<dd>
						<ResourceBoundary
							resource={networkGasEstimateTimestamp}
							placeholderText="Loading gas estimate…"
						>
							{#snippet children(networkGasEstimateTimestamp)}
								<code>{networkGasEstimateTimestamp.fields.transport}</code>
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
