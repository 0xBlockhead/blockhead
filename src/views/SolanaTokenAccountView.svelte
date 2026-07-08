<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const solanaTokenAccount = $derived(selection({
		fields: {
			$mint: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.tokenAccountPubkey ?? prefetched.tokenAccountPubkey) ?? '')].filter(Boolean).join(' ') || 'solana token account')
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
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.tokenAccountPubkey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-account/[tokenAccountPubkey]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$network.caip2.namespace) + ':' + String(pendingEntity.$network.caip2.reference))].slug ?? ''),
			tokenAccountPubkey: String(pendingEntity.tokenAccountPubkey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaTokenAccount}>
			{#snippet Pending()}
				{@const tokenAccountPubkey0 = selection.entitySelector.tokenAccountPubkey ?? prefetched.tokenAccountPubkey}
				{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
					<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const tokenAccountPubkey0 = resolvedEntity.tokenAccountPubkey}
				{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
					<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTokenAccount}>
			{#snippet Pending()}
				{@const tokenAccountPubkey0 = selection.entitySelector.tokenAccountPubkey ?? prefetched.tokenAccountPubkey}
				{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
					<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const tokenAccountPubkey0 = resolvedEntity.tokenAccountPubkey}
				{#if tokenAccountPubkey0 !== undefined && tokenAccountPubkey0 !== null}
					<TruncatedValue value={String((tokenAccountPubkey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTokenAccount}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$mint}
				>
					{#snippet children(solanaTokenMint)}
						<span data-text="muted">
							<SolanaTokenMintView
								selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
								prefetched={solanaTokenMint}
								href={
									(solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-mint/[mintAddress]', {
										networkSlug: String(networkByCaip2[String(String(solanaTokenMint[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaTokenMint[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
										mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$mint}
				>
					{#snippet children(solanaTokenMint)}
						<span data-text="muted">
							<SolanaTokenMintView
								selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
								prefetched={solanaTokenMint}
								href={
									(solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-mint/[mintAddress]', {
										networkSlug: String(networkByCaip2[String(String(solanaTokenMint[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaTokenMint[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
										mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Token account public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tokenAccountPubkey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tokenAccountPubkey = selection.entitySelector.tokenAccountPubkey ?? prefetched.tokenAccountPubkey}
							{#if tokenAccountPubkey !== undefined && tokenAccountPubkey !== null}
								<TruncatedValue value={String((tokenAccountPubkey) ?? '')} />
							{/if}
						{/snippet}

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
							{#if solanaTokenMint[EntityMetaKey.Selector] != null}
								<SolanaTokenMintView
									selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
									prefetched={solanaTokenMint}
									href={
										(solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaTokenMint[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaTokenMint[EntityMetaKey.Selector].mintAddress !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/token-mint/[mintAddress]', {
											networkSlug: String(networkByCaip2[String(String(solanaTokenMint[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaTokenMint[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											mintAddress: String(solanaTokenMint[EntityMetaKey.Selector].mintAddress ?? ''),
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
										(solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaAccount[EntityMetaKey.Selector].pubkey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/account/[pubkey]', {
											networkSlug: String(networkByCaip2[String(String(solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaAccount[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											pubkey: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
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
										(solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaAccount[EntityMetaKey.Selector].pubkey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/account/[pubkey]', {
											networkSlug: String(networkByCaip2[String(String(solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaAccount[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											pubkey: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
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
										(solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaAccount[EntityMetaKey.Selector].pubkey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/account/[pubkey]', {
											networkSlug: String(networkByCaip2[String(String(solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaAccount[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											pubkey: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
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
										(solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && solanaAccount[EntityMetaKey.Selector].pubkey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana/account/[pubkey]', {
											networkSlug: String(networkByCaip2[String(String(solanaAccount[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(solanaAccount[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											pubkey: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
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
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
