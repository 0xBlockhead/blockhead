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
	import TezosBigMapView from '$/views/TezosBigMapView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos big map'} • tezos big map • Blockhead</title>
</svelte:head>


<Page>
	<TezosBigMapView
		selection={select(EntityType.TezosBigMap, data.selector)}
	/>
</Page>
