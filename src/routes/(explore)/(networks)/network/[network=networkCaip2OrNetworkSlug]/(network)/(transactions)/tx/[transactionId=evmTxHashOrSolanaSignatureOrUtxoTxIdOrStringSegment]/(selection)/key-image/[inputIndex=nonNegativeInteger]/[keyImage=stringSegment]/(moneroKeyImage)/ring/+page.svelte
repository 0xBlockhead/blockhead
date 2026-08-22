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
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'monero ring'} • monero ring • Blockhead</title>
</svelte:head>


<Page>
	<MoneroRingView
		selection={
			select(EntityType.MoneroRing, data.selector, {
				sources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
			})
		}
	/>
</Page>
