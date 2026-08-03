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
	import GlobalEnsNetwork_TimestampView from '$/views/_GlobalEnsNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>ENS hub observation • ENS hub observation • Blockhead</title>
</svelte:head>


<Page>
	<GlobalEnsNetwork_TimestampView
		selection={
			select(EntityType._GlobalEnsNetwork_Timestamp, {
				$hub: {
					scope: '_GlobalEnsNetwork',
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [({
					$hub: {
						scope: '_GlobalEnsNetwork',
					},
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}).source],
			})
		}
	/>
</Page>
