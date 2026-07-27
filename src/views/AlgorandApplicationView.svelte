<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
	}: EntitySelectionViewProps<EntityType.AlgorandApplication> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const algorandApplication = $derived(selection({
		fields: {
			creator: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.applicationId ?? '') || 'algorand application')
	const viewDomId = $derived('algorand-application-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
	import AlgorandBoxesView from '$/views/AlgorandBoxesView.svelte'
	import AlgorandApplicationLocalState_RoundsView from '$/views/AlgorandApplicationLocalState_RoundsView.svelte'
	import AlgorandApplication_TimestampsView from '$/views/AlgorandApplication_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandApplication}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.applicationId ?? '') || 'algorand application'}
	{/snippet}

	{#snippet Value()}
		<AlgorandNetworkView
			selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandApplication}>
			{#snippet children(entity)}
				{@const creator0 = entity.creator}
				{#if creator0 != null}
					<span data-text="muted">
						{creator0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>application ID</dt>
				<dd>
					{String(pendingEntity.applicationId)}
				</dd>
			</div>

			<ResourceBoundary
				resource={algorandApplication}
			>
				{#snippet children(entity)}
					{@const creator = entity.creator}
					{#if creator != null}
						<div>
							<dt>creator</dt>
							<dd>
								{creator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-app-state'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-app-boxes',
						label: 'Boxes',
					},
					{
						id: 'algorand-app-local-state',
						label: 'Local state rounds',
					},
				]
			}
			data-card
			class='network-view-collapsible-state'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>State</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAlgorandAppBoxes({ id, label, open })}
				<AlgorandBoxesView
					selection={selection.$$boxes}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand boxes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandAppLocalState({ id, label, open })}
				<AlgorandApplicationLocalState_RoundsView
					selection={selection.$$localStateRounds}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand application local state rounds.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-algorand-app-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'algorand-app-timestamps',
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

			{#snippet SectionAlgorandAppTimestamps({ id, label, open })}
				<AlgorandApplication_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No Algorand application observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
