<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
</script>


<Page>
	<section>
		<NetworkForksView
			href={resolve('/forks')}
			id="forks"
		/>
	</section>
</Page>
