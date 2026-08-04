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
	import EnsName_TimestampView from '$/views/EnsName_TimestampView.svelte'
</script>


<svelte:head>
	<title>ENS name observation • ENS name observation • Blockhead</title>
</svelte:head>


<Page>
	<EnsName_TimestampView
		selection={
			select(EntityType.EnsName_Timestamp, {
				$name: {
					name: decodeURIComponent(params.ensName),
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
