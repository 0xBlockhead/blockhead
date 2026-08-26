<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<svelte:head>
	<title>EVM coin instance • EVM coin instance • Blockhead</title>
</svelte:head>


<Page>
	<EvmCoinInstanceView
		selection={select(EntityType.EvmCoinInstance, data.selector)}
	/>
</Page>
