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
	import TonContractGetMethodView from '$/views/TonContractGetMethodView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON contract get method'} • TON contract get method • Blockhead</title>
</svelte:head>


<Page>
	<TonContractGetMethodView
		selection={select(EntityType.TonContractGetMethod, data.selector)}
	/>
</Page>
