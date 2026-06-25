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
	import RadicleSignedRef_TimestampView from '$/views/RadicleSignedRef_TimestampView.svelte'
</script>


<Page>
	<RadicleSignedRef_TimestampView
		selection={select(EntityType.RadicleSignedRef_Timestamp, data.selector)}
	/>
</Page>
