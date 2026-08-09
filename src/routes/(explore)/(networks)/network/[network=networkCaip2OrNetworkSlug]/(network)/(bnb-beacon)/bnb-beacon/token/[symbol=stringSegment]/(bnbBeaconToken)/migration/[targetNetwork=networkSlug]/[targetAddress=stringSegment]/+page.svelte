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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BnbBeaconTokenMigration, data.selector, {
		fields: {
			migrationKind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconTokenMigrationView from '$/views/BnbBeaconTokenMigrationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'bnb beacon token migration' : pageSelection.entity.migrationKind || 'bnb beacon token migration')} • bnb beacon token migration • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconTokenMigrationView
		selection={pageSelection}
	/>
</Page>
