<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrView from '$/views/NostrView.svelte'
</script>


<Page>
	<NostrView
		entityId={{
			scope: 'NostrNetwork',
		}}
		href={resolve('/nostr')}
	/>
</Page>
