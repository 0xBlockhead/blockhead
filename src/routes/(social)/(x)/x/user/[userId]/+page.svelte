<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.XUser, /^\d+$/.test(decodeURIComponent(params.userId)) ?
				{
					id: decodeURIComponent(params.userId),
				}
			:
				{
					username: decodeURIComponent(params.userId).replace(/^@/, ''),
				})}
	>
	</XUserView>
</Page>
