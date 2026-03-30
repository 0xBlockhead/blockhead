<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<Page>
	<FarcasterUserView
		entityId={{ fid: Number(params.userId) }}
		href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', params)}
	/>
</Page>
