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
			selection: EntityProxyResource<typeof schema, EntityType.XrplLedger>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XrplLedger>>
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
	const xrplLedger = $derived(selection({}))
	const titleFallback = $derived('XRPL ledger')
	const viewDomId = $derived('xrpl-ledger-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XrplNetworkView from '$/views/XrplNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplLedger}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplLedger}>
			{#snippet Pending()}
				{title || 'XRPL ledger'}
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
					<XrplNetworkView
						selection={select(EntityType.XrplNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerIndex = prefetched.ledgerIndex}
					{#if ledgerIndex !== undefined && ledgerIndex !== null}
						<div>
							<dt>ledger index</dt>
							<dd>
								{String((ledgerIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerIndex = resolvedEntity.ledgerIndex}
					{#if ledgerIndex !== undefined && ledgerIndex !== null}
						<div>
							<dt>ledger index</dt>
							<dd>
								{String((ledgerIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerHash = prefetched.ledgerHash}
					{#if ledgerHash !== undefined && ledgerHash !== null}
						<div>
							<dt>ledger hash</dt>
							<dd>
								<TruncatedValue value={String((ledgerHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerHash = resolvedEntity.ledgerHash}
					{#if ledgerHash !== undefined && ledgerHash !== null}
						<div>
							<dt>ledger hash</dt>
							<dd>
								<TruncatedValue value={String((ledgerHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closeTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closeTimeMs = prefetched.closeTimeMs}
					{#if closeTimeMs !== undefined && closeTimeMs !== null}
						<div>
							<dt>close time ms</dt>
							<dd>
								{String((closeTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closeTimeMs = resolvedEntity.closeTimeMs}
					{#if closeTimeMs !== undefined && closeTimeMs !== null}
						<div>
							<dt>close time ms</dt>
							<dd>
								{String((closeTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validated: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validated = prefetched.validated}
					{#if validated !== undefined && validated !== null}
						<div>
							<dt>validated</dt>
							<dd>
								{validated ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validated = resolvedEntity.validated}
					{#if validated !== undefined && validated !== null}
						<div>
							<dt>validated</dt>
							<dd>
								{validated ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalCoinsDrops: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalCoinsDrops = prefetched.totalCoinsDrops}
					{#if totalCoinsDrops !== undefined && totalCoinsDrops !== null}
						<div>
							<dt>total coins drops</dt>
							<dd>
								{String((totalCoinsDrops) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalCoinsDrops = resolvedEntity.totalCoinsDrops}
					{#if totalCoinsDrops !== undefined && totalCoinsDrops !== null}
						<div>
							<dt>total coins drops</dt>
							<dd>
								{String((totalCoinsDrops) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parentHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const parentHash = prefetched.parentHash}
					{#if parentHash !== undefined && parentHash !== null}
						<div>
							<dt>parent hash</dt>
							<dd>
								<TruncatedValue value={String((parentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentHash = resolvedEntity.parentHash}
					{#if parentHash !== undefined && parentHash !== null}
						<div>
							<dt>parent hash</dt>
							<dd>
								<TruncatedValue value={String((parentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountHash = prefetched.accountHash}
					{#if accountHash !== undefined && accountHash !== null}
						<div>
							<dt>account hash</dt>
							<dd>
								<TruncatedValue value={String((accountHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountHash = resolvedEntity.accountHash}
					{#if accountHash !== undefined && accountHash !== null}
						<div>
							<dt>account hash</dt>
							<dd>
								<TruncatedValue value={String((accountHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionHash = prefetched.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionHash = resolvedEntity.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
