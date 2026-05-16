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
			entityId: EntityId<typeof schema, EntityType.AtprotoActor>
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
			| 'Icon'
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const actor = useEntity(
		EntityType.AtprotoActor,
		entityId,
		{
			$: [Source.Atproto_Xrpc],
			displayName: {},
			handle: {},
			$icon: {},
			description: {},
		},
	)


	// Components
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Icon()}
		<ResourceBoundary resource={actor}>
			{#snippet children(atprotoProfileRow)}
				{@const atprotoBrandIconSrc = atprotoProfileRow.$icon?.[EntityMetaKey.Id].url}
				{#if atprotoBrandIconSrc}
					<IconComponent
						alt={atprotoProfileRow.displayName ?? atprotoProfileRow.handle ?? ''}
						shape={IconShape.Circle}
						src={atprotoBrandIconSrc}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary resource={actor}>
			{#snippet children(atprotoProfileRow)}
				{atprotoProfileRow.displayName
					?? atprotoProfileRow.handle
					?? entityId.did}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.did}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(atprotoProfileRow)}
				{@const atprotoSummaryHeadingLine = (
					atprotoProfileRow.displayName
					?? atprotoProfileRow.handle
					?? entityId.did
				)}
				{#if atprotoProfileRow.handle && atprotoProfileRow.handle !== atprotoSummaryHeadingLine}
					<span data-text="muted">
						@{atprotoProfileRow.handle}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<div data-column>
			<ResourceBoundary
				resource={actor}
				placeholderText="Loading profile…"
			>
			{#snippet children(atprotoProfileRow)}
				{@const atprotoSummaryHeadingLine = (
					atprotoProfileRow.displayName
					?? atprotoProfileRow.handle
					?? entityId.did
				)}
				{#if atprotoProfileRow.description}
						{#if !open}
							<p data-text="muted">
								{atprotoProfileRow.description}
							</p>
						{/if}
					{/if}
					<dl data-column-item="center">
						{#if atprotoSummaryHeadingLine !== entityId.did}
							<div>
								<dt>DID</dt>
								<dd data-text="mono">
									{@render Id()}
								</dd>
							</div>
						{/if}
						{#if open}
							{#if atprotoProfileRow.displayName}
								<div>
									<dt>Display name</dt>
									<dd>{atprotoProfileRow.displayName}</dd>
								</div>
							{/if}
						{/if}
						{#if open}
							{#if atprotoProfileRow.handle}
								<div>
									<dt>Handle</dt>
									<dd>{atprotoProfileRow.handle}</dd>
								</div>
							{/if}
						{/if}
						{#if open}
							{#if atprotoProfileRow.description}
								<div>
									<dt>Description</dt>
									<dd>{atprotoProfileRow.description}</dd>
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
			entityType={EntityType.AtprotoActor}
			{entityId}
		>
			<ResourceBoundary resource={actor}>
				{#snippet children(atprotoProfileRow)}
					{#if (
						atprotoProfileRow.handle == null
						&& atprotoProfileRow.displayName == null
						&& atprotoProfileRow.description == null
					)}
						<p data-text="muted">
							No atproto profile data in the app for this DID yet. Try again shortly.
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		<Collapsible
			id={`${idKey}:carousel-activity`}
			{...{ 'data-card': '' }}
		>
			{#snippet Summary({
				open: _postsSummaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Posts
					</HeadingComponent>
				</header>
			{/snippet}
			{#snippet children({
				open: _postsDetailOpen,
			})}
				<div
					class="carousel"
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
				>
					<section data-scroll-marker-label="Posts">
						<AtprotoPostsView
							entityFieldReference={{
								entityType: EntityType.AtprotoActor,
								entityId,
								fieldName: '$$posts',
							}}
							href={resolve('/(social)/atproto/actor/[did]/(actor)/posts', {
								did: encodeURIComponent(entityId.did),
							})}
							id={`${idKey}:posts`}
							open={false}
						/>
					</section>
				</div>
			{/snippet}
		</Collapsible>
	{/snippet}
</EntityView>


<style>
	.carousel {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
