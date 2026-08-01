<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.ActivityPubInstance_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
	}))
	const activityPubInstanceTimestamp = $derived(viewSelection({
		fields: {
			title: true,
			version: true,
		},
	}))
	const titleFallback = $derived([(prefetched.title ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'ActivityPub instance observation')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubInstancePeersView from '$/views/ActivityPubInstancePeersView.svelte'
	import ActivityPubInstanceModeratedDomainsView from '$/views/ActivityPubInstanceModeratedDomainsView.svelte'
	import ActivityPubInstanceView from '$/views/ActivityPubInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstance_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					instanceOrigin: encodeURIComponent(selection.entitySelector.$instance.instanceOrigin),
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubInstanceTimestamp}>
			{#snippet children(entity)}
				{[(entity.title ?? ''), String(selection.entitySelector.timestampMs)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubInstanceTimestamp}>
			{#snippet children(entity)}
				<ActivityPubInstanceView
					selection={select(EntityType.ActivityPubInstance, selection.entitySelector.$instance)}
					href={null}
					layout={EntityLayout.Value}
				/>
				{selection.entitySelector.source}
				{@const version = entity.version}
				{#if version != null}
					{version}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Instance</dt>
				<dd>
					<ActivityPubInstanceView
						selection={select(EntityType.ActivityPubInstance, selection.entitySelector.$instance)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubInstanceTimestamp}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>Title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={activityPubInstanceTimestamp}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								{version}
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
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const peersResource = selection.$$peers}
		<ResourceBoundary
			resource={peersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubInstancePeersView
						selection={peersResource}
						countResource={peersResource.count}
						title='Peers'
						id='peers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const moderatedDomainsResource = selection.$$moderatedDomains}
		<ResourceBoundary
			resource={moderatedDomainsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubInstanceModeratedDomainsView
						selection={moderatedDomainsResource}
						countResource={moderatedDomainsResource.count}
						title='Moderated domains'
						id='moderated-domains'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
