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
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<Page>
	<GlobalRedditNetworkView
		href={resolve('/(social)/(reddit)/reddit')}
		selection={
			select(EntityType._GlobalRedditNetwork, {
				scope: '_GlobalRedditNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
