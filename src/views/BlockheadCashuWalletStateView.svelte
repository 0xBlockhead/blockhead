<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
	}: EntitySelectionViewProps<EntityType.BlockheadCashuWalletState> = $props()

	const viewDomId = $derived('blockhead-cashu-wallet-state-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import BlockheadCashuTokensView from '$/views/BlockheadCashuTokensView.svelte'
	import BlockheadCashuMintQuotesView from '$/views/BlockheadCashuMintQuotesView.svelte'
	import BlockheadCashuMeltQuotesView from '$/views/BlockheadCashuMeltQuotesView.svelte'
	import BlockheadCashuWalletState_TimestampsView from '$/views/BlockheadCashuWalletState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuWalletState}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.walletId || 'blockhead Cashu wallet state')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.unit}
		<ResourceBoundary
			resource={selection.$mint}
		>
			{#snippet children(cashuMint)}
				<CashuMintView
					selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
					prefetched={cashuMint}
					layout={EntityLayout.Value}
				/>
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
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>mint</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$mint}
					>
						{#snippet children(cashuMint)}
							<CashuMintView
								selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
								prefetched={cashuMint}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>mint URL</dt>
				<dd>
					<a
						href={selection.entitySelector.mintUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.mintUrl} />
					</a>
				</dd>
			</div>

			<div>
				<dt>unit</dt>
				<dd>
					{selection.entitySelector.unit}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-cashu-wallet-balance'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cashu-proofs',
						label: 'Proofs',
					},
					{
						id: 'cashu-tokens',
						label: 'Tokens',
					},
				]
			}
			data-card
			class='network-view-collapsible-balance'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Balance</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCashuProofs({ id, label })}
				<BlockheadCashuProofsView
					selection={selection.$$proofs}
					collapsible={false}
					title={label}
					emptyText='No proofs found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCashuTokens({ id, label })}
				<BlockheadCashuTokensView
					selection={selection.$$tokens}
					collapsible={false}
					title={label}
					emptyText='No tokens found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-cashu-wallet-quotes'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cashu-mint-quotes',
						label: 'Mint quotes',
					},
					{
						id: 'cashu-melt-quotes',
						label: 'Melt quotes',
					},
				]
			}
			data-card
			class='network-view-collapsible-quotes'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Quotes</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCashuMintQuotes({ id, label })}
				<BlockheadCashuMintQuotesView
					selection={selection.$$mintQuotes}
					collapsible={false}
					title={label}
					emptyText='No mint quotes found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCashuMeltQuotes({ id, label })}
				<BlockheadCashuMeltQuotesView
					selection={selection.$$meltQuotes}
					collapsible={false}
					title={label}
					emptyText='No melt quotes found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-cashu-wallet-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cashu-wallet-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCashuWalletTimestamps({ id, label })}
				<BlockheadCashuWalletState_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
