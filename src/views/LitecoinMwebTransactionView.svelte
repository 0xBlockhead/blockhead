<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.LitecoinMwebTransaction>, 'prefetched'> = $props()

	const litecoinMwebTransaction = $derived(selection({
		sources: selection.sources ?? [
			Source.LitecoinCore_JsonRpc,
		],
	})({
		fields: {
			kernelOffset: true,
		},
	}))
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
	title={title ?? 'litecoin MWEB transaction'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<LitecoinMwebBlockView
			selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.transactionIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={litecoinMwebTransaction}>
			{#snippet children(entity)}
				{@const kernelOffset = entity.kernelOffset}
				{#if kernelOffset != null}
					<span data-text="muted">
						{kernelOffset}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>MWEB block</dt>
				<dd>
					<LitecoinMwebBlockView
						selection={select(EntityType.LitecoinMwebBlock, selection.entitySelector.$mwebBlock)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.transactionIndex}
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

	{#snippet Details()}
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

			{#snippet SectionLitecoinMwebTransactionOutputs({ id, label })}
				<LitecoinMwebOutputsView
					selection={selection.$$outputs}
					collapsible={false}
					title={label}
					emptyText='No outputs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLitecoinMwebTransactionPegIns({ id, label })}
				<LitecoinMwebPegInsView
					selection={selection.$$pegIns}
					collapsible={false}
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

			{#snippet SectionLitecoinMwebTransactionPegOuts({ id, label })}
				<LitecoinMwebPegOutsView
					selection={selection.$$pegOuts}
					collapsible={false}
					title={label}
					emptyText='No peg outs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
