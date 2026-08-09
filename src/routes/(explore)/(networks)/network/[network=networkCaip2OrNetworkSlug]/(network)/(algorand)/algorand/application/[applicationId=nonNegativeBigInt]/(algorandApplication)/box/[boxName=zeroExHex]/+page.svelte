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
	import AlgorandBoxView from '$/views/AlgorandBoxView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'algorand box'} • algorand box • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandBoxView
		selection={select(EntityType.AlgorandBox, data.selector)}
	/>
</Page>
