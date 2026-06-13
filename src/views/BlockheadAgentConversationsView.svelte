<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Agent conversations',
		open = $bindable(true),
		collapsible = true,
				id = 'agents',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference?: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadAgentConversation
			>
			title?: string
			open?: boolean
			collapsible?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Functions
	const globalId = (
		{ scope: '$$blockheadAgentConversations' } satisfies EntityId<typeof schema, EntityType._Global>
	)


	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadAgentConversationView from '$/views/BlockheadAgentConversationView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadAgentConversation}
	{id}
	bind:open
	{collapsible}
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Persisted large-language-model chat transcripts: each row is one conversation with ordered user/assistant messages.
		</p>
		<p>
			Those logs are ordinary files or local DB blockheadAgentConversations—not consensus state, Farcaster casts, or multiplayer CRDT rooms.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No conversations yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const global = subscribe(EntityType._Global,
				entityFieldReference?.entityId ?? globalId,
				({ sources: [
						Source.Local_Internal,
					], fields: { $$blockheadAgentConversations: true } }),
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
				id={`${id}-items`}
				open={true}
				getKey={(conversation) => stringify(conversation[EntityMetaKey.Id])}
				getSortValue={(conversation) => conversation[EntityMetaKey.Id].id}
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
					<BlockheadAgentConversationView
						entityId={{
							id: conversation[EntityMetaKey.Id].id,
						}}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
