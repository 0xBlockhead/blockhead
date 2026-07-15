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
			selection: RegisteredEntityProxyResource<EntityType.XrplLedgerEntry>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.XrplLedgerEntry>>
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
	const xrplLedgerEntry = $derived(selection({}))
	const titleFallback = $derived('XRPL ledger entry')
	const viewDomId = $derived('xrpl-ledger-entry-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XrplLedgerView from '$/views/XrplLedgerView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplLedgerEntry}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplLedgerEntry}>
			{#snippet Pending()}
				{title || 'XRPL ledger entry'}
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
				<dt>ledger</dt>
				<dd>
					<XrplLedgerView
						selection={select(EntityType.XrplLedger, selection.entitySelector.$ledger, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>entry hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									entryHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const entryHash = pendingEntity.entryHash}
							{#if entryHash !== undefined && entryHash !== null}
								<TruncatedValue value={String((entryHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const entryHash = resolvedEntity.entryHash}
							{#if entryHash !== undefined && entryHash !== null}
								<TruncatedValue value={String((entryHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>entry type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									entryType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const entryType = pendingEntity.entryType}
							{#if entryType !== undefined && entryType !== null}
								{String((entryType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const entryType = resolvedEntity.entryType}
							{#if entryType !== undefined && entryType !== null}
								{String((entryType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							account: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const account = pendingEntity.account}
					{#if account !== undefined && account !== null}
						<div>
							<dt>account</dt>
							<dd>
								<TruncatedValue value={String((account) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const account = resolvedEntity.account}
					{#if account !== undefined && account !== null}
						<div>
							<dt>account</dt>
							<dd>
								<TruncatedValue value={String((account) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousTransactionHash = pendingEntity.previousTransactionHash}
					{#if previousTransactionHash !== undefined && previousTransactionHash !== null}
						<div>
							<dt>previous transaction hash</dt>
							<dd>
								<TruncatedValue value={String((previousTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousTransactionHash = resolvedEntity.previousTransactionHash}
					{#if previousTransactionHash !== undefined && previousTransactionHash !== null}
						<div>
							<dt>previous transaction hash</dt>
							<dd>
								<TruncatedValue value={String((previousTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransactionLedgerIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousTransactionLedgerIndex = pendingEntity.previousTransactionLedgerIndex}
					{#if previousTransactionLedgerIndex !== undefined && previousTransactionLedgerIndex !== null}
						<div>
							<dt>previous transaction ledger index</dt>
							<dd>
								{String((previousTransactionLedgerIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousTransactionLedgerIndex = resolvedEntity.previousTransactionLedgerIndex}
					{#if previousTransactionLedgerIndex !== undefined && previousTransactionLedgerIndex !== null}
						<div>
							<dt>previous transaction ledger index</dt>
							<dd>
								{String((previousTransactionLedgerIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
