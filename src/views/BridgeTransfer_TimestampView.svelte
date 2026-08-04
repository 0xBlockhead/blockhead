<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.BridgeTransfer_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lifi_Rest,
			Source.Allium_Rest,
			Source.Dune_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const bridgeTransferTimestamp = $derived(viewSelection({
		fields: {
			status: true,
			substatus: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeTransfer_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bridgeTransferTimestamp}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), (entity.substatus ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transfer</dt>
				<dd>
					<BridgeTransferView
						selection={select(EntityType.BridgeTransfer, selection.entitySelector.$transfer)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={bridgeTransferTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bridgeTransferTimestamp}
			>
				{#snippet children(entity)}
					{@const substatus = entity.substatus}
					{#if substatus != null}
						<div>
							<dt>substatus</dt>
							<dd>
								{substatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceConfirmations: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceConfirmations = entity.sourceConfirmations}
					{#if sourceConfirmations != null}
						<div>
							<dt>source confirmations</dt>
							<dd>
								<NumberValue
									value={sourceConfirmations}
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
							requiredConfirmations: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requiredConfirmations = entity.requiredConfirmations}
					{#if requiredConfirmations != null}
						<div>
							<dt>required confirmations</dt>
							<dd>
								<NumberValue
									value={requiredConfirmations}
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
							destinationTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationTxHash = entity.destinationTxHash}
					{#if destinationTxHash != null}
						<div>
							<dt>destination tx hash</dt>
							<dd>
								<TruncatedValue value={destinationTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							relayer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const relayer = entity.relayer}
					{#if relayer != null}
						<div>
							<dt>relayer</dt>
							<dd>
								{relayer}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							refundTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const refundTxHash = entity.refundTxHash}
					{#if refundTxHash != null}
						<div>
							<dt>refund tx hash</dt>
							<dd>
								<TruncatedValue value={refundTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							estimatedCompletionMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const estimatedCompletionMs = entity.estimatedCompletionMs}
					{#if estimatedCompletionMs != null}
						<div>
							<dt>estimated completion ms</dt>
							<dd>
								<Timestamp timestamp={estimatedCompletionMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedAt = entity.completedAt}
					{#if completedAt != null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={completedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
