<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalSwarmAccess_TimestampView from '$/views/_GlobalSwarmAccess_TimestampView.svelte'
</script>


<svelte:head>
	<title>global Swarm access timestamp • global Swarm access timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalSwarmAccess_TimestampView
		selection={
			select(EntityType._GlobalSwarmAccess_Timestamp, {
				$hub: {
					scope: '_GlobalSwarmAccess',
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
