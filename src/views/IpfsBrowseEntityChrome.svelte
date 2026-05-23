<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import {
		ipfsResourceCanonicalUri,
		ipfsResourceHref,
	} from '$/lib/ipfs.ts'


	// Props
	let {
		entityId,
		Form,
		open = $bindable(true),
	}: {
		entityId: EntityId<typeof schema, EntityType.IpfsResource>
		Form: Snippet
		open?: boolean
	} = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const ipfs = useEntity(
		EntityType.IpfsResource,
		entityId,
		{
			$: [Source.Ipfs_Rest],
			canonicalUri: {},
			gatewayOrigin: {},
			gatewayUrl: {},
			fileName: {},
			extension: {},
			contentType: {},
			contentLength: {},
			displayType: {},
			isContentTypeInferred: {},
			...(open && {
				text: {},
				cidVersion: {},
				cidMultibase: {},
				cidMulticodecCode: {},
				cidMultihashCode: {},
				cidMultihashDigestHex: {},
				isCidSubdomainSafe: {},
				$media: {},
			}),
		},
	)

	const ipfsChromeKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	layout={EntityLayout.Details}
	entityType={EntityType.IpfsResource}
	{entityId}
	href={ipfsResourceHref(entityId)}
	title={ipfsResourceCanonicalUri(entityId)}
	bind:open
