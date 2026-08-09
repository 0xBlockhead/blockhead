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

	const pageSelection = $derived(select(EntityType.BlockheadStateChannel, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.id || 'blockhead state channel')} • blockhead state channel • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadStateChannelView
		selection={pageSelection}
	/>
</Page>
