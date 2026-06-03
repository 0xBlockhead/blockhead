<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/~/(agents)/agents/(conversations)/conversation/[conversationId]',
			{ conversationId: entityId.id },
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadAgentConversation>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const conversation = useEntity(
		EntityType.BlockheadAgentConversation,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			pinned: {},
			createdAt: {},
			updatedAt: {},
			...(open ?
				{
					systemPrompt: {},
					defaultConnectionId: {},
					defaultModelId: {},
				}
			:
				{}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConversationTurnsView from '$/views/BlockheadAgentConversationTurnsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{#if true}
			{#snippet ConversationHeading(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
				{conversation.name ?? entityId.id}
			{/snippet}

			<ResourceBoundary
				children={ConversationHeading}
				placeholderText="Loading conversation…"
				resource={conversation}
			/>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Persisted large-language-model chat transcripts: each row is one conversation with ordered user and assistant turns.
		</p>
		<p>
			Those logs are ordinary local storage—not consensus state, Farcaster casts, or multiplayer CRDT rooms.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Pinned</dt>
				<dd>
					{#if true}
						{#snippet ConversationPinnedRow(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
							{conversation.pinned ? 'Yes' : 'No'}
						{/snippet}

						<ResourceBoundary
							children={ConversationPinnedRow}
							placeholderText="Loading conversation…"
							resource={conversation}
						/>
					{/if}
				</dd>
			</div>

			<div>
				<dt>Last activity</dt>
				<dd>
					{#if true}
						{#snippet ConversationLastActivityRow(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
							{#if conversation.updatedAt !== undefined}
								<Timestamp
									timestamp={conversation.updatedAt}
								/>
							{:else}
								{#if conversation.createdAt !== undefined}
									<Timestamp
										timestamp={conversation.createdAt}
									/>
								{/if}
							{/if}
						{/snippet}

						<ResourceBoundary
							children={ConversationLastActivityRow}
							placeholderText="Loading conversation…"
							resource={conversation}
						/>
					{/if}
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Created</dt>
					<dd>
						{#if true}
							{#snippet ConversationCreatedRow(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
								{#if conversation.createdAt !== undefined}
									<Timestamp
										timestamp={conversation.createdAt}
									/>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={ConversationCreatedRow}
								placeholderText="Loading conversation…"
								resource={conversation}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Updated</dt>
					<dd>
						{#if true}
							{#snippet ConversationUpdatedRow(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
								{#if conversation.updatedAt !== undefined}
									<Timestamp
										timestamp={conversation.updatedAt}
									/>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={ConversationUpdatedRow}
								placeholderText="Loading conversation…"
								resource={conversation}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Default connection</dt>
					<dd>
						{#if true}
							{#snippet ConversationConnectionRow(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
								{#if conversation.defaultConnectionId != null && conversation.defaultConnectionId !== ''}
									<TruncatedValue
										value={conversation.defaultConnectionId}
										format={TruncatedValueFormat.Visual}
									/>
								{:else}
									<span data-text="muted">
										Not set.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={ConversationConnectionRow}
								placeholderText="Loading conversation…"
								resource={conversation}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Default model</dt>
					<dd>
						{#if true}
							{#snippet ConversationModelRow(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
								{#if conversation.defaultModelId != null && conversation.defaultModelId !== ''}
									<TruncatedValue
										value={conversation.defaultModelId}
										format={TruncatedValueFormat.Visual}
									/>
								{:else}
									<span data-text="muted">
										Not set.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={ConversationModelRow}
								placeholderText="Loading conversation…"
								resource={conversation}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>System prompt</dt>
					<dd>
						{#if true}
							{#snippet ConversationSystemPromptRow(conversation: Entity<typeof schema, EntityType.BlockheadAgentConversation>)}
								{#if conversation.systemPrompt !== ''}
									<p>
										{conversation.systemPrompt}
									</p>
								{:else}
									<span data-text="muted">
										Empty.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={ConversationSystemPromptRow}
								placeholderText="Loading conversation…"
								resource={conversation}
							/>
						{/if}
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open,
	})}

	{/snippet}
</EntityView>
