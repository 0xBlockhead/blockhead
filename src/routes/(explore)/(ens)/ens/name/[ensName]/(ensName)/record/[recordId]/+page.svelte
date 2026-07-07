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
	import EnsRecordView from '$/views/EnsRecordView.svelte'
</script>


<Page>
	<EnsRecordView
		href={
			resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/record/[recordId]', {
				ensName: params.ensName,
				recordId: params.recordId,
			})
		}
		selection={
			select(EntityType.EnsRecord, {
				$name: {
					name: decodeURIComponent(params.ensName),
				},
				recordKey: decodeURIComponent(params.recordId),
			}, {
				sources: [
					Source.TheGraph_Graphql,
					Source.Voltaire_JsonRpc,
				],
				fields: {
					recordKind: true,
					coinType: true,
				},
			})
		}
	/>
</Page>
