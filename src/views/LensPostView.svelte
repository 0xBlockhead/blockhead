<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
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
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.LensPost>
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


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const lensPost = useEntity(
		EntityType.LensPost,
		entityId,
		{
			$: [Source.Lens_Graphql],
			text: {},
			timestamp: {},
			$author: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			placeholderText="Loading Lens v3 publication…"
			resource={lensPost}
		>
			{#snippet children(lensPost)}
				<TruncatedValue
					format={TruncatedValueFormat.Visual}
					startLength={42}
					endLength={14}
					value={(
						lensPost.text
							? lensPost.text
						:
							entityId.id
					)}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading Lens v3 publication…"
			resource={lensPost}
		>
			{#snippet children(lensPost)}
				<div data-column>
					{#if lensPost.text}
						<p>
							<TruncatedValue
								value={lensPost.text}
								format={TruncatedValueFormat.Visual}
								startLength={64}
								endLength={24}
							/>
						</p>
					{/if}
					<dl data-column-item="center">
						{#if lensPost.$author}
							<div>
								<dt>Author (Lens v3 profile)</dt>
								<dd>
									<LensAccountView
										entityId={lensPost.$author[EntityMetaKey.Id]}
										href={resolve('/(social)/lens/account/[address]', {
											address: lensPost.$author[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if lensPost.timestamp != null}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={lensPost.timestamp}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
						<div>
							<dt>Publication id (Lens v3 on-chain)</dt>
							<dd data-text="mono">
								{entityId.id}
							</dd>
						</div>
					</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const postDetailKey = stringify(entityId)}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${postDetailKey}:carousel-lens-post`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Lens v3 publication
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#${postDetailKey}:lens-post-record`}
					>Record</a>
					{#if children}
						<a
							data-scroll-marker-label="More"
							href={`#${postDetailKey}:lens-post-more`}
						>More</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Record"
						id={`${postDetailKey}:lens-post-record`}
					>
						<EntityDetails
							entityType={EntityType.LensPost}
							{entityId}
						/>
					</section>
					{#if children}
						<section
							data-scroll-marker-label="More"
							id={`${postDetailKey}:lens-post-more`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
