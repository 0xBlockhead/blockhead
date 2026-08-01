<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.A2aAgentCard>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aAgentCard_SnapshotsView from '$/views/A2aAgentCard_SnapshotsView.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aAgentCard}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.agentCardUrl || 'A2A agent card')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>agent card URL</dt>
				<dd>
					<a
						href={selection.entitySelector.agentCardUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.agentCardUrl} />
					</a>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const snapshotsResource = selection.$$snapshots}
		<ResourceBoundary
			resource={snapshotsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<A2aAgentCard_SnapshotsView
						selection={snapshotsResource}
						countResource={snapshotsResource.count}
						title='snapshots'
						id='snapshots'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const documentsResource = selection.$$documents}
		<ResourceBoundary
			resource={documentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiDocumentsView
						selection={documentsResource}
						countResource={documentsResource.count}
						title='documents'
						id='documents'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
