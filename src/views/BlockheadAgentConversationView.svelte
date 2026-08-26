<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadAgentConversation> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAgentConversation = $derived(viewSelection({
		fields: {
			name: true,
			pinned: true,
			createdAt: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.id || 'agent conversation')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConversationTurnsView from '$/views/BlockheadAgentConversationTurnsView.svelte'
	import BlockheadAgentProfileView from '$/views/BlockheadAgentProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/agents/conversation/[conversationId=stringSegment]',
				{
					conversationId: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAgentConversation}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentConversation}>
			{#snippet children(entity)}
				<Timestamp timestamp={entity.updatedAt} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pinned</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAgentConversation}
					>
						{#snippet children(entity)}
							{entity.pinned ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAgentConversation}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadAgentConversation}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.updatedAt} />
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
							defaultConnectionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const defaultConnectionId = entity.defaultConnectionId}
					{#if defaultConnectionId != null}
						<div>
							<dt>Default connection ID</dt>
							<dd>
								{defaultConnectionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							defaultModelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const defaultModelId = entity.defaultModelId}
					{#if defaultModelId != null}
						<div>
							<dt>Default model ID</dt>
							<dd>
								{defaultModelId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$profile}
			>
				{#snippet children(blockheadAgentProfile)}
					{#if blockheadAgentProfile != null}
						{@const blockheadAgentProfileInitial = untrack(() => blockheadAgentProfile)}
						<div>
							<dt>profile</dt>
							<dd>
								<BlockheadAgentProfileView
									selection={select(EntityType.BlockheadAgentProfile, (blockheadAgentProfile ?? blockheadAgentProfileInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadAgentProfile ?? blockheadAgentProfileInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						systemPrompt: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const systemPrompt = entity.systemPrompt}
				{#if systemPrompt !== ''}
					<p data-text="long-text">{systemPrompt}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const turnsResource = selection.$$turns}
		<ResourceBoundary
			resource={turnsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadAgentConversationTurnsView
						selection={turnsResource}
						countResource={turnsResource.count}
						title='Turns'
						id='turns'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
