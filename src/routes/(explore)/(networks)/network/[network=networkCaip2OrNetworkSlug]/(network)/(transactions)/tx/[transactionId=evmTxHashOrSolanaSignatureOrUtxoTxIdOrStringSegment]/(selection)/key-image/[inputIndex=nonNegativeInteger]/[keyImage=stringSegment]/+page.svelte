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

	const pageSelection = $derived(select(EntityType.MoneroKeyImage, data.selector, {
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoneroKeyImageView from '$/views/MoneroKeyImageView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.keyImage || 'monero key image')} • monero key image • Blockhead</title>
</svelte:head>


<Page>
	<MoneroKeyImageView
		selection={pageSelection}
	/>
</Page>
