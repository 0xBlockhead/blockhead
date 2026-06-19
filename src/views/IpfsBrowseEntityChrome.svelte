<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		Form,
		open = $bindable(true),
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.IpfsResource>
		Form: Snippet
		open?: boolean
	} = $props()


	import {
		ipfsResourceCanonicalUri,
		ipfsResourceHref,
	} from '$/lib/ipfs.ts'

	import { select } from '$/routes/+layout.svelte'

	const ipfs = $derived(selection( { sources: [Source.Ipfs_Rest], fields: { canonicalUri: true, gatewayOrigin: true, gatewayUrl: true, fileName: true, extension: true, contentType: true, contentLength: true, displayType: true, isContentTypeInferred: true, ...(open && ({ text: true, cidVersion: true, cidMultibase: true, cidMulticodecCode: true, cidMultihashCode: true, cidMultihashDigestHex: true, isCidSubdomainSafe: true, $media: true })) } }))


	// (Derived)
	const ipfsChromeKey = $derived(
		stringify(selection.entitySelector),
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
	layout={EntityLayout.SummaryDetails}
	entityType={EntityType.IpfsResource}
	entitySelector={selection.entitySelector}
	title={ipfsResourceCanonicalUri(selection.entitySelector)}
	bind:open
>
	{#snippet Content()}
		<ResourceBoundary
			resource={ipfs}
			placeholderText="Loading IPFS resource (multibase CID, gateway URL)…"
		>
			{#snippet children(ipfs)}
				{#if (
					open
					&& ipfs.fields.text !== undefined
				)}
					<p>
						<TruncatedValue
							value={ipfs.fields.text}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl>
					{#if ipfs.fields.gatewayUrl !== undefined}
						<div>
							<dt>Gateway URL</dt>
							<dd>
								<a
									href={ipfs.fields.gatewayUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue
										value={ipfs.fields.gatewayUrl}
										format={TruncatedValueFormat.Visual}
									/>
								</a>
							</dd>
						</div>
					{/if}

					{#if ipfs.fields.displayType !== undefined}
						<div>
							<dt>Display type</dt>
							<dd>{ipfs.fields.displayType}</dd>
						</div>
					{/if}

					{#if ipfs.fields.contentType !== undefined}
						<div>
							<dt>Content type</dt>
							<dd>
								<TruncatedValue
									value={ipfs.fields.contentType}
									format={TruncatedValueFormat.Visual}
								/>
								{#if ipfs.fields.isContentTypeInferred}
									{' '}
									<span data-text="muted">(inferred)</span>
								{/if}
							</dd>
						</div>
					{/if}

					{#if ipfs.fields.fileName !== undefined}
						<div>
							<dt>File name</dt>
							<dd>
								<TruncatedValue
									value={ipfs.fields.fileName}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}

					{#if ipfs.fields.extension !== undefined}
						<div>
							<dt>Extension</dt>
							<dd>.{ipfs.fields.extension}</dd>
						</div>
					{/if}

					{#if ipfs.fields.contentLength !== undefined}
						<div>
							<dt>Content length</dt>
							<dd>
								<NumberValue
									value={ipfs.fields.contentLength}
									options={{ maximumFractionDigits: 0 }}
								/>
								{' '}
								bytes
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& ipfs.fields.cidVersion !== undefined
					)}
						<div>
							<dt>CID version</dt>
							<dd>{String(ipfs.fields.cidVersion)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& ipfs.fields.cidMultibase !== undefined
					)}
						<div>
							<dt>Multibase</dt>
							<dd>
								<TruncatedValue
									value={ipfs.fields.cidMultibase}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& ipfs.fields.cidMulticodecCode !== undefined
					)}
						<div>
							<dt>Multicodec code</dt>
							<dd>{String(ipfs.fields.cidMulticodecCode)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& ipfs.fields.cidMultihashCode !== undefined
					)}
						<div>
							<dt>Multihash code</dt>
							<dd>{String(ipfs.fields.cidMultihashCode)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& ipfs.fields.cidMultihashDigestHex !== undefined
					)}
						<div>
							<dt>Multihash digest</dt>
							<dd>
								<TruncatedValue
									value={ipfs.fields.cidMultihashDigestHex}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& ipfs.fields.isCidSubdomainSafe !== undefined
					)}
						<div>
							<dt>Subdomain-safe</dt>
							<dd>{ipfs.fields.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
					{#if (
						open
						&& ipfs.fields.$media?.[EntityMetaKey.Selector].url !== undefined
					)}
						<div>
							<dt>Media</dt>
							<dd>
								<Media
									media={{ url: ipfs.fields.$media[EntityMetaKey.Selector].url }}
									alt={ipfs.fields.fileName ?? ''}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
		<CollapsibleTabs
			id={`${ipfsChromeKey}:carousel-browser`}
			sectionIdPrefix={ipfsChromeKey}
			sections={[
				{ id: 'ipfs-browser-form', label: 'CID & path' },
				{ id: 'ipfs-browser-note', label: 'Current resource' },
				{ id: 'ipfs-metadata', label: 'Metadata' },
				{ id: 'ipfs-content', label: 'Content' },
			]}
			data-card
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

			{#snippet SectionIpfsBrowserForm()}
				<section
					class="ipfs-browser"
					data-column
				>
					{@render Form()}
				</section>
			{/snippet}

			{#snippet SectionIpfsBrowserNote()}
				<section
					class="ipfs-browser-note"
					data-card
					data-column
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
								value={ipfsResourceCanonicalUri(selection.entitySelector)}
								format={TruncatedValueFormat.Visual}
							/>
						</code>
					</p>
				</section>
			{/snippet}

			{#snippet SectionIpfsMetadata()}
				<section
					data-card
					data-column
				>
					<header data-row="wrap align-center gap-2">
						<h2>Metadata</h2>
					</header>

					<ResourceBoundary
						resource={ipfs}
						placeholderText="Loading metadata…"
					>
						{#snippet children(ipfs)}
							<div>
								{#if ipfs.fields.canonicalUri !== undefined}
									<div>
										<dt>Canonical URI</dt>
										<dd>
											<TruncatedValue
												value={ipfs.fields.canonicalUri}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if ipfs.fields.gatewayOrigin !== undefined}
									<div>
										<dt>Gateway origin</dt>
										<dd>
											<TruncatedValue
												value={ipfs.fields.gatewayOrigin}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if ipfs.fields.cidVersion !== undefined}
									<div>
										<dt>CID version</dt>
										<dd>{String(ipfs.fields.cidVersion)}</dd>
									</div>
								{/if}

								{#if ipfs.fields.cidMultibase !== undefined}
									<div>
										<dt>Multibase</dt>
										<dd>
											<TruncatedValue
												value={ipfs.fields.cidMultibase}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if ipfs.fields.cidMulticodecCode !== undefined}
									<div>
										<dt>Multicodec code</dt>
										<dd>{String(ipfs.fields.cidMulticodecCode)}</dd>
									</div>
								{/if}

								{#if ipfs.fields.cidMultihashCode !== undefined}
									<div>
										<dt>Multihash code</dt>
										<dd>{String(ipfs.fields.cidMultihashCode)}</dd>
									</div>
								{/if}

								{#if ipfs.fields.cidMultihashDigestHex !== undefined}
									<div>
										<dt>Multihash digest</dt>
										<dd>
											<TruncatedValue
												value={ipfs.fields.cidMultihashDigestHex}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if ipfs.fields.isCidSubdomainSafe !== undefined}
									<div>
										<dt>Subdomain-safe</dt>
										<dd>{ipfs.fields.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
									</div>
								{/if}

								{#if ipfs.fields.contentLength !== undefined}
									<div>
										<dt>Content length</dt>
										<dd>
											<NumberValue
												value={ipfs.fields.contentLength}
												options={{ maximumFractionDigits: 0 }}
											/>
											{' '}
											bytes
										</dd>
									</div>
								{/if}

								{#if ipfs.fields.fileName !== undefined}
									<div>
										<dt>File name</dt>
										<dd>
											<TruncatedValue
												value={ipfs.fields.fileName}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if ipfs.fields.extension !== undefined}
									<div>
										<dt>Extension</dt>
										<dd>.{ipfs.fields.extension}</dd>
									</div>
								{/if}

								{#if ipfs.fields.contentType !== undefined}
									<div>
										<dt>Content type</dt>
										<dd>
											<TruncatedValue
												value={ipfs.fields.contentType}
												format={TruncatedValueFormat.Visual}
											/>
											{#if ipfs.fields.isContentTypeInferred}
												{' '}
												<span data-text="muted">(inferred)</span>
											{/if}
										</dd>
									</div>
								{/if}

								{#if ipfs.fields.displayType !== undefined}
									<div>
										<dt>Display type</dt>
										<dd>{ipfs.fields.displayType}</dd>
									</div>
								{/if}
							</div>
						{/snippet}
					</ResourceBoundary>
				</section>
			{/snippet}

			{#snippet SectionIpfsContent()}
				<section
					data-card
					data-column
				>
					<header data-row="wrap align-center gap-2">
						<h2>Content</h2>
					</header>

					<ResourceBoundary
						resource={ipfs}
						placeholderText="Loading content…"
					>
						{#snippet children(ipfs)}
							{#if ipfs.fields.text !== undefined}
								<pre>{ipfs.fields.text}</pre>
							{:else}
								<p data-text="muted">No text content available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</section>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
