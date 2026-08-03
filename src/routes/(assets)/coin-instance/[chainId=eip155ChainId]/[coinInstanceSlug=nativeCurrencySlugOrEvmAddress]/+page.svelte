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

	const pageTitle = $derived(
		'EVM coin instance'
	)

	// Components
	import Page from '$/components/Page.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<svelte:head>
	<title>{pageTitle} • EVM coin instance • Blockhead</title>
</svelte:head>


<Page>
	<EvmCoinInstanceView
		selection={select(EntityType.EvmCoinInstance, data.selector)}
	/>
</Page>
