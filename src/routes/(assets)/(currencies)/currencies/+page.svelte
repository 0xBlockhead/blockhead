<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
