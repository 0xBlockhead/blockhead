<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.ArweaveResource> = $props()

	const arweaveResource = $derived(selection({
		fields: {
			canonicalUri: true,
			contentPath: true,
		},
	}))
	const titleFallback = $derived((prefetched.canonicalUri ?? '') || selection.entitySelector.transactionId || 'arweave resource')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveManifestPathsView from '$/views/ArweaveManifestPathsView.svelte'
	import ArweaveResource_TimestampsView from '$/views/ArweaveResource_TimestampsView.svelte'
	import ArweaveResourceView from '$/views/ArweaveResourceView.svelte'
	import ArweaveTransactionView from '$/views/ArweaveTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveResource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'contentPath' in selection.entitySelector ?
					resolve(
						'/(arweave)/arweave/resource/[transactionId=stringSegment]/(arweaveResource)/path/[...contentPath=stringSegment]',
						{
							transactionId: selection.entitySelector.transactionId,
							contentPath: selection.entitySelector.contentPath,
						}
					)
				:
					resolve(
						'/(arweave)/arweave/resource/[transactionId=stringSegment]',
						{
							transactionId: selection.entitySelector.transactionId,
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
		<ResourceBoundary resource={arweaveResource}>
			{#snippet children(entity)}
				{entity.canonicalUri || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={arweaveResource}>
			{#snippet children(entity)}
				{entity.contentPath || entity.canonicalUri || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.transactionId} />
				</dd>
			</div>

			<div>
				<dt>content path</dt>
				<dd>
					<ResourceBoundary
						resource={arweaveResource}
					>
						{#snippet children(entity)}
							{entity.contentPath}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>canonical URI</dt>
				<dd>
					<ResourceBoundary
						resource={arweaveResource}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							manifestVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const manifestVersion = entity.manifestVersion}
					{#if manifestVersion != null}
						<div>
							<dt>manifest version</dt>
							<dd>
								{manifestVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							manifestDeclaredIndexPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const manifestDeclaredIndexPath = entity.manifestDeclaredIndexPath}
					{#if manifestDeclaredIndexPath != null}
						<div>
							<dt>manifest declared index path</dt>
							<dd>
								{manifestDeclaredIndexPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$manifestIndexResource}
			>
				{#snippet children(arweaveResource)}
					{#if arweaveResource != null}
						{@const arweaveResourceInitial = untrack(() => arweaveResource)}
						<div>
							<dt>manifest index resource</dt>
							<dd>
								<ArweaveResourceView
									selection={select(EntityType.ArweaveResource, (arweaveResource ?? arweaveResourceInitial)[EntityMetaKey.Selector])}
									prefetched={arweaveResource ?? arweaveResourceInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$manifestFallbackResource}
			>
				{#snippet children(arweaveResource)}
					{#if arweaveResource != null}
						{@const arweaveResourceInitial = untrack(() => arweaveResource)}
						<div>
							<dt>manifest fallback resource</dt>
							<dd>
								<ArweaveResourceView
									selection={select(EntityType.ArweaveResource, (arweaveResource ?? arweaveResourceInitial)[EntityMetaKey.Selector])}
									prefetched={arweaveResource ?? arweaveResourceInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(arweaveTransaction)}
					{#if arweaveTransaction != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<ArweaveTransactionView
									selection={select(EntityType.ArweaveTransaction, arweaveTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const manifestPathsResource = selection.$$manifestPaths}
		<ResourceBoundary
			resource={manifestPathsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ArweaveManifestPathsView
						selection={manifestPathsResource}
						countResource={manifestPathsResource.count}
						title='Manifest paths'
						id='manifest-paths'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ArweaveResource_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
