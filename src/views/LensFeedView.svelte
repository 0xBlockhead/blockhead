<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensFeed> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const lensFeed = $derived(selection({
		fields: {
			name: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.name ?? ''), String(pendingEntity.address ?? '')].filter(Boolean).join(' ') || 'Lens feed')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.LensFeed}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensFeed}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), String(pendingEntity.address)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={String(pendingEntity.address)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensFeed}>
			{#snippet children(entity)}
				{@const createdAt0 = entity.createdAt}
				{#if createdAt0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensFeed}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.address)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							owner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const owner = entity.owner}
					{#if owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={String(owner)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lensFeed}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const lensFeedLensPostsViewPostsResource = selection.$$posts}
		<ResourceBoundary
			resource={lensFeedLensPostsViewPostsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensPostsView
						selection={lensFeedLensPostsViewPostsResource}
						countResource={lensFeedLensPostsViewPostsResource.count}
						title='Posts'
						id='posts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
