<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTokenAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaTokenAccount>>
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

	const solanaTokenAccount = $derived(selection({
		fields: {
			$mint: true,
			$account: true,
			$owner: true,
			$delegate: true,
			$closeAuthority: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).tokenAccountPubkey) ?? '')].filter(Boolean).join(' ') || 'solana token account')
	const viewDomId = $derived('solana-token-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-account/[tokenAccountPubkey]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			tokenAccountPubkey: String(({ ...selection.entitySelector, ...prefetched }).tokenAccountPubkey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const tokenAccountPubkey0 = ({ ...selection.entitySelector, ...prefetched }).tokenAccountPubkey}
			{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
				<TruncatedValue value={String(tokenAccountPubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTokenAccount}>
				{#snippet Pending()}
					{@const tokenAccountPubkey0 = ({ ...selection.entitySelector, ...prefetched }).tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String(tokenAccountPubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tokenAccountPubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String(tokenAccountPubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const tokenAccountPubkey0 = ({ ...selection.entitySelector, ...prefetched }).tokenAccountPubkey}
			{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
				<TruncatedValue value={String(tokenAccountPubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTokenAccount}>
				{#snippet Pending()}
					{@const tokenAccountPubkey0 = ({ ...selection.entitySelector, ...prefetched }).tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String(tokenAccountPubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tokenAccountPubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String(tokenAccountPubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaTokenMint, false>('$mint')}
			>
				{#snippet children(solanaTokenMint)}
					<span data-text="muted">
						<SolanaTokenMintView
							selection={select(EntityType.SolanaTokenMint, solanaTokenMint.entitySelector)}
							prefetched={solanaTokenMint}
							href={
								resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mint/[mintAddress]', {
									networkSlug: String(solanaTokenMint.entitySelector.$network.slug),
									mintAddress: String(solanaTokenMint.entitySelector.mintAddress),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={solanaTokenAccount}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.SolanaTokenMint, false>('$mint')}
					>
						{#snippet children(solanaTokenMint)}
							<span data-text="muted">
								<SolanaTokenMintView
									selection={select(EntityType.SolanaTokenMint, solanaTokenMint.entitySelector)}
									prefetched={solanaTokenMint}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mint/[mintAddress]', {
											networkSlug: String(solanaTokenMint.entitySelector.$network.slug),
											mintAddress: String(solanaTokenMint.entitySelector.mintAddress),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.SolanaTokenMint, false>('$mint')}
					>
						{#snippet children(solanaTokenMint)}
							<span data-text="muted">
								<SolanaTokenMintView
									selection={select(EntityType.SolanaTokenMint, solanaTokenMint.entitySelector)}
									prefetched={solanaTokenMint}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mint/[mintAddress]', {
											networkSlug: String(solanaTokenMint.entitySelector.$network.slug),
											mintAddress: String(solanaTokenMint.entitySelector.mintAddress),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaAccount, false>('$account')}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Account</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount.entitySelector)}
									prefetched={solanaAccount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
											networkSlug: String(solanaAccount.entitySelector.$network.slug),
											pubkey: String(solanaAccount.entitySelector.pubkey),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaAccount, false>('$owner')}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount.entitySelector)}
									prefetched={solanaAccount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
											networkSlug: String(solanaAccount.entitySelector.$network.slug),
											pubkey: String(solanaAccount.entitySelector.pubkey),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaAccount, false>('$delegate')}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Delegate</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount.entitySelector)}
									prefetched={solanaAccount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
											networkSlug: String(solanaAccount.entitySelector.$network.slug),
											pubkey: String(solanaAccount.entitySelector.pubkey),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaAccount, false>('$closeAuthority')}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Close authority</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount.entitySelector)}
									prefetched={solanaAccount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
											networkSlug: String(solanaAccount.entitySelector.$network.slug),
											pubkey: String(solanaAccount.entitySelector.pubkey),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
