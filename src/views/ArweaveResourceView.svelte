<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
		},
	}))
	const titleFallback = $derived((prefetched.canonicalUri ?? '') || selection.entitySelector.transactionId || 'arweave resource')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveResourcesView from '$/views/ArweaveResourcesView.svelte'
	import ArweaveResource_TimestampsView from '$/views/ArweaveResource_TimestampsView.svelte'
	import ArweaveTransactionView from '$/views/ArweaveTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveResource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(arweave)/arweave/resource/[transactionId=stringSegment]/[contentPath=stringSegment]',
				{
					transactionId: selection.entitySelector.transactionId,
					contentPath: selection.entitySelector.contentPath,
				}
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
		{selection.entitySelector.contentPath || (prefetched.canonicalUri ?? '') || titleFallback}
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
					{selection.entitySelector.contentPath}
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
							manifestIndexPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const manifestIndexPath = entity.manifestIndexPath}
					{#if manifestIndexPath != null}
						<div>
							<dt>manifest index path</dt>
							<dd>
								{manifestIndexPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							manifestFallbackTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const manifestFallbackTransactionId = entity.manifestFallbackTransactionId}
					{#if manifestFallbackTransactionId != null}
						<div>
							<dt>manifest fallback transaction ID</dt>
							<dd>
								<TruncatedValue value={manifestFallbackTransactionId} />
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
						{@const arweaveTransactionInitial = untrack(() => arweaveTransaction)}
						<div>
							<dt>transaction</dt>
							<dd>
								<ArweaveTransactionView
									selection={select(EntityType.ArweaveTransaction, (arweaveTransaction ?? arweaveTransactionInitial)[EntityMetaKey.Selector])}
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
					<ArweaveResourcesView
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
