<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
</script>


<Page>
	<BlockheadFarcasterAccountConnectionsView
		href={resolve('/farcaster/accounts')}
		id="accounts"
	/>
</Page>
