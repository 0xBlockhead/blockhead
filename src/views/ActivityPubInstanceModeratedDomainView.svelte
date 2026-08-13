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
	}: EntitySelectionViewProps<EntityType.ActivityPubInstanceModeratedDomain> = $props()

	const observation = $derived(selection.entitySelector.$observation)
	const activityPubInstanceModeratedDomain = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
		fields: {
			domain: true,
			severity: true,
			comment: true,
		},
	}))
	const titleFallback = $derived([(prefetched.domain ?? ''), (prefetched.severity ?? ''), (prefetched.comment ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance moderated domain')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstanceModeratedDomain}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/moderated-domain/[digest=stringSegment]',
				{
					instanceOrigin: encodeURIComponent(observation.$instance.instanceOrigin),
					timestampMs: String(observation.timestampMs),
					source: observation.source,
					digest: selection.entitySelector.digest,
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
		<ResourceBoundary resource={activityPubInstanceModeratedDomain}>
			{#snippet children(entity)}
				{[entity.domain, entity.severity, (entity.comment ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ActivityPubInstance_TimestampView
			selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Observation</dt>
				<dd>
					<ActivityPubInstance_TimestampView
						selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Digest</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.digest} />
				</dd>
			</div>

			<div>
				<dt>Domain</dt>
				<dd>
					<ResourceBoundary
						resource={activityPubInstanceModeratedDomain}
					>
						{#snippet children(entity)}
							{entity.domain}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Severity</dt>
				<dd>
					<ResourceBoundary
						resource={activityPubInstanceModeratedDomain}
					>
						{#snippet children(entity)}
							{entity.severity}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubInstanceModeratedDomain}
			>
				{#snippet children(entity)}
					{@const comment = entity.comment}
					{#if comment != null}
						<div>
							<dt>Comment</dt>
							<dd>
								{comment}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
