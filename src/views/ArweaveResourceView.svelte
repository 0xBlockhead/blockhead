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
			selection: RegisteredEntityProxyResource<EntityType.ArweaveResource>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ArweaveResource>>
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
	const arweaveResource = $derived(selection({
		sources: selection.sources,
		fields: {
			canonicalUri: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.transactionId) ?? '')].filter(Boolean).join(' ') || 'arweave resource')
	const viewDomId = $derived('arweave-resource-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveResource_TimestampsView from '$/views/ArweaveResource_TimestampsView.svelte'
	import ArweaveTransactionView from '$/views/ArweaveTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveResource}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={arweaveResource}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.contentPath) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={arweaveResource}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.contentPath) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.canonicalUri) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionId = resolvedEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								<TruncatedValue value={String((transactionId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>content path</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									contentPath: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const contentPath = resolvedEntity.contentPath}
							{#if contentPath !== undefined && contentPath !== null}
								{String((contentPath) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>canonical URI</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									canonicalUri: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const canonicalUri = resolvedEntity.canonicalUri}
							{#if canonicalUri !== undefined && canonicalUri !== null}
								<svelte:element
									this={'a'}
									href={String(canonicalUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(canonicalUri)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(arweaveTransaction)}
					{#if arweaveTransaction != null && arweaveTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<ArweaveTransactionView
									selection={select(EntityType.ArweaveTransaction, arweaveTransaction[EntityMetaKey.Selector])}
									prefetched={arweaveTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ArweaveResource_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='ArweaveResource_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
