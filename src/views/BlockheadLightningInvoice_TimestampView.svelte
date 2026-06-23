<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'invoice',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'invoice',
					},
					{
						label: 'observation time',
					},
					'source',
					'state',
					{
						label: 'amount paid msat',
					},
					{
						label: 'settled time',
					},
					{
						label: 'settle index',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Invoice',
					items: [
						{
							label: 'parent local invoice',
						},
					],
				},
				{
					label: 'Local node',
					items: [
						{
							label: 'connected Lightning node state',
						},
					],
				},
				{
					label: 'Settlement',
					items: [
						{
							label: 'amount paid',
						},
						{
							label: 'settled time',
						},
						{
							label: 'settle index',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'LND lookupinvoice',
						},
						{
							label: 'listinvoices',
						},
						{
							label: 'or invoice subscription payload',
						},
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningInvoice_Timestamp>
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
	entityType={EntityType.BlockheadLightningInvoice_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
