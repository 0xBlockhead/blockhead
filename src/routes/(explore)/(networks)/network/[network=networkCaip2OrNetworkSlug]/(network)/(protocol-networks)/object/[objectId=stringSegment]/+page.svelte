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
	import SuiObjectView from '$/views/SuiObjectView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Sui object'} • Sui object • Blockhead</title>
</svelte:head>


<Page>
	<SuiObjectView
		selection={select(EntityType.SuiObject, data.selector)}
	/>
</Page>
