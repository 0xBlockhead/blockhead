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
	import NetworkStacksView from '$/views/NetworkStacksView.svelte'
</script>


<svelte:head>
	<title>Network stacks • Blockhead</title>
</svelte:head>


<Page>
	<NetworkStacksView
		href={resolve('/network-stacks')}
		title='Network stacks'
		selection={
			select(EntityType._Global, {
				scope: '$$networkStacks',
			}).$$networkStacks({
				sources: [
					Source.Constants_Internal,
				],
				count: true,
			})
		}
		id='network-stacks'
	/>
</Page>
