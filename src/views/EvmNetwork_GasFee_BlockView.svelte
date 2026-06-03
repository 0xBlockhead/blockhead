<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(blocks)/block/[blockNumber]', {
			caip2Namespace: entityId.$network.caip2.namespace,
			caip2Reference: entityId.$network.caip2.reference,
			blockNumber: String(entityId.blockNumber),
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNetwork_GasFee_Block>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const networkGasFeeBlock = useEntity(
		EntityType.EvmNetwork_GasFee_Block,
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
	entityType={EntityType.EvmNetwork_GasFee_Block}
	{entityId}
	href={href}
	{layout}
	{open}
	title="Gas"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={networkGasFeeBlock}
		>
			{#snippet children(networkGasFeeBlock)}
				{#if networkGasFeeBlock.baseFeePerGas !== undefined}
					<NumberValue value={networkGasFeeBlock.baseFeePerGas} />
					wei
				{:else if networkGasFeeBlock.legacyGasPrice !== undefined}
					<NumberValue value={networkGasFeeBlock.legacyGasPrice} />
					wei
				{:else}
					<span>
						block {String(entityId.blockNumber)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={networkGasFeeBlock}
		>
			{#snippet children(networkGasFeeBlock)}
				{#if networkGasFeeBlock.baseFeePerGas !== undefined}
					<NumberValue value={networkGasFeeBlock.baseFeePerGas} />
					wei
				{:else if networkGasFeeBlock.legacyGasPrice !== undefined}
					<NumberValue value={networkGasFeeBlock.legacyGasPrice} />
					wei
				{:else}
					<span>
						block {String(entityId.blockNumber)}
					</span>
				{/if}
	{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Block-keyed fee-market snapshot: base fee and fullness are tied to one execution height, with optional current RPC fee hints on the head block.
		</p>
		<p>
			EIP-1559 sets base fee from parent fullness; priority fee percentiles describe inclusion bids around this height.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={networkGasFeeBlock}
		>
			{#snippet children(networkGasFeeBlock)}
				<dl data-column-item="center">
					{#if networkGasFeeBlock.baseFeePerGas !== undefined}
						<div>
							<dt>Base fee</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.baseFeePerGas} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.legacyGasPrice !== undefined}
						<div>
							<dt>Suggested gas price</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.legacyGasPrice} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.maxPriorityFeePerGas !== undefined}
						<div>
							<dt>Max priority fee</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.maxPriorityFeePerGas} />
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
								<NumberValue value={networkGasFeeBlock.priorityFeeRewardAt50thPercentile} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.baseFeePerBlobGas !== undefined}
						<div>
							<dt>Blob base fee</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.baseFeePerBlobGas} />
								wei
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& networkGasFeeBlock.blobGasUsedRatio !== undefined
					)}
						<div>
							<dt>Blob gas used ratio</dt>
							<dd>{String(networkGasFeeBlock.blobGasUsedRatio)}</dd>
						</div>
					{/if}

				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
	{/snippet}
</EntityView>
