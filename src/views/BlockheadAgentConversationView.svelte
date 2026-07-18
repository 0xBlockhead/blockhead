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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadAgentConversation>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadAgentConversation>>
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
	const blockheadAgentConversation = $derived(selection({
		sources: selection.sources,
		fields: {
			name: true,
			pinned: true,
			createdAt: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.id) ?? '')].filter(Boolean).join(' ') || 'agent conversation')
	const viewDomId = $derived('blockhead-agent-conversation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConversationTurnsView from '$/views/BlockheadAgentConversationTurnsView.svelte'
	import BlockheadAgentProfileView from '$/views/BlockheadAgentProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.id !== undefined ? resolve('/~/agents/conversation/[conversationId=stringSegment]', {
			conversationId: String(pendingEntity.id ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const updatedAt0 = pendingEntity.updatedAt}
					{#if updatedAt0 !== undefined && updatedAt0 !== null}
						<Timestamp timestamp={Number(updatedAt0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt0 = resolvedEntity.updatedAt}
					{#if updatedAt0 !== undefined && updatedAt0 !== null}
						<Timestamp timestamp={Number(updatedAt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pinned</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									pinned: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pinned = resolvedEntity.pinned}
							{#if pinned !== undefined && pinned !== null}
								{pinned ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									updatedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const updatedAt = resolvedEntity.updatedAt}
							{#if updatedAt !== undefined && updatedAt !== null}
								<Timestamp timestamp={Number(updatedAt)} />
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
							defaultConnectionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const defaultConnectionId = resolvedEntity.defaultConnectionId}
					{#if defaultConnectionId !== undefined && defaultConnectionId !== null}
						<div>
							<dt>Default connection ID</dt>
							<dd>
								{String((defaultConnectionId) ?? '')}
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
							defaultModelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const defaultModelId = resolvedEntity.defaultModelId}
					{#if defaultModelId !== undefined && defaultModelId !== null}
						<div>
							<dt>Default model ID</dt>
							<dd>
								{String((defaultModelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$profile}
			>
				{#snippet children(blockheadAgentProfile)}
					{#if blockheadAgentProfile != null && blockheadAgentProfile[EntityMetaKey.Selector] != null}
						<div>
							<dt>profile</dt>
							<dd>
								<BlockheadAgentProfileView
									selection={select(EntityType.BlockheadAgentProfile, blockheadAgentProfile[EntityMetaKey.Selector])}
									prefetched={blockheadAgentProfile}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						systemPrompt: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const systemPrompt = resolvedEntity.systemPrompt}
				{#if systemPrompt !== undefined && systemPrompt !== null && systemPrompt !== ''}
					<p data-text="long-text">{String((systemPrompt) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadAgentConversationTurnsView
				selection={
						selection.$$turns({
							count: true,
						})
					}
				title='Turns'
				emptyText='No turns yet.'
				id='BlockheadAgentConversationTurnsView-turns'
			/>
		{/if}
	{/snippet}
</EntityView>
