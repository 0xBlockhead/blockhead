<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeTransfer_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BridgeTransfer_Timestamp>>
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
	const bridgeTransferTimestamp = $derived(selection({
		sources: [
			Source.LifiStatus_Rest,
			Source.Allium_Rest,
			Source.Dune_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			status: true,
			substatus: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'bridge transfer timestamp')
	const viewDomId = $derived('bridge-transfer-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeTransfer_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bridgeTransferTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bridgeTransferTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? ''), String((prefetched.substatus) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'bridge transfer timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.substatus) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeTransferTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transfer</dt>
				<dd>
					<BridgeTransferView
						selection={select(EntityType.BridgeTransfer, selection.entitySelector.$transfer, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
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
						fields: {
							substatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const substatus = prefetched.substatus}
					{#if substatus !== undefined && substatus !== null}
						<div>
							<dt>substatus</dt>
							<dd>
								{String((substatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const substatus = resolvedEntity.substatus}
					{#if substatus !== undefined && substatus !== null}
						<div>
							<dt>substatus</dt>
							<dd>
								{String((substatus) ?? '')}
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
							sourceConfirmations: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceConfirmations = prefetched.sourceConfirmations}
					{#if sourceConfirmations !== undefined && sourceConfirmations !== null}
						<div>
							<dt>source confirmations</dt>
							<dd>
								<NumberValue value={Number(sourceConfirmations)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceConfirmations = resolvedEntity.sourceConfirmations}
					{#if sourceConfirmations !== undefined && sourceConfirmations !== null}
						<div>
							<dt>source confirmations</dt>
							<dd>
								<NumberValue value={Number(sourceConfirmations)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requiredConfirmations: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requiredConfirmations = prefetched.requiredConfirmations}
					{#if requiredConfirmations !== undefined && requiredConfirmations !== null}
						<div>
							<dt>required confirmations</dt>
							<dd>
								<NumberValue value={Number(requiredConfirmations)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requiredConfirmations = resolvedEntity.requiredConfirmations}
					{#if requiredConfirmations !== undefined && requiredConfirmations !== null}
						<div>
							<dt>required confirmations</dt>
							<dd>
								<NumberValue value={Number(requiredConfirmations)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationTxHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const destinationTxHash = prefetched.destinationTxHash}
					{#if destinationTxHash !== undefined && destinationTxHash !== null}
						<div>
							<dt>destination tx hash</dt>
							<dd>
								<TruncatedValue value={String((destinationTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationTxHash = resolvedEntity.destinationTxHash}
					{#if destinationTxHash !== undefined && destinationTxHash !== null}
						<div>
							<dt>destination tx hash</dt>
							<dd>
								<TruncatedValue value={String((destinationTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							relayer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const relayer = prefetched.relayer}
					{#if relayer !== undefined && relayer !== null}
						<div>
							<dt>relayer</dt>
							<dd>
								{String((relayer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relayer = resolvedEntity.relayer}
					{#if relayer !== undefined && relayer !== null}
						<div>
							<dt>relayer</dt>
							<dd>
								{String((relayer) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							refundTxHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const refundTxHash = prefetched.refundTxHash}
					{#if refundTxHash !== undefined && refundTxHash !== null}
						<div>
							<dt>refund tx hash</dt>
							<dd>
								<TruncatedValue value={String((refundTxHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const refundTxHash = resolvedEntity.refundTxHash}
					{#if refundTxHash !== undefined && refundTxHash !== null}
						<div>
							<dt>refund tx hash</dt>
							<dd>
								<TruncatedValue value={String((refundTxHash) ?? '')} />
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
							estimatedCompletionMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const estimatedCompletionMs = prefetched.estimatedCompletionMs}
					{#if estimatedCompletionMs !== undefined && estimatedCompletionMs !== null}
						<div>
							<dt>estimated completion ms</dt>
							<dd>
								<Timestamp timestamp={Number(estimatedCompletionMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const estimatedCompletionMs = resolvedEntity.estimatedCompletionMs}
					{#if estimatedCompletionMs !== undefined && estimatedCompletionMs !== null}
						<div>
							<dt>estimated completion ms</dt>
							<dd>
								<Timestamp timestamp={Number(estimatedCompletionMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const completedAt = prefetched.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const completedAt = resolvedEntity.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
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
							<dt>error</dt>
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
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
