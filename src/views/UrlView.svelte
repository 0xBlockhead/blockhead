<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
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

	const url = useEntity(
		EntityType.Url,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.MetadataVision_Rest,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
				Source.Lifi_Rest,
			],
			catalogName: {},
			catalogStandard: {},
			catalogIcon: {},
			openGraphTitle: {},
			openGraphDescription: {},
			publisher: {},
			$siteIcon: {},
			$openGraphImage: {},
		},
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
				{url.openGraphTitle ?? url.catalogName ?? entityId.url}
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
					<ResourceBoundary resource={url}>
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
						<ResourceBoundary resource={url}>
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
						<ResourceBoundary resource={url}>
							{#snippet children(url)}
								{#if (
									url.$openGraphImage != null
									&& url.$openGraphImage[EntityMetaKey.Id].url
								)}
									<Media
										alt={url.openGraphTitle ?? ''}
										media={{ url: url.$openGraphImage[EntityMetaKey.Id].url }}
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
							{#if url.openGraphTitle != null}
								<a
									href={entityId.url}
									rel="noreferrer"
									target="_blank"
								>
									{entityId.url}
								</a>
							{:else}
								{#if url.catalogName != null}
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
