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
	import TonWorkchainView from '$/views/TonWorkchainView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'TON workchain'} • TON workchain • Blockhead</title>
</svelte:head>


<Page>
	<TonWorkchainView
		selection={select(EntityType.TonWorkchain, data.selector)}
	/>
</Page>
