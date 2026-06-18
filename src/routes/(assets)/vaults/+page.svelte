<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import VaultsView from '$/views/VaultsView.svelte'
</script>


<Page>
	<VaultsView
		href={resolve('/vaults')}
		selection={select(
			EntityType._Global,
			{ scope: '$$vaults' }
		).$$vaults}
		id="vaults"
	/>
</Page>
