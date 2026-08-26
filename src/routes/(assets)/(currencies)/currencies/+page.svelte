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
	import CurrenciesView from '$/views/CurrenciesView.svelte'
</script>


<svelte:head>
	<title>Currencies • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$currencies',
	}).$$currencies}

	<CurrenciesView
		href={resolve('/(assets)/(currencies)/currencies')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='currencies'
	/>
</Page>
