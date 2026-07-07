<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTransaction_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaTransaction_Timestamp>>
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
	const solanaTransactionTimestamp = $derived(selection({
		fields: {
			status: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.slot ?? prefetched.slot) ?? '')].filter(Boolean).join(' ') || 'solana transaction timestamp')
	const viewDomId = $derived('solana-transaction-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaTransactionTimestamp}>
			{#snippet Pending()}
				{@const slot0 = selection.entitySelector.slot ?? prefetched.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const slot0 = resolvedEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTransactionTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.slot ?? prefetched.slot) ?? '')].filter(Boolean).join(' ') || title || 'solana transaction timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.slot) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTransactionTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction, {})}
						href={
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.signature !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/tx/[signature]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
								signature: String(selection.entitySelector.$transaction.signature ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
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
						sources: [
							Source.Solana_JsonRpc,
							Source.Helius_Rest,
						],
						fields: {
							feeLamports: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeLamports = prefetched.feeLamports}
					{#if feeLamports !== undefined && feeLamports !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								{String((feeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeLamports = resolvedEntity.feeLamports}
					{#if feeLamports !== undefined && feeLamports !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								{String((feeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
							Source.Helius_Rest,
						],
						fields: {
							computeUnitsConsumed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const computeUnitsConsumed = prefetched.computeUnitsConsumed}
					{#if computeUnitsConsumed !== undefined && computeUnitsConsumed !== null}
						<div>
							<dt>Compute units consumed</dt>
							<dd>
								{String((computeUnitsConsumed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const computeUnitsConsumed = resolvedEntity.computeUnitsConsumed}
					{#if computeUnitsConsumed !== undefined && computeUnitsConsumed !== null}
						<div>
							<dt>Compute units consumed</dt>
							<dd>
								{String((computeUnitsConsumed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Solana_JsonRpc,
							Source.Helius_Rest,
						],
						fields: {
							confirmationStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const confirmationStatus = prefetched.confirmationStatus}
					{#if confirmationStatus !== undefined && confirmationStatus !== null}
						<div>
							<dt>Confirmation status</dt>
							<dd>
								{String((confirmationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confirmationStatus = resolvedEntity.confirmationStatus}
					{#if confirmationStatus !== undefined && confirmationStatus !== null}
						<div>
							<dt>Confirmation status</dt>
							<dd>
								{String((confirmationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
