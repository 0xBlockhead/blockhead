<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.A2aAgentCard>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.A2aAgentCard>
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
	const a2aAgentCard = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.agentCardUrl) ?? '')].filter(Boolean).join(' ') || 'A2A agent card')
	const viewDomId = $derived('a2a-agent-card-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aAgentCard_SnapshotsView from '$/views/A2aAgentCard_SnapshotsView.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aAgentCard}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.agentCardUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={a2aAgentCard}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.agentCardUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>agent card URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									agentCardUrl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const agentCardUrl = resolvedEntity.agentCardUrl}
							{#if agentCardUrl !== undefined && agentCardUrl !== null}
								<svelte:element
									this={'a'}
									href={String(agentCardUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(agentCardUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
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
					id='A2aAgentCard_SnapshotsView-snapshots'
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
					id='AiDocumentsView-documents'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
