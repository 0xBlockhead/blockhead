<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const media = $derived(selection({
		fields: {
			type: true,
			transport: true,
			hash: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).url) ?? '')].filter(Boolean).join(' ') || 'Media')
	const viewDomId = $derived('media-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Media}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/media/[url]', {
			url: String(({ ...selection.entitySelector, ...prefetched }).url),
		})
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const url0 = ({ ...selection.entitySelector, ...prefetched }).url}
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
		{:else}
			<ResourceBoundary resource={media}>
				{#snippet Pending()}
					{@const url0 = ({ ...selection.entitySelector, ...prefetched }).url}
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
					{@const url0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).url}
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
		{/if}
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
				<dt>Type</dt>
				<dd>
					<ResourceBoundary resource={media}>
						{#snippet Pending()}
							{@const type = prefetched.type ?? selection.entitySelector.type}
							{#if type !== undefined && type !== null}
								{String((type) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const type = entity.type ?? selection.entitySelector.type ?? prefetched.type}
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
					<ResourceBoundary resource={media}>
						{#snippet Pending()}
							{@const transport = prefetched.transport ?? selection.entitySelector.transport}
							{#if transport !== undefined && transport !== null}
								{String((transport) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const transport = entity.transport ?? selection.entitySelector.transport ?? prefetched.transport}
							{#if transport !== undefined && transport !== null}
								{String((transport) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={media}>
				{#snippet Pending()}
					{@const hash = prefetched.hash ?? selection.entitySelector.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String(hash)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const hash = entity.hash ?? selection.entitySelector.hash ?? prefetched.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String(hash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<section data-column="gap-2">
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
					{#if url !== undefined && url !== null && type === 'Video'}
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
					{:else if url !== undefined && url !== null}
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
