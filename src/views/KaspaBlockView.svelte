<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.KaspaBlock>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.KaspaBlock>>
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
	const kaspaBlock = $derived(selection({
		sources: [
			Source.KaspaExplorer_Rest,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))
	const titleFallback = $derived('kaspa block')
	const viewDomId = $derived('kaspa-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaAcceptedTransactionsView from '$/views/KaspaAcceptedTransactionsView.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={kaspaBlock}>
			{#snippet Pending()}
				{title || 'kaspa block'}
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
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockHash = pendingEntity.blockHash}
							{#if blockHash !== undefined && blockHash !== null}
								<TruncatedValue value={String((blockHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockHash = resolvedEntity.blockHash}
							{#if blockHash !== undefined && blockHash !== null}
								<TruncatedValue value={String((blockHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blueScore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blueScore = pendingEntity.blueScore}
					{#if blueScore !== undefined && blueScore !== null}
						<div>
							<dt>blue score</dt>
							<dd>
								<NumberValue value={Number(blueScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blueScore = resolvedEntity.blueScore}
					{#if blueScore !== undefined && blueScore !== null}
						<div>
							<dt>blue score</dt>
							<dd>
								<NumberValue value={Number(blueScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							daaScore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const daaScore = pendingEntity.daaScore}
					{#if daaScore !== undefined && daaScore !== null}
						<div>
							<dt>daa score</dt>
							<dd>
								<NumberValue value={Number(daaScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const daaScore = resolvedEntity.daaScore}
					{#if daaScore !== undefined && daaScore !== null}
						<div>
							<dt>daa score</dt>
							<dd>
								<NumberValue value={Number(daaScore)} />
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
							selectedParentHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const selectedParentHash = pendingEntity.selectedParentHash}
					{#if selectedParentHash !== undefined && selectedParentHash !== null}
						<div>
							<dt>selected parent hash</dt>
							<dd>
								<TruncatedValue value={String((selectedParentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const selectedParentHash = resolvedEntity.selectedParentHash}
					{#if selectedParentHash !== undefined && selectedParentHash !== null}
						<div>
							<dt>selected parent hash</dt>
							<dd>
								<TruncatedValue value={String((selectedParentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>parent hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									parentHashes: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const parentHashes = pendingEntity.parentHashes}
							{#if parentHashes !== undefined && parentHashes !== null}
								<TruncatedValue value={parentHashes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const parentHashes = resolvedEntity.parentHashes}
							{#if parentHashes !== undefined && parentHashes !== null}
								<TruncatedValue value={parentHashes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							utxoCommitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const utxoCommitment = pendingEntity.utxoCommitment}
					{#if utxoCommitment !== undefined && utxoCommitment !== null}
						<div>
							<dt>UTXO commitment</dt>
							<dd>
								{String((utxoCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const utxoCommitment = resolvedEntity.utxoCommitment}
					{#if utxoCommitment !== undefined && utxoCommitment !== null}
						<div>
							<dt>UTXO commitment</dt>
							<dd>
								{String((utxoCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<KaspaAcceptedTransactionsView
				selection={
						selection.$$acceptedTransactions({
							count: true,
						})
					}
				title='accepted transactions'
				emptyText='No Kaspa accepted transactions.'
				id='KaspaAcceptedTransactionsView-accepted-transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
