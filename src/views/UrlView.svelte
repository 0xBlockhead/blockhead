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
	summaryUsesHeading={true}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.url}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
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
			{#if contentOpen}
				<div>
					<dt>Description</dt>
					<dd>
						<ResourceBoundary resource={url}>
							{#snippet children(url)}
								{#if url.openGraphDescription != null}
									{url.openGraphDescription}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

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
					<dt>Explorer standard</dt>
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
					<dt>Preview</dt>
					<dd>
						<ResourceBoundary resource={url}>
							{#snippet children(url)}
								{#if url.$openGraphImage != null}
									{#if url.$openGraphImage[EntityMetaKey.Id].url}
										<Media
											alt={url.openGraphTitle ?? ''}
											media={{ url: url.$openGraphImage[EntityMetaKey.Id].url }}
										/>
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Website</dt>
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

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Url}
			{entityId}
		/>
	{/snippet}
</EntityView>
