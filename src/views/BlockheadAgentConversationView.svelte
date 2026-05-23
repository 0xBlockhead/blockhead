<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children: childrenSnippet,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadAgentConversation>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const conversation = useEntity(
		EntityType.BlockheadAgentConversation,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			createdAt: {},
			updatedAt: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={conversation}
			placeholderText="Loading conversation…"
		>
			{#snippet children(conversation)}
				{conversation.name ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Scope</dt>
				<dd data-text="muted">
					Persisted chat transcript keyed by conversation id: role-tagged messages and optional titles. This persistence is client-side storage—not consensus slots, Farcaster casts, or on-chain events.
				</dd>
			</div>

			<ResourceBoundary resource={conversation}>
				{#snippet children(conversation)}
					{#if conversation.updatedAt !== undefined}
						<div>
							<dt>Last activity</dt>
							<dd>
								<Timestamp
									timestamp={conversation.updatedAt}
								/>
							</dd>
						</div>
					{:else}
						{#if conversation.createdAt !== undefined}
							<div>
								<dt>Last activity</dt>
								<dd>
									<Timestamp
										timestamp={conversation.createdAt}
									/>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if conversation.createdAt !== undefined}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={conversation.createdAt}
									/>
								</dd>
							</div>
						{/if}

						{#if conversation.updatedAt !== undefined}
							<div>
								<dt>Updated at</dt>
								<dd>
									<Timestamp
										timestamp={conversation.updatedAt}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadAgentConversation}
			{entityId}
		/>

		{#if childrenSnippet}
			{@render childrenSnippet()}
		{/if}
	{/snippet}
</EntityView>
