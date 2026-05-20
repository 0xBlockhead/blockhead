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


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Network_GasFee_Block>
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
	const networkGasFeeBlock = useEntity(
		EntityType.Network_GasFee_Block,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			baseFeePerGas: {},
			legacyGasPrice: {},
			maxPriorityFeePerGas: {},
			gasUsedRatio: {},
			priorityFeeRewardAt50thPercentile: {},
		},
	)

	const defaultHref = resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
		{
			networkId: String(entityId.$network.chainId),
			blockNumber: String(entityId.blockNumber),
		},
	)
</script>


<EntityView
	entityType={EntityType.Network_GasFee_Block}
	{entityId}
	href={href ?? defaultHref}
	{layout}
	{open}
	title="Gas"
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			block {String(entityId.blockNumber)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Fee-market snapshot for one execution block: base fee per gas from <code>eth_feeHistory</code>, plus optional live RPC hints for legacy and priority fees.
		</p>
		<p>
			EIP-1559 sets base fee from parent fullness; priority fee percentiles describe inclusion bids around this height.
		</p>
	{/snippet}

	{#snippet Title()}
		<span data-text="font-monospace">
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={networkGasFeeBlock}
		>
			{#snippet children(networkGasFeeBlock)}
				<dl data-column-item="center">

					{#if open}
						{#if networkGasFeeBlock.baseFeePerGas !== undefined}
							<div>
								<dt>Base fee</dt>
								<dd>
									<NumberValue value={networkGasFeeBlock.baseFeePerGas} /> wei
								</dd>
							</div>
						{/if}

						{#if networkGasFeeBlock.legacyGasPrice !== undefined}
							<div>
								<dt>Suggested gas price</dt>
								<dd>
									<NumberValue value={networkGasFeeBlock.legacyGasPrice} /> wei
								</dd>
							</div>
						{/if}

						{#if networkGasFeeBlock.maxPriorityFeePerGas !== undefined}
							<div>
								<dt>Max priority fee</dt>
								<dd>
									<NumberValue value={networkGasFeeBlock.maxPriorityFeePerGas} /> wei
								</dd>
							</div>
						{/if}

						{#if networkGasFeeBlock.gasUsedRatio !== undefined}
							<div>
								<dt>Gas used ratio</dt>
								<dd>{String(networkGasFeeBlock.gasUsedRatio)}</dd>
							</div>
						{/if}

						{#if networkGasFeeBlock.priorityFeeRewardAt50thPercentile !== undefined}
							<div>
								<dt>Priority fee at 50th percentile</dt>
								<dd>
									<NumberValue value={networkGasFeeBlock.priorityFeeRewardAt50thPercentile} /> wei
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Network_GasFee_Block}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
