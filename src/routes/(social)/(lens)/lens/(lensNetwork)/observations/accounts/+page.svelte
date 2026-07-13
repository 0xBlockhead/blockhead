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
	import LensAccountsView from '$/views/LensAccountsView.svelte'
</script>


<svelte:head>
	<title>Lens accounts • Blockhead</title>
</svelte:head>


<Page>
	<LensAccountsView
		href={resolve('/lens/observations/accounts')}
		title='Lens accounts'
		selection={
			select(EntityType.LensNetwork, {
				scope: 'LensNetwork',
			}).$$lensAccounts({
				sources: [
					Source.Constants_Internal,
				],
				count: true,
			})
		}
		id='lens-accounts'
	/>
</Page>
