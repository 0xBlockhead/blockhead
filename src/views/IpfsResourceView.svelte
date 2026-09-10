<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.IpfsResource> = $props()

	const ipfsResourceLatestResource1 = $derived(
		selection
			.$$timestamps({
				sources: [
					Source.Ipfs_Rest,
				],
				fields: {
					timestampMs: true,
					gatewayOrigin: true,
					gatewayUrl: true,
					fileName: true,
					extension: true,
					contentType: true,
					contentLength: true,
					displayType: true,
					isContentTypeInferred: true,
					text: true,
					$media: true,
				},
				limit: 1,
				orderBy: [
					[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
				],
			})
	)

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Ipfs_Rest,
		],
	}))
	const ipfsResource = $derived(viewSelection({
		fields: {
			canonicalUri: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IpfsResource_TimestampsView from '$/views/IpfsResource_TimestampsView.svelte'
	import IpfsResource_TimestampView from '$/views/IpfsResource_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	entitySelector={selection.entitySelector}
	title={title ?? ((prefetched.canonicalUri ?? '') || 'IPFS resource')}
	href={
		href === undefined ?
			(
				selection.entitySelector.contentPath === '' ?
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]',
						{
							namespace: selection.entitySelector.namespace,
							target: selection.entitySelector.target,
						}
					)
				:
					resolve(
						'/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]',
						{
							namespace: selection.entitySelector.namespace,
							target: selection.entitySelector.target,
							contentPath: selection.entitySelector.contentPath,
						}
					)
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ipfsResource}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.canonicalUri} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Latest capture</dt>
				<dd>
					<ResourceBoundary
						resource={ipfsResourceLatestResource1}
					>
						{#snippet children(ipfsResourceTimestamps)}
							{@const ipfsResourceTimestamp = ipfsResourceTimestamps.values[0]}
							{#if ipfsResourceTimestamp != null}
								<IpfsResource_TimestampView
									selection={
										select(EntityType.IpfsResource_Timestamp, ipfsResourceTimestamp[EntityMetaKey.Selector], {
											sources: [
												Source.Ipfs_Rest,
											],
										})
									}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest capture available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					{selection.entitySelector.namespace}
				</dd>
			</div>

			<div>
				<dt>Target</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.target} />
				</dd>
			</div>

			<div>
				<dt>Content path</dt>
				<dd>
					{selection.entitySelector.contentPath}
				</dd>
			</div>

			<div>
				<dt>Canonical URI</dt>
				<dd>
					<ResourceBoundary
						resource={ipfsResource}
					>
						{#snippet children(entity)}
							<a
								href={entity.canonicalUri}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.canonicalUri} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidVersion = entity.cidVersion}
					{#if cidVersion != null}
						<div>
							<dt>CID version</dt>
							<dd>
								{cidVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMultibase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMultibase = entity.cidMultibase}
					{#if cidMultibase != null}
						<div>
							<dt>CID multibase</dt>
							<dd>
								{cidMultibase}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMulticodecCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMulticodecCode = entity.cidMulticodecCode}
					{#if cidMulticodecCode != null}
						<div>
							<dt>CID multicodec code</dt>
							<dd>
								{cidMulticodecCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMultihashCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMultihashCode = entity.cidMultihashCode}
					{#if cidMultihashCode != null}
						<div>
							<dt>CID multihash code</dt>
							<dd>
								{cidMultihashCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cidMultihashDigestHex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cidMultihashDigestHex = entity.cidMultihashDigestHex}
					{#if cidMultihashDigestHex != null}
						<div>
							<dt>CID multihash digest hex</dt>
							<dd>
								{cidMultihashDigestHex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isCidSubdomainSafe: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isCidSubdomainSafe = entity.isCidSubdomainSafe}
					{#if isCidSubdomainSafe != null}
						<div>
							<dt>CID subdomain safe</dt>
							<dd>
								{isCidSubdomainSafe ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IpfsResource_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Captures'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
