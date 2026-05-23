<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import VaultView from '$/views/VaultView.svelte'
</script>


<Page>
	<VaultView
		entityId={{
			$network: { chainId: 1 },
			id: params.vaultId,
		}}
		href={resolve('/(assets)/(vaults)/vault/[vaultId]', params)}
	/>
</Page>
