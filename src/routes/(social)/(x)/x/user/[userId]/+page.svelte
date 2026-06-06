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
		entityId={
			/^\d+$/.test(decodeURIComponent(params.userId)) ?
				{
					id: decodeURIComponent(params.userId),
				}
			:
				{
					username: decodeURIComponent(params.userId).replace(/^@/, ''),
				}
		}
	>
	</XUserView>
</Page>
