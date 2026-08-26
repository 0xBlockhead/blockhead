<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLightningForward>, 'prefetched'> = $props()

	const localNodeState = $derived(selection.entitySelector.$localNodeState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningForward}
	entitySelector={selection.entitySelector}
	title={title ?? 'local LND forward'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/forward/[incomingChannelId=stringSegment]/[incomingHtlcId=nonNegativeBigInt]',
				{
					network: (
						'caip2' in localNodeState.$network.$network ?
							caip2StringFromValue(localNodeState.$network.$network.caip2)
						:
							localNodeState.$network.$network.slug
					),
					connectionId: localNodeState.connectionId,
					incomingChannelId: selection.entitySelector.$incomingChannel.channelId,
					incomingHtlcId: String(selection.entitySelector.incomingHtlcId),
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
		<LightningChannelView
			selection={select(EntityType.LightningChannel, selection.entitySelector.$incomingChannel)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.incomingHtlcId}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$outgoingChannel}
		>
			{#snippet children(lightningChannel)}
				{@const lightningChannelInitial = untrack(() => lightningChannel)}
				<span data-text="muted">
					<LightningChannelView
						selection={select(EntityType.LightningChannel, (lightningChannel ?? lightningChannelInitial)[EntityMetaKey.Selector])}
						prefetched={lightningChannel ?? lightningChannelInitial}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>local LND node state</dt>
				<dd>
					<BlockheadLightningNodeStateView
						selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>incoming channel</dt>
				<dd>
					<LightningChannelView
						selection={select(EntityType.LightningChannel, selection.entitySelector.$incomingChannel)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>incoming HTLC id</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.incomingHtlcId}
					/>
				</dd>
			</div>

			<div>
				<dt>outgoing channel</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$outgoingChannel}
					>
						{#snippet children(lightningChannel)}
							{@const lightningChannelInitial = untrack(() => lightningChannel)}
							<LightningChannelView
								selection={select(EntityType.LightningChannel, (lightningChannel ?? lightningChannelInitial)[EntityMetaKey.Selector])}
								prefetched={lightningChannel ?? lightningChannelInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>outgoing HTLC id</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									outgoingHtlcId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.outgoingHtlcId}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Incoming msat</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									incomingMsat: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.incomingMsat}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Outgoing msat</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									outgoingMsat: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.outgoingMsat}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Fee msat</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									feeMsat: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.feeMsat}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Completion timestamp ns</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									completionTimestampNs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.completionTimestampNs}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
