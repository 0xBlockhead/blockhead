<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.AtprotoActor> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const atprotoActor = $derived(selection({
		sources: selection.sources ?? [
			Source.Atproto_Xrpc,
		],
	})({
		fields: {
			did: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import AtprotoActor_TimestampsView from '$/views/AtprotoActor_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor}
	entitySelector={selection.entitySelector}
	title={title ?? ((prefetched.did ?? '') || 'AT Protocol account')}
	href={
		href === undefined ?
			(
				'did' in selection.entitySelector ?
					resolve(
						'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
						{
							did: encodeURIComponent(selection.entitySelector.did),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
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
				<TruncatedValue value={pendingEntity.did ?? ''} />
			{/snippet}

			{#snippet children(observations)}
				{@const observation = observations.values[0]}
				{#if observation?.displayName}
					{observation.displayName}
				{:else if observation?.handle}
					@{observation.handle}
				{:else}
					<TruncatedValue value={pendingEntity.did ?? ''} />
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
						resource={atprotoActor}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.did} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const postsResource = selection.$$posts}
		<ResourceBoundary
			resource={postsResource}
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
							<AtprotoPostsView
								selection={postsResource}
								countResource={postsResource.count}
								title='Posts'
								href={
									entity.did != null ? resolve(
										'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/posts',
										{
											did: encodeURIComponent(entity.did),
										}
									) : undefined
								}
								id='posts'
							/>
						{/snippet}
					</ResourceBoundary>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
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
							<AtprotoActor_TimestampsView
								selection={timestampsResource}
								countResource={timestampsResource.count}
								title='Metric observations'
								href={
									entity.did != null ? resolve(
										'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations',
										{
											did: encodeURIComponent(entity.did),
										}
									) : undefined
								}
								id='timestamps'
							/>
						{/snippet}
					</ResourceBoundary>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
