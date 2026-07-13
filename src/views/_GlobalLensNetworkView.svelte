<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalLensNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalLensNetwork>>
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
	const globalLensNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Lens_Graphql,
		],
	}))
	const titleFallback = $derived('global lens network')
	const viewDomId = $derived('-global-lens-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
	import LensFeedsView from '$/views/LensFeedsView.svelte'
	import LensUsernameNamespacesView from '$/views/LensUsernameNamespacesView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import GlobalLensNetwork_TimestampsView from '$/views/_GlobalLensNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalLensNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalLensNetwork}>
			{#snippet Pending()}
				{title || 'global lens network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalLensNetwork}>
			{#snippet Pending()}
				{[String((pendingEntity.scope) ?? '')].filter(Boolean).join(' ') || title || 'global lens network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.scope) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-lens-directory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lens-accounts',
							label: 'Accounts',
						},
						{
							id: 'lens-feeds',
							label: 'Feeds',
						},
						{
							id: 'lens-username-namespaces',
							label: 'Username namespaces',
						},
					]
				}
				data-card
				class='network-view-collapsible-directory'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Directory</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLensAccounts({ id, label, open })}
					<LensAccountsView
						selection={
							selection.$$observedAccounts({
								count: true,
							})
						}
						href={resolve('/lens/observations/accounts')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Lens accounts in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionLensFeeds({ id, label, open })}
					<LensFeedsView
						selection={
							selection.$$observedFeeds({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Lens feeds in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionLensUsernameNamespaces({ id, label, open })}
					<LensUsernameNamespacesView
						selection={
							selection.$$observedUsernameNamespaces({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Lens username namespaces in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-lens-posts'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lens-post-list',
							label: 'Posts',
						},
					]
				}
				data-card
				class='network-view-collapsible-posts'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Posts</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLensPostList({ id, label, open })}
					<LensPostsView
						selection={
							selection.$$observedPosts({
								count: true,
							})
						}
						href={resolve('/lens/observations/posts')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Lens posts in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-lens-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lens-hub-observations',
							label: 'Observations',
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

				{#snippet SectionLensHubObservations({ id, label, open })}
					<GlobalLensNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Lens observed observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
