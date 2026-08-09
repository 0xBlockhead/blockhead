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
	}: Omit<EntitySelectionViewProps<EntityType.CardanoBlock>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoBlock}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano block'}
	href={
		href === undefined ?
			(
				'hash' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockHash: selection.entitySelector.hash,
						}
					)
				:
					'slot' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/slot/[slot=nonNegativeBigInt]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								slot: String(selection.entitySelector.slot),
							}
						)
					:
						'blockNo' in selection.entitySelector ?
							resolve(
								'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/cardano/[blockNo=nonNegativeBigInt]',
								{
									network: (
										'caip2' in network ?
											caip2StringFromValue(network.caip2)
										:
											network.slug
									),
									blockNo: String(selection.entitySelector.blockNo),
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
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									slot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.slot}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>block no</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNo: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.blockNo}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epoch = entity.epoch}
					{#if epoch != null}
						<div>
							<dt>epoch</dt>
							<dd>
								{epoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							era: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const era = entity.era}
					{#if era != null}
						<div>
							<dt>era</dt>
							<dd>
								{era}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							issuerVkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const issuerVkey = entity.issuerVkey}
					{#if issuerVkey != null}
						<div>
							<dt>issuer vkey</dt>
							<dd>
								{issuerVkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
