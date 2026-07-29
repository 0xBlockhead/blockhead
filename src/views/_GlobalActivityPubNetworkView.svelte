<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalActivityPubNetwork> = $props()

	const titleFallback = 'global ActivityPub network'
	const viewDomId = $derived('-global-activity-pub-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActivityPubInstancesView from '$/views/ActivityPubInstancesView.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import GlobalActivityPubNetwork_TimestampsView from '$/views/_GlobalActivityPubNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalActivityPubNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve('/(social)/(activitypub)/activitypub')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		global ActivityPub network
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.scope || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					{selection.entitySelector.scope}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-activitypub-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'activitypub-instances',
						label: 'Instances',
					},
				]
			}
			data-card
			class='network-view-collapsible-directory'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Directory</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivitypubInstances({ id, label, open })}
				<ActivityPubInstancesView
					selection={selection.$$instances}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No ActivityPub instances declared.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-activitypub-public-timeline'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'activitypub-actors',
						label: 'Accounts',
					},
					{
						id: 'activitypub-notes',
						label: 'Notes',
					},
				]
			}
			data-card
			class='network-view-collapsible-content'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Public timeline</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivitypubActors({ id, label, open })}
				<ActivityPubActorsView
					selection={selection.$$observedActors}
					href={resolve('/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actors')}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionActivitypubNotes({ id, label, open })}
				<ActivityPubNotesView
					selection={selection.$$observedNotes}
					href={resolve('/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/notes')}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivitypubHubObservations({ id, label, open })}
				<GlobalActivityPubNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No ActivityPub hub observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
