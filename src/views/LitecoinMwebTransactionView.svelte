<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LitecoinMwebTransaction>>
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
	const litecoinMwebTransaction = $derived(selection({
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
		fields: {
			kernelOffset: true,
		},
	}))
	const titleFallback = $derived('litecoin MWEB transaction')
	const viewDomId = $derived('litecoin-mweb-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebOutputsView from '$/views/LitecoinMwebOutputsView.svelte'
	import LitecoinMwebPegInsView from '$/views/LitecoinMwebPegInsView.svelte'
	import LitecoinMwebPegOutsView from '$/views/LitecoinMwebPegOutsView.svelte'
	import LitecoinMwebBlockView from '$/views/LitecoinMwebBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={litecoinMwebTransaction}>
			{#snippet Pending()}
				<LitecoinMwebBlockView
					selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<LitecoinMwebBlockView
					selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={litecoinMwebTransaction}>
			{#snippet Pending()}
				{@const transactionIndex0 = selection.entitySelector.transactionIndex ?? prefetched.transactionIndex}
				{#if transactionIndex0 !== undefined && transactionIndex0 !== null}
					<NumberValue value={Number(transactionIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const transactionIndex0 = resolvedEntity.transactionIndex}
				{#if transactionIndex0 !== undefined && transactionIndex0 !== null}
					<NumberValue value={Number(transactionIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={litecoinMwebTransaction}>
			{#snippet Pending()}
				{@const kernelOffset0 = prefetched.kernelOffset}
				{#if kernelOffset0 !== undefined && kernelOffset0 !== null}
					<span data-text="muted">
						{String((kernelOffset0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const kernelOffset0 = resolvedEntity.kernelOffset}
				{#if kernelOffset0 !== undefined && kernelOffset0 !== null}
					<span data-text="muted">
						{String((kernelOffset0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>MWEB block</dt>
				<dd>
					<LitecoinMwebBlockView
						selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionIndex = selection.entitySelector.transactionIndex ?? prefetched.transactionIndex}
							{#if transactionIndex !== undefined && transactionIndex !== null}
								<NumberValue value={Number(transactionIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionIndex = resolvedEntity.transactionIndex}
							{#if transactionIndex !== undefined && transactionIndex !== null}
								<NumberValue value={Number(transactionIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							kernelOffset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const kernelOffset = prefetched.kernelOffset}
					{#if kernelOffset !== undefined && kernelOffset !== null}
						<div>
							<dt>kernel offset</dt>
							<dd>
								{String((kernelOffset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const kernelOffset = resolvedEntity.kernelOffset}
					{#if kernelOffset !== undefined && kernelOffset !== null}
						<div>
							<dt>kernel offset</dt>
							<dd>
								{String((kernelOffset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<LitecoinMwebOutputsView
				selection={selection.$$outputs}
				title='outputs'
				emptyText='No Litecoin MWEB outputs.'
				id='LitecoinMwebOutputsView-outputs'
			/>

			<LitecoinMwebPegInsView
				selection={selection.$$pegIns}
				title='peg ins'
				emptyText='No Litecoin MWEB peg ins.'
				id='LitecoinMwebPegInsView-peg-ins'
			/>

			<LitecoinMwebPegOutsView
				selection={selection.$$pegOuts}
				title='peg outs'
				emptyText='No Litecoin MWEB peg outs.'
				id='LitecoinMwebPegOutsView-peg-outs'
			/>
		{/if}
	{/snippet}
</EntityView>
