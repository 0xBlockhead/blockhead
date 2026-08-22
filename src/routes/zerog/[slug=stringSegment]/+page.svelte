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

	const pageSelection = $derived(select(EntityType.ZeroGNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGNetworkView from '$/views/ZeroGNetworkView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'zero g network' : pageSelection.entity.name || 'zero g network')} • zero g network • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGNetworkView
		selection={pageSelection}
	/>
</Page>
