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
	import BnbBeaconTokenMigration_TimestampView from '$/views/BnbBeaconTokenMigration_TimestampView.svelte'
</script>


<Page>
	<BnbBeaconTokenMigration_TimestampView
		selection={select(EntityType.BnbBeaconTokenMigration_Timestamp, data.selector)}
	/>
</Page>
