<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadAgentConversationTurn> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAgentConversationTurn = $derived(viewSelection({
		fields: {
			userPrompt: true,
			assistantText: true,
			status: true,
			createdAt: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentProviderCallsView from '$/views/BlockheadAgentProviderCallsView.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversationTurn}
	entitySelector={selection.entitySelector}
	title={title ?? ((prefetched.userPrompt ?? '') || 'agent conversation turn')}
	href={
		href === undefined ?
			(
				'$conversation' in selection.entitySelector ?
					resolve(
						'/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]',
						{
							conversationId: selection.entitySelector.$conversation.id,
							turnId: selection.entitySelector.id,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAgentConversationTurn}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.userPrompt} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentConversationTurn}>
			{#snippet children(entity)}
				<Timestamp timestamp={entity.createdAt} />
			{/snippet}
		</ResourceBoundary>
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
							<BlockheadAgentConversationView
								selection={select(EntityType.BlockheadAgentConversation, blockheadAgentConversation[EntityMetaKey.Selector])}
								prefetched={blockheadAgentConversation}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAgentConversationTurn}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAgentConversationTurn}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerId = entity.providerId}
					{#if providerId != null}
						<div>
							<dt>Provider</dt>
							<dd>
								{providerId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							promptVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const promptVersion = entity.promptVersion}
					{#if promptVersion != null}
						<div>
							<dt>Prompt version</dt>
							<dd>
								{promptVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							parentId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentId = entity.parentId}
					{#if parentId != null}
						<div>
							<dt>Parent turn ID</dt>
							<dd>
								{parentId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={blockheadAgentConversationTurn}
		>
			{#snippet children(entity)}
				{@const assistantText = entity.assistantText}
				{#if assistantText != null && assistantText !== ''}
					<p data-text="long-text">{assistantText}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const providerCallsResource = selection.$$providerCalls}
		<ResourceBoundary
			resource={providerCallsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadAgentProviderCallsView
						selection={providerCallsResource}
						countResource={providerCallsResource.count}
						title='provider calls'
						id='provider-calls'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
