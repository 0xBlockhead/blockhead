<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
let {
		selection = select(
			EntityType._Global,
			{ scope: '$$blockheadAgentConversations' },
			{
				sources: [Source.Local_Internal],
			}
		).$$blockheadAgentConversations,
		title = 'Agent conversations',
		open = $bindable(true),
		collapsible = true,
		id = 'agents',
		...EntitiesListProps
	}: WithRest<
		{
			selection?: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAgentConversation>
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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading conversations…">
				{#snippet children(conversations)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadAgentConversation}
						id={`${id}-items`}
						open={true}
						items={conversations.entities}
						getKey={(conversation) => stringify(conversation.entitySelector)}
						getSortValue={(conversation) => conversation.entitySelector.id}
						placeholderText="Loading conversations…"
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No conversations yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadAgentConversationView
								selection={select(EntityType.BlockheadAgentConversation, { id: item.entitySelector.id })}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
