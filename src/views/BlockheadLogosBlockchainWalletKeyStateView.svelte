<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadLogosBlockchainWalletKeyState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived(String(pendingEntity.publicKey ?? '') || 'blockhead Logos blockchain wallet key state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLogosBlockchainWalletKeyState_TimestampsView from '$/views/BlockheadLogosBlockchainWalletKeyState_TimestampsView.svelte'
	import BlockheadLogosBlockchainNodeStateView from '$/views/BlockheadLogosBlockchainNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.publicKey ?? '') || 'blockhead Logos blockchain wallet key state'}
	{/snippet}

	{#snippet Value()}
		<BlockheadLogosBlockchainNodeStateView
			selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadLogosBlockchainNodeStateView
						selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>public key</dt>
				<dd>
					{String(pendingEntity.publicKey)}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLogosBlockchainWalletKeyState_TimestampsView
						selection={blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource}
						countResource={blockheadLogosBlockchainWalletKeyStateBlockheadLogosBlockchainWalletKeyStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
