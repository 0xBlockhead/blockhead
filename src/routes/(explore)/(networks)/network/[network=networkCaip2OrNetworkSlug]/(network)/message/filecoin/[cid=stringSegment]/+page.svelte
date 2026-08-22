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

	const pageSelection = $derived(select(EntityType.FilecoinMessage, data.selector, {
		sources: [
			Source.Filfox_Rest,
			Source.Lotus_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.cid || 'filecoin message')} • filecoin message • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMessageView
		selection={pageSelection}
	/>
</Page>
