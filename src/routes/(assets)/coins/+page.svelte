<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
		href={resolve('/(assets)/coins')}
		title='Coins'
		selection={
			select(EntityType._Global, {
				scope: '$$coins',
			})[EntityProxyField]<EntityType.Coin>('$$coins', {
				sources: [
					Source.Constants_Internal,
					Source.Coinpaprika_OpenApi,
				],
				limit: 120,
			})
		}
		id='CoinsView-page'
	/>
</Page>
