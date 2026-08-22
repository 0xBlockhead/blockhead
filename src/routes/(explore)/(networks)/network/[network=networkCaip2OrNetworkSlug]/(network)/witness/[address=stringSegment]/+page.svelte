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
	import TronWitnessView from '$/views/TronWitnessView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tron witness'} • tron witness • Blockhead</title>
</svelte:head>


<Page>
	<TronWitnessView
		selection={select(EntityType.TronWitness, data.selector)}
	/>
</Page>
