<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.XrplLedgerEntry>
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
	const xrplLedgerEntry = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'XRPL ledger entry'
	const viewDomId = $derived('xrpl-ledger-entry-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={xrplLedgerEntry}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ledger</dt>
				<dd>
					<XrplLedgerView
						selection={select(EntityType.XrplLedger, selection.entitySelector.$ledger)}
						href={
							(
								selection.entitySelector.$ledger != null && 'ledgerIndex' in selection.entitySelector.$ledger
								&& selection.entitySelector.$ledger.ledgerIndex != null
								&& selection.entitySelector.$ledger != null && '$network' in selection.entitySelector.$ledger ?
									selection.entitySelector.$ledger.$network != null && 'caip2' in selection.entitySelector.$ledger.$network
									&& selection.entitySelector.$ledger.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
									ledgerIndex: String(selection.entitySelector.$ledger.ledgerIndex ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$ledger.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$ledger.$network != null && 'slug' in selection.entitySelector.$ledger.$network
										&& selection.entitySelector.$ledger.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
										ledgerIndex: String(selection.entitySelector.$ledger.ledgerIndex ?? ''),
										network: String(selection.entitySelector.$ledger.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
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
								sources: selection.sources,
								fields: {
									entryHash: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									entryType: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							account: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							previousTransactionHash: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							previousTransactionLedgerIndex: true,
						},
					})
				}
			>
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
