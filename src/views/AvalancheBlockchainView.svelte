<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AvalancheBlockchain> = $props()

	const avalancheBlockchain = $derived(selection({
		fields: {
			chainName: true,
			chainAlias: true,
			vmId: true,
		},
	}))
	const titleFallback = $derived([(prefetched.chainName ?? ''), (prefetched.chainAlias ?? '')].filter(Boolean).join(' ') || selection.entitySelector.blockchainId || 'avalanche blockchain')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheBlockchain}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(avalanche)/avalanche/blockchain/[blockchainId=stringSegment]',
				{
					blockchainId: selection.entitySelector.blockchainId,
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
		<ResourceBoundary resource={avalancheBlockchain}>
			{#snippet children(entity)}
				{[(entity.chainName ?? ''), (entity.chainAlias ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheBlockchain}>
			{#snippet children(entity)}
				{entity.vmId || [(entity.chainName ?? ''), (entity.chainAlias ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>blockchain ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.blockchainId} />
				</dd>
			</div>

			<div>
				<dt>subnet</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$subnet}
					>
						{#snippet children(avalancheSubnet)}
							<AvalancheSubnetView
								selection={select(EntityType.AvalancheSubnet, avalancheSubnet[EntityMetaKey.Selector])}
								prefetched={avalancheSubnet}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>vm ID</dt>
				<dd>
					<ResourceBoundary
						resource={avalancheBlockchain}
					>
						{#snippet children(entity)}
							{entity.vmId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={avalancheBlockchain}
			>
				{#snippet children(entity)}
					{@const chainName = entity.chainName}
					{#if chainName != null}
						<div>
							<dt>chain name</dt>
							<dd>
								{chainName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={avalancheBlockchain}
			>
				{#snippet children(entity)}
					{@const chainAlias = entity.chainAlias}
					{#if chainAlias != null}
						<div>
							<dt>chain alias</dt>
							<dd>
								{chainAlias}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							genesisDataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const genesisDataHash = entity.genesisDataHash}
					{#if genesisDataHash != null}
						<div>
							<dt>genesis data hash</dt>
							<dd>
								<TruncatedValue value={genesisDataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAtTxId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAtTxId = entity.createdAtTxId}
					{#if createdAtTxId != null}
						<div>
							<dt>created AT transaction ID</dt>
							<dd>
								<TruncatedValue value={createdAtTxId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
