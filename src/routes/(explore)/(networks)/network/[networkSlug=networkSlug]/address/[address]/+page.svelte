<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types'
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	}: PageProps = $props()

	const network = $derived(select(EntityType.Network,
		{ slug: params.networkSlug },
		({ sources: [Source.Constants_Internal], fields: { namespace: true, slug: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const selector = { slug: params.networkSlug }}
			{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
				<UtxoAddressView
					selection={select(EntityType.UtxoAddress, { $network: selector, address: params.address })}
				/>
			{:else if network.namespace === NetworkNamespace.ZeroG}
				{@const account = select(EntityType.EvmNetworkAccount, {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '16661',
						},
					},
					$actor: { address: with0xHex(params.address) },
				}, {
					sources: [Source.ZeroGChain_JsonRpc],
					fields: { isContract: true },
				})}
				<section data-column>
					<h1>
						<TruncatedValue
							format={TruncatedValueFormat.Visual}
							value={params.address}
						/>
					</h1>

					<dl data-column-item="center">
						<div>
							<dt>Network</dt>
							<dd>0G</dd>
						</div>

						<div>
							<dt>CAIP-2</dt>
							<dd>
								<code>eip155:16661</code>
							</dd>
						</div>

						<div>
							<dt>Contract</dt>
							<dd>
								<ResourceBoundary
									resource={account}
									placeholderText="Loading network activity…"
								>
									{#snippet children(account)}
										{account.isContract ? 'Yes' : 'No'}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					</dl>
				</section>
			{:else}
				<p data-text="muted">Address detail not available for this network type yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
