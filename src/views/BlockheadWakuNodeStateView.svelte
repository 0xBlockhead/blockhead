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
	}: EntitySelectionViewProps<EntityType.BlockheadWakuNodeState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWakuNodeState = $derived(viewSelection({
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.nodeId ?? '') || 'blockhead waku node state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWakuNodeState_TimestampsView from '$/views/BlockheadWakuNodeState_TimestampsView.svelte'
	import BlockheadWakuMessageObservation_TimestampsView from '$/views/BlockheadWakuMessageObservation_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWakuNodeState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.nodeId ?? '') || 'blockhead waku node state'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.connectionId ?? '') || (pendingEntity.nodeId ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWakuNodeState}>
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
				<dt>node ID</dt>
				<dd>
					{pendingEntity.nodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadWakuNodeState}
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
		{@const blockheadWakuNodeStateBlockheadWakuNodeStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadWakuNodeStateBlockheadWakuNodeStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWakuNodeState_TimestampsView
						selection={blockheadWakuNodeStateBlockheadWakuNodeStateTimestampsViewTimestampsResource}
						countResource={blockheadWakuNodeStateBlockheadWakuNodeStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadWakuNodeStateBlockheadWakuMessageObservationTimestampsViewMessageObservationsResource = selection.$$messageObservations}
		<ResourceBoundary
			resource={blockheadWakuNodeStateBlockheadWakuMessageObservationTimestampsViewMessageObservationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWakuMessageObservation_TimestampsView
						selection={blockheadWakuNodeStateBlockheadWakuMessageObservationTimestampsViewMessageObservationsResource}
						countResource={blockheadWakuNodeStateBlockheadWakuMessageObservationTimestampsViewMessageObservationsResource.count}
						title='message observations'
						id='message-observations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
