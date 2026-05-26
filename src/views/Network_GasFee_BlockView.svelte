<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
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
		'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
		{
			networkId: String(entityId.$network.chainId),
			blockNumber: String(entityId.blockNumber),
		},
	),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Network_GasFee_Block>
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


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Network_GasFee_Block}
	{entityId}
	href={href}
	{layout}
	{open}
	title="Gas"
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			block {String(entityId.blockNumber)}
		</span>
	{/snippet}

	{#snippet Heading()}

		<span>
			block {String(entityId.blockNumber)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Block-keyed fee-market snapshot: base fee and fullness are tied to one execution height, with optional current RPC fee hints on the head block.
		</p>
		<p>
			EIP-1559 sets base fee from parent fullness; priority fee percentiles describe inclusion bids around this height.
		</p>
	{/snippet}

	{#snippet Title()}
		<span>
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={networkGasFeeBlock}
		>
			{#snippet children(loadedNetworkGasFeeBlock)}
				<dl data-column-item="center">
					{#if loadedNetworkGasFeeBlock.baseFeePerGas !== undefined}
						<div>
							<dt>Base fee</dt>
							<dd>
								<NumberValue value={loadedNetworkGasFeeBlock.baseFeePerGas} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.legacyGasPrice !== undefined}
						<div>
							<dt>Suggested gas price</dt>
							<dd>
								<NumberValue value={loadedNetworkGasFeeBlock.legacyGasPrice} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.maxPriorityFeePerGas !== undefined}
						<div>
							<dt>Max priority fee</dt>
							<dd>
								<NumberValue value={loadedNetworkGasFeeBlock.maxPriorityFeePerGas} />
								wei
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& networkGasFeeBlock.gasUsedRatio !== undefined
					)}
						<div>
							<dt>Gas used ratio</dt>
							<dd>{String(networkGasFeeBlock.gasUsedRatio)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& networkGasFeeBlock.priorityFeeRewardAt50thPercentile !== undefined
					)}
						<div>
							<dt>Priority fee at 50th percentile</dt>
							<dd>
								<NumberValue value={loadedNetworkGasFeeBlock.priorityFeeRewardAt50thPercentile} />
								wei
							</dd>
						</div>
					{/if}

				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.Network_GasFee_Block}
			{entityId}
		/>
	{/snippet}
</EntityView>
