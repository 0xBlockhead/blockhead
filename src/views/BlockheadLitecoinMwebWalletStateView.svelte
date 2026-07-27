<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadLitecoinMwebWalletState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.walletId ?? '') || 'blockhead litecoin mweb wallet state')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLitecoinMwebWalletState_TimestampsView from '$/views/BlockheadLitecoinMwebWalletState_TimestampsView.svelte'
	import BlockheadLitecoinMwebOutputStatesView from '$/views/BlockheadLitecoinMwebOutputStatesView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLitecoinMwebWalletState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.walletId ?? '') || 'blockhead litecoin mweb wallet state'}
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$wallet}
		>
			{#snippet children(blockheadWallet)}
				{#if blockheadWallet != null}
					<span data-text="muted">
						<BlockheadWalletView
							selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
							prefetched={blockheadWallet}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					{pendingEntity.walletId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebWalletStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebWalletStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLitecoinMwebWalletState_TimestampsView
						selection={blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebWalletStateTimestampsViewTimestampsResource}
						countResource={blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebWalletStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebOutputStatesViewOutputsResource = selection.$$outputs}
		<ResourceBoundary
			resource={blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebOutputStatesViewOutputsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLitecoinMwebOutputStatesView
						selection={blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebOutputStatesViewOutputsResource}
						countResource={blockheadLitecoinMwebWalletStateBlockheadLitecoinMwebOutputStatesViewOutputsResource.count}
						title='outputs'
						id='outputs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
