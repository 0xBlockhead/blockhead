<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActorCoinsView from '$/views/ActorCoinsView.svelte'
</script>


<Page>
	<ActorCoinsView
		href={resolve('/~/accounts/balances')}
		id="balances"
	/>
</Page>
