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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaVirtualChain_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.KaspaVirtualChain_Timestamp>>
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
	const kaspaVirtualChainTimestamp = $derived(selection({}))
	const titleFallback = $derived('kaspa virtual chain timestamp')
	const viewDomId = $derived('kaspa-virtual-chain-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaVirtualChain_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={kaspaVirtualChainTimestamp}>
			{#snippet Pending()}
				{title || 'kaspa virtual chain timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>start hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									startHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const startHash = selection.entitySelector.startHash ?? prefetched.startHash}
							{#if startHash !== undefined && startHash !== null}
								<TruncatedValue value={String((startHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const startHash = resolvedEntity.startHash}
							{#if startHash !== undefined && startHash !== null}
								<TruncatedValue value={String((startHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
							minConfirmationCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const minConfirmationCount = prefetched.minConfirmationCount}
					{#if minConfirmationCount !== undefined && minConfirmationCount !== null}
						<div>
							<dt>min confirmation count</dt>
							<dd>
								<NumberValue value={Number(minConfirmationCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minConfirmationCount = resolvedEntity.minConfirmationCount}
					{#if minConfirmationCount !== undefined && minConfirmationCount !== null}
						<div>
							<dt>min confirmation count</dt>
							<dd>
								<NumberValue value={Number(minConfirmationCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>added chain block hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									addedChainBlockHashes: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const addedChainBlockHashes = prefetched.addedChainBlockHashes}
							{#if addedChainBlockHashes !== undefined && addedChainBlockHashes !== null}
								<TruncatedValue value={(addedChainBlockHashes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const addedChainBlockHashes = resolvedEntity.addedChainBlockHashes}
							{#if addedChainBlockHashes !== undefined && addedChainBlockHashes !== null}
								<TruncatedValue value={(addedChainBlockHashes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>removed chain block hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									removedChainBlockHashes: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const removedChainBlockHashes = prefetched.removedChainBlockHashes}
							{#if removedChainBlockHashes !== undefined && removedChainBlockHashes !== null}
								<TruncatedValue value={(removedChainBlockHashes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const removedChainBlockHashes = resolvedEntity.removedChainBlockHashes}
							{#if removedChainBlockHashes !== undefined && removedChainBlockHashes !== null}
								<TruncatedValue value={(removedChainBlockHashes?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							acceptedTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const acceptedTransactionCount = prefetched.acceptedTransactionCount}
					{#if acceptedTransactionCount !== undefined && acceptedTransactionCount !== null}
						<div>
							<dt>accepted transaction count</dt>
							<dd>
								<NumberValue value={Number(acceptedTransactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const acceptedTransactionCount = resolvedEntity.acceptedTransactionCount}
					{#if acceptedTransactionCount !== undefined && acceptedTransactionCount !== null}
						<div>
							<dt>accepted transaction count</dt>
							<dd>
								<NumberValue value={Number(acceptedTransactionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextCheckpointHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nextCheckpointHash = prefetched.nextCheckpointHash}
					{#if nextCheckpointHash !== undefined && nextCheckpointHash !== null}
						<div>
							<dt>next checkpoint hash</dt>
							<dd>
								<TruncatedValue value={String((nextCheckpointHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextCheckpointHash = resolvedEntity.nextCheckpointHash}
					{#if nextCheckpointHash !== undefined && nextCheckpointHash !== null}
						<div>
							<dt>next checkpoint hash</dt>
							<dd>
								<TruncatedValue value={String((nextCheckpointHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
