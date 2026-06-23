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
				label: 'canister',
			},
			{
				label: 'observed time/source',
			},
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'canister',
					},
					{
						label: 'observed time/source',
					},
					'status',
					{
						label: 'subnet',
					},
					{
						label: 'canister kind',
					},
					{
						label: 'Candid interface hash',
					},
					{
						label: 'module hash',
					},
					{
						label: 'cycles balance',
					},
					{
						label: 'memory size',
					},
					{
						label: 'canister version',
					},
					{
						label: 'controller count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Canister',
					items: [
						{
							label: 'parent ICP canister',
						},
					],
				},
				{
					label: 'Subnet',
					items: [
						{
							label: 'resolved subnet when available',
						},
					],
				},
				{
					label: 'Controllers/settings',
					items: [
						'controllers',
						{
							label: 'freezing threshold',
						},
						{
							label: 'memory allocation',
						},
						{
							label: 'compute allocation',
						},
						{
							label: 'reserved cycles',
						},
					],
				},
				{
					label: 'Resource use',
					items: [
						{
							label: 'memory size',
						},
						{
							label: 'cycles balance',
						},
						{
							label: 'idle burn rate',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'canister_status',
						},
						{
							label: 'registry',
						},
						{
							label: 'dashboard',
						},
						{
							label: 'or interface payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanister_Timestamp>
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
	entityType={EntityType.IcpCanister_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
