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

	const pageSelection = $derived(select(EntityType.HederaNft, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.serialNumber) || 'hedera NFT')} • hedera NFT • Blockhead</title>
</svelte:head>


<Page>
	<HederaNftView
		selection={pageSelection}
	/>
</Page>
