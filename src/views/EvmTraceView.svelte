<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmInternalCallType } from '$/constants/Evm.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmTrace> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const evmTrace = $derived(selection({
		fields: {
			index: true,
			type: true,
			error: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.index ?? '') ? 'Trace #' + String(pendingEntity.index ?? '') : '') || (pendingEntity.traceAddress ?? '') || 'EVM trace')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTracesView from '$/views/EvmTracesView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTrace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.index ?? '')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmTrace}>
			{#snippet children(entity)}
				<span data-row="inline align-center gap-2 wrap">
					<span>Trace </span>
					<span data-badge="small">
						#{String(entity.index)}
					</span>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmTrace}>
			{#snippet children(entity)}
				<span data-badge="small">
					#{String(entity.index)}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmTrace}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.type}
				</span>
				{@const error1 = entity.error}
				{#if error1 != null}
					<span data-text="muted">
						{error1}
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
					<TruncatedValue value={pendingEntity.traceAddress} />
				</dd>
			</div>

			<div>
				<dt>Index</dt>
				<dd>
					<ResourceBoundary
						resource={evmTrace}
					>
						{#snippet children(entity)}
							{String(entity.index)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Type</dt>
				<dd>
					<ResourceBoundary
						resource={evmTrace}
					>
						{#snippet children(entity)}
							{entity.type}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmTrace}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>From</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
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
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								<TruncatedValue value={String(value)} />
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
				{#snippet children(entity)}
					{@const gas = entity.gas}
					{#if gas != null}
						<div>
							<dt>Gas</dt>
							<dd>
								{String(gas)}
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
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>Gas used</dt>
							<dd>
								{String(gasUsed)}
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
				{#snippet children(entity)}
					{@const input = entity.input}
					{#if input != null}
						<div>
							<dt>Input</dt>
							<dd>
								<TruncatedValue value={String(input)} />
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
				{#snippet children(entity)}
					{@const output = entity.output}
					{#if output != null}
						<div>
							<dt>Output</dt>
							<dd>
								<TruncatedValue value={String(output)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const evmTraceEvmTracesViewChildrenResource = selection.$$children}
		<ResourceBoundary
			resource={evmTraceEvmTracesViewChildrenResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmTracesView
						selection={evmTraceEvmTracesViewChildrenResource}
						countResource={evmTraceEvmTracesViewChildrenResource.count}
						title='Children'
						id='children'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
