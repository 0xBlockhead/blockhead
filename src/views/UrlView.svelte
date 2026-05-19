<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		entityId,
		href = entityId.url,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Url>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
			| 'Icon'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.Url}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.url}
		</span>
	{/snippet}

	{#snippet Heading()}
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

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={url}>
				{#snippet children(url)}
					{#if contentOpen}
						{#if url.openGraphDescription != null}
							<div>
								<dt>Description</dt>
								<dd>{url.openGraphDescription}</dd>
							</div>
						{/if}
					{/if}

					{#if url.publisher != null}
						<div>
							<dt>Publisher</dt>
							<dd>{url.publisher}</dd>
						</div>
					{/if}

					{#if contentOpen}
						{#if url.catalogStandard != null}
							<div>
								<dt>Explorer standard</dt>
								<dd>{url.catalogStandard}</dd>
							</div>
						{/if}
					{/if}

					{#if contentOpen}
						{#if url.$openGraphImage != null}
							{#if url.$openGraphImage[EntityMetaKey.Id].url}
								<div>
									<dt>Preview</dt>
									<dd>
										<Media
											alt={url.openGraphTitle ?? ''}
											media={{ url: url.$openGraphImage[EntityMetaKey.Id].url }}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}

					{#if url.openGraphTitle != null}
						<div>
							<dt>Website</dt>
							<dd>
								<a
									href={entityId.url}
									rel="noreferrer"
									target="_blank"
								>
									{entityId.url}
								</a>
							</dd>
						</div>
					{:else}
						{#if url.catalogName != null}
							<div>
								<dt>Website</dt>
								<dd>
									<a
										href={entityId.url}
										rel="noreferrer"
										target="_blank"
									>
										{entityId.url}
									</a>
								</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Url}
			{entityId}
		/>
	{/snippet}
</EntityView>
