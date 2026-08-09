<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'litecoin MWEB transaction'} • litecoin MWEB transaction • Blockhead</title>
</svelte:head>


<Page>
	<LitecoinMwebTransactionView
		selection={
			select(EntityType.LitecoinMwebTransaction, data.selector, {
				sources: [
					Source.LitecoinCore_JsonRpc,
				],
			})
		}
	/>
</Page>
