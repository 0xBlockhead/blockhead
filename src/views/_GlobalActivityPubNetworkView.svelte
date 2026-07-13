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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalActivityPubNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalActivityPubNetwork>>
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
	const globalActivityPubNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Mastodon_Rest,
		],
	}))
	const titleFallback = $derived('global ActivityPub network')
	const viewDomId = $derived('-global-activity-pub-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import ActivityPubInstancesView from '$/views/ActivityPubInstancesView.svelte'
	import ActivityPubInstancePeersView from '$/views/ActivityPubInstancePeersView.svelte'
	import ActivityPubInstanceModeratedDomainsView from '$/views/ActivityPubInstanceModeratedDomainsView.svelte'
	import GlobalActivityPubNetwork_TimestampsView from '$/views/_GlobalActivityPubNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalActivityPubNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalActivityPubNetwork}>
			{#snippet Pending()}
				{title || 'global ActivityPub network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalActivityPubNetwork}>
			{#snippet Pending()}
				{[String((pendingEntity.scope) ?? '')].filter(Boolean).join(' ') || title || 'global ActivityPub network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.scope) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scope = pendingEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-activitypub-directory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'activitypub-actors',
							label: 'Actors',
						},
						{
							id: 'activitypub-notes',
							label: 'Notes',
						},
						{
							id: 'activitypub-instances',
							label: 'Instances',
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

				{#snippet SectionActivitypubActors({ id, label, open })}
					<ActivityPubActorsView
						selection={selection.$$observedActors}
						href={resolve('/activitypub/actors')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub actors in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionActivitypubNotes({ id, label, open })}
					<ActivityPubNotesView
						selection={selection.$$observedNotes}
						href={resolve('/activitypub/notes')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub notes in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionActivitypubInstances({ id, label, open })}
					<ActivityPubInstancesView
						selection={selection.$$instances}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub instances declared.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-activitypub-federation'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'activitypub-peers',
							label: 'Instance peers',
						},
						{
							id: 'activitypub-moderated-domains',
							label: 'Moderated domains',
						},
					]
				}
				data-card
				class='network-view-collapsible-federation'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Federation</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionActivitypubPeers({ id, label, open })}
					<ActivityPubInstancePeersView
						selection={selection.$$instancePeers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub instance peers in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionActivitypubModeratedDomains({ id, label, open })}
					<ActivityPubInstanceModeratedDomainsView
						selection={selection.$$instanceModeratedDomains}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub moderated domains in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-activitypub-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'activitypub-hub-observations',
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

				{#snippet SectionActivitypubHubObservations({ id, label, open })}
					<GlobalActivityPubNetwork_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub hub observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
