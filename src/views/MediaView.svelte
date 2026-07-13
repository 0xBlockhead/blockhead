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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Media>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Media>>
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
	const media = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.url) ?? '')].filter(Boolean).join(' ') || 'Media')
	const viewDomId = $derived('media-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Media}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.url !== undefined ? resolve('/media/[url=absoluteUrl]', {
			url: String(pendingEntity.url ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={media}>
			{#snippet Pending()}
				{@const url = prefetched.url ?? selection.entitySelector.url}
				{#if url !== undefined && url !== null}
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
				{#if url !== undefined && url !== null && type === 'Image'}
					<img
						src={String(url)}
						alt=""
						width={20}
						height={20}
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{:else if url !== undefined && url !== null && type === 'Video'}
					<video
						src={String(url)}
						width={20}
						height={20}
						preload="metadata"
						muted
					></video>
				{:else if url !== undefined && url !== null && type === 'Audio'}
					<audio
						src={String(url)}
						preload="metadata"
					></audio>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={media}>
			{#snippet Pending()}
				{@const url0 = pendingEntity.url}
				{#if url0 !== undefined && url0 !== null}
					<svelte:element
						this={'a'}
						href={String(url0)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(url0)} />
					</svelte:element>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const url0 = resolvedEntity.url}
				{#if url0 !== undefined && url0 !== null}
					<svelte:element
						this={'a'}
						href={String(url0)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(url0)} />
					</svelte:element>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={media}>
			{#snippet Pending()}
				{@const url = prefetched.url ?? selection.entitySelector.url}
				{#if url !== undefined && url !== null}
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
				{#if url !== undefined && url !== null && type === 'Image'}
					<img
						src={String(url)}
						alt=""
						loading="lazy"
						decoding="async"
						referrerpolicy="no-referrer"
					/>
				{:else if url !== undefined && url !== null && type === 'Video'}
					<!-- svelte-ignore a11y_media_has_caption -->
					<video
						src={String(url)}
						controls
						preload="metadata"
					></video>
				{:else if url !== undefined && url !== null && type === 'Audio'}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									url: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const url = pendingEntity.url}
							{#if url !== undefined && url !== null}
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const url = resolvedEntity.url}
							{#if url !== undefined && url !== null}
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
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
						{#snippet Pending()}
							{@const type = pendingEntity.type}
							{#if type !== undefined && type !== null}
								{String((type) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const type = resolvedEntity.type}
							{#if type !== undefined && type !== null}
								{String((type) ?? '')}
							{/if}
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
						{#snippet Pending()}
							{@const transport = pendingEntity.transport}
							{#if transport !== undefined && transport !== null}
								{String((transport) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transport = resolvedEntity.transport}
							{#if transport !== undefined && transport !== null}
								{String((transport) ?? '')}
							{/if}
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
				{#snippet Pending()}
					{@const hash = pendingEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash = resolvedEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
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
