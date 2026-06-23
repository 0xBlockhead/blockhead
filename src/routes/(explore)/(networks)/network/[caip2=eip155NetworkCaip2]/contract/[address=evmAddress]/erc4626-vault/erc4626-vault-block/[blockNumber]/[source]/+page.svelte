<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4626Vault_BlockView from '$/views/Erc4626Vault_BlockView.svelte'
</script>


<Page>
	<Erc4626Vault_BlockView
		selection={select(EntityType.Erc4626Vault_Block, data.selector)}
	/>
</Page>
