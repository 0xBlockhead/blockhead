<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.Media> = $props()

	const media = $derived(selection)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Media}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.url || 'Media')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/media/[url=absoluteUrl]',
				{
					url: encodeURIComponent(selection.entitySelector.url),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={media}>
			{#snippet Pending()}
				{@const url = prefetched.url ?? selection.entitySelector.url}
				{#if url != null}
					<img
						src={url}
						alt=""
						width={20}
						height={20}
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const url = entity.url ?? selection.entitySelector.url ?? prefetched.url}
				{@const type = entity.type ?? ''}
				{#if url != null && type === 'Image'}
					<img
						src={url}
						alt=""
						width={20}
						height={20}
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{:else if url != null && type === 'Video'}
					<video
						src={url}
						width={20}
						height={20}
						preload="metadata"
						muted
					></video>
				{:else if url != null && type === 'Audio'}
					<audio
						src={url}
						preload="metadata"
					></audio>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<a
			href={selection.entitySelector.url}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={selection.entitySelector.url} />
		</a>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={media}>
			{#snippet Pending()}
				{@const url = prefetched.url ?? selection.entitySelector.url}
				{#if url != null}
					<img
						src={url}
						alt=""
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const url = entity.url ?? selection.entitySelector.url ?? prefetched.url}
				{@const type = entity.type ?? ''}
				{#if url != null && type === 'Image'}
					<img
						src={url}
						alt=""
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{:else if url != null && type === 'Video'}
					<!-- svelte-ignore a11y_media_has_caption -->
					<video
						src={url}
						controls
						preload="metadata"
					></video>
				{:else if url != null && type === 'Audio'}
					<audio
						src={url}
						controls
						preload="metadata"
					></audio>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>URL</dt>
				<dd>
					<a
						href={selection.entitySelector.url}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.url} />
					</a>
				</dd>
			</div>

			<div>
				<dt>Type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									type: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.type}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transport</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transport: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.transport}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hash = entity.hash}
					{#if hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={hash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<section data-column="gap-2">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							type: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const url = selection.entitySelector.url}
					{#if entity.type === 'Video'}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video
							src={url}
							controls
							preload="metadata"
						></video>
					{:else if entity.type === 'Audio'}
						<audio
							src={url}
							controls
							preload="metadata"
						></audio>
					{:else}
						<img
							src={url}
							alt=""
							loading="lazy"
							decoding="async"
							referrerpolicy="no-referrer"
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
