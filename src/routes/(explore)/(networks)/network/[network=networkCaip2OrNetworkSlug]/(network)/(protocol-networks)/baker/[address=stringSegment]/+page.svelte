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
	import TezosBakerView from '$/views/TezosBakerView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos baker'} • tezos baker • Blockhead</title>
</svelte:head>


<Page>
	<TezosBakerView
		selection={select(EntityType.TezosBaker, data.selector)}
	/>
</Page>
