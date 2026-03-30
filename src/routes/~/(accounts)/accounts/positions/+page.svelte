<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPositionsView from '$/views/LiquidityPositionsView.svelte'
</script>


<Page>
	<LiquidityPositionsView
		href={resolve('/~/accounts/positions')}
		id="positions"
	/>
</Page>
