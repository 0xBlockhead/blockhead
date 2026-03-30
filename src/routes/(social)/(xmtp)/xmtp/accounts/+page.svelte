<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActorsView from '$/views/ActorsView.svelte'
</script>


<Page>
	<ActorsView
		href={resolve('/xmtp/accounts')}
		id="accounts"
	/>
</Page>
