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
	import HederaNodeView from '$/views/HederaNodeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera node'} • hedera node • Blockhead</title>
</svelte:head>


<Page>
	<HederaNodeView
		selection={select(EntityType.HederaNode, data.selector)}
	/>
</Page>
