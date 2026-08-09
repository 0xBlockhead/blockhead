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

	const pageSelection = $derived(select(EntityType.BlockheadWalletRequest, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			requestKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletRequestView from '$/views/BlockheadWalletRequestView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'blockhead wallet request' : pageSelection.entity.requestKind || 'blockhead wallet request')} • blockhead wallet request • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletRequestView
		selection={pageSelection}
	/>
</Page>
