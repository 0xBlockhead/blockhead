<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import CurrenciesView from '$/views/CurrenciesView.svelte'
</script>


<svelte:head>
	<title>Currencies • Blockhead</title>
</svelte:head>


<Page>
	<CurrenciesView
		href={resolve('/currencies')}
		title='Currencies'
		selection={
			select(EntityType._Global, {
				scope: '$$currencies',
			}).$$currencies
		}
		countResource={
			select(EntityType._Global, {
				scope: '$$currencies',
			}).$$currencies.count
		}
		id='currencies'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
