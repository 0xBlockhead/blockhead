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


	// Components
	import Page from '$/components/Page.svelte'
	import EnsName_TimestampView from '$/views/EnsName_TimestampView.svelte'
</script>


<Page>
	<EnsName_TimestampView
		href={
			resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source]', {
				ensName: params.ensName,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.EnsName_Timestamp, {
				$name: {
					name: decodeURIComponent(params.ensName),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$name: {
					name: decodeURIComponent(params.ensName),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					$resolvedActor: true,
					$resolverContract: true,
					$ownerActor: true,
					subdomainCount: true,
					ttl: true,
					isMigrated: true,
				},
			})
		}
	/>
</Page>
