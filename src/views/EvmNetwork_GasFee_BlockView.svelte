<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EvmNetwork_GasFee_Block>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmNetwork_GasFee_Block>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmNetworkGasFeeBlock = $derived(selection({
		fields: {
			baseFeePerGas: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.blockNumber) ?? '') ? 'Block ' + String((pendingEntity.blockNumber) ?? '') : ''), (String((pendingEntity.baseFeePerGas) ?? '') ? String((pendingEntity.baseFeePerGas) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'EVM network gas fee block')
	const viewDomId = $derived('evm-network-gas-fee-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasFee_Block}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.blockNumber !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
			blockNumber: String(pendingEntity.blockNumber ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.blockNumber !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
			blockNumber: String(pendingEntity.blockNumber ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkGasFeeBlock}>
			{#snippet Pending()}
				{[(String((pendingEntity.blockNumber) ?? '') ? 'Block ' + String((pendingEntity.blockNumber) ?? '') : ''), (String((pendingEntity.baseFeePerGas) ?? '') ? String((pendingEntity.baseFeePerGas) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || 'EVM network gas fee block'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[(String((resolvedEntity.blockNumber) ?? '') ? 'Block ' + String((resolvedEntity.blockNumber) ?? '') : ''), (String((resolvedEntity.baseFeePerGas) ?? '') ? String((resolvedEntity.baseFeePerGas) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkGasFeeBlock}>
			{#snippet Pending()}
				{@const baseFeePerGas0 = pendingEntity.baseFeePerGas}
				{#if baseFeePerGas0 !== undefined && baseFeePerGas0 !== null}
					<NumberValue value={Number(baseFeePerGas0)} />

					<span> wei</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const baseFeePerGas0 = resolvedEntity.baseFeePerGas}
				{#if baseFeePerGas0 !== undefined && baseFeePerGas0 !== null}
					<NumberValue value={Number(baseFeePerGas0)} />

					<span> wei</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmNetworkGasFeeBlock}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockNumber = pendingEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								<NumberValue value={Number(blockNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseFeePerGas: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseFeePerGas = pendingEntity.baseFeePerGas}
					{#if baseFeePerGas !== undefined && baseFeePerGas !== null}
						<div>
							<dt>Base fee per gas</dt>
							<dd>
								<NumberValue value={Number(baseFeePerGas)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseFeePerGas = resolvedEntity.baseFeePerGas}
					{#if baseFeePerGas !== undefined && baseFeePerGas !== null}
						<div>
							<dt>Base fee per gas</dt>
							<dd>
								<NumberValue value={Number(baseFeePerGas)} />

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							legacyGasPrice: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const legacyGasPrice = pendingEntity.legacyGasPrice}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const legacyGasPrice = resolvedEntity.legacyGasPrice}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxPriorityFeePerGas: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxPriorityFeePerGas = pendingEntity.maxPriorityFeePerGas}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxPriorityFeePerGas = resolvedEntity.maxPriorityFeePerGas}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsedRatio: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsedRatio = pendingEntity.gasUsedRatio}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsedRatio = resolvedEntity.gasUsedRatio}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priorityFeeRewardAt50thPercentile: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const priorityFeeRewardAt50thPercentile = pendingEntity.priorityFeeRewardAt50thPercentile}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priorityFeeRewardAt50thPercentile = resolvedEntity.priorityFeeRewardAt50thPercentile}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseFeePerBlobGas: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseFeePerBlobGas = pendingEntity.baseFeePerBlobGas}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseFeePerBlobGas = resolvedEntity.baseFeePerBlobGas}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blobGasUsedRatio: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blobGasUsedRatio = pendingEntity.blobGasUsedRatio}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blobGasUsedRatio = resolvedEntity.blobGasUsedRatio}
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

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
