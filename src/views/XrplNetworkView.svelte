<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [],
		content: {
			dl: [
				[],
			],
		},
		details: {
			tabs: [
				{
					label: 'ledgers',
					when: 'open',
					items: [
						'$$ledgers',
					],
				},
				{
					label: 'transactions',
					when: 'open',
					items: [
						'$$transactions',
					],
				},
				{
					label: 'accounts',
					when: 'open',
					items: [
						'$$accounts',
					],
				},
				{
					label: 'ledger entries',
					when: 'open',
					items: [
						'$$ledgerEntries',
					],
				},
				{
					label: 'amendments',
					when: 'open',
					items: [
						'$$amendments',
					],
				},
				{
					label: 'amms',
					when: 'open',
					items: [
						'$$amms',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XrplNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.XrplNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
