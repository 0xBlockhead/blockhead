<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.SolanaTokenAccount> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenAccount}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.tokenAccountPubkey || 'solana token account')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					tokenAccountPubkey: selection.entitySelector.tokenAccountPubkey,
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
		<TruncatedValue value={selection.entitySelector.tokenAccountPubkey} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.tokenAccountPubkey} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$mint}
		>
			{#snippet children(solanaTokenMint)}
				<span data-text="muted">
					<SolanaTokenMintView
						selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
						prefetched={solanaTokenMint}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Token account public key</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.tokenAccountPubkey} />
				</dd>
			</div>

			<div>
				<dt>Mint</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$mint}
					>
						{#snippet children(solanaTokenMint)}
							<SolanaTokenMintView
								selection={select(EntityType.SolanaTokenMint, solanaTokenMint[EntityMetaKey.Selector])}
								prefetched={solanaTokenMint}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Account</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
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
					{#if solanaAccount != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
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
					{#if solanaAccount != null}
						<div>
							<dt>Delegate</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
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
					{#if solanaAccount != null}
						<div>
							<dt>Close authority</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
