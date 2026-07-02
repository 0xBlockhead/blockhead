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
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


<svelte:head>
	<title>Polkadot account • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotAccountView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]', {
				networkSlug: params.networkSlug,
				accountId: params.accountId,
			})
		}
		selection={select(EntityType.PolkadotAccount, data.selector)}
	/>
</Page>
