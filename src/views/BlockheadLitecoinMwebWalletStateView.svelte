<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLitecoinMwebWalletState>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


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
	title={title ?? (selection.entitySelector.walletId || 'blockhead litecoin mweb wallet state')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/litecoin-mweb/wallet/[walletId=stringSegment]/state',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					walletId: selection.entitySelector.walletId,
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
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$wallet}
		>
			{#snippet children(blockheadWallet)}
				{#if blockheadWallet != null}
					{@const blockheadWalletInitial = untrack(() => blockheadWallet)}
					<span data-text="muted">
						<BlockheadWalletView
							selection={select(EntityType.BlockheadWallet, (blockheadWallet ?? blockheadWalletInitial)[EntityMetaKey.Selector])}
							prefetched={blockheadWallet ?? blockheadWalletInitial}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					{selection.entitySelector.walletId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null}
						{@const blockheadWalletInitial = untrack(() => blockheadWallet)}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, (blockheadWallet ?? blockheadWalletInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadWallet ?? blockheadWalletInitial}
									layout={EntityLayout.Value}
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
					/>
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
					<BlockheadLitecoinMwebWalletState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const outputsResource = selection.$$outputs}
		<ResourceBoundary
			resource={outputsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLitecoinMwebOutputStatesView
						selection={outputsResource}
						countResource={outputsResource.count}
						title='outputs'
						id='outputs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
