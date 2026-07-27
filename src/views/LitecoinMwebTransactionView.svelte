<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LitecoinMwebTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LitecoinCore_JsonRpc,
		],
	}))
	const litecoinMwebTransaction = $derived(viewSelection({
		fields: {
			kernelOffset: true,
		},
	}))
	const titleFallback = 'litecoin MWEB transaction'
	const viewDomId = $derived('litecoin-mweb-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<LitecoinMwebBlockView
			selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={pendingEntity.transactionIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={litecoinMwebTransaction}>
			{#snippet children(entity)}
				{@const kernelOffset0 = entity.kernelOffset}
				{#if kernelOffset0 != null}
					<span data-text="muted">
						{kernelOffset0}
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
						selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.transactionIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={litecoinMwebTransaction}
			>
				{#snippet children(entity)}
					{@const kernelOffset = entity.kernelOffset}
					{#if kernelOffset != null}
						<div>
							<dt>kernel offset</dt>
							<dd>
								{kernelOffset}
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
					},
					{
						id: 'litecoin-mweb-transaction-peg-ins',
						label: 'Peg Ins',
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

			{#snippet SectionLitecoinMwebTransactionOutputs({ id, label, open })}
				<LitecoinMwebOutputsView
					selection={selection.$$outputs}
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
			{/snippet}

			{#snippet SectionLitecoinMwebTransactionPegIns({ id, label, open })}
				<LitecoinMwebPegInsView
					selection={selection.$$pegIns}
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

			{#snippet SectionLitecoinMwebTransactionPegOuts({ id, label, open })}
				<LitecoinMwebPegOutsView
					selection={selection.$$pegOuts}
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
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
