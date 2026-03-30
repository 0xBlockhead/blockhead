<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
	<FarcasterCastView
		variant={'feed'}
		entityId={{
			fid: 0,
			hash: '0x0',
		}}
		href={resolve('/farcaster/feed')}
	/>
</Page>
