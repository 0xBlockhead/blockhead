<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadCashuToken, {
		id: params.id,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuTokenView from '$/views/BlockheadCashuTokenView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.id || 'blockhead Cashu token'} • blockhead Cashu token • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCashuTokenView
		selection={pageSelection}
	/>
</Page>
