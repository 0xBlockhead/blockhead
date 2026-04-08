<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterView from '$/views/FarcasterView.svelte'
</script>


<Page>
	<FarcasterView
		entityId={{
			scope: 'FarcasterNetwork',
		}}
		href={resolve('/farcaster')}
	/>
</Page>
