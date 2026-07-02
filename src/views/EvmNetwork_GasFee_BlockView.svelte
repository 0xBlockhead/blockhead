<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork_GasFee_Block>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetwork_GasFee_Block>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const evmNetworkGasFeeBlock = $derived(selection({
		fields: {
			baseFeePerGas: true,
			legacyGasPrice: true,
			maxPriorityFeePerGas: true,
			gasUsedRatio: true,
			priorityFeeRewardAt50thPercentile: true,
			baseFeePerBlobGas: true,
			blobGasUsedRatio: true,
		},
	}))
	const titleFallback = $derived(['Block ' + String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).baseFeePerGas) ?? '') + ' wei'].filter(Boolean).join(' ') || 'EVM network gas fee block')
	const viewDomId = $derived('evm-network-gas-fee-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasFee_Block}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/fee-market/block/[blockNumber=evmBlockNumber]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			blockNumber: String(({ ...selection.entitySelector, ...prefetched }).blockNumber),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{['Block ' + String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).baseFeePerGas) ?? '') + ' wei'].filter(Boolean).join(' ') || title || 'EVM network gas fee block'}
		{:else}
			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{['Block ' + String((({ ...selection.entitySelector, ...prefetched }).blockNumber) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).baseFeePerGas) ?? '') + ' wei'].filter(Boolean).join(' ') || title || 'EVM network gas fee block'}
				{/snippet}

				{#snippet children(entity)}
					{['Block ' + String((entity.blockNumber) ?? ''), String((entity.baseFeePerGas) ?? '') + ' wei'].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const baseFeePerGas0 = ({ ...selection.entitySelector, ...prefetched }).baseFeePerGas}
			{#if baseFeePerGas0 !== undefined && baseFeePerGas0 !== null}
				<NumberValue value={Number(baseFeePerGas0)} />

				<span> wei</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{@const baseFeePerGas0 = ({ ...selection.entitySelector, ...prefetched }).baseFeePerGas}
					{#if baseFeePerGas0 !== undefined && baseFeePerGas0 !== null}
						<NumberValue value={Number(baseFeePerGas0)} />

						<span> wei</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const baseFeePerGas0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).baseFeePerGas}
					{#if baseFeePerGas0 !== undefined && baseFeePerGas0 !== null}
						<NumberValue value={Number(baseFeePerGas0)} />

						<span> wei</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<EvmNetworkView
					selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					<span data-text="muted">
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{@const legacyGasPrice = prefetched.legacyGasPrice ?? selection.entitySelector.legacyGasPrice}
					{#if legacyGasPrice !== undefined && legacyGasPrice !== null}
						<div>
							<dt>Legacy gas price</dt>
							<dd>
								<NumberValue value={Number(legacyGasPrice)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const legacyGasPrice = entity.legacyGasPrice ?? selection.entitySelector.legacyGasPrice ?? prefetched.legacyGasPrice}
					{#if legacyGasPrice !== undefined && legacyGasPrice !== null}
						<div>
							<dt>Legacy gas price</dt>
							<dd>
								<NumberValue value={Number(legacyGasPrice)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{@const maxPriorityFeePerGas = prefetched.maxPriorityFeePerGas ?? selection.entitySelector.maxPriorityFeePerGas}
					{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
						<div>
							<dt>Max priority fee per gas</dt>
							<dd>
								<NumberValue value={Number(maxPriorityFeePerGas)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const maxPriorityFeePerGas = entity.maxPriorityFeePerGas ?? selection.entitySelector.maxPriorityFeePerGas ?? prefetched.maxPriorityFeePerGas}
					{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
						<div>
							<dt>Max priority fee per gas</dt>
							<dd>
								<NumberValue value={Number(maxPriorityFeePerGas)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{@const gasUsedRatio = prefetched.gasUsedRatio ?? selection.entitySelector.gasUsedRatio}
					{#if gasUsedRatio !== undefined && gasUsedRatio !== null}
						<div>
							<dt>Gas used ratio</dt>
							<dd>
								<NumberValue
									value={Number(gasUsedRatio)}
									options={{ style: 'percent' }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const gasUsedRatio = entity.gasUsedRatio ?? selection.entitySelector.gasUsedRatio ?? prefetched.gasUsedRatio}
					{#if gasUsedRatio !== undefined && gasUsedRatio !== null}
						<div>
							<dt>Gas used ratio</dt>
							<dd>
								<NumberValue
									value={Number(gasUsedRatio)}
									options={{ style: 'percent' }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{@const priorityFeeRewardAt50thPercentile = prefetched.priorityFeeRewardAt50thPercentile ?? selection.entitySelector.priorityFeeRewardAt50thPercentile}
					{#if priorityFeeRewardAt50thPercentile !== undefined && priorityFeeRewardAt50thPercentile !== null}
						<div>
							<dt>Priority fee reward at 50th percentile</dt>
							<dd>
								<NumberValue value={Number(priorityFeeRewardAt50thPercentile)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const priorityFeeRewardAt50thPercentile = entity.priorityFeeRewardAt50thPercentile ?? selection.entitySelector.priorityFeeRewardAt50thPercentile ?? prefetched.priorityFeeRewardAt50thPercentile}
					{#if priorityFeeRewardAt50thPercentile !== undefined && priorityFeeRewardAt50thPercentile !== null}
						<div>
							<dt>Priority fee reward at 50th percentile</dt>
							<dd>
								<NumberValue value={Number(priorityFeeRewardAt50thPercentile)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{@const baseFeePerBlobGas = prefetched.baseFeePerBlobGas ?? selection.entitySelector.baseFeePerBlobGas}
					{#if baseFeePerBlobGas !== undefined && baseFeePerBlobGas !== null}
						<div>
							<dt>Base fee per blob gas</dt>
							<dd>
								<NumberValue value={Number(baseFeePerBlobGas)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const baseFeePerBlobGas = entity.baseFeePerBlobGas ?? selection.entitySelector.baseFeePerBlobGas ?? prefetched.baseFeePerBlobGas}
					{#if baseFeePerBlobGas !== undefined && baseFeePerBlobGas !== null}
						<div>
							<dt>Base fee per blob gas</dt>
							<dd>
								<NumberValue value={Number(baseFeePerBlobGas)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNetworkGasFeeBlock}>
				{#snippet Pending()}
					{@const blobGasUsedRatio = prefetched.blobGasUsedRatio ?? selection.entitySelector.blobGasUsedRatio}
					{#if blobGasUsedRatio !== undefined && blobGasUsedRatio !== null}
						<div>
							<dt>Blob gas used ratio</dt>
							<dd>
								<NumberValue
									value={Number(blobGasUsedRatio)}
									options={{ style: 'percent' }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blobGasUsedRatio = entity.blobGasUsedRatio ?? selection.entitySelector.blobGasUsedRatio ?? prefetched.blobGasUsedRatio}
					{#if blobGasUsedRatio !== undefined && blobGasUsedRatio !== null}
						<div>
							<dt>Blob gas used ratio</dt>
							<dd>
								<NumberValue
									value={Number(blobGasUsedRatio)}
									options={{ style: 'percent' }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
