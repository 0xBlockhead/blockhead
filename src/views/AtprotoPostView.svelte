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
	import HeadingComponent from '$/components/Heading.svelte'
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
	{#snippet Heading()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(u)}
				{#if u.text !== undefined && u.text !== ''}
					<HeadingComponent>
						{#if href}
							<a href={href}>
								<TruncatedValue
									endLength={8}
									format={TruncatedValueFormat.Visual}
									startLength={88}
									value={u.text}
								/>
							</a>
						{:else}
							<TruncatedValue
								endLength={8}
								format={TruncatedValueFormat.Visual}
								startLength={88}
								value={u.text}
							/>
						{/if}
					</HeadingComponent>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column>
			<ResourceBoundary
				resource={post}
				placeholderText="Loading post…"
			>
				{#snippet children(u)}
					{#if u.text}
						<p>
							{u.text}
						</p>
					{/if}
					{#if u.$author}
						<p data-text="muted">
							<a
								href={resolve(
									'/(social)/atproto/actor/[did]',
									{
										did: encodeURIComponent(
											u.$author[EntityMetaKey.Id].did,
										),
									},
								)}
							>Author ({u.$author[EntityMetaKey.Id].did})</a>
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div data-text="mono muted">
				{entityId.uri}
			</div>
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
				{#snippet children(u)}
					{#if (u.text == null || u.text === '') && u.createdAt == null}
						<p data-text="muted">
							Post details are not available yet.
						</p>
					{:else}
						<dl>
							{#if u.$author}
								<div>
									<dt>Author</dt>
									<dd>{u.$author[EntityMetaKey.Id].did}</dd>
								</div>
							{/if}
							{#if u.text !== undefined && u.text !== ''}
								<div>
									<dt>Text</dt>
									<dd>{u.text}</dd>
								</div>
							{/if}
							{#if u.createdAt !== undefined}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={u.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
