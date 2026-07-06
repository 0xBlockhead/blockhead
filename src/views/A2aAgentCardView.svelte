<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentCard>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.A2aAgentCard>>
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
	const a2aAgentCard = $derived(selection({
		sources: [
			Source.A2aWellKnown_Http,
			Source.Eip8004Scan_Rest,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.agentCardUrl ?? prefetched.agentCardUrl) ?? '')].filter(Boolean).join(' ') || 'A2A agent card')
	const viewDomId = $derived('a2a-agent-card-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={a2aAgentCard}>
			{#snippet Pending()}
				{[String((selection.entitySelector.agentCardUrl ?? prefetched.agentCardUrl) ?? '')].filter(Boolean).join(' ') || title || 'A2A agent card'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.agentCardUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>agent card URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									agentCardUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const agentCardUrl = selection.entitySelector.agentCardUrl ?? prefetched.agentCardUrl}
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
		{#if detailsOpen}
			<A2aAgentCard_SnapshotsView
				selection={selection[EntityProxyField]<EntityType.A2aAgentCard_Snapshot>('$$snapshots')}
				title='snapshots'
				emptyText='No A2A agent card snapshots.'
				id='A2aAgentCard_SnapshotsView-$$snapshots'
			/>

			<AiDocumentsView
				selection={selection[EntityProxyField]<EntityType.AiDocument>('$$documents')}
				title='documents'
				emptyText='No linked documents.'
				id='AiDocumentsView-$$documents'
			/>
		{/if}
	{/snippet}
</EntityView>
