<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
</script>


<svelte:head>
	<title>Coins • Blockhead</title>
</svelte:head>


<Page>
	<CoinsView
		href={resolve('/coins')}
		title='Coins'
		selection={
			select(EntityType._Global, {
				scope: '$$coins',
			}).$$coins({
				sources: [
					Source.Constants_Internal,
					Source.Coinpaprika_OpenApi,
				],
				limit: 120,
				count: true,
			})
		}
		id='coins'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
