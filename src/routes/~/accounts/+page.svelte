<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAccountsView from '$/views/BlockheadAccountsView.svelte'
</script>


<svelte:head>
	<title>Accounts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadAccounts',
	})
		.$$blockheadAccounts({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadAccountsView
		href={resolve('/~/accounts')}
		title='Accounts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-accounts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
