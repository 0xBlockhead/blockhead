<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>DID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources ?? [
									Source.Atproto_Xrpc,
								],
							})({
								fields: {
									did: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.did} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const postsResource = selection.$$posts}
		<ResourceBoundary
			resource={postsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AtprotoPostsView
						selection={postsResource}
						countResource={postsResource.count}
						title='Posts'
						href={
							'did' in selection.entitySelector ?
								resolve(
									'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/posts',
									{
										did: encodeURIComponent(selection.entitySelector.did),
									}
								)
							:
								undefined
						}
						id='posts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AtprotoActor_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Metric observations'
						href={
							'did' in selection.entitySelector ?
								resolve(
									'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations',
									{
										did: encodeURIComponent(selection.entitySelector.did),
									}
								)
							:
								undefined
						}
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
