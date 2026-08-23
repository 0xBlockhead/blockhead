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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TezosMichelsonScriptView from '$/views/TezosMichelsonScriptView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosMichelsonScript, {
				$network: data.selector,
				scriptHash: params.scriptHash,
			})}
		<title>{data?.title ?? 'tezos michelson script'} • tezos michelson script • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos michelson script'} • tezos michelson script • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TezosMichelsonScript, {
				$network: data.selector,
				scriptHash: params.scriptHash,
			})}

	<TezosMichelsonScriptView
		selection={pageSelection}
	/>
	{/if}
</Page>
