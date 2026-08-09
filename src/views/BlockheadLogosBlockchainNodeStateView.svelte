<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLogosBlockchainNodeState>, 'prefetched'> = $props()

	const blockheadLogosBlockchainNodeState = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.LogosBlockchainNode_Rest,
		],
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.peerId || 'blockhead Logos blockchain node state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLogosBlockchainNodeState_TimestampsView from '$/views/BlockheadLogosBlockchainNodeState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLogosBlockchainNodeState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]',
				{
					connectionId: selection.entitySelector.connectionId,
					peerId: selection.entitySelector.peerId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.connectionId || selection.entitySelector.peerId || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLogosBlockchainNodeState}>
			{#snippet children(entity)}
				{@const endpoint = entity.endpoint}
				{#if endpoint != null}
					<span data-text="muted">
						<a
							href={endpoint}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={endpoint} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>peer ID</dt>
				<dd>
					{selection.entitySelector.peerId}
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
									href={endpoint}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpoint} />
								</a>
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
					<BlockheadLogosBlockchainNodeState_TimestampsView
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
