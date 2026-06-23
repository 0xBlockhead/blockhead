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
	import Erc4626VaultView from '$/views/Erc4626VaultView.svelte'
</script>


<Page>
	<Erc4626VaultView
		selection={select(EntityType.Erc4626Vault, data.selector)}
	/>
</Page>
