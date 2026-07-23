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
			selection: RegisteredEntityProxyResource<EntityType.ActivityPubInstancePeer>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ActivityPubInstancePeer>
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
	const activityPubInstancePeer = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.peerDomain) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance peer')
	const viewDomId = $derived('activity-pub-instance-peer-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstancePeer}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$observation') && prefetched.$observation != null && Object.hasOwn(prefetched.$observation, 'title') && Object.hasOwn(prefetched.$observation, '$instance') && prefetched.$observation.$instance != null && Object.hasOwn(prefetched.$observation, 'version')}
			{[String((pendingEntity.peerDomain) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={activityPubInstancePeer}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.peerDomain) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$observation') && prefetched.$observation != null && Object.hasOwn(prefetched.$observation, 'title') && Object.hasOwn(prefetched.$observation, '$instance') && prefetched.$observation.$instance != null && Object.hasOwn(prefetched.$observation, 'version')}
			{@const activityPubInstanceTimestamp0 = pendingEntity.$observation}
			{#if activityPubInstanceTimestamp0 != null && selection.entitySelector.$observation != null}
				<ActivityPubInstance_TimestampView
					selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation, { sources: selection.sources })}
					prefetched={activityPubInstanceTimestamp0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={activityPubInstancePeer}>
				{#snippet children(entity)}
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A domain that a declared ActivityPub instance reports as a known connected domain.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Observation</dt>
				<dd>
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
						href={
							(
								selection.entitySelector.$observation != null && 'timestampMs' in selection.entitySelector.$observation
								&& selection.entitySelector.$observation.timestampMs != null
								&& selection.entitySelector.$observation != null && 'source' in selection.entitySelector.$observation
								&& selection.entitySelector.$observation.source != null
								&& selection.entitySelector.$observation != null && '$instance' in selection.entitySelector.$observation
								&& selection.entitySelector.$observation.$instance != null && 'instanceOrigin' in selection.entitySelector.$observation.$instance
								&& selection.entitySelector.$observation.$instance.instanceOrigin != null ?
									resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(selection.entitySelector.$observation.timestampMs ?? ''),
								source: String(selection.entitySelector.$observation.source ?? ''),
								instanceOrigin: encodeURIComponent(String(selection.entitySelector.$observation.$instance.instanceOrigin ?? '')),
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
				<dt>Peer domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									peerDomain: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const peerDomain = resolvedEntity.peerDomain}
							{#if peerDomain !== undefined && peerDomain !== null}
								{String((peerDomain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
