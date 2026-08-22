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
	import ComplianceModuleView from '$/views/ComplianceModuleView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'compliance module'} • compliance module • Blockhead</title>
</svelte:head>


<Page>
	<ComplianceModuleView
		selection={
			select(EntityType.ComplianceModule, {
				$profile: data.selector,
				moduleKey: params.moduleKey,
			})
		}
	/>
</Page>
