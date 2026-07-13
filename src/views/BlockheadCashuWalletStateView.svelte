<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuWalletState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCashuWalletState>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadCashuWalletState = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu wallet state')
	const viewDomId = $derived('blockhead-cashu-wallet-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadCashuWalletState}>
			{#snippet Pending()}
				{[String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Cashu wallet state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.walletId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuWalletState}>
			{#snippet Pending()}
				{@const unit0 = pendingEntity.unit}
				{#if unit0 !== undefined && unit0 !== null}
					{String((unit0) ?? '')}
				{/if}

				<ResourceBoundary
					resource={selection.$mint}
				>
					{#snippet children(cashuMint)}
						<CashuMintView
							selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
							prefetched={cashuMint}
							layout={EntityLayout.Value}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const unit0 = resolvedEntity.unit}
				{#if unit0 !== undefined && unit0 !== null}
					{String((unit0) ?? '')}
				{/if}

				<ResourceBoundary
					resource={selection.$mint}
				>
					{#snippet children(cashuMint)}
						<CashuMintView
							selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
							prefetched={cashuMint}
							layout={EntityLayout.Value}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const walletId = pendingEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const walletId = resolvedEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
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
				<dt>mint</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$mint}
					>
						{#snippet children(cashuMint)}
							{#if cashuMint != null && cashuMint[EntityMetaKey.Selector] != null}
								<CashuMintView
									selection={select(EntityType.CashuMint, cashuMint[EntityMetaKey.Selector])}
									prefetched={cashuMint}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>mint URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									mintUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const mintUrl = pendingEntity.mintUrl}
							{#if mintUrl !== undefined && mintUrl !== null}
								<svelte:element
									this={'a'}
									href={String(mintUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mintUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const mintUrl = resolvedEntity.mintUrl}
							{#if mintUrl !== undefined && mintUrl !== null}
								<svelte:element
									this={'a'}
									href={String(mintUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(mintUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>unit</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									unit: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const unit = pendingEntity.unit}
							{#if unit !== undefined && unit !== null}
								{String((unit) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const unit = resolvedEntity.unit}
							{#if unit !== undefined && unit !== null}
								{String((unit) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Balance</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCashuProofs({ id, label, open })}
					<BlockheadCashuProofsView
						selection={selection.$$proofs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No proofs found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCashuTokens({ id, label, open })}
					<BlockheadCashuTokensView
						selection={selection.$$tokens}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No tokens found.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Quotes</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCashuMintQuotes({ id, label, open })}
					<BlockheadCashuMintQuotesView
						selection={selection.$$mintQuotes}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No mint quotes found.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionCashuMeltQuotes({ id, label, open })}
					<BlockheadCashuMeltQuotesView
						selection={selection.$$meltQuotes}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No melt quotes found.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCashuWalletTimestamps({ id, label, open })}
					<BlockheadCashuWalletState_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
