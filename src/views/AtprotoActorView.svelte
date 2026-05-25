<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/(social)/(atproto)/atproto/actor/[did]', {
			did: entityId.did,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AtprotoActor>
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

	const idKey = stringify(entityId)

	const actor = useEntity(
		EntityType.AtprotoActor,
		entityId,
		{
			$: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
			displayName: {},
			handle: {},
			$icon: {},
			...(open ?
				{
					description: {},
					followersCount: {},
					followsCount: {},
					postsCount: {},
					indexedAt: {},
				}
			:
				{}),
		},
	)


	// Components
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			AT Protocol profiles are DIDs with Bluesky App View metadata (handle, avatar, counts); the repo record lives behind the DID, not a legacy numeric profile id.
		</p>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(loadedActor)}
				{@const atprotoBrandIconSrc = loadedActor.$icon?.[EntityMetaKey.Id].url}
				{#if atprotoBrandIconSrc}
					<IconComponent
						alt={loadedActor.displayName ?? loadedActor.handle ?? ''}
						shape={IconShape.Circle}
						src={atprotoBrandIconSrc}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading profile…"
		>
			{#snippet children(loadedActor)}
				{loadedActor.displayName
					?? loadedActor.handle
					?? entityId.did}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.did}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(loadedActor)}
				{@const atprotoSummaryHeadingLine = (
					actor.displayName
					?? loadedActor.handle
					?? entityId.did
				)}
				{#if loadedActor.handle && loadedActor.handle !== atprotoSummaryHeadingLine}
					<span data-text="muted">
						@{loadedActor.handle}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Bio</dt>
				<dd>
					<ResourceBoundary
						resource={actor}
						placeholderText="Loading profile…"
					>
						{#snippet children(loadedActor)}
							{#if loadedActor.description}
								{loadedActor.description}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Handle</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedActor)}
								{#if loadedActor.handle}
									{loadedActor.handle}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				contentOpen
				&& actor.followersCount != null
			)}
				<div>
					<dt>Followers</dt>
					<dd>
						<NumberValue
							value={loadedActor.followersCount}
						/>
					</dd>
				</div>
			{/if}

			{#if (
				contentOpen
				&& actor.followsCount != null
			)}
				<div>
					<dt>Following</dt>
					<dd>
						<NumberValue
							value={loadedActor.followsCount}
						/>
					</dd>
				</div>
			{/if}

			{#if (
				contentOpen
				&& actor.postsCount != null
			)}
				<div>
					<dt>Posts</dt>
					<dd>
						<NumberValue
							value={loadedActor.postsCount}
						/>
					</dd>
				</div>
			{/if}

			{#if (
				contentOpen
				&& actor.indexedAt != null
			)}
				<div>
					<dt>Indexed</dt>
					<dd>
						<Timestamp
							timestamp={loadedActor.indexedAt}
						/>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="entity-view-detail-carousels atproto-actor-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-profile`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _profileSummaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Lexicon profile & posts
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Lexicon identity"
						href={`#${idKey}:profile-details`}
					>Lexicon identity</a>
					<a
						data-scroll-marker-label="Posts"
						href={`#${idKey}:activity-posts`}
					>Posts</a>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<section
						data-scroll-marker-label="Lexicon identity"
						id={`${idKey}:profile-details`}
					>
						<EntityDetails
							entityType={EntityType.AtprotoActor}
							{entityId}
						/>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedActor)}
								{@const atprotoProfileUnset = (
									actor.handle == null
									&& actor.displayName == null
									&& actor.description == null
								)}
								{#if atprotoProfileUnset}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											No profile fields yet.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>
													Display name, handle, and description load from the configured ATProto repository when the DID resolves.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="Lexicon profile"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>

					<section
						data-scroll-marker-label="Posts"
						id={`${idKey}:activity-posts`}
					>
						<AtprotoPostsView
							href={resolve(
								'/(social)/(atproto)/atproto/actor/[did]/(actor)/posts',
								{ did: encodeURIComponent(entityId.did) },
							)}
							entityFieldReference={{
								entityType: EntityType.AtprotoActor,
								entityId,
								fieldName: '$$posts',
							}}
							id={`${idKey}:posts`}
							fieldOpen={_open}
							title="Posts"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

