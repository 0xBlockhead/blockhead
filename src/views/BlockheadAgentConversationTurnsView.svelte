<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		id = 'turns',
		title = 'Turns',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadAgentConversationTurn
			>
			id?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadAgentConversationTurn}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Ordered prompt–response pairs for this conversation; branch via parent turn ids when users edit or retry prompts.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No turns yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const conversation = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Local_Internal,
					],
					[entityFieldReference.fieldName]: {},
				},
			)}
			{@const turns = derive(
				conversation,
				(conversation) => (
					conversation[entityFieldReference.fieldName]
					?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadAgentConversationTurn}
				id={`${id}-items`}
				open={true}
				getKey={(turn) => stringify(turn[EntityMetaKey.Id])}
				placeholderText="Loading turns…"
				resource={turns}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No turns yet.
					</p>
				{/snippet}

				{#snippet Item({ item: turn })}
					<BlockheadAgentConversationTurnView
						entityId={turn[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
