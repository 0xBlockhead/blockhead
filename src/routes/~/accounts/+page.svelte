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
	import BlockheadAccountsView from '$/views/BlockheadAccountsView.svelte'
</script>


<svelte:head>
	<title>Accounts • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAccountsView
		href={resolve('/~/accounts')}
		title='Accounts'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadAccounts',
			})
				.$$blockheadAccounts({
					sources: [
						Source.Local_Internal,
					],
				})
		}
		countResource={
			select(EntityType._Global, {
				scope: '$$blockheadAccounts',
			})
				.$$blockheadAccounts({
					sources: [
						Source.Local_Internal,
					],
				}).count
		}
		id='blockhead-accounts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
