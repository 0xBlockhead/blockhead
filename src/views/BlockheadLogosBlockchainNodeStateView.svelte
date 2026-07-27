<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadLogosBlockchainNodeState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.LogosBlockchainNode_Rest,
		],
	}))
	const blockheadLogosBlockchainNodeState = $derived(viewSelection({
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.peerId ?? '') || 'blockhead Logos blockchain node state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLogosBlockchainNodeState_TimestampsView from '$/views/BlockheadLogosBlockchainNodeState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLogosBlockchainNodeState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.peerId ?? '') || 'blockhead Logos blockchain node state'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.connectionId ?? '') || (pendingEntity.peerId ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLogosBlockchainNodeState}>
			{#snippet children(entity)}
				{@const endpoint0 = entity.endpoint}
				{#if endpoint0 != null}
					<span data-text="muted">
						<a
							href={String(endpoint0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpoint0)} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{pendingEntity.connectionId}
				</dd>
			</div>

			<div>
				<dt>peer ID</dt>
				<dd>
					{pendingEntity.peerId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadLogosBlockchainNodeState}
			>
				{#snippet children(entity)}
					{@const endpoint = entity.endpoint}
					{#if endpoint != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<a
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadLogosBlockchainNodeStateBlockheadLogosBlockchainNodeStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLogosBlockchainNodeStateBlockheadLogosBlockchainNodeStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLogosBlockchainNodeState_TimestampsView
						selection={blockheadLogosBlockchainNodeStateBlockheadLogosBlockchainNodeStateTimestampsViewTimestampsResource}
						countResource={blockheadLogosBlockchainNodeStateBlockheadLogosBlockchainNodeStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
