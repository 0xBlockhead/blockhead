<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { MediaTransport, MediaType } from '$/schema/Media.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const media = $derived(selection)
	const titleFallback = $derived(String(pendingEntity.url ?? '') || 'Media')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Media}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/media/[url=absoluteUrl]',
			{
				url: encodeURIComponent(String(selection.entitySelector.url)),
			}
		)
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
						src={String(url)}
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
				{@const type = String(entity.type ?? '')}
				{#if url != null && type === 'Image'}
					<img
						src={String(url)}
						alt=""
						width={20}
						height={20}
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{:else if url != null && type === 'Video'}
					<video
						src={String(url)}
						width={20}
						height={20}
						preload="metadata"
						muted
					></video>
				{:else if url != null && type === 'Audio'}
					<audio
						src={String(url)}
						preload="metadata"
					></audio>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<a
			href={String(pendingEntity.url)}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={String(pendingEntity.url)} />
		</a>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={media}>
			{#snippet Pending()}
				{@const url = prefetched.url ?? selection.entitySelector.url}
				{#if url != null}
					<img
						src={String(url)}
						alt=""
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const url = entity.url ?? selection.entitySelector.url ?? prefetched.url}
				{@const type = String(entity.type ?? '')}
				{#if url != null && type === 'Image'}
					<img
						src={String(url)}
						alt=""
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{:else if url != null && type === 'Video'}
					<!-- svelte-ignore a11y_media_has_caption -->
					<video
						src={String(url)}
						controls
						preload="metadata"
					></video>
				{:else if url != null && type === 'Audio'}
					<audio
						src={String(url)}
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
						href={String(pendingEntity.url)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.url)} />
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
							src={String(url)}
							controls
							preload="metadata"
						></video>
					{:else if entity.type === 'Audio'}
						<audio
							src={String(url)}
							controls
							preload="metadata"
						></audio>
					{:else}
						<img
							src={String(url)}
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
