<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<Page>
	<EvmCalldataView
		entityId={{ hex: '0x00000000' }}
		href={resolve('/evm/calldata')}
	/>
</Page>
