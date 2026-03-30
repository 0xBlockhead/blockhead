<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LeverageView from '$/views/LeverageView.svelte'
</script>


<Page>
	<LeverageView
		entityId={{
			$network: { chainId: 1 },
			id: 'list',
		}}
		href={resolve('/leverage')}
	/>
</Page>
