<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


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
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$currencies' },
			fieldName: '$$currencies',
		}}
		open
	/>
</Page>
