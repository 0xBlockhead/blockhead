<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'

	import { mergeEntityCollectionRowFields } from '$/collections/mergeEntityCollectionRowFields.ts'


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
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const atprotoActorMergeSourceOrder = [
		Source.Atproto_Xrpc,
	] as const

	const actorQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.AtprotoActor] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const actorFields = $derived(
		mergeEntityCollectionRowFields<EntityType.AtprotoActor>(
			actorQuery.data,
			atprotoActorMergeSourceOrder,
		),
	)

	const displayTitle = $derived(
		actorFields.displayName
		?? actorFields.handle
		?? entityId.did,
	)

	const avatarUrl = $derived((
		actorFields.$icon?.[EntityMetaKey.Id].url
	))


	// Components
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		{#if avatarUrl !== undefined}
			<IconComponent
				alt={actorFields.displayName ?? actorFields.handle ?? ''}
				shape={IconShape.Circle}
				src={avatarUrl}
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if actorFields.handle !== undefined && actorFields.handle !== displayTitle}
			<span data-text="muted">
				@{actorFields.handle}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		{#if actorFields.description}
			<p data-text="muted">
				{actorFields.description}
			</p>
		{/if}
		<div data-text="mono muted">
			{entityId.did}
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.AtprotoActor}
			{entityId}
		>
			<QueryBoundary
				query={actorQuery}
			>
				{#snippet children(atprotoActorResultRows)}
					{#if atprotoActorResultRows == null || atprotoActorResultRows.length === 0}
						<p data-text="muted">
							No atproto profile data in the app for this DID yet. Try again shortly.
						</p>
					{:else}
						<dl>
							{#if actorFields.displayName}
								<div>
									<dt>Display name</dt>
									<dd>{actorFields.displayName}</dd>
								</div>
							{/if}
							{#if actorFields.handle}
								<div>
									<dt>Handle</dt>
									<dd>{actorFields.handle}</dd>
								</div>
							{/if}
							{#if actorFields.description}
								<div>
									<dt>Description</dt>
									<dd>{actorFields.description}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<Collapsible
			id={`${idKey}:carousel-activity`}
			{...{ 'data-card': '' }}
		>
			{#snippet Summary({
				open: _open,
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
			{#snippet children(_ctx)}
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
