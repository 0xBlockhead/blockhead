<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyResource<EntityType.ActivityPubInstanceModeratedDomain>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ActivityPubInstanceModeratedDomain>>
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
	const activityPubInstanceModeratedDomain = $derived(selection({
		sources: selection.sources,
		fields: {
			severity: true,
			comment: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.domain) ?? ''), String((pendingEntity.severity) ?? ''), String((pendingEntity.comment) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance moderated domain')
	const viewDomId = $derived('activity-pub-instance-moderated-domain-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstanceModeratedDomain}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.domain) ?? ''), String((pendingEntity.severity) ?? ''), String((pendingEntity.comment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={activityPubInstanceModeratedDomain}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.domain) ?? ''), String((resolvedEntity.severity) ?? ''), String((resolvedEntity.comment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
						href={
						(selection.entitySelector.$observation.timestampMs !== undefined && selection.entitySelector.$observation.source !== undefined && selection.entitySelector.$observation.$instance !== undefined && selection.entitySelector.$observation.$instance.instanceOrigin !== undefined ? resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(selection.entitySelector.$observation.timestampMs ?? ''),
							source: String(selection.entitySelector.$observation.source ?? ''),
							instanceOrigin: encodeURIComponent(String(selection.entitySelector.$observation.$instance.instanceOrigin ?? '')),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={activityPubInstanceModeratedDomain}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
						href={
						(selection.entitySelector.$observation.timestampMs !== undefined && selection.entitySelector.$observation.source !== undefined && selection.entitySelector.$observation.$instance !== undefined && selection.entitySelector.$observation.$instance.instanceOrigin !== undefined ? resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(selection.entitySelector.$observation.timestampMs ?? ''),
							source: String(selection.entitySelector.$observation.source ?? ''),
							instanceOrigin: encodeURIComponent(String(selection.entitySelector.$observation.$instance.instanceOrigin ?? '')),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A domain that a declared ActivityPub instance reports in its public moderation-domain list.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Observation</dt>
				<dd>
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation, {})}
						href={
							(selection.entitySelector.$observation.timestampMs !== undefined && selection.entitySelector.$observation.source !== undefined && selection.entitySelector.$observation.$instance !== undefined && selection.entitySelector.$observation.$instance.instanceOrigin !== undefined ? resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(selection.entitySelector.$observation.timestampMs ?? ''),
								source: String(selection.entitySelector.$observation.source ?? ''),
								instanceOrigin: encodeURIComponent(String(selection.entitySelector.$observation.$instance.instanceOrigin ?? '')),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Domain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									domain: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const domain = resolvedEntity.domain}
							{#if domain !== undefined && domain !== null}
								{String((domain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							severity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const severity = resolvedEntity.severity}
					{#if severity !== undefined && severity !== null}
						<div>
							<dt>Severity</dt>
							<dd>
								{String((severity) ?? '')}
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
							comment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const comment = resolvedEntity.comment}
					{#if comment !== undefined && comment !== null}
						<div>
							<dt>Comment</dt>
							<dd>
								{String((comment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
