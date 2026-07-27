<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadLightningChannelState> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Grpc,
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))
	const blockheadLightningChannelState = $derived(viewSelection({
		fields: {
			private: true,
		},
	}))
	const titleFallback = 'blockhead Lightning channel state'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLightningChannelState_TimestampsView from '$/views/BlockheadLightningChannelState_TimestampsView.svelte'
	import BlockheadLightningHtlcsView from '$/views/BlockheadLightningHtlcsView.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningChannelState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<LightningChannelView
			selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<BlockheadLightningNodeStateView
			selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningChannelState}>
			{#snippet children(entity)}
				{@const privateValue0 = entity.private}
				{#if privateValue0 != null}
					<span data-text="muted">
						{privateValue0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>local node state</dt>
				<dd>
					<BlockheadLightningNodeStateView
						selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>channel</dt>
				<dd>
					<LightningChannelView
						selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadLightningChannelState}
			>
				{#snippet children(entity)}
					{@const privateValue = entity.private}
					{#if privateValue != null}
						<div>
							<dt>private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							initiator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const initiator = entity.initiator}
					{#if initiator != null}
						<div>
							<dt>initiator</dt>
							<dd>
								{initiator ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLightningChannelState_TimestampsView
						selection={blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource}
						countResource={blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource = selection.$$htlcs}
		<ResourceBoundary
			resource={blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLightningHtlcsView
						selection={blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource}
						countResource={blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource.count}
						title='htlcs'
						id='htlcs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
