<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(blocks)/block/[blockNumber]', {
			caip2Namespace: selector.$network.caip2.namespace,
			caip2Reference: selector.$network.caip2.reference,
			blockNumber: String(selector.blockNumber),
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmNetwork_GasFee_Block>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const networkGasFeeBlock = subscribe(EntityType.EvmNetwork_GasFee_Block,
		selector,
		({ sources: [Source.Voltaire_JsonRpc], fields: { baseFeePerGas: true, legacyGasPrice: true, maxPriorityFeePerGas: true, gasUsedRatio: true, priorityFeeRewardAt50thPercentile: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasFee_Block}
	entitySelector={selector}
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
				{#if networkGasFeeBlock.fields.baseFeePerGas !== undefined}
					<NumberValue value={networkGasFeeBlock.fields.baseFeePerGas} />
					wei
				{:else if networkGasFeeBlock.fields.legacyGasPrice !== undefined}
					<NumberValue value={networkGasFeeBlock.fields.legacyGasPrice} />
					wei
				{:else}
					<span>
						block {String(selector.blockNumber)}
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
				{#if networkGasFeeBlock.fields.baseFeePerGas !== undefined}
					<NumberValue value={networkGasFeeBlock.fields.baseFeePerGas} />
					wei
				{:else if networkGasFeeBlock.fields.legacyGasPrice !== undefined}
					<NumberValue value={networkGasFeeBlock.fields.legacyGasPrice} />
					wei
				{:else}
					<span>
						block {String(selector.blockNumber)}
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
					{#if networkGasFeeBlock.fields.baseFeePerGas !== undefined}
						<div>
							<dt>Base fee</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.fields.baseFeePerGas} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.fields.legacyGasPrice !== undefined}
						<div>
							<dt>Suggested gas price</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.fields.legacyGasPrice} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.fields.maxPriorityFeePerGas !== undefined}
						<div>
							<dt>Max priority fee</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.fields.maxPriorityFeePerGas} />
								wei
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& networkGasFeeBlock.fields.gasUsedRatio !== undefined
					)}
						<div>
							<dt>Gas used ratio</dt>
							<dd>{String(networkGasFeeBlock.fields.gasUsedRatio)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& networkGasFeeBlock.fields.priorityFeeRewardAt50thPercentile !== undefined
					)}
						<div>
							<dt>Priority fee at 50th percentile</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.fields.priorityFeeRewardAt50thPercentile} />
								wei
							</dd>
						</div>
					{/if}

					{#if networkGasFeeBlock.fields.baseFeePerBlobGas !== undefined}
						<div>
							<dt>Blob base fee</dt>
							<dd>
								<NumberValue value={networkGasFeeBlock.fields.baseFeePerBlobGas} />
								wei
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& networkGasFeeBlock.fields.blobGasUsedRatio !== undefined
					)}
						<div>
							<dt>Blob gas used ratio</dt>
							<dd>{String(networkGasFeeBlock.fields.blobGasUsedRatio)}</dd>
						</div>
					{/if}

				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
