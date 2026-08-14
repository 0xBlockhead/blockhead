<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGStorageNode_Timestamp>, 'prefetched'> = $props()

	const storageNode = $derived(selection.entitySelector.$storageNode)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageNode_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'zero g storage node timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-node/[nodeId=evmAddress]/(zeroGStorageNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in storageNode.$network ?
							caip2StringFromValue(storageNode.$network.caip2)
						:
							storageNode.$network.slug
					),
					nodeId: storageNode.nodeId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<ZeroGStorageNodeView
			selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>storage node</dt>
				<dd>
					<ZeroGStorageNodeView
						selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								{balance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalReward: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalReward = entity.totalReward}
					{#if totalReward != null}
						<div>
							<dt>total reward</dt>
							<dd>
								{totalReward}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							winCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const winCount = entity.winCount}
					{#if winCount != null}
						<div>
							<dt>win count</dt>
							<dd>
								<NumberValue
									value={winCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							miningAttempts: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const miningAttempts = entity.miningAttempts}
					{#if miningAttempts != null}
						<div>
							<dt>mining attempts</dt>
							<dd>
								<NumberValue
									value={miningAttempts}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
