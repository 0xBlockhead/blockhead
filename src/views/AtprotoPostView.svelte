<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const atprotoPost = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Atproto_Xrpc,
		],
		fields: {
			text: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.text) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.uri) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post')
	const viewDomId = $derived('atproto-post-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.uri !== undefined ? resolve('/atproto/post/[...uri=stringSegment]', {
			uri: String(pendingEntity.uri ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={atprotoPost}>
			{#snippet Pending()}
				{@const text0 = pendingEntity.text}
				{#if text0 !== undefined && text0 !== null}
					<span data-text="long-text">{String((text0) ?? '')}</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const text0 = resolvedEntity.text}
				{#if text0 !== undefined && text0 !== null}
					<span data-text="long-text">{String((text0) ?? '')}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={atprotoPost}>
			{#snippet Pending()}
				{@const createdAt0 = pendingEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>AT URI</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									uri: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const uri = pendingEntity.uri}
							{#if uri !== undefined && uri !== null}
								<TruncatedValue value={String((uri) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const uri = resolvedEntity.uri}
							{#if uri !== undefined && uri !== null}
								<TruncatedValue value={String((uri) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$author}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(atprotoActor)}
						{#if atprotoActor != null && atprotoActor[EntityMetaKey.Selector] != null}
							<div>
								<dt>Author</dt>
								<dd>
									<AtprotoActorView
										selection={select(EntityType.AtprotoActor, atprotoActor[EntityMetaKey.Selector])}
										prefetched={atprotoActor}
										href={
											(atprotoActor[EntityMetaKey.Selector].did !== undefined ? resolve('/atproto/actor/[did=stringSegment]', {
												did: String(atprotoActor[EntityMetaKey.Selector].did ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Value}
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
					resource={selection.$parent}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(atprotoPost)}
						{#if atprotoPost != null && atprotoPost[EntityMetaKey.Selector] != null}
							<div>
								<dt>Reply parent</dt>
								<dd>
									<AtprotoPostView
										selection={select(EntityType.AtprotoPost, atprotoPost[EntityMetaKey.Selector])}
										prefetched={atprotoPost}
										href={
											(atprotoPost[EntityMetaKey.Selector].uri !== undefined ? resolve('/atproto/post/[...uri=stringSegment]', {
												uri: String(atprotoPost[EntityMetaKey.Selector].uri ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Value}
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
					resource={selection.$root}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(atprotoPost)}
						{#if atprotoPost != null && atprotoPost[EntityMetaKey.Selector] != null}
							<div>
								<dt>Thread root</dt>
								<dd>
									<AtprotoPostView
										selection={select(EntityType.AtprotoPost, atprotoPost[EntityMetaKey.Selector])}
										prefetched={atprotoPost}
										href={
											(atprotoPost[EntityMetaKey.Selector].uri !== undefined ? resolve('/atproto/post/[...uri=stringSegment]', {
												uri: String(atprotoPost[EntityMetaKey.Selector].uri ?? ''),
											}) : undefined)
										}
										layout={EntityLayout.Value}
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
					resource={
						selection({
							fields: {
								createdAt: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const createdAt = pendingEntity.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const createdAt = resolvedEntity.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								indexedAt: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const indexedAt = pendingEntity.indexedAt}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const indexedAt = resolvedEntity.indexedAt}
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
				<ResourceBoundary
					resource={
						selection({
							fields: {
								langs: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const langs = pendingEntity.langs}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const langs = resolvedEntity.langs}
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
				<ResourceBoundary
					resource={
						selection({
							fields: {
								selfLabelValues: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const selfLabelValues = pendingEntity.selfLabelValues}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const selfLabelValues = resolvedEntity.selfLabelValues}
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

		<ResourceBoundary
			resource={
				selection({
					fields: {
						text: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const text = resolvedEntity.text}
				{#if text !== undefined && text !== null && text !== ''}
					<p data-text="long-text">{String((text) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AtprotoPostsView
				selection={
						selection.$$thread({
							sources: [
								Source.Atproto_Xrpc,
							],
							count: true,
						})
					}
				title='Thread posts'
				href={resolve('/atproto/posts')}
				id='AtprotoPostsView-thread'
			/>

			<AtprotoPost_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.Atproto_Xrpc,
							],
							count: true,
						})
					}
				title='Metric observations'
				id='AtprotoPost_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
