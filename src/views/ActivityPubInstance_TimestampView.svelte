<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived([(pendingEntity.title ?? ''), String(pendingEntity.timestampMs ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance observation')


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
		href ?? resolve(
			'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				instanceOrigin: encodeURIComponent(String(selection.entitySelector.$instance.instanceOrigin)),
				timestampMs: String(selection.entitySelector.timestampMs),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubInstanceTimestamp}>
			{#snippet children(entity)}
				{[(entity.title ?? ''), String(pendingEntity.timestampMs)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubInstanceTimestamp}>
			{#snippet children(entity)}
				<ActivityPubInstanceView
					selection={select(EntityType.ActivityPubInstance, selection.entitySelector.$instance)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
				{pendingEntity.source}
				{@const version2 = entity.version}
				{#if version2 != null}
					{version2}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instance</dt>
				<dd>
					<ActivityPubInstanceView
						selection={select(EntityType.ActivityPubInstance, selection.entitySelector.$instance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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

	{#snippet Details({ open: detailsOpen })}
		{@const activityPubInstanceTimestampActivityPubInstancePeersViewPeersResource = selection.$$peers}
		<ResourceBoundary
			resource={activityPubInstanceTimestampActivityPubInstancePeersViewPeersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubInstancePeersView
						selection={activityPubInstanceTimestampActivityPubInstancePeersViewPeersResource}
						countResource={activityPubInstanceTimestampActivityPubInstancePeersViewPeersResource.count}
						title='Peers'
						id='peers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const activityPubInstanceTimestampActivityPubInstanceModeratedDomainsViewModeratedDomainsResource = selection.$$moderatedDomains}
		<ResourceBoundary
			resource={activityPubInstanceTimestampActivityPubInstanceModeratedDomainsViewModeratedDomainsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubInstanceModeratedDomainsView
						selection={activityPubInstanceTimestampActivityPubInstanceModeratedDomainsViewModeratedDomainsResource}
						countResource={activityPubInstanceTimestampActivityPubInstanceModeratedDomainsViewModeratedDomainsResource.count}
						title='Moderated domains'
						id='moderated-domains'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
