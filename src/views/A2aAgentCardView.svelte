<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.A2aAgentCard> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived(String(pendingEntity.agentCardUrl ?? '') || 'A2A agent card')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aAgentCard_SnapshotsView from '$/views/A2aAgentCard_SnapshotsView.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aAgentCard}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.agentCardUrl ?? '') || 'A2A agent card'}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>agent card URL</dt>
				<dd>
					<a
						href={String(pendingEntity.agentCardUrl)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.agentCardUrl)} />
					</a>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const a2aAgentCardA2aAgentCardSnapshotsViewSnapshotsResource = selection.$$snapshots}
		<ResourceBoundary
			resource={a2aAgentCardA2aAgentCardSnapshotsViewSnapshotsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<A2aAgentCard_SnapshotsView
						selection={a2aAgentCardA2aAgentCardSnapshotsViewSnapshotsResource}
						countResource={a2aAgentCardA2aAgentCardSnapshotsViewSnapshotsResource.count}
						title='snapshots'
						id='snapshots'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const a2aAgentCardAiDocumentsViewDocumentsResource = selection.$$documents}
		<ResourceBoundary
			resource={a2aAgentCardAiDocumentsViewDocumentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiDocumentsView
						selection={a2aAgentCardAiDocumentsViewDocumentsResource}
						countResource={a2aAgentCardAiDocumentsViewDocumentsResource.count}
						title='documents'
						id='documents'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
