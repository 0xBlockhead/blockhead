<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AlgorandApplication> = $props()

	const algorandApplication = $derived(selection({
		fields: {
			creator: true,
		},
	}))
	const viewDomId = $derived('algorand-application-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
	import AlgorandBoxesView from '$/views/AlgorandBoxesView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandApplication}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? String(selection.entitySelector.applicationId)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<AlgorandNetworkView
			selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandApplication}>
			{#snippet children(entity)}
				{@const creator = entity.creator}
				{#if creator != null}
					<span data-text="muted">
						{creator}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>application ID</dt>
				<dd>
					{selection.entitySelector.applicationId}
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

	{#snippet Details()}
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
					collapsible={false}
					title={label}
					emptyText='No Algorand boxes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAlgorandAppLocalState({ id, label, open })}
				<EntitiesList
					entityType={EntityType.AlgorandApplicationLocalState_Round}
					collapsible={false}
					title={label}
					emptyText='No Algorand application local state rounds.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$localStateRounds()}
				>
					{#snippet Item({ item: algorandApplicationLocalStateRound })}
						<EntityView
							entityType={EntityType.AlgorandApplicationLocalState_Round}
							entitySelector={algorandApplicationLocalStateRound[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.AlgorandApplication_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Algorand application observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: algorandApplicationTimestamp })}
						<EntityView
							entityType={EntityType.AlgorandApplication_Timestamp}
							entitySelector={algorandApplicationTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
