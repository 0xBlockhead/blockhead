<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Agent conversations',
		open = $bindable(true),
		collapsible = true,
		href = resolve('/~/agents'),
		id = 'agents',
		...entitiesListForward
	}: WithRest<
		{
			entityFieldReference?: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadAgentConversation
			>
			title?: string
			open?: boolean
			href?: string
			id?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const globalId = (
		{} satisfies EntityId<typeof schema, EntityType._Global>
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadAgentConversation}
	{href}
	{id}
	bind:open
	{collapsible}
	{title}
	{...entitiesListForward}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Persisted large-language-model chat transcripts: each row is one conversation with ordered user/assistant messages.
		</p>
		<p>
			Those logs are ordinary files or local DB rows—not consensus state, Farcaster casts, or multiplayer CRDT rooms.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No conversations yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const global = useEntity(
				EntityType._Global,
				entityFieldReference?.entityId ?? globalId,
				{
					$: [
						Source.Local_Internal,
					],
					$$blockheadAgentConversations: {},
				},
			)}
			{@const conversations = derive(
				global,
				(global) => (
					global.$$blockheadAgentConversations
					?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadAgentConversation}
				{href}
				id={`${id}-items`}
				open={true}
				getKey={(conversation) => stringify(conversation[EntityMetaKey.Id])}
				getSortValue={(conversation) => -conversation.updatedAt}
				placeholderText="Loading conversations…"
				resource={conversations}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No conversations yet.
					</p>
				{/snippet}

				{#snippet Item({ item: conversation })}
					{#if conversation}
						<BlockheadAgentConversationView
							entityId={{
								id: conversation[EntityMetaKey.Id].id,
							}}
							href={(
								href.includes('/~/agents') ?
									`/~/agents/conversations/conversation/${encodeURIComponent(conversation[EntityMetaKey.Id].id)}`
								:
									resolve(
										'/(explore)/(agents)/agent/[agentId]',
										{
											agentId: encodeURIComponent(
												conversation[EntityMetaKey.Id].id,
											),
										},
									)
							)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
