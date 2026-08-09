<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLogosBlockchainWalletKeyState>, 'prefetched'> = $props()

	const nodeState = $derived(selection.entitySelector.$nodeState)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLogosBlockchainWalletKeyState_TimestampsView from '$/views/BlockheadLogosBlockchainWalletKeyState_TimestampsView.svelte'
	import BlockheadLogosBlockchainNodeStateView from '$/views/BlockheadLogosBlockchainNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.publicKey || 'blockhead Logos blockchain wallet key state')}
	href={
		href === undefined ?
			resolve(
				'/~/logos/connection/[connectionId=stringSegment]/node-state/[peerId=stringSegment]/(blockheadLogosBlockchainNodeState)/wallet-key/[publicKey=zeroExHex]',
				{
					connectionId: nodeState.connectionId,
					peerId: nodeState.peerId,
					publicKey: selection.entitySelector.publicKey,
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
		<BlockheadLogosBlockchainNodeStateView
			selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadLogosBlockchainNodeStateView
						selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>public key</dt>
				<dd>
					{selection.entitySelector.publicKey}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLogosBlockchainWalletKeyState_TimestampsView
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
