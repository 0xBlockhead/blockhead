<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ActivityPubNetwork> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const activityPubNetwork = $derived(viewSelection({
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.protocolName ?? '') || 'ActivityPub')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.protocolName ?? '') || titleFallback}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ActivityPub is the W3C federation protocol. This hub shows bounded Mastodon-compatible actor and note windows from declared instance sources.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={activityPubNetwork}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={activityPubNetwork}
					>
						{#snippet children(entity)}
							<a
								href={String(entity.homeUrl)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(entity.homeUrl)} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubNetwork}
			>
				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl}
					{#if docsUrl != null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<a
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const activityPubNetworkActivityPubActorsViewActivityPubActorsResource = selection.$$activityPubActors}
		<ResourceBoundary
			resource={activityPubNetworkActivityPubActorsViewActivityPubActorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubActorsView
						selection={activityPubNetworkActivityPubActorsViewActivityPubActorsResource}
						countResource={activityPubNetworkActivityPubActorsViewActivityPubActorsResource.count}
						title='Actors'
						id='activity-pub-actors'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const activityPubNetworkActivityPubNotesViewActivityPubNotesResource = selection.$$activityPubNotes}
		<ResourceBoundary
			resource={activityPubNetworkActivityPubNotesViewActivityPubNotesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubNotesView
						selection={activityPubNetworkActivityPubNotesViewActivityPubNotesResource}
						countResource={activityPubNetworkActivityPubNotesViewActivityPubNotesResource.count}
						title='Notes'
						id='activity-pub-notes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
