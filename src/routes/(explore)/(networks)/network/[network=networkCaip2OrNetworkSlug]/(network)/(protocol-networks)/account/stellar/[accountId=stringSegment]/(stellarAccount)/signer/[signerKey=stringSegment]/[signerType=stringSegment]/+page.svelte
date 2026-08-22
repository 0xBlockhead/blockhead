<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StellarAccountSignerView from '$/views/StellarAccountSignerView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'stellar account signer'} • stellar account signer • Blockhead</title>
</svelte:head>


<Page>
	<StellarAccountSignerView
		selection={select(EntityType.StellarAccountSigner, data.selector)}
	/>
</Page>
