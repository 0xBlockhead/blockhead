<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.RadicleRepository>, 'prefetched'> = $props()

	const viewDomId = $derived('radicle-repository-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
	import RadicleDelegatesView from '$/views/RadicleDelegatesView.svelte'
	import RadicleSignedRefsView from '$/views/RadicleSignedRefsView.svelte'
	import RadicleIssuesView from '$/views/RadicleIssuesView.svelte'
	import RadiclePatchesView from '$/views/RadiclePatchesView.svelte'
	import BlockheadRadicleSeedObservation_TimestampsView from '$/views/BlockheadRadicleSeedObservation_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleRepository}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	href={
		href === undefined ?
			resolve(
				'/radicle/repository/[rid=stringSegment]',
				{
					rid: selection.entitySelector.rid,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>rid</dt>
				<dd>
					{selection.entitySelector.rid}
				</dd>
			</div>

			<div>
				<dt>Git repository</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$gitRepository}
					>
						{#snippet children(gitRepository)}
							<GitRepositoryView
								selection={select(EntityType.GitRepository, gitRepository[EntityMetaKey.Selector])}
								prefetched={gitRepository}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>visibility</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									visibility: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.visibility}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							defaultBranch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const defaultBranch = entity.defaultBranch}
					{#if defaultBranch != null}
						<div>
							<dt>default branch</dt>
							<dd>
								{defaultBranch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-radicle-repository-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'radicle-repository-delegates',
						label: 'Delegates',
					},
					{
						id: 'radicle-repository-signed-refs',
						label: 'Signed Refs',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRadicleRepositoryDelegates({ id, label })}
				<RadicleDelegatesView
					selection={selection.$$delegates}
					collapsible={false}
					title={label}
					emptyText='No delegates.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionRadicleRepositorySignedRefs({ id, label })}
				<RadicleSignedRefsView
					selection={selection.$$signedRefs}
					collapsible={false}
					title={label}
					emptyText='No signed refs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-radicle-repository-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'radicle-repository-issues',
						label: 'Issues',
					},
					{
						id: 'radicle-repository-patches',
						label: 'Patches',
					},
				]
			}
			data-card
			class='network-view-collapsible-related'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRadicleRepositoryIssues({ id, label })}
				<RadicleIssuesView
					selection={selection.$$issues}
					collapsible={false}
					title={label}
					emptyText='No issues.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionRadicleRepositoryPatches({ id, label })}
				<RadiclePatchesView
					selection={selection.$$patches}
					collapsible={false}
					title={label}
					emptyText='No patches.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-radicle-repository-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'radicle-repository-seed-observations',
						label: 'Seed Observations',
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

			{#snippet SectionRadicleRepositorySeedObservations({ id, label })}
				<BlockheadRadicleSeedObservation_TimestampsView
					selection={selection.$$seedObservations}
					collapsible={false}
					title={label}
					emptyText='No seed observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
