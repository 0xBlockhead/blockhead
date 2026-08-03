<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'EVM error'} • EVM error • Blockhead</title>
</svelte:head>


<Page>
	<EvmErrorView
		selection={
			select(EntityType.EvmError, data.selector, {
				sources: [
					Source.Openchain_Rest,
				],
			})
		}
	/>
</Page>
