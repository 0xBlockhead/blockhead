<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.IbcPacket>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.IbcPacket>>
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
	const ibcPacket = $derived(selection({
		sources: selection.sources,
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.sequence) ?? '') ? 'Packet #' + String((pendingEntity.sequence) ?? '') : '') || 'IBC packet')
	const viewDomId = $derived('ibc-packet-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IbcChannelView from '$/views/IbcChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcPacket}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.sequence ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.sequence}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Packet </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.sequence}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const direction0 = pendingEntity.direction}
			{#if direction0 !== undefined && direction0 !== null}
				<span data-text="muted">
					{String((direction0) ?? '')}
				</span>
			{/if}
			{@const status1 = pendingEntity.status}
			{#if status1 !== undefined && status1 !== null}
				<span data-text="muted">
					{String((status1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={ibcPacket}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const direction0 = resolvedEntity.direction}
					{#if direction0 !== undefined && direction0 !== null}
						<span data-text="muted">
							{String((direction0) ?? '')}
						</span>
					{/if}
					{@const status1 = resolvedEntity.status}
					{#if status1 !== undefined && status1 !== null}
						<span data-text="muted">
							{String((status1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Sequence</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									sequence: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sequence = resolvedEntity.sequence}
							{#if sequence !== undefined && sequence !== null}
								{String((sequence) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Direction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									direction: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const direction = resolvedEntity.direction}
							{#if direction !== undefined && direction !== null}
								{String((direction) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							receiptExists: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receiptExists = resolvedEntity.receiptExists}
					{#if receiptExists !== undefined && receiptExists !== null}
						<div>
							<dt>Receipt exists</dt>
							<dd>
								{receiptExists ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							timeoutTimestampNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timeoutTimestampNs = resolvedEntity.timeoutTimestampNs}
					{#if timeoutTimestampNs !== undefined && timeoutTimestampNs !== null}
						<div>
							<dt>Timeout timestamp ns</dt>
							<dd>
								{String((timeoutTimestampNs) ?? '')}
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
						sources: selection.sources,
						fields: {
							sourcePort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourcePort = resolvedEntity.sourcePort}
					{#if sourcePort !== undefined && sourcePort !== null}
						<div>
							<dt>Source port</dt>
							<dd>
								{String((sourcePort) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sourceChannel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceChannel = resolvedEntity.sourceChannel}
					{#if sourceChannel !== undefined && sourceChannel !== null}
						<div>
							<dt>Source channel</dt>
							<dd>
								{String((sourceChannel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							destinationPort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationPort = resolvedEntity.destinationPort}
					{#if destinationPort !== undefined && destinationPort !== null}
						<div>
							<dt>Destination port</dt>
							<dd>
								{String((destinationPort) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							destinationChannel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationChannel = resolvedEntity.destinationChannel}
					{#if destinationChannel !== undefined && destinationChannel !== null}
						<div>
							<dt>Destination channel</dt>
							<dd>
								{String((destinationChannel) ?? '')}
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
						sources: selection.sources,
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataHash = resolvedEntity.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>Data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							commitmentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commitmentHash = resolvedEntity.commitmentHash}
					{#if commitmentHash !== undefined && commitmentHash !== null}
						<div>
							<dt>Commitment hash</dt>
							<dd>
								<TruncatedValue value={String((commitmentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							acknowledgementHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const acknowledgementHash = resolvedEntity.acknowledgementHash}
					{#if acknowledgementHash !== undefined && acknowledgementHash !== null}
						<div>
							<dt>Acknowledgement hash</dt>
							<dd>
								<TruncatedValue value={String((acknowledgementHash) ?? '')} />
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
						sources: selection.sources,
						fields: {
							sendTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sendTxHash = resolvedEntity.sendTxHash}
					{#if sendTxHash !== undefined && sendTxHash !== null}
						<div>
							<dt>Send transaction hash</dt>
							<dd>
								<TruncatedValue value={String((sendTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							receiveTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receiveTxHash = resolvedEntity.receiveTxHash}
					{#if receiveTxHash !== undefined && receiveTxHash !== null}
						<div>
							<dt>Receive transaction hash</dt>
							<dd>
								<TruncatedValue value={String((receiveTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							acknowledgeTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const acknowledgeTxHash = resolvedEntity.acknowledgeTxHash}
					{#if acknowledgeTxHash !== undefined && acknowledgeTxHash !== null}
						<div>
							<dt>Acknowledge transaction hash</dt>
							<dd>
								<TruncatedValue value={String((acknowledgeTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							timeoutTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timeoutTxHash = resolvedEntity.timeoutTxHash}
					{#if timeoutTxHash !== undefined && timeoutTxHash !== null}
						<div>
							<dt>Timeout transaction hash</dt>
							<dd>
								<TruncatedValue value={String((timeoutTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Channel</dt>
				<dd>
					<IbcChannelView
						selection={select(EntityType.IbcChannel, selection.entitySelector.$channel, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
