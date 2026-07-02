<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosBlock>>
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

	const cosmosBlock = $derived(selection({
		fields: {
			transactionCount: true,
			proposerConsensusAddress: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).height) ?? '') ? 'Block #' + String((({ ...selection.entitySelector, ...prefetched }).height) ?? '') : '') || [String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || 'Cosmos block')
	const viewDomId = $derived('cosmos-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosTransactionsView from '$/views/CosmosTransactionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosBlock}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).height ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			height: String(({ ...selection.entitySelector, ...prefetched }).height),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).height}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Block </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).height}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{:else}
			{[String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ')}
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const transactionCount0 = prefetched.transactionCount}
			{#if transactionCount0 !== undefined && transactionCount0 !== null}
				<span data-text="muted">
					{String((transactionCount0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosBlock}>
				{#snippet Pending()}
					{@const transactionCount0 = prefetched.transactionCount}
					{#if transactionCount0 !== undefined && transactionCount0 !== null}
						<span data-text="muted">
							{String((transactionCount0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionCount0 = entity.transactionCount}
					{#if transactionCount0 !== undefined && transactionCount0 !== null}
						<span data-text="muted">
							{String((transactionCount0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary resource={cosmosBlock}>
						{#snippet Pending()}
							{@const height = prefetched.height ?? selection.entitySelector.height}
							{#if height !== undefined && height !== null}
								{String((height) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const height = entity.height ?? selection.entitySelector.height ?? prefetched.height}
							{#if height !== undefined && height !== null}
								{String((height) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary resource={cosmosBlock}>
						{#snippet Pending()}
							{@const hash = prefetched.hash ?? selection.entitySelector.hash}
							{#if hash !== undefined && hash !== null}
								{String((hash) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const hash = entity.hash ?? selection.entitySelector.hash ?? prefetched.hash}
							{#if hash !== undefined && hash !== null}
								{String((hash) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={cosmosBlock}>
				{#snippet Pending()}
					{@const proposerConsensusAddress = prefetched.proposerConsensusAddress ?? selection.entitySelector.proposerConsensusAddress}
					{#if proposerConsensusAddress !== undefined && proposerConsensusAddress !== null}
						<div>
							<dt>Proposer consensus address</dt>
							<dd>
								{String((proposerConsensusAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const proposerConsensusAddress = entity.proposerConsensusAddress ?? selection.entitySelector.proposerConsensusAddress ?? prefetched.proposerConsensusAddress}
					{#if proposerConsensusAddress !== undefined && proposerConsensusAddress !== null}
						<div>
							<dt>Proposer consensus address</dt>
							<dd>
								{String((proposerConsensusAddress) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosBlock}>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								{String((timestampMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								{String((timestampMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CosmosTransactionsView
				selection={selection[EntityProxyField]<EntityType.CosmosTransaction>('$$transactions')}
				title='Transactions'
				emptyText='No Cosmos transactions.'
				id='CosmosTransactionsView-$$transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
