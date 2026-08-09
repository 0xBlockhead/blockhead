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
	import ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'zero g storage node'} • zero g storage node • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGStorageNodeView
		selection={select(EntityType.ZeroGStorageNode, data.selector)}
	/>
</Page>
