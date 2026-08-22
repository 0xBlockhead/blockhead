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
	import TezosBigMapKeyView from '$/views/TezosBigMapKeyView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tezos big map key'} • tezos big map key • Blockhead</title>
</svelte:head>


<Page>
	<TezosBigMapKeyView
		selection={select(EntityType.TezosBigMapKey, data.selector)}
	/>
</Page>
