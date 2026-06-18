<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import CurrenciesView from '$/views/CurrenciesView.svelte'
</script>


<svelte:head>
	<title>Currencies</title>
</svelte:head>


<Page>
	<CurrenciesView
		href={resolve('/currencies')}
		selection={select(
			EntityType._Global,
			{ scope: '$$currencies' }
		).$$currencies}
		open
	/>
</Page>
