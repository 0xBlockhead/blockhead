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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MoneroStealthOutput, {
		$transaction: data.selector,
		outputIndex: Number(params.outputIndex),
	}, {
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoneroStealthOutputView from '$/views/MoneroStealthOutputView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.outputIndex) || 'monero stealth output')} • monero stealth output • Blockhead</title>
</svelte:head>


<Page>
	<MoneroStealthOutputView
		selection={pageSelection}
	/>
</Page>
