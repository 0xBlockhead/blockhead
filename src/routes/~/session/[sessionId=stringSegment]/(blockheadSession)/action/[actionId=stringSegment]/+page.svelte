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

	const pageSelection = $derived(select(EntityType.BlockheadSessionAction, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			actionType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead session action' : pageSelection.entity.actionType || 'blockhead session action')} • blockhead session action • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSessionActionView
		selection={pageSelection}
	/>
</Page>
