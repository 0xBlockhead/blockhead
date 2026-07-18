<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.SolanaTokenAccount>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SolanaTokenAccount>>
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
	const solanaTokenAccount = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.tokenAccountPubkey) ?? '')].filter(Boolean).join(' ') || 'solana token account')
	const viewDomId = $derived('solana-token-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.tokenAccountPubkey !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
			tokenAccountPubkey: String(pendingEntity.tokenAccountPubkey ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.tokenAccountPubkey !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
			tokenAccountPubkey: String(pendingEntity.tokenAccountPubkey ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const tokenAccountPubkey0 = pendingEntity.tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={solanaTokenAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenAccountPubkey0 = resolvedEntity.tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const tokenAccountPubkey0 = pendingEntity.tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={solanaTokenAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenAccountPubkey0 = resolvedEntity.tokenAccountPubkey}
					{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
						<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={selection.$mint}
			>
				{#snippet children(solanaTokenMint)}
					{#if solanaTokenMint != null && solanaTokenMint[EntityMetaKey.Selector] != null}
					<span data-text="muted">
						<SolanaTokenMintView
							selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
							prefetched={solanaTokenMint}
							href={
								(solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
									mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
									network: String(caip2StringFromValue(solanaTokenMint[EntityMetaKey.Selector].$network.caip2) ?? ''),
								}) : solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
									mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
									network: String(solanaTokenMint[EntityMetaKey.Selector].$network.slug ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={solanaTokenAccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$mint}
					>
						{#snippet children(solanaTokenMint)}
							{#if solanaTokenMint != null && solanaTokenMint[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<SolanaTokenMintView
									selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
									prefetched={solanaTokenMint}
									href={
										(solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
											mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
											network: String(caip2StringFromValue(solanaTokenMint[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
											mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
											network: String(solanaTokenMint[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Token account public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									tokenAccountPubkey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tokenAccountPubkey = resolvedEntity.tokenAccountPubkey}
							{#if tokenAccountPubkey !== undefined && tokenAccountPubkey !== null}
								<TruncatedValue value={String((tokenAccountPubkey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Mint</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$mint}
					>
						{#snippet children(solanaTokenMint)}
							{#if solanaTokenMint != null && solanaTokenMint[EntityMetaKey.Selector] != null}
								<SolanaTokenMintView
									selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
									prefetched={solanaTokenMint}
									href={
										(solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
											mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
											network: String(caip2StringFromValue(solanaTokenMint[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
											mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
											network: String(solanaTokenMint[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null && solanaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Account</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
									href={
										(solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(caip2StringFromValue(solanaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(solanaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null && solanaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
									href={
										(solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(caip2StringFromValue(solanaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(solanaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
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
				resource={selection.$delegate}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null && solanaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Delegate</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
									href={
										(solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(caip2StringFromValue(solanaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(solanaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$closeAuthority}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null && solanaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Close authority</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
									href={
										(solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(caip2StringFromValue(solanaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(solanaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