>
	{#snippet Content()}
		<ResourceBoundary
			resource={ipfs}
			placeholderText="Loading IPFS resource (multibase CID, gateway URL)…"
		>
			{#snippet children(ipfs)}
				<dl>
					{#if ipfs.gatewayUrl !== undefined}
						<div>
							<dt>Gateway URL</dt>
							<dd>
								<a
									href={ipfs.gatewayUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue
										value={ipfs.gatewayUrl}
										format={TruncatedValueFormat.Visual}
									/>
								</a>
							</dd>
						</div>
					{/if}

					{#if ipfs.displayType !== undefined}
						<div>
							<dt>Display type</dt>
							<dd>{ipfs.displayType}</dd>
						</div>
					{/if}

					{#if ipfs.contentType !== undefined}
						<div>
							<dt>Content type</dt>
							<dd>
								<TruncatedValue
									value={ipfs.contentType}
									format={TruncatedValueFormat.Visual}
								/>
								{#if ipfs.isContentTypeInferred}
									{' '}
									<span data-text="muted">(inferred)</span>
								{/if}
							</dd>
						</div>
					{/if}

					{#if ipfs.fileName !== undefined}
						<div>
							<dt>File name</dt>
							<dd>
								<TruncatedValue
									value={ipfs.fileName}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}

					{#if ipfs.extension !== undefined}
						<div>
							<dt>Extension</dt>
							<dd>.{ipfs.extension}</dd>
						</div>
					{/if}

					{#if ipfs.contentLength !== undefined}
						<div>
							<dt>Content length</dt>
							<dd>
								<NumberValue
									value={ipfs.contentLength}
									options={{ maximumFractionDigits: 0 }}
								/>
								{' '}
								bytes
							</dd>
						</div>
					{/if}

					{#if open}
						{#if ipfs.cidVersion !== undefined}
							<div>
								<dt>CID version</dt>
								<dd>{String(ipfs.cidVersion)}</dd>
							</div>
						{/if}

						{#if ipfs.cidMultibase !== undefined}
							<div>
								<dt>Multibase</dt>
								<dd>
									<TruncatedValue
										value={ipfs.cidMultibase}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if ipfs.cidMulticodecCode !== undefined}
							<div>
								<dt>Multicodec code</dt>
								<dd>{String(ipfs.cidMulticodecCode)}</dd>
							</div>
						{/if}

						{#if ipfs.cidMultihashCode !== undefined}
							<div>
								<dt>Multihash code</dt>
								<dd>{String(ipfs.cidMultihashCode)}</dd>
							</div>
						{/if}

						{#if ipfs.cidMultihashDigestHex !== undefined}
							<div>
								<dt>Multihash digest</dt>
								<dd>
									<TruncatedValue
										value={ipfs.cidMultihashDigestHex}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if ipfs.isCidSubdomainSafe !== undefined}
							<div>
								<dt>Subdomain-safe</dt>
								<dd>{ipfs.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if ipfs.text !== undefined}
							<div>
								<dt>Text</dt>
								<dd>
									<TruncatedValue
										value={ipfs.text}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if ipfs.$media?.[EntityMetaKey.Id].url !== undefined}
							<div>
								<dt>Media</dt>
								<dd>
									<Media
										media={{ url: ipfs.$media[EntityMetaKey.Id].url }}
										alt={ipfs.fileName ?? ''}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${ipfsChromeKey}:carousel-browser`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Browse
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: markersOpen,
				})}
					<a
						data-scroll-marker-label="CID & path"
						href={`#${ipfsChromeKey}:ipfs-browser-form`}
					>CID & path</a>
					<a
						data-scroll-marker-label="Current resource"
						href={`#${ipfsChromeKey}:ipfs-browser-note`}
					>Current resource</a>
					{#if markersOpen}
						<a
							data-scroll-marker-label="Metadata"
							href={`#${ipfsChromeKey}:ipfs-metadata`}
						>Metadata</a>
						<a
							data-scroll-marker-label="Content"
							href={`#${ipfsChromeKey}:ipfs-content`}
						>Content</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _paneOpen,
				})}
					<section
						class="ipfs-browser"
						data-column
						data-scroll-marker-label="CID & path"
						id={`${ipfsChromeKey}:ipfs-browser-form`}
					>
						{@render Form()}
					</section>

					<section
						class="ipfs-browser-note"
						data-card
						data-column
						data-scroll-marker-label="Current resource"
						id={`${ipfsChromeKey}:ipfs-browser-note`}
					>
						<header data-row="wrap align-center gap-2">
							<h2>Browse IPFS</h2>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										You are looking at one logical content address; the canonical string and the clickable gateway link below both resolve to it.
									</p>
									<p>
										A path narrows inside that root directory when supplied.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="Canonical URL and gateway"
								>ⓘ</abbr>
							</Tooltip>
						</header>

						<p>
							<code>
								<TruncatedValue
									value={ipfsResourceCanonicalUri(entityId)}
									format={TruncatedValueFormat.Visual}
								/>
							</code>
						</p>
					</section>

					<section
						data-card
						data-column
						data-scroll-marker-label="Metadata"
						id={`${ipfsChromeKey}:ipfs-metadata`}
					>
						<header data-row="wrap align-center gap-2">
							<h2>Metadata</h2>
						</header>

						<ResourceBoundary
							resource={ipfs}
							placeholderText="Loading metadata…"
						>
							{#snippet children(ipfs)}
								<dl>
									{#if ipfs.canonicalUri !== undefined}
										<div>
											<dt>Canonical URI</dt>
											<dd>
												<TruncatedValue
													value={ipfs.canonicalUri}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if ipfs.gatewayOrigin !== undefined}
										<div>
											<dt>Gateway origin</dt>
											<dd>
												<TruncatedValue
													value={ipfs.gatewayOrigin}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if ipfs.cidVersion !== undefined}
										<div>
											<dt>CID version</dt>
											<dd>{String(ipfs.cidVersion)}</dd>
										</div>
									{/if}

									{#if ipfs.cidMultibase !== undefined}
										<div>
											<dt>Multibase</dt>
											<dd>
												<TruncatedValue
													value={ipfs.cidMultibase}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if ipfs.cidMulticodecCode !== undefined}
										<div>
											<dt>Multicodec code</dt>
											<dd>{String(ipfs.cidMulticodecCode)}</dd>
										</div>
									{/if}

									{#if ipfs.cidMultihashCode !== undefined}
										<div>
											<dt>Multihash code</dt>
											<dd>{String(ipfs.cidMultihashCode)}</dd>
										</div>
									{/if}

									{#if ipfs.cidMultihashDigestHex !== undefined}
										<div>
											<dt>Multihash digest</dt>
											<dd>
												<TruncatedValue
													value={ipfs.cidMultihashDigestHex}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if ipfs.isCidSubdomainSafe !== undefined}
										<div>
											<dt>Subdomain-safe</dt>
											<dd>{ipfs.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
										</div>
									{/if}

									{#if ipfs.contentLength !== undefined}
										<div>
											<dt>Content length</dt>
											<dd>
												<NumberValue
													value={ipfs.contentLength}
													options={{ maximumFractionDigits: 0 }}
												/>
												{' '}
												bytes
											</dd>
										</div>
									{/if}

									{#if ipfs.fileName !== undefined}
										<div>
											<dt>File name</dt>
											<dd>
												<TruncatedValue
													value={ipfs.fileName}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if ipfs.extension !== undefined}
										<div>
											<dt>Extension</dt>
											<dd>.{ipfs.extension}</dd>
										</div>
									{/if}

									{#if ipfs.contentType !== undefined}
										<div>
											<dt>Content type</dt>
											<dd>
												<TruncatedValue
													value={ipfs.contentType}
													format={TruncatedValueFormat.Visual}
												/>
												{#if ipfs.isContentTypeInferred}
													{' '}
													<span data-text="muted">(inferred)</span>
												{/if}
											</dd>
										</div>
									{/if}

									{#if ipfs.displayType !== undefined}
										<div>
											<dt>Display type</dt>
											<dd>{ipfs.displayType}</dd>
										</div>
									{/if}
								</dl>
							{/snippet}
						</ResourceBoundary>
					</section>

					<section
						data-card
						data-column
						data-scroll-marker-label="Content"
						id={`${ipfsChromeKey}:ipfs-content`}
					>
						<header data-row="wrap align-center gap-2">
							<h2>Content</h2>
						</header>

						<ResourceBoundary
							resource={ipfs}
							placeholderText="Loading content…"
						>
							{#snippet children(ipfs)}
								{#if ipfs.text !== undefined}
									<pre>{ipfs.text}</pre>
								{:else}
									<p data-text="muted">No text content available.</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

