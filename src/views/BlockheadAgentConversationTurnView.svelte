<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { blockheadAgentConversationTurnStatusByStatus } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadAgentConversationTurn>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const turn = useEntity(
		EntityType.BlockheadAgentConversationTurn,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			userPrompt: {},
			assistantText: {},
			status: {},
			createdAt: {},
			...(open ?
				{
					providerId: {},
					promptVersion: {},
					parentId: {},
					error: {},
				}
			:
				{}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversationTurn}
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
			{#snippet TurnPromptHeading(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
				<TruncatedValue
					value={turn.userPrompt}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}

			<ResourceBoundary
				children={TurnPromptHeading}
				placeholderText="Loading turn…"
				resource={turn}
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={turn}
		>
			{#snippet children(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
				{#if turn.createdAt !== undefined}
					<span data-text="muted">
						<Timestamp
							timestamp={turn.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One prompt–response pair in a persisted agent chat tree; parent links form a branching transcript, not on-chain events.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			{#if !open}
				<div>
					<dt>User prompt</dt>
					<dd>
						{#if true}
							{#snippet TurnPromptSummary(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.userPrompt !== ''}
									<p>{turn.userPrompt}</p>
								{:else}
									<span data-text="muted">Empty prompt.</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnPromptSummary}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>
			{/if}

			<div>
				<dt>Status</dt>
				<dd>
					{#if true}
						{#snippet TurnStatusRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
							{#if turn.status !== undefined}
							{blockheadAgentConversationTurnStatusByStatus[turn.status].label}
							{/if}
						{/snippet}

						<ResourceBoundary
							children={TurnStatusRow}
							placeholderText="Loading turn…"
							resource={turn}
						/>
					{/if}
				</dd>
			</div>

			{#if open}
				<div>
					<dt>User prompt</dt>
					<dd>
						{#if true}
							{#snippet TurnPromptRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.userPrompt !== ''}
									<p>{turn.userPrompt}</p>
								{:else}
									<span data-text="muted">Empty prompt.</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnPromptRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Created</dt>
					<dd>
						{#if true}
							{#snippet TurnCreatedRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.createdAt !== undefined}
									<Timestamp
										timestamp={turn.createdAt}
									/>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnCreatedRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Assistant reply</dt>
					<dd>
						{#if true}
							{#snippet TurnAssistantRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.assistantText != null && turn.assistantText !== ''}
									<p>
										{turn.assistantText}
									</p>
								{:else}
									<span data-text="muted">
										No assistant text yet.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnAssistantRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Provider</dt>
					<dd>
						{#if true}
							{#snippet TurnProviderRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.providerId != null && turn.providerId !== ''}
									<TruncatedValue
										value={turn.providerId}
										format={TruncatedValueFormat.Visual}
									/>
								{:else}
									<span data-text="muted">
										Not recorded.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnProviderRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Prompt version</dt>
					<dd>
						{#if true}
							{#snippet TurnPromptVersionRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.promptVersion !== ''}
									{turn.promptVersion}
								{:else}
									<span data-text="muted">
										Not recorded.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnPromptVersionRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Parent turn</dt>
					<dd>
						{#if true}
							{#snippet TurnParentRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.parentId != null && turn.parentId !== ''}
									<svelte:self
										entityId={{ id: turn.parentId }}
										layout={EntityLayout.Title}
										open={false}
									/>
								{:else}
									<span data-text="muted">
										Root turn.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnParentRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Error</dt>
					<dd>
						{#if true}
							{#snippet TurnErrorRow(turn: Entity<typeof schema, EntityType.BlockheadAgentConversationTurn>)}
								{#if turn.error != null && turn.error !== ''}
									{turn.error}
								{:else}
									<span data-text="muted">
										None.
									</span>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={TurnErrorRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
