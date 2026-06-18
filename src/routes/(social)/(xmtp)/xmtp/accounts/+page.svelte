<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
</script>


<Page>
	<EvmAccountsView
		href={resolve('/~/accounts')}
		selection={select(
			EntityType._Global,
			{ scope: '$$actors' }
		).$$actors}
		id="accounts"
	/>
</Page>
