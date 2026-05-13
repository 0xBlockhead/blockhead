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
	{#snippet Heading()}
		<ResourceBoundary resource={actor}>
			{#snippet Pending()}{/snippet}
			{#snippet children(profile)}
				<HeadingComponent>
					{profile.displayName
						?? profile.handle
						?? entityId.did}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary resource={actor}>
			{#snippet Pending()}{/snippet}
			{#snippet children(profile)}
				{@const avatar = profile.$icon?.[EntityMetaKey.Id].url}
				{#if avatar !== undefined}
					<IconComponent
						alt={profile.displayName ?? profile.handle ?? ''}
						shape={IconShape.Circle}
						src={avatar}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={actor}>
			{#snippet Pending()}{/snippet}
			{#snippet children(profile)}
				{@const heading = (
					profile.displayName
					?? profile.handle
					?? entityId.did
				)}
				{#if profile.handle !== undefined && profile.handle !== heading}
					<span data-text="muted">
						@{profile.handle}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column>
			<ResourceBoundary
				resource={actor}
				placeholderText="Loading profile…"
			>
				{#snippet children(profile)}
					{#if profile.description}
						<p data-text="muted">
							{profile.description}
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div data-text="mono muted">
				{entityId.did}
			</div>
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
				{#snippet children(profile)}
					{#if profile.handle == null && profile.displayName == null && profile.description == null}
						<p data-text="muted">
							No atproto profile data in the app for this DID yet. Try again shortly.
						</p>
					{:else}
						<dl>
							{#if profile.displayName}
								<div>
									<dt>Display name</dt>
									<dd>{profile.displayName}</dd>
								</div>
							{/if}
							{#if profile.handle}
								<div>
									<dt>Handle</dt>
									<dd>{profile.handle}</dd>
								</div>
							{/if}
							{#if profile.description}
								<div>
									<dt>Description</dt>
									<dd>{profile.description}</dd>
								</div>
							{/if}
						</dl>
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
