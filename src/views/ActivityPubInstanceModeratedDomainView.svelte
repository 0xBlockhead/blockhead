<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ActivityPubInstanceModeratedDomain> = $props()

	const activityPubInstanceModeratedDomain = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
	})({
		fields: {
			severity: true,
			comment: true,
		},
	}))
	const titleFallback = $derived([selection.entitySelector.domain, (prefetched.severity ?? ''), (prefetched.comment ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance moderated domain')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubInstanceModeratedDomain}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubInstanceModeratedDomain}>
			{#snippet children(entity)}
				{[selection.entitySelector.domain, (entity.severity ?? ''), (entity.comment ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ActivityPubInstance_TimestampView
			selection={select(EntityType.ActivityPubInstance_Timestamp, selection.entitySelector.$observation)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
				<dt>Domain</dt>
				<dd>
					{selection.entitySelector.domain}
				</dd>
			</div>

			<ResourceBoundary
				resource={activityPubInstanceModeratedDomain}
			>
				{#snippet children(entity)}
					{@const severity = entity.severity}
					{#if severity != null}
						<div>
							<dt>Severity</dt>
							<dd>
								{severity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
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
