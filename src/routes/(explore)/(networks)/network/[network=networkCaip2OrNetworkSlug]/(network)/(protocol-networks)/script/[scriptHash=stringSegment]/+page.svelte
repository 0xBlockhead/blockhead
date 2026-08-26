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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosMichelsonScript, {
		$network: data.selector,
		scriptHash: params.scriptHash,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosMichelsonScriptView from '$/views/TezosMichelsonScriptView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos michelson script'} • tezos michelson script • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos michelson script'} • tezos michelson script • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosMichelsonScriptView
		selection={pageSelection}
	/>
	{/if}
</Page>
