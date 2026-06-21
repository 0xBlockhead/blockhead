<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(`/url/${encodeURIComponent(selection.entitySelector.url)}`),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Url>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const catalogUrl = $derived(selection(
		({ sources: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			], fields: { catalogName: true, catalogStandard: true, catalogIcon: true } }),
	))

	const metadataUrl = $derived(selection(
		({ sources: [Source.MetadataVision_Rest], fields: { openGraphTitle: true, openGraphDescription: true, publisher: true, $siteIcon: true, $openGraphImage: true } }),
	))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Url}
	entitySelector={selection.entitySelector}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.url}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={catalogUrl}
			placeholderText="Loading URL entity…"
		>
			{#snippet children(url)}
				{url.catalogName ?? selection.entitySelector.url}
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
			<ResourceBoundary resource={metadataUrl}>
				{#snippet children(url)}
					{#if url.openGraphDescription != null}
						<p>
							<TruncatedValue
								value={url.openGraphDescription}
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
					<ResourceBoundary resource={metadataUrl}>
						{#snippet children(url)}
							{#if url.publisher != null}
								{url.publisher}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Catalog standard</dt>
					<dd>
						<ResourceBoundary resource={catalogUrl}>
							{#snippet children(url)}
								{#if url.catalogStandard != null}
									{url.catalogStandard}
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
						<ResourceBoundary resource={metadataUrl}>
							{#snippet children(url)}
								{#if (
									url.$openGraphImage != null
									&& url.$openGraphImage[EntityMetaKey.Selector].url
								)}
									<Media
										alt={url.openGraphTitle ?? ''}
										media={{ url: url.$openGraphImage[EntityMetaKey.Selector].url }}
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
					<ResourceBoundary resource={catalogUrl}>
						{#snippet children(url)}
							<a
								href={selection.entitySelector.url}
								rel="noreferrer"
								target="_blank"
							>
								{selection.entitySelector.url}
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
