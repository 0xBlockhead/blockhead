<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
</script>


<Page>
	<LensAccountsView
		href={resolve('/lens/accounts')}
		selection={select(
			EntityType.LensNetwork,
			{ scope: 'LensNetwork' }
		).$$lensAccounts}
		id="lens-accounts"
	/>
</Page>
