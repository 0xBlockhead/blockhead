<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadAvalancheNodeState>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AvalancheInfo_JsonRpc,
		],
	}))
	const blockheadAvalancheNodeState = $derived(viewSelection({
		fields: {
			nodeIp: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadAvalancheNodeState_TimestampsView from '$/views/BlockheadAvalancheNodeState_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAvalancheNodeState}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.nodeId || 'blockhead avalanche node state')}
	href={
		href === undefined ?
			resolve(
				'/~/avalanche/node-state/[nodeId=stringSegment]',
				{
					nodeId: selection.entitySelector.nodeId,
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
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				{#if network != null}
					{@const networkInitial = untrack(() => network)}
					<NetworkView
						selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
						prefetched={network ?? networkInitial}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAvalancheNodeState}>
			{#snippet children(entity)}
				{@const nodeIp = entity.nodeIp}
				{#if nodeIp != null}
					<span data-text="muted">
						{nodeIp}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadAvalancheNodeState}
			>
				{#snippet children(entity)}
					{@const nodeIp = entity.nodeIp}
					{#if nodeIp != null}
						<div>
							<dt>node IP</dt>
							<dd>
								{nodeIp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nodePopPublicKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodePopPublicKey = entity.nodePopPublicKey}
					{#if nodePopPublicKey != null}
						<div>
							<dt>node PoP public key</dt>
							<dd>
								{nodePopPublicKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nodePopProofOfPossession: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodePopProofOfPossession = entity.nodePopProofOfPossession}
					{#if nodePopProofOfPossession != null}
						<div>
							<dt>node PoP proof of possession</dt>
							<dd>
								{nodePopProofOfPossession}
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
					<BlockheadAvalancheNodeState_TimestampsView
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
