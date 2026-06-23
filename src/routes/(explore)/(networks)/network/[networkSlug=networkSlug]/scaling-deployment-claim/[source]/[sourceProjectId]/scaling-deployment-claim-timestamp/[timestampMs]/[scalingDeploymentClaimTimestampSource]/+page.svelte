<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ScalingDeploymentClaim_TimestampView from '$/views/ScalingDeploymentClaim_TimestampView.svelte'
</script>


<Page>
	<ScalingDeploymentClaim_TimestampView
		selection={select(EntityType.ScalingDeploymentClaim_Timestamp, data.selector)}
	/>
</Page>
