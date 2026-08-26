<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
		href={resolve('/~/services/agents')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='eip8004-services'
	/>
</Page>
