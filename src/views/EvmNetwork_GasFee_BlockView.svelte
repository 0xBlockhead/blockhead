<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
			blockNumber: String(selection.entitySelector.blockNumber),
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork_GasFee_Block>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const networkGasFeeBlock = $derived(selection({
			sources: [
				Source.Voltaire_JsonRpc,
			],
		},
	))
	const baseFeePerGas = $derived(networkGasFeeBlock.baseFeePerGas)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasFee_Block}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	{open}
	title="Gas"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={baseFeePerGas}
		>
			{#snippet children(baseFeePerGas)}
				{#if baseFeePerGas !== undefined}
					<NumberValue value={baseFeePerGas} />
					wei
				{:else}
					<span>block {String(selection.entitySelector.blockNumber)}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={baseFeePerGas}
		>
			{#snippet children(baseFeePerGas)}
				{#if baseFeePerGas !== undefined}
					<NumberValue value={baseFeePerGas} />
					wei
				{:else}
					<span>block {String(selection.entitySelector.blockNumber)}</span>
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
		<dl data-column-item="center">
			<ResourceBoundary resource={baseFeePerGas} placeholderText="Loading base fee…">
				{#snippet children(baseFeePerGas)}
					{#if baseFeePerGas !== undefined}
						<div><dt>Base fee</dt><dd><NumberValue value={baseFeePerGas} /> wei</dd></div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={networkGasFeeBlock.legacyGasPrice} placeholderText="Loading gas price…">
				{#snippet children(legacyGasPrice)}
					{#if legacyGasPrice !== undefined}
						<div><dt>Suggested gas price</dt><dd><NumberValue value={legacyGasPrice} /> wei</dd></div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={networkGasFeeBlock.maxPriorityFeePerGas} placeholderText="Loading priority fee…">
				{#snippet children(maxPriorityFeePerGas)}
					{#if maxPriorityFeePerGas !== undefined}
						<div><dt>Max priority fee</dt><dd><NumberValue value={maxPriorityFeePerGas} /> wei</dd></div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary resource={networkGasFeeBlock.gasUsedRatio} placeholderText="Loading gas used ratio…">
					{#snippet children(gasUsedRatio)}
						{#if gasUsedRatio !== undefined}
							<div><dt>Gas used ratio</dt><dd>{String(gasUsedRatio)}</dd></div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={networkGasFeeBlock.priorityFeeRewardAt50thPercentile} placeholderText="Loading priority fee percentile…">
					{#snippet children(priorityFeeRewardAt50thPercentile)}
						{#if priorityFeeRewardAt50thPercentile !== undefined}
							<div><dt>Priority fee at 50th percentile</dt><dd><NumberValue value={priorityFeeRewardAt50thPercentile} /> wei</dd></div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={networkGasFeeBlock.baseFeePerBlobGas} placeholderText="Loading blob base fee…">
					{#snippet children(baseFeePerBlobGas)}
						{#if baseFeePerBlobGas !== undefined}
							<div><dt>Blob base fee</dt><dd><NumberValue value={baseFeePerBlobGas} /> wei</dd></div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary resource={networkGasFeeBlock.blobGasUsedRatio} placeholderText="Loading blob gas used ratio…">
					{#snippet children(blobGasUsedRatio)}
						{#if blobGasUsedRatio !== undefined}
							<div><dt>Blob gas used ratio</dt><dd>{String(blobGasUsedRatio)}</dd></div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

</EntityView>
