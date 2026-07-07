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
	import GlobalSwarmAccessView from '$/views/_GlobalSwarmAccessView.svelte'
</script>


<Page>
	<GlobalSwarmAccessView
		href={resolve('/(explore)/(swarm)/swarm/access')}
		selection={
			select(EntityType._GlobalSwarmAccess, {
				scope: '_GlobalSwarmAccess',
			}, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
