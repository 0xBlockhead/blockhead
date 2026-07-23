<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.ActivityPubInstance_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ActivityPubInstance_Timestamp>
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
	const activityPubInstanceTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			title: true,
			version: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			title: true,
			version: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance observation')
	const viewDomId = $derived('activity-pub-instance-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActivityPubInstancePeersView from '$/views/ActivityPubInstancePeersView.svelte'
	import ActivityPubInstanceModeratedDomainsView from '$/views/ActivityPubInstanceModeratedDomainsView.svelte'
	import ActivityPubInstanceView from '$/views/ActivityPubInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstance_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$instance' in selection.entitySelector
			&& selection.entitySelector.$instance != null && 'instanceOrigin' in selection.entitySelector.$instance
			&& selection.entitySelector.$instance.instanceOrigin != null ?
				resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			source: String(selection.entitySelector.source ?? ''),
			instanceOrigin: encodeURIComponent(String(selection.entitySelector.$instance.instanceOrigin ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'title') && Object.hasOwn(prefetched, '$instance') && prefetched.$instance != null && Object.hasOwn(prefetched, 'version')}
			{[String((pendingEntity.title) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={activityPubInstanceTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.title) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'title') && Object.hasOwn(prefetched, '$instance') && prefetched.$instance != null && Object.hasOwn(prefetched, 'version')}
			{@const activityPubInstance0 = pendingEntity.$instance}
			{#if activityPubInstance0 != null && selection.entitySelector.$instance != null}
				<ActivityPubInstanceView
					selection={select(EntityType.ActivityPubInstance, selection.entitySelector.$instance, { sources: selection.sources })}
					prefetched={activityPubInstance0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
			{@const source1 = pendingEntity.source}
			{#if source1 !== undefined && source1 !== null}
				{String((source1) ?? '')}
			{/if}
			{@const version2 = pendingEntity.version}
			{#if version2 !== undefined && version2 !== null}
				{String((version2) ?? '')}
			{/if}
		{:else}
			<ResourceBoundary resource={activityPubInstanceTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ActivityPubInstanceView
						selection={select(EntityType.ActivityPubInstance, selection.entitySelector.$instance)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
					{@const source1 = resolvedEntity.source}
					{#if source1 !== undefined && source1 !== null}
						{String((source1) ?? '')}
					{/if}
					{@const version2 = resolvedEntity.version}
					{#if version2 !== undefined && version2 !== null}
						{String((version2) ?? '')}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Instance</dt>
				<dd>
					<ActivityPubInstanceView
						selection={select(EntityType.ActivityPubInstance, selection.entitySelector.$instance)}
						href={
							(
								selection.entitySelector.$instance != null && 'instanceOrigin' in selection.entitySelector.$instance
								&& selection.entitySelector.$instance.instanceOrigin != null ?
									resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]', {
								instanceOrigin: encodeURIComponent(String(selection.entitySelector.$instance.instanceOrigin ?? '')),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							title: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const title = resolvedEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>Title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							description: true,
						},
					})
				}
			>
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
					id='ActivityPubInstancePeersView-peers'
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
					id='ActivityPubInstanceModeratedDomainsView-moderated-domains'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
