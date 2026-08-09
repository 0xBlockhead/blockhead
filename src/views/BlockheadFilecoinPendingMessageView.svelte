<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadFilecoinPendingMessage>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadFilecoinPendingMessage = $derived(viewSelection({
		fields: {
			local: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinNetworkView from '$/views/FilecoinNetworkView.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFilecoinPendingMessage}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.messageCid || 'blockhead filecoin pending message')}
	href={
		href === undefined ?
			resolve(
				'/~/filecoin/node/[nodeId=stringSegment]/pending-message/[messageCid=stringSegment]/[observedAtMs=nonNegativeInteger]',
				{
					nodeId: selection.entitySelector.nodeId,
					messageCid: selection.entitySelector.messageCid,
					observedAtMs: String(selection.entitySelector.observedAtMs),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.messageCid} />
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.observedAtMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadFilecoinPendingMessage}>
			{#snippet children(entity)}
				{@const local = entity.local}
				{#if local != null}
					<span data-text="muted">
						{local ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
				</dd>
			</div>

			<div>
				<dt>message CID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.messageCid} />
				</dd>
			</div>

			<div>
				<dt>observed AT ms</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.observedAtMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(filecoinNetwork)}
					{#if filecoinNetwork != null}
						<div>
							<dt>network</dt>
							<dd>
								<FilecoinNetworkView
									selection={select(EntityType.FilecoinNetwork, filecoinNetwork[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$message}
			>
				{#snippet children(filecoinMessage)}
					{#if filecoinMessage != null}
						<div>
							<dt>message</dt>
							<dd>
								<FilecoinMessageView
									selection={select(EntityType.FilecoinMessage, filecoinMessage[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						<div>
							<dt>from</dt>
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
							<dt>to</dt>
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
		</dl>

		<dl data-column-item="center">
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
							<dt>nonce</dt>
							<dd>
								{nonce}
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
							<dt>method</dt>
							<dd>
								{method}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							valueAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valueAttoFil = entity.valueAttoFil}
					{#if valueAttoFil != null}
						<div>
							<dt>value atto fil</dt>
							<dd>
								{valueAttoFil}
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
							<dt>gas limit</dt>
							<dd>
								{gasLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							gasFeeCapAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasFeeCapAttoFil = entity.gasFeeCapAttoFil}
					{#if gasFeeCapAttoFil != null}
						<div>
							<dt>gas fee cap atto fil</dt>
							<dd>
								{gasFeeCapAttoFil}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							gasPremiumAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasPremiumAttoFil = entity.gasPremiumAttoFil}
					{#if gasPremiumAttoFil != null}
						<div>
							<dt>gas premium atto fil</dt>
							<dd>
								{gasPremiumAttoFil}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signatureType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureType = entity.signatureType}
					{#if signatureType != null}
						<div>
							<dt>signature type</dt>
							<dd>
								{signatureType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadFilecoinPendingMessage}
			>
				{#snippet children(entity)}
					{@const local = entity.local}
					{#if local != null}
						<div>
							<dt>local</dt>
							<dd>
								{local ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
