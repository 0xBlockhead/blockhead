<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<Page>
	<XUserView
		entityId={{ id: decodeURIComponent(params.userId) }}
	>
	</XUserView>
</Page>
