<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LitecoinMwebBlock>>
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
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
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
		<ResourceBoundary resource={litecoinMwebBlock}>
			{#snippet Pending()}
				<UtxoBlockView
					selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
					href={
						(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
							height: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<UtxoBlockView
					selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
					href={
						(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
							height: String(selection.entitySelector.$block.height ?? ''),
							hash: String(selection.entitySelector.$block.hash ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={litecoinMwebBlock}>
			{#snippet Pending()}
				{[String((prefetched.hogExTransactionId) ?? '')].filter(Boolean).join(' ') || title || 'litecoin MWEB block'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.hogExTransactionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={litecoinMwebBlock}>
			{#snippet Pending()}
				{@const kernelRoot0 = prefetched.kernelRoot}
				{#if kernelRoot0 !== undefined && kernelRoot0 !== null}
					<span data-text="muted">
						{String((kernelRoot0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block, {})}
						href={
							(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
								height: String(selection.entitySelector.$block.height ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
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
						fields: {
							hogExTransactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hogExTransactionId = prefetched.hogExTransactionId}
					{#if hogExTransactionId !== undefined && hogExTransactionId !== null}
						<div>
							<dt>hog ex transaction ID</dt>
							<dd>
								{String((hogExTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							kernelRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const kernelRoot = prefetched.kernelRoot}
					{#if kernelRoot !== undefined && kernelRoot !== null}
						<div>
							<dt>kernel root</dt>
							<dd>
								{String((kernelRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				selection={selection[EntityProxyField]<EntityType.LitecoinMwebTransaction>('$$transactions')}
				title='transactions'
				emptyText='No Litecoin MWEB transactions.'
				id='LitecoinMwebTransactionsView-$$transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
