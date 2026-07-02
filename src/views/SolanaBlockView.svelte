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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaBlock>>
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

	const solanaBlock = $derived(selection({
		fields: {
			blockHeight: true,
			blockHash: true,
			previousBlockHash: true,
			parentSlot: true,
			timestampMs: true,
			transactionCount: true,
			$parent: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).slot) ?? '') ? 'Slot #' + String((({ ...selection.entitySelector, ...prefetched }).slot) ?? '') : '') || 'solana block')
	const viewDomId = $derived('solana-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaBlock}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).slot ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/block/[slot]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			slot: String(({ ...selection.entitySelector, ...prefetched }).slot),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Slot </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const blockHeight0 = prefetched.blockHeight}
			{#if blockHeight0 !== undefined && blockHeight0 !== null}
				<span data-text="muted">
					{String((blockHeight0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaBlock}>
				{#snippet Pending()}
					{@const blockHeight0 = prefetched.blockHeight}
					{#if blockHeight0 !== undefined && blockHeight0 !== null}
						<span data-text="muted">
							{String((blockHeight0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blockHeight0 = entity.blockHeight}
					{#if blockHeight0 !== undefined && blockHeight0 !== null}
						<span data-text="muted">
							{String((blockHeight0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary resource={solanaBlock}>
						{#snippet Pending()}
							{@const slot = prefetched.slot ?? selection.entitySelector.slot}
							{#if slot !== undefined && slot !== null}
								{String((slot) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const slot = entity.slot ?? selection.entitySelector.slot ?? prefetched.slot}
							{#if slot !== undefined && slot !== null}
								{String((slot) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={solanaBlock}>
				{#snippet Pending()}
					{@const blockHash = prefetched.blockHash ?? selection.entitySelector.blockHash}
					{#if blockHash !== undefined && blockHash !== null}
						<div>
							<dt>Block hash</dt>
							<dd>
								{String((blockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const blockHash = entity.blockHash ?? selection.entitySelector.blockHash ?? prefetched.blockHash}
					{#if blockHash !== undefined && blockHash !== null}
						<div>
							<dt>Block hash</dt>
							<dd>
								{String((blockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaBlock}>
				{#snippet Pending()}
					{@const previousBlockHash = prefetched.previousBlockHash ?? selection.entitySelector.previousBlockHash}
					{#if previousBlockHash !== undefined && previousBlockHash !== null}
						<div>
							<dt>Previous block hash</dt>
							<dd>
								{String((previousBlockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const previousBlockHash = entity.previousBlockHash ?? selection.entitySelector.previousBlockHash ?? prefetched.previousBlockHash}
					{#if previousBlockHash !== undefined && previousBlockHash !== null}
						<div>
							<dt>Previous block hash</dt>
							<dd>
								{String((previousBlockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={solanaBlock}>
				{#snippet Pending()}
					{@const parentSlot = prefetched.parentSlot ?? selection.entitySelector.parentSlot}
					{#if parentSlot !== undefined && parentSlot !== null}
						<div>
							<dt>Parent slot</dt>
							<dd>
								{String((parentSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const parentSlot = entity.parentSlot ?? selection.entitySelector.parentSlot ?? prefetched.parentSlot}
					{#if parentSlot !== undefined && parentSlot !== null}
						<div>
							<dt>Parent slot</dt>
							<dd>
								{String((parentSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaBlock}>
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

			<ResourceBoundary resource={solanaBlock}>
				{#snippet Pending()}
					{@const transactionCount = prefetched.transactionCount ?? selection.entitySelector.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount ?? selection.entitySelector.transactionCount ?? prefetched.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaBlock, false>('$parent')}
			>
				{#snippet children(solanaBlock)}
					{#if solanaBlock != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<SolanaBlockView
									selection={select(EntityType.SolanaBlock, solanaBlock.entitySelector)}
									prefetched={solanaBlock}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/block/[slot]', {
											networkSlug: String(solanaBlock.entitySelector.$network.slug),
											slot: String(solanaBlock.entitySelector.slot),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
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
</EntityView>
