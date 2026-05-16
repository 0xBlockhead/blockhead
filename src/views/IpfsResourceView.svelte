<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.IpfsResource>
			href: string
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
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { ipfsResourceCanonicalUri } from '$/lib/ipfs.ts'

	const resourceEntity = useEntity(
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
	import FileDetails from '$/components/FileDetails.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary, { Layout } from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import IpfsCidAlternateEncodings from '$/views/IpfsCidAlternateEncodings.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.cid}
		</span>
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
		<ResourceBoundary resource={resourceEntity}>
			{#snippet children(loaded)}
				{#if loaded.contentType !== undefined || open}
					<dl>
						{#if loaded.contentType !== undefined}
							<div>
								<dt>Content type</dt>
								<dd>
									<TruncatedValue
										value={loaded.contentType}
										format={TruncatedValueFormat.Visual}
									/>
									{#if loaded.isContentTypeInferred}
										{' '}<span data-text="muted">(inferred)</span>
									{/if}
								</dd>
							</div>
						{/if}
						{#if open}
							<div>
								<dt>Canonical URI</dt>
								<dd>
									<TruncatedValue
										value={loaded.canonicalUri}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>

							<div>
								<dt>Gateway</dt>
								<dd>
									<TruncatedValue
										value={loaded.gatewayOrigin}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>

							<div>
								<dt>Gateway URL</dt>
								<dd>
									<a
										href={loaded.gatewayUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue
											value={loaded.gatewayUrl}
											format={TruncatedValueFormat.Visual}
										/>
									</a>
								</dd>
							</div>

							{#if loaded.contentLength !== undefined}
								<div>
									<dt>Content length</dt>
									<dd
									>
										<NumberValue
											value={loaded.contentLength}
											options={{ maximumFractionDigits: 0 }}
										/>
										{' '}
										bytes
									</dd>
								</div>
							{/if}
							{#if loaded.fileName !== undefined}
								<div>
									<dt>File name</dt>
									<dd>
										<TruncatedValue
											value={loaded.fileName}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
							{#if loaded.extension !== undefined}
								<div>
									<dt>Extension</dt>
									<dd>.{loaded.extension}</dd>
								</div>
							{/if}
							<div>
								<dt>Display type</dt>
								<dd>{loaded.displayType}</dd>
							</div>
							{#if entityId.namespace === 'ipfs'}
								{#if loaded.cidVersion !== undefined}
									<div>
										<dt>CID version</dt>
										<dd>{String(loaded.cidVersion)}</dd>
									</div>
									{#if loaded.cidMultibase !== undefined}
										<div>
											<dt>Multibase</dt>
											<dd>
												<TruncatedValue
													value={loaded.cidMultibase}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}
									{#if loaded.cidMulticodecCode !== undefined}
										<div>
											<dt>Multicodec code</dt>
											<dd>{String(loaded.cidMulticodecCode)}</dd>
										</div>
									{/if}
									{#if loaded.cidMultihashCode !== undefined}
										<div>
											<dt>Multihash code</dt>
											<dd>{String(loaded.cidMultihashCode)}</dd>
										</div>
									{/if}
									{#if loaded.cidMultihashDigestHex !== undefined}
										<div>
											<dt>Digest</dt>
											<dd>
												<TruncatedValue
													value={loaded.cidMultihashDigestHex}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}
									{#if loaded.isCidSubdomainSafe !== undefined}
										<div>
											<dt>Subdomain-safe</dt>
											<dd>{loaded.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
										</div>
									{/if}
								{/if}
							{/if}
						{/if}
					</dl>
				{:else}
					<p data-text="muted">Content type unavailable.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.IpfsResource}
			{entityId}
		/>
			{#if entityId.namespace === 'ipfs'}
				<IpfsCidAlternateEncodings
					contentPath={entityId.contentPath}
					target={entityId.target}
				/>
			{/if}

			<ResourceBoundary
				layout={Layout.Block}
				resource={resourceEntity}
			>
				{#snippet children(loaded)}
					<FileDetails
						contentSize={loaded.contentLength}
						contentType={loaded.contentType}
						displayType={loaded.displayType}
						extension={loaded.extension}
						fileName={loaded.fileName}
						src={loaded.gatewayUrl}
						text={loaded.text}
					/>
				{/snippet}
			</ResourceBoundary>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
