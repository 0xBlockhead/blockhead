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
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const post = useEntity(
		EntityType.AtprotoPost,
		entityId,
		{
			$: [Source.Atproto_Xrpc],
			text: {},
			createdAt: {},
			...(open ?
				{
					$author: {},
					$parent: {},
					$root: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost}
	{entityId}
	{href}
	bind:open
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

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={post}
			placeholderText=""
		>
			{#snippet children(resolvedAtprotoPost)}
				{#if resolvedAtprotoPost.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={resolvedAtprotoPost.createdAt}
							format={TimestampFormat.Both}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading lexicon record…"
		>
			{#snippet children(resolvedAtprotoPost)}
				<dl data-column-item="center">
					{#if open}
						{#if resolvedAtprotoPost.$author}
							{@const authorDid = resolvedAtprotoPost.$author[EntityMetaKey.Id].did}
							<div>
								<dt>Author DID</dt>
								<dd>
									<a
										data-link
										href={resolve(
											'/(social)/atproto/actor/[did]',
											{
												did: encodeURIComponent(authorDid),
											},
										)}
									>
										<TruncatedValue
											endLength={12}
											format={TruncatedValueFormat.Visual}
											startLength={20}
											value={authorDid}
										/>
									</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if resolvedAtprotoPost.$parent}
							{@const parentUri = resolvedAtprotoPost.$parent[EntityMetaKey.Id].uri}
							<div>
								<dt>Reply to</dt>
								<dd>
									<a
										data-link
										href={resolve(
											'/(social)/atproto/post/[uri]',
											{
												uri: encodeURIComponent(parentUri),
											},
										)}
									>
										<TruncatedValue
											endLength={12}
											format={TruncatedValueFormat.Visual}
											startLength={20}
											value={parentUri}
										/>
									</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if resolvedAtprotoPost.$root && resolvedAtprotoPost.$root[EntityMetaKey.Id].uri !== resolvedAtprotoPost.$parent?.[EntityMetaKey.Id].uri}
							{@const rootUri = resolvedAtprotoPost.$root[EntityMetaKey.Id].uri}
							<div>
								<dt>Thread root</dt>
								<dd>
									<a
										data-link
										href={resolve(
											'/(social)/atproto/post/[uri]',
											{
												uri: encodeURIComponent(rootUri),
											},
										)}
									>
										<TruncatedValue
											endLength={12}
											format={TruncatedValueFormat.Visual}
											startLength={20}
											value={rootUri}
										/>
									</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if resolvedAtprotoPost.text !== undefined}
							{#if resolvedAtprotoPost.text !== ''}
								<div>
									<dt>AT URI</dt>
									<dd data-text="mono">
										{@render Id()}
									</dd>
								</div>
							{/if}
						{/if}
					{/if}

					{#if open}
						{#if resolvedAtprotoPost.text}
							<div>
								<dt>Record text</dt>
								<dd>{resolvedAtprotoPost.text}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if resolvedAtprotoPost.createdAt != null}
							<div>
								<dt>Indexed at</dt>
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
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="atproto-post-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-record`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 36ch',
				}}
			>
				{#snippet Summary({ open: _lexiconSummary })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
				<HeadingComponent>
					Repository commit & record
				</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Repository metadata"
						href={`#${idKey}:post-repo-record`}
					>Repository metadata</a>
					<a
						data-scroll-marker-label="Lexicon body"
						href={`#${idKey}:post-lexicon-body`}
					>Lexicon body</a>
				{/snippet}

				{#snippet children()}
					<section
						data-scroll-marker-label="Repository metadata"
						id={`${idKey}:post-repo-record`}
					>
						<EntityDetails
							entityType={EntityType.AtprotoPost}
							{entityId}
						/>

						<ResourceBoundary
							resource={post}
							placeholderText="Loading lexicon record…"
						>
							{#snippet children(resolvedAtprotoPost)}
								{@const atprotoRecordNotReady = (
									resolvedAtprotoPost.createdAt == null
									&& (
										resolvedAtprotoPost.text === undefined
										|| resolvedAtprotoPost.text === ''
									)
								)}
								{#if atprotoRecordNotReady}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											Record not ready.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>Text and timestamp appear after this record is read from the author repository.</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="Lexicon record"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
					<section
						data-scroll-marker-label="Lexicon body"
						id={`${idKey}:post-lexicon-body`}
					>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading lexicon record…"
						>
							{#snippet children(resolvedAtprotoPost)}
								{#if resolvedAtprotoPost.text}
									<p>
										{resolvedAtprotoPost.text}
									</p>
								{:else}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											No text yet.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>Post body fills in when the lexicon record syncs from the backing repo.</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="Post text"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

<style>
	.atproto-post-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
