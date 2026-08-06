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

	const pageSelection = $derived(select(EntityType.IbcChannel, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcChannelView from '$/views/IbcChannelView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.channelId || 'IBC channel')} • IBC channel • Blockhead</title>
</svelte:head>


<Page>
	<IbcChannelView
		selection={pageSelection}
	/>
</Page>
