<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RegulatedAssetProfile_TimestampView from '$/views/RegulatedAssetProfile_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'regulated asset profile timestamp'} • regulated asset profile timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RegulatedAssetProfile_TimestampView
		selection={
			select(EntityType.RegulatedAssetProfile_Timestamp, {
				$profile: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
