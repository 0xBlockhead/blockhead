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
	import SuiDynamicFieldEdgeView from '$/views/SuiDynamicFieldEdgeView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Sui dynamic field edge'} • Sui dynamic field edge • Blockhead</title>
</svelte:head>


<Page>
	<SuiDynamicFieldEdgeView
		selection={select(EntityType.SuiDynamicFieldEdge, data.selector)}
	/>
</Page>
