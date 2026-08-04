<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensFeed> = $props()

	const lensFeed = $derived(selection({
		fields: {
			name: true,
			createdAt: true,
			owner: true,
			description: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), selection.entitySelector.address].filter(Boolean).join(' ') || 'Lens feed')


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
	href={
		href === undefined ?
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/feed/[address=evmAddress]',
				{
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensFeed}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), selection.entitySelector.address].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensFeed}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={lensFeed}
		>
			{#snippet children(entity)}
				<dl data-column-item="center">
					{#if entity.name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{entity.name}
							</dd>
						</div>
					{/if}

					<div>
						<dt>Address</dt>
						<dd>
							<TruncatedValue value={selection.entitySelector.address} />
						</dd>
					</div>

					{#if entity.owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={entity.owner} />
							</dd>
						</div>
					{/if}

					{#if entity.createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={entity.createdAt} />
							</dd>
						</div>
					{/if}
				</dl>

				{#if entity.description != null && entity.description !== ''}
					<p data-text="long-text">{entity.description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const postsResource = selection.$$posts}
		<LensPostsView
			selection={postsResource}
			countResource={postsResource.count}
			title='Posts'
			emptyText='No Lens posts for this feed.'
			id='posts'
		/>
	{/snippet}
</EntityView>
