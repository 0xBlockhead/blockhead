<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Network_GasEstimate_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	const networkGasEstimateTimestamp = useEntity(
		EntityType.Network_GasEstimate_Timestamp,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
				Source.Voltaire_JsonRpc,
			],
			slowGwei: {},
			averageGwei: {},
			fastGwei: {},
			...(open ?
				{
					legacyGasPriceWei: {},
					maxPriorityFeePerGasWei: {},
					baseFeePerGasWei: {},
					transport: {},
				}
				:
				{}),
		},
	)

	const defaultHref = resolve(
		'/(explore)/(networks)/network/[networkId]',
		{ networkId: String(entityId.$network.chainId) },
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Network_GasEstimate_Timestamp}
	{entityId}
	href={href ?? defaultHref}
	{layout}
	{open}
	title="Gas estimate"
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}
		<Timestamp
			format={TimestampFormat.Both}
			timestamp={entityId.timestampMs}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Suggested slow, average, and fast gas tiers (gwei) from an explorer oracle, or live <code>eth_gasPrice</code> / fee-market hints from JSON-RPC when tiers are unavailable.
		</p>
	{/snippet}

	{#snippet Title()}
		<span data-text="font-monospace">
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading gas estimate…"
			resource={networkGasEstimateTimestamp}
		>
			{#snippet children(networkGasEstimateTimestamp)}
				<dl data-column-item="center">
					<div>
						<dt>As of</dt>
						<dd>
							<Timestamp
								format={TimestampFormat.Both}
								timestamp={entityId.timestampMs}
							/>
						</dd>
					</div>
					{#if networkGasEstimateTimestamp.slowGwei != null}
						<div>
							<dt>Slow</dt>
							<dd>
								<NumberValue
									value={networkGasEstimateTimestamp.slowGwei}
									options={{ maximumFractionDigits: 4 }}
								/> gwei
							</dd>
						</div>
					{/if}
					{#if networkGasEstimateTimestamp.averageGwei != null}
						<div>
							<dt>Average</dt>
							<dd>
								<NumberValue
									value={networkGasEstimateTimestamp.averageGwei}
									options={{ maximumFractionDigits: 4 }}
								/> gwei
							</dd>
						</div>
					{/if}
					{#if networkGasEstimateTimestamp.fastGwei != null}
						<div>
							<dt>Fast</dt>
							<dd>
								<NumberValue
									value={networkGasEstimateTimestamp.fastGwei}
									options={{ maximumFractionDigits: 4 }}
								/> gwei
							</dd>
						</div>
					{/if}
					{#if open}
						{#if networkGasEstimateTimestamp.legacyGasPriceWei !== undefined}
							<div>
								<dt><code>eth_gasPrice</code></dt>
								<dd>
									<NumberValue value={networkGasEstimateTimestamp.legacyGasPriceWei} /> wei
								</dd>
							</div>
						{/if}
						{#if networkGasEstimateTimestamp.maxPriorityFeePerGasWei !== undefined}
							<div>
								<dt>Max priority fee</dt>
								<dd>
									<NumberValue value={networkGasEstimateTimestamp.maxPriorityFeePerGasWei} /> wei
								</dd>
							</div>
						{/if}
						{#if networkGasEstimateTimestamp.baseFeePerGasWei !== undefined}
							<div>
								<dt>Base fee</dt>
								<dd>
									<NumberValue value={networkGasEstimateTimestamp.baseFeePerGasWei} /> wei
								</dd>
							</div>
						{/if}
						{#if networkGasEstimateTimestamp.transport !== undefined}
							<div>
								<dt>Transport</dt>
								<dd><code>{networkGasEstimateTimestamp.transport}</code></dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Network_GasEstimate_Timestamp}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
