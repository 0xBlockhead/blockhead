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
	import StellarAccountView from '$/views/StellarAccountView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar account'} • stellar account • Blockhead</title>
</svelte:head>


<Page>
	<StellarAccountView
		selection={select(EntityType.StellarAccount, data.selector)}
	/>
</Page>
