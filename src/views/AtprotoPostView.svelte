<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AtprotoPost>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'Content'
			| 'Details'
			| 'entityId'
			| 'entityType'
			| 'Heading'
			| 'HeadingAfter'
			| 'Icon'
			| 'href'
			| 'open'
			| 'title'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const post = useEntity(
		EntityType.AtprotoPost,
		entityId,
		{
			$: [Source.Atproto_Xrpc],
			text: {},
			createdAt: {},
			$author: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.uri}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(resolvedAtprotoPost)}
				{#if resolvedAtprotoPost.text}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={resolvedAtprotoPost.text}
					/>
				{:else}
					{entityId.uri}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<div data-column>
			<ResourceBoundary
				resource={post}
				placeholderText="Loading post…"
			>
				{#snippet children(resolvedAtprotoPost)}
					{#if resolvedAtprotoPost.text}
						{#if !open}
							<p>
								{resolvedAtprotoPost.text}
							</p>
						{/if}
					{/if}
					{#if resolvedAtprotoPost.$author}
						<p data-text="muted">
							<a
								href={resolve(
									'/(social)/atproto/actor/[did]',
									{
										did: encodeURIComponent(
											resolvedAtprotoPost.$author[EntityMetaKey.Id].did,
										),
									},
								)}
							>Author ({resolvedAtprotoPost.$author[EntityMetaKey.Id].did})</a>
						</p>
					{/if}
					<dl data-column-item="center">
						{#if resolvedAtprotoPost.text}
							<div>
								<dt>Record URI</dt>
								<dd data-text="mono">
									{@render Id()}
								</dd>
							</div>
						{/if}
						{#if open}
							{#if resolvedAtprotoPost.$author}
								<div>
									<dt>Author</dt>
									<dd>{resolvedAtprotoPost.$author[EntityMetaKey.Id].did}</dd>
								</div>
							{/if}
							{#if resolvedAtprotoPost.text}
								<div>
									<dt>Text</dt>
									<dd>{resolvedAtprotoPost.text}</dd>
								</div>
							{/if}
							{#if resolvedAtprotoPost.createdAt}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={resolvedAtprotoPost.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.AtprotoPost}
			{entityId}
		>
			<ResourceBoundary resource={post}>
				{#snippet children(resolvedAtprotoPost)}
					{#if (
						!resolvedAtprotoPost.text
						&& resolvedAtprotoPost.createdAt == null
					)}
						<p data-text="muted">
							Post details are not available yet.
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
