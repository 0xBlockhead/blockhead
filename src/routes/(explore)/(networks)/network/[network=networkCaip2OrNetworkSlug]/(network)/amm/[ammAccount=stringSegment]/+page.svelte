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
	import XrplAmmView from '$/views/XrplAmmView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'XRPL AMM'} • XRPL AMM • Blockhead</title>
</svelte:head>


<Page>
	<XrplAmmView
		selection={select(EntityType.XrplAmm, data.selector)}
	/>
</Page>
