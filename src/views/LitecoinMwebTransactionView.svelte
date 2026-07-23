<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.LitecoinMwebTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LitecoinMwebTransaction>
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
	const litecoinMwebTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			kernelOffset: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			kernelOffset: true,
		},
	}))
	const titleFallback = 'litecoin MWEB transaction'
	const viewDomId = $derived('litecoin-mweb-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebBlockView from '$/views/LitecoinMwebBlockView.svelte'
	import LitecoinMwebOutputsView from '$/views/LitecoinMwebOutputsView.svelte'
	import LitecoinMwebPegInsView from '$/views/LitecoinMwebPegInsView.svelte'
	import LitecoinMwebPegOutsView from '$/views/LitecoinMwebPegOutsView.svelte'
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$mwebBlock') && prefetched.$mwebBlock != null && Object.hasOwn(prefetched.$mwebBlock, '$block') && prefetched.$mwebBlock.$block != null && Object.hasOwn(prefetched.$mwebBlock.$block, 'hash') && Object.hasOwn(prefetched.$mwebBlock.$block, 'transactionCount') && Object.hasOwn(prefetched.$mwebBlock, 'hogExTransactionId') && Object.hasOwn(prefetched.$mwebBlock, 'kernelRoot') && Object.hasOwn(prefetched, 'kernelOffset')}
			{@const litecoinMwebBlock0 = pendingEntity.$mwebBlock}
			{#if litecoinMwebBlock0 != null && selection.entitySelector.$mwebBlock != null}
				<LitecoinMwebBlockView
					selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock, { sources: selection.sources })}
					prefetched={litecoinMwebBlock0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={litecoinMwebTransaction}>
				{#snippet children(entity)}
					<LitecoinMwebBlockView
						selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$mwebBlock') && prefetched.$mwebBlock != null && Object.hasOwn(prefetched.$mwebBlock, '$block') && prefetched.$mwebBlock.$block != null && Object.hasOwn(prefetched.$mwebBlock.$block, 'hash') && Object.hasOwn(prefetched.$mwebBlock.$block, 'transactionCount') && Object.hasOwn(prefetched.$mwebBlock, 'hogExTransactionId') && Object.hasOwn(prefetched.$mwebBlock, 'kernelRoot') && Object.hasOwn(prefetched, 'kernelOffset')}
			{@const transactionIndex0 = pendingEntity.transactionIndex}
			{#if transactionIndex0 !== undefined && transactionIndex0 !== null}
				<NumberValue
					value={transactionIndex0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={litecoinMwebTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionIndex0 = resolvedEntity.transactionIndex}
					{#if transactionIndex0 !== undefined && transactionIndex0 !== null}
						<NumberValue
							value={transactionIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$mwebBlock') && prefetched.$mwebBlock != null && Object.hasOwn(prefetched.$mwebBlock, '$block') && prefetched.$mwebBlock.$block != null && Object.hasOwn(prefetched.$mwebBlock.$block, 'hash') && Object.hasOwn(prefetched.$mwebBlock.$block, 'transactionCount') && Object.hasOwn(prefetched.$mwebBlock, 'hogExTransactionId') && Object.hasOwn(prefetched.$mwebBlock, 'kernelRoot') && Object.hasOwn(prefetched, 'kernelOffset')}
			{@const kernelOffset0 = pendingEntity.kernelOffset}
			{#if kernelOffset0 !== undefined && kernelOffset0 !== null}
				<span data-text="muted">
					{String((kernelOffset0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={litecoinMwebTransaction}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>MWEB block</dt>
				<dd>
					<LitecoinMwebBlockView
						selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
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
								sources: selection.sources,
								fields: {
									transactionIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionIndex = resolvedEntity.transactionIndex}
							{#if transactionIndex !== undefined && transactionIndex !== null}
								<NumberValue
									value={transactionIndex}
								/>
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
							kernelOffset: true,
						},
					})
				}
			>
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
		<CollapsibleTabs
			id={viewDomId + '-carousel-litecoin-mweb-transaction-activity-a'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'litecoin-mweb-transaction-outputs',
						label: 'Outputs',
						ownsSection: true,
					},
					{
						id: 'litecoin-mweb-transaction-peg-ins',
						label: 'Peg Ins',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-activity-a'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerLitecoinMwebTransactionOutputs(_context, Content)}
				{@const litecoinMwebTransactionActivityALitecoinMwebTransactionOutputsResource = selection.$$outputs}
				<ResourceBoundary
					resource={litecoinMwebTransactionActivityALitecoinMwebTransactionOutputsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLitecoinMwebTransactionOutputs({ id, label, open, active })}
				{@const litecoinMwebTransactionActivityALitecoinMwebTransactionOutputsResource = selection.$$outputs}
				<ResourceBoundary
					resource={litecoinMwebTransactionActivityALitecoinMwebTransactionOutputsResource}
				>
					{#snippet children(litecoinMwebOutput)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<LitecoinMwebOutputsView
								selection={litecoinMwebTransactionActivityALitecoinMwebTransactionOutputsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No outputs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerLitecoinMwebTransactionPegIns(_context, Content)}
				{@const litecoinMwebTransactionActivityALitecoinMwebTransactionPegInsResource = selection.$$pegIns}
				<ResourceBoundary
					resource={litecoinMwebTransactionActivityALitecoinMwebTransactionPegInsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLitecoinMwebTransactionPegIns({ id, label, open, active })}
				{@const litecoinMwebTransactionActivityALitecoinMwebTransactionPegInsResource = selection.$$pegIns}
				<ResourceBoundary
					resource={litecoinMwebTransactionActivityALitecoinMwebTransactionPegInsResource}
				>
					{#snippet children(litecoinMwebPegIn)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<LitecoinMwebPegInsView
								selection={litecoinMwebTransactionActivityALitecoinMwebTransactionPegInsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No peg ins.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-litecoin-mweb-transaction-activity-b'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'litecoin-mweb-transaction-peg-outs',
						label: 'Peg Outs',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-activity-b'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity continued</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerLitecoinMwebTransactionPegOuts(_context, Content)}
				{@const litecoinMwebTransactionActivityBLitecoinMwebTransactionPegOutsResource = selection.$$pegOuts}
				<ResourceBoundary
					resource={litecoinMwebTransactionActivityBLitecoinMwebTransactionPegOutsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionLitecoinMwebTransactionPegOuts({ id, label, open, active })}
				{@const litecoinMwebTransactionActivityBLitecoinMwebTransactionPegOutsResource = selection.$$pegOuts}
				<ResourceBoundary
					resource={litecoinMwebTransactionActivityBLitecoinMwebTransactionPegOutsResource}
				>
					{#snippet children(litecoinMwebPegOut)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<LitecoinMwebPegOutsView
								selection={litecoinMwebTransactionActivityBLitecoinMwebTransactionPegOutsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No peg outs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
