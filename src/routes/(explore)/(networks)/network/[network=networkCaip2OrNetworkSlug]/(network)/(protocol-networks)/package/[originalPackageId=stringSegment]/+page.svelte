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
	import SuiPackageView from '$/views/SuiPackageView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Sui package'} • Sui package • Blockhead</title>
</svelte:head>


<Page>
	<SuiPackageView
		selection={select(EntityType.SuiPackage, data.selector)}
	/>
</Page>
