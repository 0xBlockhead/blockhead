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
				label: 'linked base Network',
			},
			{
				label: 'decommissioned time',
			},
			{
				label: 'fusion deadline',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked base Network',
					},
					{
						label: 'decommissioned time',
					},
					{
						label: 'fusion deadline',
					},
					{
						label: 'latest archived height',
					},
					{
						label: 'archive coverage status',
					},
					{
						label: 'validator count',
					},
					{
						label: 'token count',
					},
					{
						label: 'archived transactions',
					},
					{
						label: 'validators',
					},
					{
						label: 'BEP tokens',
					},
					{
						label: 'token migrations',
					},
					{
						label: 'archive timestamp history',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Archive status',
					items: [
						{
							label: 'BnbBeaconNetwork_Timestamp list',
						},
					],
				},
				{
					label: 'Blocks',
					items: [
						{
							label: 'BnbBeaconBlock list',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'BnbBeaconTransaction list',
						},
					],
				},
				{
					label: 'Validators',
					items: [
						{
							label: 'BnbValidator list',
						},
					],
				},
				{
					label: 'Tokens/migration',
					items: [
						{
							label: 'BnbBeaconToken',
						},
						{
							label: 'BnbBeaconTokenMigration',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconNetwork>
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
	entityType={EntityType.BnbBeaconNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
