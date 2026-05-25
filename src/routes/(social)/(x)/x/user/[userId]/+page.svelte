<script lang="ts">
	// State
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
	>
	</XUserView>
</Page>
