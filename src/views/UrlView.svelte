<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(`/url/${encodeURIComponent(entityId.url)}`),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Url>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const url = useEntity(entityCollectionsContext, EntityType.Url,
		entityId,
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
	{entityId}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.url}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={url}
			placeholderText="Loading URL entity…"
		>
			{#snippet children(url)}
				{url.fields.openGraphTitle ?? url.fields.catalogName ?? entityId.url}
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
									&& url.fields.$openGraphImage[EntityMetaKey.Id].url
								)}
									<Media
										alt={url.fields.openGraphTitle ?? ''}
										media={{ url: url.fields.$openGraphImage[EntityMetaKey.Id].url }}
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
									href={entityId.url}
									rel="noreferrer"
									target="_blank"
								>
									{entityId.url}
								</a>
							{:else}
								{#if url.fields.catalogName != null}
									<a
										href={entityId.url}
										rel="noreferrer"
										target="_blank"
									>
										{entityId.url}
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
