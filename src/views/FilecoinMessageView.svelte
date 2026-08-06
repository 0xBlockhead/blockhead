<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FilecoinMessage>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	}))
	const filecoinMessage = $derived(viewSelection({
		fields: {
			valueAttoFil: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinMessage_TimestampsView from '$/views/FilecoinMessage_TimestampsView.svelte'
	import FilecoinMessageTransfersView from '$/views/FilecoinMessageTransfersView.svelte'
	import FilecoinMessageTokenTransfersView from '$/views/FilecoinMessageTokenTransfersView.svelte'
	import FilecoinMessageEventsView from '$/views/FilecoinMessageEventsView.svelte'
	import FilecoinMessageSubcallsView from '$/views/FilecoinMessageSubcallsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
	import FilecoinMessageReceiptView from '$/views/FilecoinMessageReceiptView.svelte'
	import FilecoinMessageFeeView from '$/views/FilecoinMessageFeeView.svelte'
	import FilecoinMessage_TimestampView from '$/views/FilecoinMessage_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessage}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.cid || 'filecoin message')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.cid} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$from}
		>
			{#snippet children(filecoinActor)}
				{#if filecoinActor != null}
					<FilecoinActorView
						selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$to}
		>
			{#snippet children(filecoinActor)}
				{#if filecoinActor != null}
					<FilecoinActorView
						selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinMessage}>
			{#snippet children(entity)}
				{@const valueAttoFil = entity.valueAttoFil}
				{#if valueAttoFil != null}
					<span data-text="muted">
						<NumberValue
							value={valueAttoFil}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Latest observation</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
							.$$timestamps({
								sources: [
									Source.Filfox_Rest,
								],
								fields: {
									height: true,
									timestampMs: true,
									source: true,
								},
								orderBy: [
									[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].height ?? Number.NEGATIVE_INFINITY, 'desc'],
								],
							}).first()
						}
					>
						{#snippet children(filecoinMessageTimestamp)}
							{#if filecoinMessageTimestamp != null}
								{@const filecoinMessageTimestampSelector = filecoinMessageTimestamp[EntityMetaKey.Selector]}
								<FilecoinMessage_TimestampView
									selection={
										select(EntityType.FilecoinMessage_Timestamp, filecoinMessageTimestampSelector, {
											sources: [
												Source.Filfox_Rest,
											],
										})
									}
									prefetched={{ ...filecoinMessageTimestampSelector, ...filecoinMessageTimestamp }}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest observation available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>CID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.cid} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						<div>
							<dt>From</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						<div>
							<dt>To</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							method: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const method = entity.method}
					{#if method != null}
						<div>
							<dt>Method</dt>
							<dd>
								<NumberValue
									value={method}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue
									value={nonce}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={filecoinMessage}
			>
				{#snippet children(entity)}
					{@const valueAttoFil = entity.valueAttoFil}
					{#if valueAttoFil != null}
						<div>
							<dt>Value attoFIL</dt>
							<dd>
								<NumberValue
									value={valueAttoFil}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							gasLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasLimit = entity.gasLimit}
					{#if gasLimit != null}
						<div>
							<dt>Gas limit</dt>
							<dd>
								<NumberValue
									value={gasLimit}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$receipt}
			>
				{#snippet children(filecoinMessageReceipt)}
					{#if filecoinMessageReceipt != null}
						<div>
							<dt>Receipt</dt>
							<dd>
								<FilecoinMessageReceiptView
									selection={select(EntityType.FilecoinMessageReceipt, filecoinMessageReceipt[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fee}
			>
				{#snippet children(filecoinMessageFee)}
					{#if filecoinMessageFee != null}
						<div>
							<dt>Fee</dt>
							<dd>
								<FilecoinMessageFeeView
									selection={select(EntityType.FilecoinMessageFee, filecoinMessageFee[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMessage_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const transfersResource = selection.$$transfers}
		<ResourceBoundary
			resource={transfersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMessageTransfersView
						selection={transfersResource}
						countResource={transfersResource.count}
						title='Transfers'
						id='transfers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const tokenTransfersResource = selection.$$tokenTransfers}
		<ResourceBoundary
			resource={tokenTransfersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMessageTokenTransfersView
						selection={tokenTransfersResource}
						countResource={tokenTransfersResource.count}
						title='Token transfers'
						id='token-transfers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const eventsResource = selection.$$events}
		<ResourceBoundary
			resource={eventsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMessageEventsView
						selection={eventsResource}
						countResource={eventsResource.count}
						title='Events'
						id='events'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const subcallsResource = selection.$$subcalls}
		<ResourceBoundary
			resource={subcallsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinMessageSubcallsView
						selection={subcallsResource}
						countResource={subcallsResource.count}
						title='Subcalls'
						id='subcalls'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
