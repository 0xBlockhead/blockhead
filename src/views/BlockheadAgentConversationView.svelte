<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntityResourceData } from '$/client/$subscribe.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'


	type Conversation = EntityResourceData<typeof schema, EntityType.BlockheadAgentConversation>

	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/~/(agents)/agents/(conversations)/conversation/[conversationId]',
			{ conversationId: selection.entitySelector.id },
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConversation>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const conversation = $derived.by(() => (
		selection(
			({ sources: [
				Source.Local_Internal,
			], fields: { name: true, pinned: true, createdAt: true, updatedAt: true, ...(open ? ({ systemPrompt: true, defaultConnectionId: true, defaultModelId: true }) : ({  })) } }),
		)
	))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{#if true}
			{#snippet ConversationHeading(conversation: Conversation)}
				{conversation.fields.name ?? selection.entitySelector.id}
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
		{#if open}
			{#if true}
				{#snippet ConversationSystemPromptProse(conversation: Conversation)}
					{#if conversation.fields.systemPrompt !== ''}
						<p>
							{conversation.fields.systemPrompt}
						</p>
					{:else}
						<p data-text="muted">
							Empty.
						</p>
					{/if}
				{/snippet}

				<ResourceBoundary
					children={ConversationSystemPromptProse}
					placeholderText="Loading conversation…"
					resource={conversation}
				/>
			{/if}
		{/if}

		<dl data-column-item="center">
			<div>
				<dt>Pinned</dt>
				<dd>
					{#if true}
						{#snippet ConversationPinnedRow(conversation: Conversation)}
							{conversation.fields.pinned ? 'Yes' : 'No'}
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
						{#snippet ConversationLastActivityRow(conversation: Conversation)}
							{#if conversation.fields.updatedAt !== undefined}
								<Timestamp
									timestamp={conversation.fields.updatedAt}
								/>
							{:else}
								{#if conversation.fields.createdAt !== undefined}
									<Timestamp
										timestamp={conversation.fields.createdAt}
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
							{#snippet ConversationCreatedRow(conversation: Conversation)}
								{#if conversation.fields.createdAt !== undefined}
									<Timestamp
										timestamp={conversation.fields.createdAt}
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
			{/if}

			{#if open}
				<div>
					<dt>Updated</dt>
					<dd>
						{#if true}
							{#snippet ConversationUpdatedRow(conversation: Conversation)}
								{#if conversation.fields.updatedAt !== undefined}
									<Timestamp
										timestamp={conversation.fields.updatedAt}
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
			{/if}

			{#if open}
				<div>
					<dt>Default connection</dt>
					<dd>
						{#if true}
							{#snippet ConversationConnectionRow(conversation: Conversation)}
								{#if conversation.fields.defaultConnectionId != null && conversation.fields.defaultConnectionId !== ''}
									<TruncatedValue
										value={conversation.fields.defaultConnectionId}
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
			{/if}

			{#if open}
				<div>
					<dt>Default model</dt>
					<dd>
						{#if true}
							{#snippet ConversationModelRow(conversation: Conversation)}
								{#if conversation.fields.defaultModelId != null && conversation.fields.defaultModelId !== ''}
									<TruncatedValue
										value={conversation.fields.defaultModelId}
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
			{/if}

		</dl>
	{/snippet}
</EntityView>
