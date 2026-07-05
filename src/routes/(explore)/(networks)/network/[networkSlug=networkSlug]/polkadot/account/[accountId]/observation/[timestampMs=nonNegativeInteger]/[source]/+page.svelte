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
	import PolkadotAccount_TimestampView from '$/views/PolkadotAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>Polkadot account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotAccount_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]/observation/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				accountId: params.accountId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.PolkadotAccount_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					freeBalancePlancks: true,
					nonce: true,
				},
			})
		}
	/>
</Page>
