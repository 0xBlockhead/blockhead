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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadAgentConversationTurn>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadAgentConversationTurn>
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
	const blockheadAgentConversationTurn = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			userPrompt: true,
			createdAt: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			userPrompt: true,
			assistantText: true,
			status: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.userPrompt) ?? '')].filter(Boolean).join(' ') || 'agent conversation turn')
	const viewDomId = $derived('blockhead-agent-conversation-turn-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentProviderCallsView from '$/views/BlockheadAgentProviderCallsView.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversationTurn}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'id' in selection.entitySelector
			&& selection.entitySelector.id != null
			&& selection.entitySelector != null && '$conversation' in selection.entitySelector
			&& selection.entitySelector.$conversation != null && 'id' in selection.entitySelector.$conversation
			&& selection.entitySelector.$conversation.id != null ?
				resolve('/~/agents/conversation/[conversationId=stringSegment]/turn/[turnId=stringSegment]', {
			turnId: String(selection.entitySelector.id ?? ''),
			conversationId: String(selection.entitySelector.$conversation.id ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'userPrompt') && Object.hasOwn(prefetched, 'createdAt')}
			{@const userPrompt0 = pendingEntity.userPrompt}
			{#if userPrompt0 !== undefined && userPrompt0 !== null}
				<TruncatedValue value={String((userPrompt0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userPrompt0 = resolvedEntity.userPrompt}
					{#if userPrompt0 !== undefined && userPrompt0 !== null}
						<TruncatedValue value={String((userPrompt0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'userPrompt') && Object.hasOwn(prefetched, 'createdAt')}
			{@const createdAt0 = pendingEntity.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<Timestamp timestamp={Number(createdAt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt0 = resolvedEntity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Conversation</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$conversation}
					>
						{#snippet children(blockheadAgentConversation)}
							{#if blockheadAgentConversation != null && blockheadAgentConversation[EntityMetaKey.Selector] != null}
								<BlockheadAgentConversationView
									selection={select(EntityType.BlockheadAgentConversation, blockheadAgentConversation[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConversation}
									href={
										(
											blockheadAgentConversation[EntityMetaKey.Selector] != null && 'id' in blockheadAgentConversation[EntityMetaKey.Selector]
											&& blockheadAgentConversation[EntityMetaKey.Selector].id != null ?
												resolve('/~/agents/conversation/[conversationId=stringSegment]', {
											conversationId: String(blockheadAgentConversation[EntityMetaKey.Selector].id ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerId = resolvedEntity.providerId}
					{#if providerId !== undefined && providerId !== null}
						<div>
							<dt>Provider</dt>
							<dd>
								{String((providerId) ?? '')}
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
							promptVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const promptVersion = resolvedEntity.promptVersion}
					{#if promptVersion !== undefined && promptVersion !== null}
						<div>
							<dt>Prompt version</dt>
							<dd>
								{String((promptVersion) ?? '')}
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
							parentId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentId = resolvedEntity.parentId}
					{#if parentId !== undefined && parentId !== null}
						<div>
							<dt>Parent turn ID</dt>
							<dd>
								{String((parentId) ?? '')}
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
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
						assistantText: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const assistantText = resolvedEntity.assistantText}
				{#if assistantText !== undefined && assistantText !== null && assistantText !== ''}
					<p data-text="long-text">{String((assistantText) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadAgentConversationTurnBlockheadAgentProviderCallsViewProviderCallsResource = selection.$$providerCalls}
		<ResourceBoundary
			resource={blockheadAgentConversationTurnBlockheadAgentProviderCallsViewProviderCallsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadAgentProviderCallsView
					selection={blockheadAgentConversationTurnBlockheadAgentProviderCallsViewProviderCallsResource}
					countResource={blockheadAgentConversationTurnBlockheadAgentProviderCallsViewProviderCallsResource.count}
					title='provider calls'
					id='BlockheadAgentProviderCallsView-provider-calls'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
