<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		href = ipfsResourceHref(entityId),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.IpfsResource>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { ipfsResourceCanonicalUri, ipfsResourceHref } from '$/lib/ipfs.ts'
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
			text: {},
			cidVersion: {},
			cidMultibase: {},
			cidMulticodecCode: {},
			cidMultihashCode: {},
			cidMultihashDigestHex: {},
			isCidSubdomainSafe: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import FileDetails from '$/components/FileDetails.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import IpfsCidAlternateEncodings from '$/views/IpfsCidAlternateEncodings.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.target}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		{#if href}
			<a
				{href}
			>
				<TruncatedValue
					value={ipfsResourceCanonicalUri(entityId)}
					format={TruncatedValueFormat.Visual}
				/>
			</a>
		{:else}
			<TruncatedValue
				value={ipfsResourceCanonicalUri(entityId)}
				format={TruncatedValueFormat.Visual}
			/>
		{/if}
	{/snippet}


	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Content type</dt>
				<dd>
					<ResourceBoundary resource={ipfs}>
						{#snippet children(ipfs)}
							{#if ipfs.contentType !== undefined}
								<TruncatedValue
									value={ipfs.contentType}
									format={TruncatedValueFormat.Visual}
								/>
								{#if ipfs.isContentTypeInferred}
									{' '}<span data-text="muted">(inferred)</span>
								{/if}
							{:else if !open}
								<span data-text="muted">Content type unavailable.</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Canonical URI</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								<TruncatedValue
									value={ipfs.canonicalUri}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Gateway</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								<TruncatedValue
									value={ipfs.gatewayOrigin}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Gateway URL</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
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
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Content length</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.contentLength !== undefined}
									<NumberValue
										value={ipfs.contentLength}
										options={{ maximumFractionDigits: 0 }}
									/>
									{' '}
									bytes
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>File name</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fileName !== undefined}
									<TruncatedValue
										value={ipfs.fileName}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Extension</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.extension !== undefined}
									.{ipfs.extension}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Display type</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{ipfs.displayType}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				{#if entityId.namespace === 'ipfs'}
					<div>
						<dt>Content identifier version</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(ipfs)}
									{#if ipfs.cidVersion !== undefined}
										{String(ipfs.cidVersion)}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					<div>
						<dt>Multibase</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(ipfs)}
									{#if ipfs.cidMultibase !== undefined}
										<TruncatedValue
											value={ipfs.cidMultibase}
											format={TruncatedValueFormat.Visual}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Multicodec code</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(ipfs)}
									{#if ipfs.cidMulticodecCode !== undefined}
										{String(ipfs.cidMulticodecCode)}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Multihash code</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(ipfs)}
									{#if ipfs.cidMultihashCode !== undefined}
										{String(ipfs.cidMultihashCode)}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Multihash digest</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(ipfs)}
									{#if ipfs.cidMultihashDigestHex !== undefined}
										<TruncatedValue
											value={ipfs.cidMultihashDigestHex}
											format={TruncatedValueFormat.Visual}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Subdomain-safe</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(ipfs)}
									{#if ipfs.isCidSubdomainSafe !== undefined}
										{ipfs.isCidSubdomainSafe ? 'Yes' : 'No'}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const detailKey = stringify(entityId)}
		<CollapsibleTabs
				id={`${detailKey}:carousel-ipfs-resource`}
				sectionIdPrefix={detailKey}
				sections={[
					{ id: 'ipfs-record', label: 'Record' },
					...(_open && entityId.namespace === 'ipfs' ? [{ id: 'ipfs-cid', label: 'Encodings' }] : []),
					...(_open ? [{ id: 'ipfs-preview', label: 'Preview' }] : []),
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
							Resource
						</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									IPFS names content by content identifiers (CIDs); browsers usually load bytes through an HTTP gateway.
								</p>
								<p>
									The alternate CID encodings below are the same logical content in forms other tools expect.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="IPFS resource notes"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet SectionIpfsRecord()}
				{/snippet}

				{#snippet SectionIpfsCid()}
					<IpfsCidAlternateEncodings
						contentPath={entityId.contentPath}
						target={entityId.target}
					/>
				{/snippet}

				{#snippet SectionIpfsPreview()}
					<ResourceBoundary
						resource={ipfs}
					>
						{#snippet children(ipfs)}
							<FileDetails
								contentSize={ipfs.contentLength}
								contentType={ipfs.contentType}
								displayType={ipfs.displayType}
								extension={ipfs.extension}
								fileName={ipfs.fileName}
								src={ipfs.gatewayUrl}
								text={ipfs.text}
							/>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
