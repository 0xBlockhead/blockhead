<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ id: decodeURIComponent(params.userId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<Page>
	<XUserView
		{entityId}
		href={resolve(
			'/(social)/(x)/x/user/[userId]',
			{ userId: encodeURIComponent(entityId.id) },
		)}
	>
	</XUserView>
</Page>
