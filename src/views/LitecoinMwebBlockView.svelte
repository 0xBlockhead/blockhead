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
			selection: RegisteredEntityProxyResource<EntityType.LitecoinMwebBlock>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.LitecoinMwebBlock>>
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
	const litecoinMwebBlock = $derived(selection({
		sources: selection.sources,
		fields: {
			hogExTransactionId: true,
			kernelRoot: true,
		},
	}))
	const titleFallback = $derived('litecoin MWEB block')
	const viewDomId = $derived('litecoin-mweb-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionsView from '$/views/LitecoinMwebTransactionsView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebBlock}
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
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
						href={
						(selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
							blockNumber: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
						}) : selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
							blockNumber: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
							network: String(selection.entitySelector.$block.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={litecoinMwebBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
						href={
						(selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
							blockNumber: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
						}) : selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
							blockNumber: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
							network: String(selection.entitySelector.$block.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.hogExTransactionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={litecoinMwebBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.hogExTransactionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const kernelRoot0 = pendingEntity.kernelRoot}
			{#if kernelRoot0 !== undefined && kernelRoot0 !== null}
				<span data-text="muted">
					{String((kernelRoot0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={litecoinMwebBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const kernelRoot0 = resolvedEntity.kernelRoot}
					{#if kernelRoot0 !== undefined && kernelRoot0 !== null}
						<span data-text="muted">
							{String((kernelRoot0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block, {})}
						href={
							(selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(selection.entitySelector.$block.height ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
							}) : selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(selection.entitySelector.$block.height ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							hogExTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hogExTransactionId = resolvedEntity.hogExTransactionId}
					{#if hogExTransactionId !== undefined && hogExTransactionId !== null}
						<div>
							<dt>hog ex transaction ID</dt>
							<dd>
								{String((hogExTransactionId) ?? '')}
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
							kernelRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const kernelRoot = resolvedEntity.kernelRoot}
					{#if kernelRoot !== undefined && kernelRoot !== null}
						<div>
							<dt>kernel root</dt>
							<dd>
								{String((kernelRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<LitecoinMwebTransactionsView
				selection={
						selection.$$transactions({
							count: true,
						})
					}
				title='transactions'
				emptyText='No Litecoin MWEB transactions.'
				id='LitecoinMwebTransactionsView-transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
