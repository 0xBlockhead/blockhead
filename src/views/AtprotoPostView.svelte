<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoPost>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AtprotoPost>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const atprotoPost = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Atproto_Xrpc,
		],
		fields: {
			text: true,
			createdAt: true,
			indexedAt: true,
			langs: true,
			selfLabelValues: true,
			...(open && {
				$author: true,
				$parent: true,
				$root: true,
				$$thread: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).text) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.uri) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post')
	const viewDomId = $derived('atproto-post-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import AtprotoPost_TimestampsView from '$/views/AtprotoPost_TimestampsView.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const text0 = ({ ...selection.entitySelector, ...prefetched }).text}
			{#if text0 !== undefined && text0 !== null}
				<span data-text="long-text">{String((text0) ?? '')}</span>
			{/if}
		{:else}
			<ResourceBoundary resource={atprotoPost}>
				{#snippet Pending()}
					{@const text0 = ({ ...selection.entitySelector, ...prefetched }).text}
					{#if text0 !== undefined && text0 !== null}
						<span data-text="long-text">{String((text0) ?? '')}</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const text0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).text}
					{#if text0 !== undefined && text0 !== null}
						<span data-text="long-text">{String((text0) ?? '')}</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = prefetched.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={atprotoPost}>
				{#snippet Pending()}
					{@const createdAt0 = prefetched.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = entity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.AtprotoActor, false>('$author')}
				>
					{#snippet children(atprotoActor)}
						{#if atprotoActor != null}
							<div>
								<dt>Author</dt>
								<dd>
									<AtprotoActorView
										selection={select(EntityType.AtprotoActor, atprotoActor.entitySelector)}
										prefetched={atprotoActor}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.AtprotoPost, false>('$parent')}
				>
					{#snippet children(atprotoPost)}
						{#if atprotoPost != null}
							<div>
								<dt>Reply parent</dt>
								<dd>
									<AtprotoPostView
										selection={select(EntityType.AtprotoPost, atprotoPost.entitySelector)}
										prefetched={atprotoPost}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.AtprotoPost, false>('$root')}
				>
					{#snippet children(atprotoPost)}
						{#if atprotoPost != null}
							<div>
								<dt>Thread root</dt>
								<dd>
									<AtprotoPostView
										selection={select(EntityType.AtprotoPost, atprotoPost.entitySelector)}
										prefetched={atprotoPost}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={atprotoPost}>
					{#snippet Pending()}
						{@const indexedAt = prefetched.indexedAt ?? selection.entitySelector.indexedAt}
						{#if indexedAt !== undefined && indexedAt !== null}
							<div>
								<dt>Indexed</dt>
								<dd>
									<Timestamp timestamp={Number(indexedAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const indexedAt = entity.indexedAt ?? selection.entitySelector.indexedAt ?? prefetched.indexedAt}
						{#if indexedAt !== undefined && indexedAt !== null}
							<div>
								<dt>Indexed</dt>
								<dd>
									<Timestamp timestamp={Number(indexedAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={atprotoPost}>
					{#snippet Pending()}
						{@const langs = prefetched.langs ?? selection.entitySelector.langs}
						{#if langs !== undefined && langs !== null}
							<div>
								<dt>Languages</dt>
								<dd>
									{langs == null ? '' : String(((langs).join(', ')) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const langs = entity.langs ?? selection.entitySelector.langs ?? prefetched.langs}
						{#if langs !== undefined && langs !== null}
							<div>
								<dt>Languages</dt>
								<dd>
									{langs == null ? '' : String(((langs).join(', ')) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={atprotoPost}>
					{#snippet Pending()}
						{@const selfLabelValues = prefetched.selfLabelValues ?? selection.entitySelector.selfLabelValues}
						{#if selfLabelValues !== undefined && selfLabelValues !== null}
							<div>
								<dt>Self labels</dt>
								<dd>
									{selfLabelValues == null ? '' : String(((selfLabelValues).join(', ')) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const selfLabelValues = entity.selfLabelValues ?? selection.entitySelector.selfLabelValues ?? prefetched.selfLabelValues}
						{#if selfLabelValues !== undefined && selfLabelValues !== null}
							<div>
								<dt>Self labels</dt>
								<dd>
									{selfLabelValues == null ? '' : String(((selfLabelValues).join(', ')) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AtprotoPostsView
				selection={selection[EntityProxyField]<EntityType.AtprotoPost>('$$thread')}
				title='Thread posts'
				href={resolve('/(social)/(atproto)/atproto/posts')}
				id='AtprotoPostsView-$$thread'
			/>

			<AtprotoPost_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AtprotoPost_Timestamp>('$$timestamps')}
				title='Metric observations'
				id='AtprotoPost_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
