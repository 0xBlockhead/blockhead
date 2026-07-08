<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTrace>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmTrace>>
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
	const evmTrace = $derived(selection({
		fields: {
			index: true,
			type: true,
			error: true,
		},
	}))
	const titleFallback = $derived((String((prefetched.index) ?? '') ? 'Trace #' + String((prefetched.index) ?? '') : '') || [String((selection.entitySelector.traceAddress ?? prefetched.traceAddress) ?? '')].filter(Boolean).join(' ') || 'EVM trace')
	const viewDomId = $derived('evm-trace-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTracesView from '$/views/EvmTracesView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTrace}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(prefetched.index ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmTrace}>
			{#snippet Pending()}
				{@const serialValue = prefetched.index}
				{#if serialValue !== undefined && serialValue !== null}
					<span data-row="inline align-center gap-2 wrap">
						<span>Trace </span>
						<span data-badge="small">
							#{String((serialValue) ?? '')}
						</span>
					</span>
				{:else}
					{[String((selection.entitySelector.traceAddress ?? prefetched.traceAddress) ?? '')].filter(Boolean).join(' ')}
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const serialValue = resolvedEntity.index}
				{#if serialValue !== undefined && serialValue !== null}
					<span data-row="inline align-center gap-2 wrap">
						<span>Trace </span>
						<span data-badge="small">
							#{String((serialValue) ?? '')}
						</span>
					</span>
				{:else}
					{[String((resolvedEntity.traceAddress) ?? '')].filter(Boolean).join(' ')}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmTrace}>
			{#snippet Pending()}
				{@const serialValue = prefetched.index}
				{#if serialValue !== undefined && serialValue !== null}
					<span data-badge="small">
						#{String((serialValue) ?? '')}
					</span>
				{:else}
					{[String((selection.entitySelector.traceAddress ?? prefetched.traceAddress) ?? '')].filter(Boolean).join(' ')}
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const serialValue = resolvedEntity.index}
				{#if serialValue !== undefined && serialValue !== null}
					<span data-badge="small">
						#{String((serialValue) ?? '')}
					</span>
				{:else}
					{[String((resolvedEntity.traceAddress) ?? '')].filter(Boolean).join(' ')}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmTrace}>
			{#snippet Pending()}
				{@const type0 = prefetched.type}
				{#if type0 !== undefined && type0 !== null}
					<span data-text="muted">
						{String((type0) ?? '')}
					</span>
				{/if}
				{@const error1 = prefetched.error}
				{#if error1 !== undefined && error1 !== null}
					<span data-text="muted">
						{String((error1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const type0 = resolvedEntity.type}
				{#if type0 !== undefined && type0 !== null}
					<span data-text="muted">
						{String((type0) ?? '')}
					</span>
				{/if}
				{@const error1 = resolvedEntity.error}
				{#if error1 !== undefined && error1 !== null}
					<span data-text="muted">
						{String((error1) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Trace address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									traceAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const traceAddress = selection.entitySelector.traceAddress ?? prefetched.traceAddress}
							{#if traceAddress !== undefined && traceAddress !== null}
								<TruncatedValue value={String((traceAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const traceAddress = resolvedEntity.traceAddress}
							{#if traceAddress !== undefined && traceAddress !== null}
								<TruncatedValue value={String((traceAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									index: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const index = prefetched.index}
							{#if index !== undefined && index !== null}
								{String((index) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const index = resolvedEntity.index}
							{#if index !== undefined && index !== null}
								{String((index) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							type: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const type = prefetched.type}
					{#if type !== undefined && type !== null}
						<div>
							<dt>Type</dt>
							<dd>
								{String((type) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const type = resolvedEntity.type}
					{#if type !== undefined && type !== null}
						<div>
							<dt>Type</dt>
							<dd>
								{String((type) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
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
							from: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const from = prefetched.from}
					{#if from !== undefined && from !== null}
						<div>
							<dt>From</dt>
							<dd>
								{String((from) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const from = resolvedEntity.from}
					{#if from !== undefined && from !== null}
						<div>
							<dt>From</dt>
							<dd>
								{String((from) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							to: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const to = prefetched.to}
					{#if to !== undefined && to !== null}
						<div>
							<dt>To</dt>
							<dd>
								{String((to) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const to = resolvedEntity.to}
					{#if to !== undefined && to !== null}
						<div>
							<dt>To</dt>
							<dd>
								{String((to) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const value = prefetched.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<TruncatedValue value={String((value) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const value = resolvedEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<TruncatedValue value={String((value) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gas: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gas = prefetched.gas}
					{#if gas !== undefined && gas !== null}
						<div>
							<dt>Gas</dt>
							<dd>
								{String((gas) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gas = resolvedEntity.gas}
					{#if gas !== undefined && gas !== null}
						<div>
							<dt>Gas</dt>
							<dd>
								{String((gas) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsed = prefetched.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								{String((gasUsed) ?? '')}
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
							input: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const input = prefetched.input}
					{#if input !== undefined && input !== null}
						<div>
							<dt>Input</dt>
							<dd>
								<TruncatedValue value={String((input) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const input = resolvedEntity.input}
					{#if input !== undefined && input !== null}
						<div>
							<dt>Input</dt>
							<dd>
								<TruncatedValue value={String((input) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							output: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const output = prefetched.output}
					{#if output !== undefined && output !== null}
						<div>
							<dt>Output</dt>
							<dd>
								<TruncatedValue value={String((output) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const output = resolvedEntity.output}
					{#if output !== undefined && output !== null}
						<div>
							<dt>Output</dt>
							<dd>
								<TruncatedValue value={String((output) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction, {})}
						href={
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(selection.entitySelector.$transaction.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$transaction.$network.caip2.reference ?? '')}`,
								transactionId: String(selection.entitySelector.$transaction.txHash ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmTracesView
				selection={selection.$$children}
				title='Children'
				emptyText='No child traces.'
				id='EvmTracesView-children'
			/>
		{/if}
	{/snippet}
</EntityView>
