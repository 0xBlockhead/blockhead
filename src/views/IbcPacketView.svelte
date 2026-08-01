<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IbcPacket>, 'prefetched'> = $props()

	const ibcPacket = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IbcChannelView from '$/views/IbcChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcPacket}
	entitySelector={selection.entitySelector}
	title={title ?? `Packet #${selection.entitySelector.sequence}`}
	idDragPlainText={String(selection.entitySelector.sequence)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Packet </span>
			<span data-badge="small">
				#{selection.entitySelector.sequence}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.sequence}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcPacket}>
			{#snippet children(entity)}
				<span data-text="muted">
					{selection.entitySelector.direction}
				</span>
				{@const status = entity.status}
				{#if status != null}
					<span data-text="muted">
						{status}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Sequence</dt>
				<dd>
					{selection.entitySelector.sequence}
				</dd>
			</div>

			<div>
				<dt>Direction</dt>
				<dd>
					{selection.entitySelector.direction}
				</dd>
			</div>

			<ResourceBoundary
				resource={ibcPacket}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							receiptExists: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receiptExists = entity.receiptExists}
					{#if receiptExists != null}
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
						fields: {
							timeoutTimestampNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timeoutTimestampNs = entity.timeoutTimestampNs}
					{#if timeoutTimestampNs != null}
						<div>
							<dt>Timeout timestamp ns</dt>
							<dd>
								{timeoutTimestampNs}
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
							sourcePort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourcePort = entity.sourcePort}
					{#if sourcePort != null}
						<div>
							<dt>Source port</dt>
							<dd>
								{sourcePort}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceChannel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceChannel = entity.sourceChannel}
					{#if sourceChannel != null}
						<div>
							<dt>Source channel</dt>
							<dd>
								{sourceChannel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationPort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationPort = entity.destinationPort}
					{#if destinationPort != null}
						<div>
							<dt>Destination port</dt>
							<dd>
								{destinationPort}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationChannel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationChannel = entity.destinationChannel}
					{#if destinationChannel != null}
						<div>
							<dt>Destination channel</dt>
							<dd>
								{destinationChannel}
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
							dataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataHash = entity.dataHash}
					{#if dataHash != null}
						<div>
							<dt>Data hash</dt>
							<dd>
								<TruncatedValue value={dataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commitmentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commitmentHash = entity.commitmentHash}
					{#if commitmentHash != null}
						<div>
							<dt>Commitment hash</dt>
							<dd>
								<TruncatedValue value={commitmentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							acknowledgementHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const acknowledgementHash = entity.acknowledgementHash}
					{#if acknowledgementHash != null}
						<div>
							<dt>Acknowledgement hash</dt>
							<dd>
								<TruncatedValue value={acknowledgementHash} />
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
							sendTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sendTxHash = entity.sendTxHash}
					{#if sendTxHash != null}
						<div>
							<dt>Send transaction hash</dt>
							<dd>
								<TruncatedValue value={sendTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							receiveTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receiveTxHash = entity.receiveTxHash}
					{#if receiveTxHash != null}
						<div>
							<dt>Receive transaction hash</dt>
							<dd>
								<TruncatedValue value={receiveTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							acknowledgeTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const acknowledgeTxHash = entity.acknowledgeTxHash}
					{#if acknowledgeTxHash != null}
						<div>
							<dt>Acknowledge transaction hash</dt>
							<dd>
								<TruncatedValue value={acknowledgeTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timeoutTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timeoutTxHash = entity.timeoutTxHash}
					{#if timeoutTxHash != null}
						<div>
							<dt>Timeout transaction hash</dt>
							<dd>
								<TruncatedValue value={timeoutTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Channel</dt>
				<dd>
					<IbcChannelView
						selection={select(EntityType.IbcChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
