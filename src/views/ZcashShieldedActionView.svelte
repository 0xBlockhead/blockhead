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
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedAction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZcashShieldedAction>>
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

	const zcashShieldedAction = $derived(selection({
		fields: {
			nullifier: true,
			noteCommitment: true,
			$pool: true,
			valueCommitment: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).actionKind) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action')
	const viewDomId = $derived('zcash-shielded-action-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedAction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-action/[pool]/[actionKind]/[actionIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2)].slug),
			txId: String(({ ...selection.entitySelector, ...prefetched }).$transaction.txId),
			pool: String(({ ...selection.entitySelector, ...prefetched }).pool),
			actionKind: String(({ ...selection.entitySelector, ...prefetched }).actionKind),
			actionIndex: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).actionKind) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded action'}
		{:else}
			<ResourceBoundary resource={zcashShieldedAction}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).actionKind) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded action'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.actionKind) ?? ''), String((entity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).pool) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).actionKind) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded action'}
		{:else}
			<ResourceBoundary resource={zcashShieldedAction}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).pool) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).actionKind) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded action'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.pool) ?? '')].filter(Boolean).join(' ') || [String((entity.actionKind) ?? ''), String((entity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const nullifier0 = prefetched.nullifier}
			{#if nullifier0 !== undefined && nullifier0 !== null}
				<span data-text="muted">
					{String((nullifier0) ?? '')}
				</span>
			{/if}
			{@const noteCommitment1 = prefetched.noteCommitment}
			{#if noteCommitment1 !== undefined && noteCommitment1 !== null}
				<span data-text="muted">
					{String((noteCommitment1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={zcashShieldedAction}>
				{#snippet Pending()}
					{@const nullifier0 = prefetched.nullifier}
					{#if nullifier0 !== undefined && nullifier0 !== null}
						<span data-text="muted">
							{String((nullifier0) ?? '')}
						</span>
					{/if}
					{@const noteCommitment1 = prefetched.noteCommitment}
					{#if noteCommitment1 !== undefined && noteCommitment1 !== null}
						<span data-text="muted">
							{String((noteCommitment1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const nullifier0 = entity.nullifier}
					{#if nullifier0 !== undefined && nullifier0 !== null}
						<span data-text="muted">
							{String((nullifier0) ?? '')}
						</span>
					{/if}
					{@const noteCommitment1 = entity.noteCommitment}
					{#if noteCommitment1 !== undefined && noteCommitment1 !== null}
						<span data-text="muted">
							{String((noteCommitment1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.ZcashShieldedPool, false>('$pool')}
			>
				{#snippet children(zcashShieldedPool)}
					{#if zcashShieldedPool != null}
						<div>
							<dt>Pool</dt>
							<dd>
								<ZcashShieldedPoolView
									selection={select(EntityType.ZcashShieldedPool, zcashShieldedPool.entitySelector)}
									prefetched={zcashShieldedPool}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/zcash/shielded-pool/[pool]', {
											networkSlug: String(zcashShieldedPool.entitySelector.$network.slug),
											pool: String(zcashShieldedPool.entitySelector.pool),
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

			<ResourceBoundary resource={zcashShieldedAction}>
				{#snippet Pending()}
					{@const valueCommitment = prefetched.valueCommitment ?? selection.entitySelector.valueCommitment}
					{#if valueCommitment !== undefined && valueCommitment !== null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{String((valueCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const valueCommitment = entity.valueCommitment ?? selection.entitySelector.valueCommitment ?? prefetched.valueCommitment}
					{#if valueCommitment !== undefined && valueCommitment !== null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{String((valueCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]', {
								networkSlug: String(selection.entitySelector.$transaction.$network.slug),
								txId: String(selection.entitySelector.$transaction.txId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
