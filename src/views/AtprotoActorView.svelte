<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AtprotoActor>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AtprotoActor>
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
	const atprotoActor = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.did) ?? '')].filter(Boolean).join(' ') || 'AT Protocol account')
	const viewDomId = $derived('atproto-actor-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import AtprotoActor_TimestampsView from '$/views/AtprotoActor_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'did' in selection.entitySelector
			&& selection.entitySelector.did != null ?
				resolve('/atproto/actor/[did=stringSegment]', {
			did: encodeURIComponent(String(selection.entitySelector.did ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={
				selection.$$timestamps({
					sources: [
						Source.Atproto_Xrpc,
					],
					fields: {
						displayName: true,
						handle: true,
						timestampMs: true,
						source: true,
					},
					limit: 1,
					orderBy: [
						[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
					],
				})
			}
		>
			{#snippet Pending()}
				<TruncatedValue value={String(pendingEntity.did ?? '')} />
			{/snippet}

			{#snippet children(observations)}
				{@const observation = observations.values[0]}
				{#if observation?.displayName}
					{String(observation.displayName)}
				{:else if observation?.handle}
					@{String(observation.handle)}
				{:else}
					<TruncatedValue value={String(pendingEntity.did ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>DID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									did: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const did = resolvedEntity.did}
							{#if did !== undefined && did !== null}
								<TruncatedValue value={String((did) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const atprotoActorAtprotoPostsViewPostsResource = selection
		.$$posts({
			sources: [
				Source.Atproto_Xrpc,
			],
		})}
				<ResourceBoundary
					resource={atprotoActorAtprotoPostsViewPostsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<ResourceBoundary
							resource={
									selection({
										fields: {
											did: true,
										},
									})
								}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								<AtprotoPostsView
									selection={atprotoActorAtprotoPostsViewPostsResource}
									countResource={atprotoActorAtprotoPostsViewPostsResource.count}
									title='Posts'
									href={
											(entity != null && 'did' in entity && entity.did != null ? resolve('/atproto/actor/[did=stringSegment]/posts', {
												did: encodeURIComponent(String(entity.did ?? '')),
											}) : undefined)
										}
									id='AtprotoPostsView-posts'
								/>
							{/snippet}
						</ResourceBoundary>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const atprotoActorAtprotoActorTimestampsViewTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Atproto_Xrpc,
			],
		})}
				<ResourceBoundary
					resource={atprotoActorAtprotoActorTimestampsViewTimestampsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<ResourceBoundary
							resource={
									selection({
										fields: {
											did: true,
										},
									})
								}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								<AtprotoActor_TimestampsView
									selection={atprotoActorAtprotoActorTimestampsViewTimestampsResource}
									countResource={atprotoActorAtprotoActorTimestampsViewTimestampsResource.count}
									title='Metric observations'
									href={
											(entity != null && 'did' in entity && entity.did != null ? resolve('/atproto/actor/[did=stringSegment]/observations', {
												did: encodeURIComponent(String(entity.did ?? '')),
											}) : undefined)
										}
									id='AtprotoActor_TimestampsView-timestamps'
								/>
							{/snippet}
						</ResourceBoundary>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
