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
			...(open ?
				{
					description: {},
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
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
			placeholderText=""
		>
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
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading profile…"
		>
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
			placeholderText=""
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
								<dt>Federation handle</dt>
								<dd>{atprotoProfileRow.handle}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if atprotoProfileRow.description}
							<div>
								<dt>Bio</dt>
								<dd>{atprotoProfileRow.description}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="atproto-actor-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-profile`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 36ch',
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

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Lexicon identity"
						href={`#${idKey}:profile-details`}
					>Lexicon identity</a>
					<a
						data-scroll-marker-label="Posts"
						href={`#${idKey}:activity-posts`}
					>Posts</a>
				{/snippet}

				{#snippet children(_profileCarouselContext)}
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
							{#snippet children(atprotoProfileRow)}
								{@const atprotoProfileUnset = (
									atprotoProfileRow.handle == null
									&& atprotoProfileRow.displayName == null
									&& atprotoProfileRow.description == null
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
							entityFieldReference={{
								entityType: EntityType.AtprotoActor,
								entityId,
								fieldName: '$$posts',
							}}
							href={resolve('/(social)/atproto/actor/[did]/(actor)/posts', {
								did: encodeURIComponent(entityId.did),
							})}
							id={`${idKey}:posts`}
							fieldOpen={_open}
							open={false}
							title="Posts"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.atproto-actor-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
