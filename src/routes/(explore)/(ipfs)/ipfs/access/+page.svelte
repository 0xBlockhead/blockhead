<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<Page>
	<GlobalIpfsAccessView
		href={resolve('/(explore)/(ipfs)/ipfs/access')}
		selection={
			select(EntityType._GlobalIpfsAccess, {
				scope: '_GlobalIpfsAccess',
			}, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
