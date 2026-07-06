<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
</script>


<svelte:head>
	<title>Zcash shielded pool • Blockhead</title>
</svelte:head>


<Page>
	<ZcashShieldedPoolView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/shielded-pool/[pool]', {
				networkSlug: params.networkSlug,
				pool: params.pool,
			})
		}
		selection={
			select(EntityType.ZcashShieldedPool, data.selector, {
				fields: {
					noteProtocol: true,
					activationNetworkUpgrade: true,
				},
			})
		}
	/>
</Page>
