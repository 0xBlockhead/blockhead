<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntityFieldValues, EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { blockheadAgentConversationTurnStatusByStatus } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/Source.ts'

	type ResourceFields = {
		fields: Partial<EntityFieldValues<typeof schema, EntityType.BlockheadAgentConversationTurn>>
	}


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConversationTurn>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const turn = $derived.by(() => (
		selection(
			({ sources: [
				Source.Local_Internal,
			], fields: { userPrompt: true, assistantText: true, status: true, createdAt: true, ...(open ? ({ providerId: true, promptVersion: true, parentId: true, error: true }) : ({  })) } }),
		)
	))
	const turnError = $derived(turn.field('error'))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversationTurn}
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
			{#snippet TurnPromptHeading(turn: ResourceFields)}
				<TruncatedValue
					value={turn.fields.userPrompt}
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
			{#snippet children(turn: ResourceFields)}
				<span data-text="muted">
					<Timestamp
						timestamp={turn.fields.createdAt}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One prompt–response pair in a persisted agent chat tree; parent links form a branching transcript, not on-chain events.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={turn}
			placeholderText="Loading turn…"
		>
			{#snippet children(turn: ResourceFields)}
				{#if turn.fields.userPrompt !== ''}
					<p>{turn.fields.userPrompt}</p>
				{:else}
					<p data-text="muted">Empty prompt.</p>
				{/if}

				{#if open && turn.fields.assistantText != null && turn.fields.assistantText !== ''}
					<p>{turn.fields.assistantText}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
				<div>
					<dt>Status</dt>
					<dd>
						{#if true}
							{#snippet TurnStatusRow(turn: ResourceFields)}
								{#if turn.fields.status !== undefined}
									{blockheadAgentConversationTurnStatusByStatus[turn.fields.status].label}
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
						<dt>Created</dt>
						<dd>
							{#if true}
								{#snippet TurnCreatedRow(turn: ResourceFields)}
								<Timestamp
									timestamp={turn.fields.createdAt}
								/>
							{/snippet}

								<ResourceBoundary
									children={TurnCreatedRow}
								placeholderText="Loading turn…"
								resource={turn}
							/>
						{/if}
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Provider</dt>
					<dd>
						{#if true}
							{#snippet TurnProviderRow(turn: ResourceFields)}
								{#if turn.fields.providerId != null && turn.fields.providerId !== ''}
									<TruncatedValue
										value={turn.fields.providerId}
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
			{/if}

			{#if open}
				<div>
					<dt>Prompt version</dt>
					<dd>
						{#if true}
							{#snippet TurnPromptVersionRow(turn: ResourceFields)}
								{#if turn.fields.promptVersion !== ''}
									{turn.fields.promptVersion}
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
			{/if}

			{#if open}
				<div>
					<dt>Parent turn</dt>
					<dd>
						{#if true}
							{#snippet TurnParentRow(turn: ResourceFields)}
								{#if turn.fields.parentId != null && turn.fields.parentId !== ''}
									<BlockheadAgentConversationTurnView
										selection={select(EntityType.BlockheadAgentConversationTurn, { id: turn.fields.parentId })}
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
				{/if}

				{#if open}
					<div>
						<dt>Error</dt>
						<dd>
							{#if true}
								{#snippet TurnErrorRow(error?: string)}
								{#if error !== undefined && error !== ''}
									{error}
								{:else}
									<span data-text="muted">
										None.
									</span>
								{/if}
						{/snippet}

							<ResourceBoundary
								children={TurnErrorRow}
								placeholderText="Loading turn…"
								resource={turnError}
							/>
						{/if}
					</dd>
				</div>
				{/if}
		</dl>
	{/snippet}
</EntityView>
