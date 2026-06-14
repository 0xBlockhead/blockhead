<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(`/url/${encodeURIComponent(selector.url)}`),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Url>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const url = subscribe(EntityType.Url,
		selector,
		({ sources: [
				Source.Constants_Internal,
				Source.MetadataVision_Rest,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			], fields: { catalogName: true, catalogStandard: true, catalogIcon: true, openGraphTitle: true, openGraphDescription: true, publisher: true, $siteIcon: true, $openGraphImage: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Url}
	entitySelector={selector}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selector.url}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={url}
			placeholderText="Loading URL entity…"
		>
			{#snippet children(url)}
				{url.fields.openGraphTitle ?? url.fields.catalogName ?? selector.url}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Ordinary HTTPS links with page metadata (title, preview) when available.
		</p>
		<p>
			Different from Swarm or IPFS roots, token pool contracts, event logs, or social posts.
		</p>
	{/snippet}

	{#snippet Content({
		open: contentOpen,
	})}
		{#if contentOpen}
			<ResourceBoundary resource={url}>
				{#snippet children(url)}
					{#if url.fields.openGraphDescription != null}
						<p>
							<TruncatedValue
								value={url.fields.openGraphDescription}
								format={TruncatedValueFormat.Visual}
							/>
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}

		<dl data-column-item="center">
			<div>
				<dt>Publisher</dt>
				<dd>
					<ResourceBoundary resource={url}>
						{#snippet children(url)}
							{#if url.fields.publisher != null}
								{url.fields.publisher}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Catalog standard</dt>
					<dd>
						<ResourceBoundary resource={url}>
							{#snippet children(url)}
								{#if url.fields.catalogStandard != null}
									{url.fields.catalogStandard}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Open Graph image</dt>
					<dd>
						<ResourceBoundary resource={url}>
							{#snippet children(url)}
								{#if (
									url.fields.$openGraphImage != null
									&& url.fields.$openGraphImage[EntityMetaKey.Selector].url
								)}
									<Media
										alt={url.fields.openGraphTitle ?? ''}
										media={{ url: url.fields.$openGraphImage[EntityMetaKey.Selector].url }}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>URL</dt>
				<dd>
					<ResourceBoundary resource={url}>
						{#snippet children(url)}
							{#if url.fields.openGraphTitle != null}
								<a
									href={selector.url}
									rel="noreferrer"
									target="_blank"
								>
									{selector.url}
								</a>
							{:else}
								{#if url.fields.catalogName != null}
									<a
										href={selector.url}
										rel="noreferrer"
										target="_blank"
									>
										{selector.url}
									</a>
								{/if}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
