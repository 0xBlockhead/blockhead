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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTransactionProof>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandTransactionProof>>
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
	const algorandTransactionProof = $derived(selection({}))
	const titleFallback = $derived('algorand transaction proof')
	const viewDomId = $derived('algorand-transaction-proof-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandTransactionView from '$/views/AlgorandTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTransactionProof}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandTransactionProof}>
			{#snippet Pending()}
				{title || 'algorand transaction proof'}
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
				<dt>transaction</dt>
				<dd>
					<AlgorandTransactionView
						selection={select(EntityType.AlgorandTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>round</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									round: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const round = selection.entitySelector.round ?? prefetched.round}
							{#if round !== undefined && round !== null}
								{String((round) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const round = resolvedEntity.round}
							{#if round !== undefined && round !== null}
								{String((round) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>hash type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hashType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hashType = selection.entitySelector.hashType ?? prefetched.hashType}
							{#if hashType !== undefined && hashType !== null}
								<TruncatedValue value={String((hashType) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hashType = resolvedEntity.hashType}
							{#if hashType !== undefined && hashType !== null}
								<TruncatedValue value={String((hashType) ?? '')} />
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proofBytes = prefetched.proofBytes}
					{#if proofBytes !== undefined && proofBytes !== null}
						<div>
							<dt>proof bytes</dt>
							<dd>
								{String((proofBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofBytes = resolvedEntity.proofBytes}
					{#if proofBytes !== undefined && proofBytes !== null}
						<div>
							<dt>proof bytes</dt>
							<dd>
								{String((proofBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stibHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stibHash = prefetched.stibHash}
					{#if stibHash !== undefined && stibHash !== null}
						<div>
							<dt>stib hash</dt>
							<dd>
								<TruncatedValue value={String((stibHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stibHash = resolvedEntity.stibHash}
					{#if stibHash !== undefined && stibHash !== null}
						<div>
							<dt>stib hash</dt>
							<dd>
								<TruncatedValue value={String((stibHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							treeDepth: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const treeDepth = prefetched.treeDepth}
					{#if treeDepth !== undefined && treeDepth !== null}
						<div>
							<dt>tree depth</dt>
							<dd>
								{String((treeDepth) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const treeDepth = resolvedEntity.treeDepth}
					{#if treeDepth !== undefined && treeDepth !== null}
						<div>
							<dt>tree depth</dt>
							<dd>
								{String((treeDepth) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
