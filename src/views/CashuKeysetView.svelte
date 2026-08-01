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
	}: EntitySelectionViewProps<EntityType.CashuKeyset> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.CashuMint_Rest,
		],
	}))
	const cashuKeyset = $derived(viewSelection({
		fields: {
			unit: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.keysetId || 'Cashu keyset')
	const viewDomId = $derived('cashu-keyset-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import CashuKeyset_TimestampsView from '$/views/CashuKeyset_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuKeyset}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.keysetId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cashuKeyset}>
			{#snippet children(entity)}
				{(entity.unit ?? '') || selection.entitySelector.keysetId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<CashuMintView
				selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>keyset ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.keysetId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={cashuKeyset}
			>
				{#snippet children(entity)}
					{@const unit = entity.unit}
					{#if unit != null}
						<div>
							<dt>unit</dt>
							<dd>
								{unit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							keysByAmountJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keysByAmountJson = entity.keysByAmountJson}
					{#if keysByAmountJson != null}
						<div>
							<dt>keys by amount JSON</dt>
							<dd>
								{keysByAmountJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-cashu-keyset-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cashu-keyset-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCashuKeysetTimestamps({ id, label, open })}
				<CashuKeyset_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No keyset observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
