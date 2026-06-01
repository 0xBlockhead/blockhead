<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<Page>
	<EvmNetworkAccountView
		entityId={data.entityId}
	/>
</Page>
