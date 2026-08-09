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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SuiObjectChangeView from '$/views/SuiObjectChangeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Sui object change'} • Sui object change • Blockhead</title>
</svelte:head>


<Page>
	<SuiObjectChangeView
		selection={
			select(EntityType.SuiObjectChange, {
				$transaction: data.selector,
				changeIndex: Number(params.changeIndex),
			})
		}
	/>
</Page>
