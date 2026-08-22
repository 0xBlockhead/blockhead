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
	import TonTraceView from '$/views/TonTraceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON trace'} • TON trace • Blockhead</title>
</svelte:head>


<Page>
	<TonTraceView
		selection={
			select(EntityType.TonTrace, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
