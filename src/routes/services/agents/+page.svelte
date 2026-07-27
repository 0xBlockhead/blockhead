<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNftsView from '$/views/EvmNftsView.svelte'
</script>


<svelte:head>
	<title>ERC-8004 Registrations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$eip8004Services',
	}).$$eip8004Services}

	<EvmNftsView
		href={resolve('/services/agents')}
		title='ERC-8004 Registrations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='eip8004-services'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
