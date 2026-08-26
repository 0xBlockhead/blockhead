<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
</script>


<svelte:head>
	<title>Lens accounts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.LensNetwork, {
		scope: 'LensNetwork',
	})
		.$$lensAccounts({
			sources: [
				Source.Constants_Internal,
			],
		})}

	<LensAccountsView
		href={resolve('/(social)/(lens)/lens/(lensNetwork)/observations/accounts')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='lens-accounts'
	/>
</Page>
