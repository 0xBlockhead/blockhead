<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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

	const blockheadWakuNodeState = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	})({
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.nodeId || 'blockhead waku node state')


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
		{selection.entitySelector.nodeId || 'blockhead waku node state'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.connectionId || selection.entitySelector.nodeId || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWakuNodeState}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
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

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWakuNodeState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const messageObservationsResource = selection.$$messageObservations}
		<ResourceBoundary
			resource={messageObservationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadWakuMessageObservation_TimestampsView
						selection={messageObservationsResource}
						countResource={messageObservationsResource.count}
						title='message observations'
						id='message-observations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
