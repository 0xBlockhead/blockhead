<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConversationTurn>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAgentConversationTurn>>
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

	const blockheadAgentConversationTurn = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			userPrompt: true,
			assistantText: true,
			status: true,
			createdAt: true,
			...(open && {
				$conversation: true,
				providerId: true,
				promptVersion: true,
				parentId: true,
				error: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).userPrompt) ?? '')].filter(Boolean).join(' ') || 'agent conversation turn')
	const viewDomId = $derived('blockhead-agent-conversation-turn-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversationTurn}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/~/agents/conversation/[conversationId]/turn/[turnId]', {
			conversationId: String(({ ...selection.entitySelector, ...prefetched }).$conversation.id),
			turnId: String(({ ...selection.entitySelector, ...prefetched }).id),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const userPrompt0 = ({ ...selection.entitySelector, ...prefetched }).userPrompt}
			{#if userPrompt0 !== undefined && userPrompt0 !== null}
				<TruncatedValue value={String(userPrompt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet Pending()}
					{@const userPrompt0 = ({ ...selection.entitySelector, ...prefetched }).userPrompt}
					{#if userPrompt0 !== undefined && userPrompt0 !== null}
						<TruncatedValue value={String(userPrompt0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const userPrompt0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).userPrompt}
					{#if userPrompt0 !== undefined && userPrompt0 !== null}
						<TruncatedValue value={String(userPrompt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<Timestamp timestamp={Number(createdAt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet Pending()}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).createdAt}
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
						resource={selection[EntityProxyField]<EntityType.BlockheadAgentConversation, false>('$conversation')}
					>
						{#snippet children(blockheadAgentConversation)}
							<BlockheadAgentConversationView
								selection={select(EntityType.BlockheadAgentConversation, blockheadAgentConversation.entitySelector)}
								prefetched={blockheadAgentConversation}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary resource={blockheadAgentConversationTurn}>
						{#snippet Pending()}
							{@const status = prefetched.status ?? selection.entitySelector.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const status = entity.status ?? selection.entitySelector.status ?? prefetched.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet Pending()}
					{@const providerId = prefetched.providerId ?? selection.entitySelector.providerId}
					{#if providerId !== undefined && providerId !== null}
						<div>
							<dt>Provider</dt>
							<dd>
								{String((providerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const providerId = entity.providerId ?? selection.entitySelector.providerId ?? prefetched.providerId}
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

			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet Pending()}
					{@const promptVersion = prefetched.promptVersion ?? selection.entitySelector.promptVersion}
					{#if promptVersion !== undefined && promptVersion !== null}
						<div>
							<dt>Prompt version</dt>
							<dd>
								{String((promptVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const promptVersion = entity.promptVersion ?? selection.entitySelector.promptVersion ?? prefetched.promptVersion}
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

			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet Pending()}
					{@const parentId = prefetched.parentId ?? selection.entitySelector.parentId}
					{#if parentId !== undefined && parentId !== null}
						<div>
							<dt>Parent turn ID</dt>
							<dd>
								{String((parentId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const parentId = entity.parentId ?? selection.entitySelector.parentId ?? prefetched.parentId}
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

			<ResourceBoundary resource={blockheadAgentConversationTurn}>
				{#snippet Pending()}
					{@const error = prefetched.error ?? selection.entitySelector.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const error = entity.error ?? selection.entitySelector.error ?? prefetched.error}
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

		<ResourceBoundary resource={blockheadAgentConversationTurn}>
			{#snippet children(entity)}
				{@const assistantText = entity.assistantText ?? selection.entitySelector.assistantText ?? prefetched.assistantText}
				{#if assistantText === undefined || assistantText === null || assistantText === ''}
					<p data-text="muted">No assistant text available.</p>
				{:else}
					<p data-text="long-text">{String((assistantText) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
