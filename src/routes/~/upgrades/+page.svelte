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
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
</script>


<svelte:head>
	<title>Upgrades • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$networkUpgrades',
	}).$$networkUpgrades}

	<EthereumNetworkUpgradesView
		href={resolve('/~/upgrades')}
		title='Upgrades'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='network-upgrades'
	/>
</Page>
