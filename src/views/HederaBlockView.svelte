<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaBlock>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaBlock}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'blockHash' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockHash: selection.entitySelector.blockHash,
						}
					)
				:
					'blockNumber' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								blockNumber: String(selection.entitySelector.blockNumber),
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.blockNumber}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.blockHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusStartTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const consensusStartTimestamp = entity.consensusStartTimestamp}
					{#if consensusStartTimestamp != null}
						<div>
							<dt>consensus start timestamp</dt>
							<dd>
								{consensusStartTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusEndTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const consensusEndTimestamp = entity.consensusEndTimestamp}
					{#if consensusEndTimestamp != null}
						<div>
							<dt>consensus end timestamp</dt>
							<dd>
								{consensusEndTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>gas used</dt>
							<dd>
								{gasUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							recordFileName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const recordFileName = entity.recordFileName}
					{#if recordFileName != null}
						<div>
							<dt>record file name</dt>
							<dd>
								{recordFileName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{transactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
