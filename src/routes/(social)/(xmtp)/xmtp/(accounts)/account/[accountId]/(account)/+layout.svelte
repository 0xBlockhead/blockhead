<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let {
		children,
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Account'}
	href={resolve(`/xmtp/account/${page.params.accountId}`)}
	id={page.params.accountId}
>
	{@render children()}
</ParentPageCollapsible>
