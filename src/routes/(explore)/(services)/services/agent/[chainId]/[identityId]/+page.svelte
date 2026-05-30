<script lang="ts">
	// Types/constants
	import { networkIdFromEvmChainId } from '$/lib/caip.ts'

	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004ServiceView from '$/views/Eip8004ServiceView.svelte'
</script>


<Page>
	<Eip8004ServiceView
		entityId={{
			$network: networkIdFromEvmChainId(Number(params.chainId)),
			identityId: decodeURIComponent(params.identityId),
		}}
	/>
</Page>
