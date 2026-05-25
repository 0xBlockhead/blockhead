<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { blockheadAgentConversationTurnStatuses } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/~/(agents)/agents/(conversations)/conversation/[conversationId]/turn/[turnId]',
			{
				conversationId: entityId.conversationId,
				turnId: entityId.turnId,
			},
		),
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		{#if true}
			{#snippet TurnPromptHeading(turn)}
				<TruncatedValue
					value={loadedTurn.userPrompt}
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
			{#snippet children(loadedTurn)}
				{#if loadedTurn.createdAt !== undefined}
					<span data-text="muted">
						<Timestamp
							timestamp={loadedTurn.createdAt}
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if !open}
				<div>
					<dt>User prompt</dt>
					<dd>
						{#if true}
							{#snippet TurnPromptSummary(turn)}
								{#if loadedTurn.userPrompt !== ''}
									<p>{loadedTurn.userPrompt}</p>
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
						{#snippet TurnStatusRow(turn)}
							{blockheadAgentConversationTurnStatuses[loadedTurn.status].label}
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
							{#snippet TurnPromptRow(turn)}
								{#if loadedTurn.userPrompt !== ''}
									<p>{loadedTurn.userPrompt}</p>
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
							{#snippet TurnCreatedRow(turn)}
								{#if loadedTurn.createdAt !== undefined}
									<Timestamp
										timestamp={loadedTurn.createdAt}
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
							{#snippet TurnAssistantRow(turn)}
								{#if loadedTurn.assistantText != null && loadedTurn.assistantText !== ''}
									<p>
										{loadedTurn.assistantText}
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
							{#snippet TurnProviderRow(turn)}
								{#if loadedTurn.providerId != null && loadedTurn.providerId !== ''}
									<TruncatedValue
										value={loadedTurn.providerId}
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
							{#snippet TurnPromptVersionRow(turn)}
								{#if loadedTurn.promptVersion !== ''}
									{loadedTurn.promptVersion}
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
							{#snippet TurnParentRow(turn)}
								{#if loadedTurn.parentId != null && loadedTurn.parentId !== ''}
									<BlockheadAgentConversationTurnView
										entityId={{ id: loadedTurn.parentId }}
										layout={EntityLayout.Title}
										open={false}
									/>
								{:else}
									<span data-text="muted">
										Root loadedTurn.
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
							{#snippet TurnErrorRow(turn)}
								{#if loadedTurn.error != null && loadedTurn.error !== ''}
									{loadedTurn.error}
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
		<EntityDetails
			entityType={EntityType.BlockheadAgentConversationTurn}
			{entityId}
		/>
	{/snippet}
</EntityView>

