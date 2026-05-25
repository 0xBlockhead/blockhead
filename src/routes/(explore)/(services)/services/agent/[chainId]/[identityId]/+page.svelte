<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


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
			$network: {
				chainId: Number(params.chainId),
			},
			identityId: decodeURIComponent(params.identityId),
		}}
	/>
</Page>
