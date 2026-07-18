<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.XrplLedger>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.XrplLedger>>
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
	const xrplLedger = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('XRPL ledger')
	const viewDomId = $derived('xrpl-ledger-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplLedger}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.ledgerIndex !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
			ledgerIndex: String(pendingEntity.ledgerIndex ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.ledgerIndex !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
			ledgerIndex: String(pendingEntity.ledgerIndex ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={xrplLedger}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerIndex = resolvedEntity.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>ledger hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerHash = resolvedEntity.ledgerHash}
							{#if ledgerHash !== undefined && ledgerHash !== null}
								<TruncatedValue value={String((ledgerHash) ?? '')} />
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
							closeTimeMs: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							validated: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							totalCoinsDrops: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							parentHash: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							accountHash: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							transactionHash: true,
						},
					})
				}
			>
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
