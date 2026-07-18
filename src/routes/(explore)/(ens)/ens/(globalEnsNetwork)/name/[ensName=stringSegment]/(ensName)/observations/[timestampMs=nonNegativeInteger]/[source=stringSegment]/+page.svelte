<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EnsName_Timestamp, {
		$name: {
			name: decodeURIComponent(params.ensName),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$name: {
				name: decodeURIComponent(params.ensName),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			$resolvedActor: true,
			$resolverContract: true,
			$ownerActor: true,
			subdomainCount: true,
			ttl: true,
			isMigrated: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'ENS name observation' : 'ENS name observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import EnsName_TimestampView from '$/views/EnsName_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ENS name observation • Blockhead</title>
</svelte:head>


<Page>
	<EnsName_TimestampView
		href={
			resolve('/ens/name/[ensName=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				ensName: params.ensName,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
