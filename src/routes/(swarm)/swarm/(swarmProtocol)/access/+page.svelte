<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalSwarmAccessView from '$/views/_GlobalSwarmAccessView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'global Swarm access'} • global Swarm access • Blockhead</title>
</svelte:head>


<Page>
	<GlobalSwarmAccessView
		selection={
			select(EntityType._GlobalSwarmAccess, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
