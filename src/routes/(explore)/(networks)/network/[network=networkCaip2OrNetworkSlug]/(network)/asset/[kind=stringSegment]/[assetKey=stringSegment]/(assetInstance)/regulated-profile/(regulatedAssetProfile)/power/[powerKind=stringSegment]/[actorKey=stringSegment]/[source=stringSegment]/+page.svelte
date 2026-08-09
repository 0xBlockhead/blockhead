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
	import IssuerPowerView from '$/views/IssuerPowerView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'issuer power'} • issuer power • Blockhead</title>
</svelte:head>


<Page>
	<IssuerPowerView
		selection={
			select(EntityType.IssuerPower, {
				$profile: data.selector,
				powerKind: params.powerKind,
				actorKey: params.actorKey,
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
