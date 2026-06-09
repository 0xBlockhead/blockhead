<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
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
			collapsible?: boolean
		},
		never
	> = $props()

	import { ipfsResourceCanonicalUri, ipfsResourceHref } from '$/lib/ipfs.ts'
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'

	const ipfs = useEntity(entityCollectionsContext, EntityType.IpfsResource,
		entityId,
		({ sources: [Source.Ipfs_Rest], fields: { canonicalUri: true, gatewayOrigin: true, gatewayUrl: true, fileName: true, extension: true, contentType: true, contentLength: true, displayType: true, isContentTypeInferred: true, text: true, cidVersion: true, cidMultibase: true, cidMulticodecCode: true, cidMultihashCode: true, cidMultihashDigestHex: true, isCidSubdomainSafe: true } }),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import FileDetails from '$/components/FileDetails.svelte'
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

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Content type</dt>
				<dd>
					<ResourceBoundary resource={ipfs}>
						{#snippet children(ipfs)}
							{#if ipfs.fields.contentType !== undefined}
								<TruncatedValue
									value={ipfs.fields.contentType}
									format={TruncatedValueFormat.Visual}
								/>
								{#if ipfs.fields.isContentTypeInferred}
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
									value={ipfs.fields.canonicalUri}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Gateway</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								<TruncatedValue
									value={ipfs.fields.gatewayOrigin}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Gateway URL</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
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
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Content length</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.contentLength !== undefined}
									<NumberValue
										value={ipfs.fields.contentLength}
										options={{ maximumFractionDigits: 0 }}
									/>
									{' '}
									bytes
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>File name</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.fileName !== undefined}
									<TruncatedValue
										value={ipfs.fields.fileName}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Extension</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.extension !== undefined}
									.{ipfs.fields.extension}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Display type</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{ipfs.fields.displayType}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open && entityId.namespace === 'ipfs'}
				<div>
					<dt>Content identifier version</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.cidVersion !== undefined}
									{String(ipfs.fields.cidVersion)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open && entityId.namespace === 'ipfs'}
				<div>
					<dt>Multibase</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.cidMultibase !== undefined}
									<TruncatedValue
										value={ipfs.fields.cidMultibase}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open && entityId.namespace === 'ipfs'}
				<div>
					<dt>Multicodec code</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.cidMulticodecCode !== undefined}
									{String(ipfs.fields.cidMulticodecCode)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open && entityId.namespace === 'ipfs'}
				<div>
					<dt>Multihash code</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.cidMultihashCode !== undefined}
									{String(ipfs.fields.cidMultihashCode)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open && entityId.namespace === 'ipfs'}
				<div>
					<dt>Multihash digest</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.cidMultihashDigestHex !== undefined}
									<TruncatedValue
										value={ipfs.fields.cidMultihashDigestHex}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open && entityId.namespace === 'ipfs'}
				<div>
					<dt>Subdomain-safe</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(ipfs)}
								{#if ipfs.fields.isCidSubdomainSafe !== undefined}
									{ipfs.fields.isCidSubdomainSafe ? 'Yes' : 'No'}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
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
							contentSize={ipfs.fields.contentLength}
							contentType={ipfs.fields.contentType}
							displayType={ipfs.fields.displayType}
							extension={ipfs.fields.extension}
							fileName={ipfs.fields.fileName}
							src={ipfs.fields.gatewayUrl}
							text={ipfs.fields.text}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
	</CollapsibleTabs>

	{/snippet}
</EntityView>
