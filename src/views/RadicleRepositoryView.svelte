<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.RadicleRepository>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.RadicleRepository>>
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
	const radicleRepository = $derived(selection({}))
	const titleFallback = $derived('radicle repository')
	const viewDomId = $derived('radicle-repository-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={radicleRepository}>
			{#snippet Pending()}
				{title || 'radicle repository'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>rid</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rid = pendingEntity.rid}
							{#if rid !== undefined && rid !== null}
								{String((rid) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rid = resolvedEntity.rid}
							{#if rid !== undefined && rid !== null}
								{String((rid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Git repository</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$gitRepository}
					>
						{#snippet children(gitRepository)}
							{#if gitRepository != null && gitRepository[EntityMetaKey.Selector] != null}
								<GitRepositoryView
									selection={select(EntityType.GitRepository, gitRepository[EntityMetaKey.Selector])}
									prefetched={gitRepository}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
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
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
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
				{#snippet Pending()}
					{@const description = pendingEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
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
						{#snippet Pending()}
							{@const visibility = pendingEntity.visibility}
							{#if visibility !== undefined && visibility !== null}
								{String((visibility) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const visibility = resolvedEntity.visibility}
							{#if visibility !== undefined && visibility !== null}
								{String((visibility) ?? '')}
							{/if}
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
				{#snippet Pending()}
					{@const defaultBranch = pendingEntity.defaultBranch}
					{#if defaultBranch !== undefined && defaultBranch !== null}
						<div>
							<dt>default branch</dt>
							<dd>
								{String((defaultBranch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const defaultBranch = resolvedEntity.defaultBranch}
					{#if defaultBranch !== undefined && defaultBranch !== null}
						<div>
							<dt>default branch</dt>
							<dd>
								{String((defaultBranch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRadicleRepositoryDelegates({ id, label, open })}
					<RadicleDelegatesView
						selection={
							selection.$$delegates({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No delegates.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRadicleRepositorySignedRefs({ id, label, open })}
					<RadicleSignedRefsView
						selection={
							selection.$$signedRefs({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No signed refs.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Related</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRadicleRepositoryIssues({ id, label, open })}
					<RadicleIssuesView
						selection={
							selection.$$issues({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No issues.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionRadicleRepositoryPatches({ id, label, open })}
					<RadiclePatchesView
						selection={
							selection.$$patches({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No patches.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRadicleRepositorySeedObservations({ id, label, open })}
					<BlockheadRadicleSeedObservation_TimestampsView
						selection={
							selection.$$seedObservations({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No seed observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
