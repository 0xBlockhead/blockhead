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
	const blockheadCashuWalletState = $derived(selection({
		fields: {
			$mint: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.walletId ?? prefetched.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu wallet state')
	const viewDomId = $derived('blockhead-cashu-wallet-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCashuWalletState_TimestampsView from '$/views/BlockheadCashuWalletState_TimestampsView.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import BlockheadCashuTokensView from '$/views/BlockheadCashuTokensView.svelte'
	import BlockheadCashuMintQuotesView from '$/views/BlockheadCashuMintQuotesView.svelte'
	import BlockheadCashuMeltQuotesView from '$/views/BlockheadCashuMeltQuotesView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
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
				{[String((selection.entitySelector.walletId ?? prefetched.walletId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Cashu wallet state'}
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
				{@const unit0 = selection.entitySelector.unit ?? prefetched.unit}
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
							{@const walletId = selection.entitySelector.walletId ?? prefetched.walletId}
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
							{#if cashuMint[EntityMetaKey.Selector] != null}
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
							{@const mintUrl = selection.entitySelector.mintUrl ?? prefetched.mintUrl}
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
							{@const unit = selection.entitySelector.unit ?? prefetched.unit}
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
			<BlockheadCashuWalletState_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No observations yet.'
				id='BlockheadCashuWalletState_TimestampsView-timestamps'
			/>

			<BlockheadCashuProofsView
				selection={selection.$$proofs}
				title='proofs'
				emptyText='No proofs found.'
				id='BlockheadCashuProofsView-proofs'
			/>

			<BlockheadCashuTokensView
				selection={selection.$$tokens}
				title='tokens'
				emptyText='No tokens found.'
				id='BlockheadCashuTokensView-tokens'
			/>

			<BlockheadCashuMintQuotesView
				selection={selection.$$mintQuotes}
				title='mint quotes'
				emptyText='No mint quotes found.'
				id='BlockheadCashuMintQuotesView-mint-quotes'
			/>

			<BlockheadCashuMeltQuotesView
				selection={selection.$$meltQuotes}
				title='melt quotes'
				emptyText='No melt quotes found.'
				id='BlockheadCashuMeltQuotesView-melt-quotes'
			/>
		{/if}
	{/snippet}
</EntityView>
