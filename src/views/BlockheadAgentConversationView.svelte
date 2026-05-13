<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


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
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary resource={conversation}>
			{#snippet children(_conversation)}
				<HeadingComponent>
					{_conversation.name ?? entityId.id}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Conversation id</dt>
				<dd>
					<TruncatedValue
						value={entityId.id}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>

			<ResourceBoundary resource={conversation}>
				{#snippet children(_conversation)}
					{#if _conversation.updatedAt !== undefined || _conversation.createdAt !== undefined}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp
									timestamp={_conversation.updatedAt ?? _conversation.createdAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if childrenSnippet}
			{@render childrenSnippet()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadAgentConversation}
				{entityId}
			>
				<ResourceBoundary resource={conversation}>
					{#snippet children(_conversation)}
						<dl>
							{#if _conversation.name !== undefined && _conversation.name !== ''}
								<div>
									<dt>Name</dt>
									<dd>{_conversation.name}</dd>
								</div>
							{/if}

							{#if _conversation.createdAt !== undefined}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={_conversation.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}

							{#if _conversation.updatedAt !== undefined}
								<div>
									<dt>Updated at</dt>
									<dd>
										<Timestamp
											timestamp={_conversation.updatedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						</dl>

						{#if (
							(_conversation.name === undefined || _conversation.name === '')
							&& _conversation.createdAt === undefined
							&& _conversation.updatedAt === undefined
						)}
							<p data-text="muted">
								No conversation details are available yet.
							</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
